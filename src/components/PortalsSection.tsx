import { useState } from "react";
import { Search, Globe, Loader2, Store } from "lucide-react";
import { usePortalSearch } from "@/hooks/usePortalSearch";

const PortalsSection = ({ searchQuery }: { searchQuery: string }) => {
  const { results, loading, error, search } = usePortalSearch();
  const [activeQuery, setActiveQuery] = useState<string>(searchQuery || "");

  const handleSearch = (platform?: "allegro" | "olx" | "otomoto" | "amazon" | "ebay") => {
    if (activeQuery.trim()) {
      search(activeQuery, platform, 10);
    }
  };

  return (
    <section className="py-16 px-4 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading text-center mb-2">
          Szukaj w <span className="text-primary">portalach</span>
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Porównaj ceny na Allegro, OLX, OtoMoto, Amazon i eBay w jednym miejscu
        </p>

        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                value={activeQuery}
                onChange={(e) => setActiveQuery(e.target.value)}
                placeholder="Wpisz nazwę części (np. klocki hamulcowe)..."
                className="w-full py-3 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <button
              onClick={() => handleSearch("allegro")}
              disabled={!activeQuery.trim() || loading}
              className="px-4 py-2 rounded-lg bg-[#FF5A00] text-white font-semibold hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Allegro
            </button>
            <button
              onClick={() => handleSearch("olx")}
              disabled={!activeQuery.trim() || loading}
              className="px-4 py-2 rounded-lg bg-[#002f34] text-white font-semibold hover:bg-[#002f34]/80 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              OLX
            </button>
            <button
              onClick={() => handleSearch("otomoto")}
              disabled={!activeQuery.trim() || loading}
              className="px-4 py-2 rounded-lg bg-[#E3000F] text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              OtoMoto
            </button>
            <button
              onClick={() => handleSearch("amazon")}
              disabled={!activeQuery.trim() || loading}
              className="px-4 py-2 rounded-lg bg-[#232F3E] text-white font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Amazon
            </button>
            <button
              onClick={() => handleSearch("ebay")}
              disabled={!activeQuery.trim() || loading}
              className="px-4 py-2 rounded-lg bg-[#0064D2] text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              eBay
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-destructive">Błąd: {error}</p>}
        </div>

        {results.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Znalezione oferty ({results.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((offer) => (
                <a
                  key={offer.id}
                  href={offer.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col rounded-xl border border-border bg-card p-5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold border border-primary/20 backdrop-blur-sm">
                      {offer.platform}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-heading font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors pr-16">
                      {offer.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Store className="w-3 h-3" /> {offer.seller}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Cena</p>
                      <p className="text-xl font-heading font-extrabold text-primary">
                        {offer.price?.toLocaleString("pl-PL", { minimumFractionDigits: 2 }) || "-"} 
                        <span className="text-xs ml-1 font-medium">{offer.currency}</span>
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                        offer.inStock 
                          ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                          : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}>
                        {offer.inStock ? "DOSTĘPNE" : "BRAK"}
                      </span>
                    </div>
                  </div>
                </a>

              ))}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && activeQuery && !error && (
          <div className="p-8 rounded-lg border border-border text-center bg-card text-muted-foreground">
            Kliknij przycisk poniżej, aby wyszukać oferty w portalach
          </div>
        )}
      </div>
    </section>
  );
};

export default PortalsSection;

