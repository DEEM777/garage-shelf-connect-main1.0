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
}

const ALLEGRO_AUTH = "https://allegro.pl/auth/oauth";

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
  const activeEntry = entry && entry.expires > now ? entry : null;

  if (activeEntry) {
    if (activeEntry.count >= RATE_LIMIT_MAX) {
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
    activeEntry.count += 1;
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
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!ALLEGRO_CLIENT_ID || !ALLEGRO_CLIENT_SECRET) {
    return new Response(
      JSON.stringify({ error: "Allegro credentials not configured" }),
      { status: 500, headers: { ...reqCors, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const basicAuth = btoa(`${ALLEGRO_CLIENT_ID}:${ALLEGRO_CLIENT_SECRET}`);

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "init-device") {
      const res = await fetch(`${ALLEGRO_AUTH}/device`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "client_id=" + ALLEGRO_CLIENT_ID,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Device init failed [${res.status}]: ${err}`);
      }

      const data = await res.json();
      return new Response(JSON.stringify({
        device_code: data.device_code,
        user_code: data.user_code,
        verification_uri: data.verification_uri_complete || data.verification_uri,
        expires_in: data.expires_in,
        interval: data.interval,
      }), {
        headers: { ...reqCors, "Content-Type": "application/json" },
      });
    }

    if (action === "poll-token") {
      const { device_code } = body;

      if (!device_code) {
        return new Response(JSON.stringify({ error: "device_code is required" }), {
          status: 400,
          headers: { ...reqCors, "Content-Type": "application/json" },
        });
      }

      const res = await fetch(`${ALLEGRO_AUTH}/token`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=urn:ietf:params:oauth:grant-type:device_code&device_code=${device_code}`,
      });

      const data = await res.json();

      if (data.error === "authorization_pending") {
        return new Response(JSON.stringify({ status: "pending" }), {
          headers: { ...reqCors, "Content-Type": "application/json" },
        });
      }

      if (data.error === "slow_down") {
        return new Response(JSON.stringify({ status: "slow_down" }), {
          headers: { ...reqCors, "Content-Type": "application/json" },
        });
      }

      if (data.error) {
        throw new Error(`Token exchange failed: ${data.error} - ${data.error_description}`);
      }

      // Save tokens
      const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

      // Delete old tokens
      await supabase.from("allegro_tokens").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const { error: insertError } = await supabase.from("allegro_tokens").insert({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: expiresAt,
      });

      if (insertError) throw new Error(`Failed to save tokens: ${insertError.message}`);

      return new Response(JSON.stringify({ status: "authorized" }), {
        headers: { ...reqCors, "Content-Type": "application/json" },
      });
    }

    if (action === "status") {
      const { data: tokens } = await supabase
        .from("allegro_tokens")
        .select("expires_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!tokens) {
        return new Response(JSON.stringify({ authorized: false }), {
          headers: { ...reqCors, "Content-Type": "application/json" },
        });
      }

      const isValid = new Date(tokens.expires_at) > new Date();
      return new Response(JSON.stringify({ authorized: true, valid: isValid }), {
        headers: { ...reqCors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...reqCors, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Allegro auth error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...reqCors, "Content-Type": "application/json" },
    });
  }
});
