import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AllegroOffer = {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  imageUrl: string | null;
  url: string;
  seller: string;
  delivery: number | null;
  condition: string;
};

export function useAllegroSearch() {
  const [results, setResults] = useState<AllegroOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const search = async (query: string, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("allegro-search", {
        body: { query, limit },
      });

      if (fnError) throw fnError;

      if (data.error === "not_authorized") {
        setError("Wymagana autoryzacja Allegro. Przejdź do ustawień, aby autoryzować.");
        setResults([]);
        return;
      }

      if (data.error) throw new Error(data.error);

      setResults(data.items || []);
      setTotal(data.total || 0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Błąd wyszukiwania";
      setError(message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, total, search };
}

export function useAllegroAuth() {
  const [deviceInfo, setDeviceInfo] = useState<{
    device_code: string;
    user_code: string;
    verification_uri: string;
    interval: number;
  } | null>(null);
  const [status, setStatus] = useState<"idle" | "waiting" | "authorized" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const initDeviceFlow = async () => {
    setStatus("waiting");
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("allegro-auth", {
        body: { action: "init-device" },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setDeviceInfo(data);
      // Start polling
      pollForToken(data.device_code, data.interval || 5);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Błąd autoryzacji Allegro";
      setError(message);
      setStatus("error");
    }
  };

  const pollForToken = async (deviceCode: string, interval: number) => {
    const poll = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("allegro-auth", {
          body: { action: "poll-token", device_code: deviceCode },
        });

        if (fnError) throw fnError;

        if (data.status === "authorized") {
          setStatus("authorized");
          return;
        }

        if (data.status === "pending" || data.status === "slow_down") {
          const delay = data.status === "slow_down" ? interval + 5 : interval;
          setTimeout(poll, delay * 1000);
          return;
        }

        if (data.error) throw new Error(data.error);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Błąd płatności Allegro";
        setError(message);
        setStatus("error");
      }
    };

    setTimeout(poll, interval * 1000);
  };

  const checkStatus = async () => {
    setStatus("idle");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("allegro-auth", {
        body: { action: "status" },
      });

      if (fnError) throw fnError;
      if (data.authorized && data.valid) {
        setStatus("authorized");
      } else {
        setStatus("idle");
      }
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Błąd sprawdzenia statusu";
      setError(message);
      setStatus("idle");
      return { authorized: false };
    }
  };

  return { deviceInfo, status, error, initDeviceFlow, checkStatus };
}
