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

      // Funkcja dodająca linki afiliacyjne
      const applyAffiliateLinks = (items: PortalOffer[]): PortalOffer[] => {
        return items.map((item) => {
          let finalUrl = item.url;
          try {
            if (item.platform === "amazon") {
              const urlObj = new URL(item.url);
              urlObj.searchParams.set("tag", "detectorhub0b-20"); // Tag partnerski Amazon
              finalUrl = urlObj.toString();
            } else if (item.platform === "ebay") {
              const urlObj = new URL(item.url);
              urlObj.searchParams.set("mkcid", "1");
              urlObj.searchParams.set("mkrid", "4908-226936-19255-0");
              urlObj.searchParams.set("campid", "5339147835"); // Twój ID Kampanii eBay
              urlObj.searchParams.set("toolid", "10001");
              urlObj.searchParams.set("mkevt", "1");
              finalUrl = urlObj.toString();
            } else if (item.platform === "allegro") {
              const urlObj = new URL(item.url);
              urlObj.searchParams.set("utm_medium", "afiliacja");
              urlObj.searchParams.set("utm_source", "ctr_2");
              urlObj.searchParams.set("utm_campaign", "3a1a3576-f348-48fb-a5e5-dc23676c97c3"); // Twój unikalny identyfikator Allegro Share
              finalUrl = urlObj.toString();
            }
          } catch (e) {
            // Bez zmian w przypadku błędu formatu URL
          }
          return { ...item, url: finalUrl };
        });
      };

      setResults(applyAffiliateLinks(data.items || []));
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
