import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PortalOffer = {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  imageUrl: string | null;
  url: string;
  seller: string;
  platform: "allegro" | "olx" | "otomoto" | "amazon" | "ebay";
  condition: string;
  inStock: boolean;
};

export function usePortalSearch() {
  const [results, setResults] = useState<PortalOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const search = async (query: string, platform?: "allegro" | "olx" | "otomoto" | "amazon" | "ebay", limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("portal-search", {
        body: { query, platform, limit },
      });

      if (fnError) throw fnError;

      if (data.error) throw new Error(data.error);

      setResults(data.items || []);
      setTotal(data.total || 0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Błąd wyszukiwania portali";
      setError(message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, total, search };
}
