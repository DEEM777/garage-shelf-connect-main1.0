import { useState } from "react";

export interface WholesalerResult {
  id: string;
  name: string;
  price: number;
  availability: boolean;
  deliveryTime: string;
}

export const useHurtowniaSearch = () => {
  const [results, setResults] = useState<WholesalerResult[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      // Mock implementation
      setResults([]);
    } catch (err) {
      setError("Wystąpił błąd podczas wyszukiwania");
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, total: results.length, search };
};