import { ExternalLink } from "lucide-react";

const marketplaces = [
  {
    name: "Allegro",
    buildUrl: (q: string) => `https://allegro.pl/listing?string=${encodeURIComponent(q)}`,
    color: "bg-primary text-primary-foreground hover:bg-accent",
  },
  {
    name: "OLX",
    buildUrl: (q: string) => `https://www.olx.pl/motoryzacja/czesci-samochodowe/q-${encodeURIComponent(q)}/`,
    color: "bg-primary text-primary-foreground hover:bg-accent",
  },
  {
    name: "OtoMoto",
    buildUrl: (q: string) => `https://www.otomoto.pl/czesci?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=filter_float_price%3Aasc&search%5Bquery%5D=${encodeURIComponent(q)}`,
    color: "bg-primary text-primary-foreground hover:bg-accent",
  },
];

const AllegroResults = ({ searchQuery }: { searchQuery: string }) => {
  if (!searchQuery || searchQuery.trim().length < 3) return null;

  return (
    <div className="mt-10 space-y-3">
      <h3 className="text-lg font-heading font-semibold mb-3">
        Szukaj na <span className="text-primary">portalach</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {marketplaces.map((mp) => (
          <a
            key={mp.name}
            href={mp.buildUrl(searchQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-card border border-border font-medium text-sm hover:border-primary hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Szukaj na {mp.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default AllegroResults;
