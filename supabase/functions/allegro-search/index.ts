import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = Deno.env.get("ALLOWED_ORIGINS");

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin");
  const allowedOrigins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean) : null;

  if (allowedOrigins && origin && !allowedOrigins.includes(origin)) {
    return null;
  }

  return {
    "Access-Control-Allow-Origin": allowedOrigins ? origin ?? "null" : "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  };
};

const RATE_LIMIT_MAP = new Map<string, { count: number; expires: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 30;

const RATE_LIMIT_VIOLATION_MAP = new Map<string, { violations: number; expires: number }>();
const VIOLATION_RESET_MS = 5 * 60 * 1000;
const VIOLATION_THRESHOLD = 3;

const BAN_MAP = new Map<string, number>();
const BAN_DURATION_MS = 10 * 60 * 1000;

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || "unknown";
}

const ALLEGRO_API = "https://api.allegro.pl";
const ALLEGRO_AUTH = "https://allegro.pl/auth/oauth";

async function getClientCredentialsToken(clientId: string, clientSecret: string): Promise<string> {
  const basicAuth = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(`${ALLEGRO_AUTH}/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Client credentials token failed:", err);
    throw new Error(`Failed to get client credentials token: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  const clientIp = getClientIp(req);
  const now = Date.now();

  const banTimeout = BAN_MAP.get(clientIp);
  if (banTimeout && banTimeout > now) {
    return new Response(
      JSON.stringify({ error: "IP banned due to repeated abuse, try again later" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  if (banTimeout && banTimeout <= now) {
    BAN_MAP.delete(clientIp);
  }

  const entry = RATE_LIMIT_MAP.get(clientIp);
  const maxEntry = entry && entry.expires > now ? entry : null;

  if (maxEntry) {
    if (maxEntry.count >= RATE_LIMIT_MAX) {
      const vioEntry = RATE_LIMIT_VIOLATION_MAP.get(clientIp);
      if (vioEntry && vioEntry.expires > now) {
        vioEntry.violations += 1;
      } else {
        RATE_LIMIT_VIOLATION_MAP.set(clientIp, { violations: 1, expires: now + VIOLATION_RESET_MS });
      }

      const currentViolations = RATE_LIMIT_VIOLATION_MAP.get(clientIp)?.violations ?? 1;
      if (currentViolations >= VIOLATION_THRESHOLD) {
        BAN_MAP.set(clientIp, now + BAN_DURATION_MS);
        RATE_LIMIT_VIOLATION_MAP.delete(clientIp);
        return new Response(
          JSON.stringify({ error: "IP temporarily banned due to repeated abuse" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Too many requests" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
    maxEntry.count += 1;
  } else {
    RATE_LIMIT_MAP.set(clientIp, { count: 1, expires: now + RATE_LIMIT_WINDOW_MS });
  }

  const reqCors = getCorsHeaders(req);
  if (!reqCors) {
    return new Response(JSON.stringify({ error: "CORS origin not allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: reqCors });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...reqCors, "Content-Type": "application/json", "Allow": "POST, OPTIONS" },
    });
  }

  const ALLEGRO_CLIENT_ID = Deno.env.get("ALLEGRO_CLIENT_ID");
  const ALLEGRO_CLIENT_SECRET = Deno.env.get("ALLEGRO_CLIENT_SECRET");

  if (!ALLEGRO_CLIENT_ID || !ALLEGRO_CLIENT_SECRET) {
    return new Response(
      JSON.stringify({ error: "Allegro credentials not configured" }),
      { status: 500, headers: { ...reqCors, "Content-Type": "application/json" } }
    );
  }

  try {
    const { query, category, limit = 10 } = await req.json();

    if (typeof query !== "string" || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        { status: 400, headers: { ...reqCors, "Content-Type": "application/json" } }
      );
    }

    if (query.trim().length > 100) {
      return new Response(
        JSON.stringify({ error: "Query parameter too long (max 100 chars)" }),
        { status: 400, headers: { ...reqCors, "Content-Type": "application/json" } }
      );
    }

    const safeLimit = Number(limit);
    const limitValue = Number.isFinite(safeLimit) ? Math.min(50, Math.max(1, safeLimit)) : 10;

    // Use client_credentials for public search - no user auth needed
    const accessToken = await getClientCredentialsToken(ALLEGRO_CLIENT_ID, ALLEGRO_CLIENT_SECRET);

    // Search Allegro offers
    const params = new URLSearchParams({
      phrase: query.trim(),
      limit: String(limitValue),
      sort: "relevance",
    });

    if (category) {
      params.set("category.id", category);
    }

    const searchRes = await fetch(`${ALLEGRO_API}/offers/listing?${params}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.allegro.public.v1+json",
      },
    });

    if (!searchRes.ok) {
      const errBody = await searchRes.text();
      console.error(`Allegro search failed [${searchRes.status}]:`, errBody);

      // Allegro may deny access for unverified apps; return safe empty result instead of 500
      if (searchRes.status === 403) {
        return new Response(
          JSON.stringify({
            items: [],
            total: 0,
            warning: "access_denied",
            message: "Brak dostępu do API Allegro dla tej aplikacji.",
          }),
          { headers: { ...reqCors, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`Allegro API error [${searchRes.status}]: ${errBody}`);
    }

    const searchData = await searchRes.json();

    // Map to our format
    const items = (searchData.items?.promoted || [])
      .concat(searchData.items?.regular || [])
      .slice(0, limitValue)
      .map((item: unknown) => {
        const it = item as Record<string, unknown>;
        const sellingMode = it.sellingMode as Record<string, unknown> | undefined;
        const priceObj = sellingMode?.price as Record<string, unknown> | undefined;
        const images = it.images as Array<Record<string, unknown>> | undefined;
        const seller = it.seller as Record<string, unknown> | undefined;
        const delivery = it.delivery as Record<string, unknown> | undefined;
        const stock = it.stock as Record<string, unknown> | undefined;

        const amount = priceObj?.amount ? Number(priceObj.amount) : null;

        return {
          id: String(it.id ?? ""),
          name: String(it.name ?? ""),
          price: Number.isFinite(amount as number) ? (amount as number) : null,
          currency: String(priceObj?.currency ?? "PLN"),
          imageUrl: images && images.length > 0 ? String(images[0].url ?? "") : null,
          url: `https://allegro.pl/oferta/${String(it.id ?? "")}`,
          seller: String(seller?.login ?? "Nieznany"),
          delivery:
            delivery?.lowestPrice && typeof delivery.lowestPrice === "object"
              ? Number((delivery.lowestPrice as Record<string, unknown>).amount ?? null)
              : null,
          condition:
            stock && typeof stock.available === "number" && stock.available > 0
              ? "available"
              : "unavailable",
        };
      });

    return new Response(
      JSON.stringify({
        items,
        total: searchData.searchMeta?.totalCount || items.length,
      }),
      { headers: { ...reqCors, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Allegro search error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...reqCors, "Content-Type": "application/json" },
    });
  }
});
