import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = Deno.env.get("ALLOWED_ORIGINS")?.split(",") || ["http://localhost:3000"];
const RATE_LIMIT_MAX = parseInt(Deno.env.get("RATE_LIMIT_MAX") || "5", 10);

const bannedIps = new Map<string, number>();
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const reqCors = {
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

function getCorsHeaders(origin?: string) {
  const allowed = ALLOWED_ORIGINS.includes(origin || "") ? origin : null;
  return {
    ...reqCors,
    "Access-Control-Allow-Origin": allowed || "null",
  };
}

function checkIpBan(ip: string) {
  if (bannedIps.has(ip)) return true;
  return false;
}

function incrementRateLimit(ip: string) {
  const now = Date.now();
  const limit = requestCounts.get(ip) || { count: 0, resetTime: now + 60000 };

  if (now > limit.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + 60000 });
    return 1;
  }

  limit.count += 1;
  requestCounts.set(ip, limit);

  if (limit.count > RATE_LIMIT_MAX) {
    const violations = (bannedIps.get(ip) || 0) + 1;
    bannedIps.set(ip, violations);
    if (violations >= 5) {
      return -1;
    }
    return limit.count;
  }

  return limit.count;
}

function validateSearchQuery(query: unknown): query is string {
  return typeof query === "string" && query.trim().length > 0 && query.trim().length <= 200;
}

function validateLimit(limit: unknown): limit is number {
  return typeof limit === "number" && limit > 0 && limit <= 100;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req.headers.get("Origin") || undefined) });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const origin = req.headers.get("Origin");

  if (!ALLOWED_ORIGINS.includes(origin || "") && origin !== "null") {
    return new Response(JSON.stringify({ error: "CORS niet allowed" }), {
      status: 403,
      headers: {
        ...reqCors,
        "Access-Control-Allow-Origin": "null",
        "Content-Type": "application/json",
      },
    });
  }

  if (checkIpBan(ip)) {
    return new Response(JSON.stringify({ error: "IP adres jest zablokowany" }), {
      status: 403,
      headers: { ...getCorsHeaders(origin || undefined), "Content-Type": "application/json" },
    });
  }

  const rateLimitStatus = incrementRateLimit(ip);
  if (rateLimitStatus === -1) {
    bannedIps.set(ip, 5);
    return new Response(JSON.stringify({ error: "Zbyt wiele żądań. IP zablokowane." }), {
      status: 403,
      headers: { ...getCorsHeaders(origin || undefined), "Content-Type": "application/json" },
    });
  }

  if (rateLimitStatus > RATE_LIMIT_MAX) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
      headers: { ...getCorsHeaders(origin || undefined), "Content-Type": "application/json" },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...getCorsHeaders(origin || undefined), "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { query, platform, limit = 10 } = body;

    if (!validateSearchQuery(query)) {
      return new Response(JSON.stringify({ error: "Invalid search query" }), {
        status: 400,
        headers: { ...getCorsHeaders(origin || undefined), "Content-Type": "application/json" },
      });
    }

    if (!validateLimit(limit)) {
      return new Response(JSON.stringify({ error: "Invalid limit parameter" }), {
        status: 400,
        headers: { ...getCorsHeaders(origin || undefined), "Content-Type": "application/json" },
      });
    }

    // Mock response - in production, integrate with actual APIs
    const items = [
      {
        id: `${platform || "portal"}-${Math.random()}`,
        name: `${query} - Demo oferta z ${platform || "portalu"}`,
        price: Math.floor(Math.random() * 1000) + 50,
        currency: "PLN",
        imageUrl: null,
        url: "https://example.com",
        seller: "Demo Seller",
        platform: platform || "allegro",
        condition: "nowe",
        inStock: true,
      },
    ];

    return new Response(JSON.stringify({ items, total: 1 }), {
      status: 200,
      headers: { ...getCorsHeaders(origin || undefined), "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Portal search error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...getCorsHeaders(origin || undefined), "Content-Type": "application/json" },
    });
  }
});
