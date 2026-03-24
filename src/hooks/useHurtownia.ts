import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type HurtowniaOffer = {
  id: string;
  name: string;
  brand?: string;
  price: number | null;
  currency: string;
  imageUrl: string | null;
  url: string;
  seller: string;
  inStock: boolean;
  delivery: number | null;
  condition: string;
  source: string;
  sourceType: "hurtownia";
};

export function useHurtowniaSearch() {
  const [results, setResults] = useState<HurtowniaOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const search = async (query: string, limit = 20) => {
    const trimmed = query?.trim();
    if (!trimmed) {
      setError("Wprowadź zapytanie do wyszukiwania hurtowni");
      setResults([]);
      setTotal(0);
      return;
    }

    if (trimmed.length > 100) {
      setError("Zapytanie nie może być dłuższe niż 100 znaków");
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const safeLimit = Number.isFinite(Number(limit)) ? Math.min(50, Math.max(1, Number(limit))) : 20;
      const { data, error: fnError } = await supabase.functions.invoke("hurtownia-search", {
        body: { query: trimmed, limit: safeLimit },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setResults(data.items || []);
      setTotal(data.total || 0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Błąd wyszukiwania hurtowni";
      setError(message);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, total, search };
}
