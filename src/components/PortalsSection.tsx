import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const PortalsSection = ({ searchQuery }: { searchQuery: string }) => {
  const [activeQuery, setActiveQuery] = useState<string>(searchQuery || "");

  // Aktualizuj pole wyszukiwania, gdy zmienia się zapytanie z głównej wyszukiwarki
  useEffect(() => {
    if (searchQuery) {
      setActiveQuery(searchQuery);
    }
  }, [searchQuery]);

  const q = encodeURIComponent(activeQuery.trim() || "");

  const portals = [
    { name: "Allegro", color: "#FF5A00", url: `https://allegro.pl/listing?string=${q}` },
    { name: "OLX", color: "#002f34", url: `https://www.olx.pl/motoryzacja/czesci-samochodowe/q-${q}/` },
    { name: "OtoMoto", color: "#E3000F", url: `https://www.otomoto.pl/czesci?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=filter_float_price%3Aasc&search%5Bquery%5D=${q}` },
    { name: "Amazon", color: "#232F3E", url: `https://www.amazon.pl/s?k=${q}` },
    { name: "eBay", color: "#0064D2", url: `https://www.ebay.pl/sch/i.html?_nkw=${q}` },
  ];

  return (
    <section className="py-16 px-4 bg-secondary/50" id="portale">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading text-center mb-2">
          Szukaj w <span className="text-primary">portalach</span>
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Szybkie przekierowanie do największych serwisów ogłoszeniowych
        </p>

        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                value={activeQuery}
                onChange={(e) => setActiveQuery(e.target.value)}
                placeholder="Wpisz nazwę części (np. klocki hamulcowe)..."
                className="w-full py-3 pl-10 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {portals.map((portal) => (
              <a
                key={portal.name}
                href={activeQuery.trim() ? portal.url : "#"}
                target={activeQuery.trim() ? "_blank" : undefined}
                rel="noreferrer"
                className={`px-4 py-2.5 rounded-lg text-white font-semibold text-center transition-all shadow-sm ${
                  !activeQuery.trim() ? "opacity-30 cursor-not-allowed pointer-events-none" : "hover:brightness-110 active:scale-95"
                }`}
                style={{ backgroundColor: portal.color }}
              >
                {portal.name}
              </a>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-lg border border-border text-center bg-background/50 text-muted-foreground italic text-sm">
          Bezpieczne, bezpośrednie linki do wyników wyszukiwania (brak śledzenia i zapytań w tle).
        </div>
      </div>
    </section>
  );
};

export default PortalsSection;
