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
    // Funkcja wyszukiwania w tle została wyłączona, aby zapobiec blokadom "nienaturalnego ruchu" na portalach.
    // Teraz polegamy wyłącznie na bezpośrednim przekierowaniu użytkownika do wybranego portalu.
    setResults([]);
    setTotal(0);
    setLoading(false);
    return;
  };

  return { results, loading, error, total, search };
}
