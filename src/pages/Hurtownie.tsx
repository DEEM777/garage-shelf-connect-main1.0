import { useMemo, useState } from "react";
import { Search, MapPin, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { partsData, PartWithOffers } from "@/data/parts";
import { useHurtowniaSearch } from "@/hooks/useHurtownia";

const Hurtownie = () => {
  const [search, setSearch] = useState("");
  const [apiQuery, setApiQuery] = useState("");
  const { results: apiResults, loading: apiLoading, error: apiError, total: apiTotal, search: searchFromApi } = useHurtowniaSearch();

  const data = useMemo(() => {
    const byWholesaler = new Map<string, {offers: number; parts: Set<string>; cheapest: number}>();

    partsData.forEach((part: PartWithOffers) => {
      const hurts = part.offers.filter((offer) => offer.sourceType === "hurtownia");

      hurts.forEach((offer) => {
        const existing = byWholesaler.get(offer.source);
        if (!existing) {
          byWholesaler.set(offer.source, {offers: 1, parts: new Set([part.id]), cheapest: offer.price});
        } else {
          existing.offers += 1;
          existing.parts.add(part.id);
          existing.cheapest = Math.min(existing.cheapest, offer.price);
        }
      });
    });

    return Array.from(byWholesaler.entries())
      .map(([source, info]) => ({
        source,
        offers: info.offers,
        partCount: info.parts.size,
        cheapest: info.cheapest,
      }))
      .filter((item) => item.source.toLowerCase().includes(search.trim().toLowerCase()))
      .sort((a, b) => b.partCount - a.partCount || a.cheapest - b.cheapest);
  }, [search]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">Panel Hurtowni</h1>
          <p className="text-muted-foreground mb-8">
            To jest dedykowany panel hurtowni — przeglądaj ofertę hurtowni, szybki dostęp do statystyk i ofert.
          </p>

          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              Widoczna hurtownia: {data.length}
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Szukaj hurtowni lokalnie..."
                className="w-full py-2 pl-9 pr-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="mb-8 rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative w-full sm:w-2/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  value={apiQuery}
                  onChange={(e) => setApiQuery(e.target.value)}
                  placeholder="Szukaj w hurtowni (API)..."
                  className="w-full py-2 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <button
                onClick={() => searchFromApi(apiQuery)}
                disabled={!apiQuery.trim() || apiLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-accent disabled:opacity-50 transition-colors"
              >
                {apiLoading ? "Ładowanie..." : "Pobierz ofertę z API hurtowni"}
              </button>
            </div>
            {apiError && <p className="mt-3 text-sm text-destructive">Błąd API: {apiError}</p>}
            {apiResults.length > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">Znaleziono {apiTotal} ofert z API hurtowni</p>
            )}
          </div>

          {data.length === 0 ? (
            <div className="p-8 rounded-lg border border-border text-center bg-secondary text-muted-foreground">
              Brak hurtowni do wyświetlenia. Zmień filtr wyszukiwania lub dodaj dane hurtowni.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((item) => (
                <div key={item.source} className="rounded-lg border border-border p-4 transition hover:shadow-lg bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{item.source}</h3>
                    <span className="text-xs text-muted-foreground">{item.partCount} części</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Ofert: {item.offers}</div>
                  <div className="flex items-center text-sm gap-1 text-primary font-semibold">
                    <TrendingUp className="w-4 h-4" /> najtańsza: {item.cheapest.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN
                  </div>
                </div>
              ))}
            </div>
          )}

          {apiResults.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-heading font-semibold mb-4">Wyniki z API hurtowni</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {apiResults.map((offer) => (
                  <a
                    key={offer.id}
                    href={offer.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg border border-border p-4 bg-card hover:shadow-lg transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-foreground">{offer.name}</h3>
                      <span className="text-xs text-muted-foreground">{offer.seller}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{offer.brand || "Producent nieznany"}</p>
                    <p className="text-lg font-bold text-primary">{offer.price?.toLocaleString("pl-PL", { minimumFractionDigits: 2 }) || "-"} {offer.currency}</p>
                    <p className="text-xs text-muted-foreground mt-1">{offer.inStock ? "W magazynie" : "Brak w magazynie"}</p>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Hurtownie;
