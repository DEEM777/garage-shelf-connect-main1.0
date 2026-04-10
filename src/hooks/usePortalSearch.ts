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
              urlObj.searchParams.set("tag", "TWOJ_KOD_AMAZON-21"); // Zmień na swój tag partnerski Amazon
              finalUrl = urlObj.toString();
            } else if (item.platform === "ebay") {
              // Standardowy link afiliacyjny eBay
              finalUrl = `https://rover.ebay.com/rover/1/711-53200-19255-0/1?icep_id=114&pub=TWOJ_PUB_ID_EBAY&toolid=10001&campid=TWOJ_CAMP_ID_EBAY&customid=&mpre=${encodeURIComponent(item.url)}`;
            } else if (item.platform === "allegro") {
              // Zmień na swój link przekierowujący w sieci afiliacyjnej (np. Convertiser/Tradedoubler)
              finalUrl = `https://twoj-reflink.pl/allegro?id=TWOJE_ID_ALLEGRO&url=${encodeURIComponent(item.url)}`;
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
