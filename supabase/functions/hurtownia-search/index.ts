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
}

const RATE_LIMIT_MAP = new Map<string, { count: number; expires: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 30;

const RATE_LIMIT_VIOLATION_MAP = new Map<string, { violations: number; expires: number }>();
const VIOLATION_RESET_MS = 5 * 60 * 1000; // 5 minutes
const VIOLATION_THRESHOLD = 3;

const BAN_MAP = new Map<string, number>();
const BAN_DURATION_MS = 10 * 60 * 1000; // 10 minutes

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || "unknown";
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

  const HURTOWNIA_API_URL = Deno.env.get("HURTOWNIA_API_URL");
  const HURTOWNIA_API_KEY = Deno.env.get("HURTOWNIA_API_KEY");

  if (!HURTOWNIA_API_URL) {
    return new Response(
      JSON.stringify({ error: "Hurtownia API URL nie jest skonfigurowane" }),
      { status: 500, headers: { ...reqCors, "Content-Type": "application/json" } }
    );
  }

  try {
    const { query, limit = 20 } = await req.json();

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
    const limitValue = Number.isFinite(safeLimit) ? Math.min(50, Math.max(1, safeLimit)) : 20;

    const apiUrl = new URL(`${HURTOWNIA_API_URL}/search`);
    apiUrl.searchParams.set("q", query.trim());
    apiUrl.searchParams.set("limit", String(limitValue));

    const response = await fetch(apiUrl.toString(), {
      headers: {
        "Accept": "application/json",
        ...(HURTOWNIA_API_KEY ? { "Authorization": `Bearer ${HURTOWNIA_API_KEY}` } : {}),
      },
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Hurtownia API error", response.status, details);
      return new Response(
        JSON.stringify({ error: `Hurtownia API zwróciło ${response.status}` }),
        { status: 502, headers: { ...reqCors, "Content-Type": "application/json" } }
      );
    }

    const payload = await response.json();

    const items = (Array.isArray(payload.items) ? payload.items : [])
      .slice(0, limit)
      .map((item: unknown) => {
        const i = item as Record<string, unknown>;

        const inStockRaw = i.inStock;
        const priceRaw = i.price;

        return {
          id: String(i.id ?? i.partNumber ?? Math.random()),
          name: String(i.name ?? i.title ?? "Brak nazwy"),
          brand: String(i.brand ?? i.producer ?? "Nieznany"),
          price:
            typeof priceRaw === "number"
              ? priceRaw
              : typeof priceRaw === "string"
              ? Number(priceRaw)
              : null,
          currency: String(i.currency ?? "PLN"),
          imageUrl: i.image ? String(i.image) : i.imageUrl ? String(i.imageUrl) : null,
          url: String(i.url ?? i.link ?? ""),
          seller: String(i.seller ?? i.source ?? "Hurtownia"),
          inStock:
            typeof inStockRaw === "boolean"
              ? inStockRaw
              : typeof inStockRaw === "string"
              ? inStockRaw.toLowerCase() === "true"
              : true,
          delivery:
            typeof i.delivery === "number"
              ? i.delivery
              : typeof i.delivery === "string"
              ? Number(i.delivery)
              : null,
          condition: String(i.condition ?? "unknown"),
          source: String(i.supplier ?? "Hurtownia API"),
          sourceType: "hurtownia" as const,
        };
      });

    return new Response(
      JSON.stringify({ items, total: payload.totalCount || items.length }),
      { headers: { ...reqCors, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("hurtownia-search error", error);
    const msg = error instanceof Error ? error.message : "Nieznany błąd";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...reqCors, "Content-Type": "application/json" },
    });
  }
});
