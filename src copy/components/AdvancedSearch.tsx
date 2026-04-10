import { useState, useRef, useEffect } from "react";
import { Search, Hash, Car, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { partsData } from "@/data/parts";

type SearchMode = "name" | "oe" | "vehicle";

const searchModes: { mode: SearchMode; label: string; icon: typeof Search; placeholder: string }[] = [
  { mode: "name", label: "Nazwa", icon: Search, placeholder: "np. klocki hamulcowe Brembo..." },
  { mode: "oe", label: "Nr OE / Katalogowy", icon: Hash, placeholder: "np. 34 11 6 761 244 lub P06024..." },
  { mode: "vehicle", label: "Pojazd", icon: Car, placeholder: "np. BMW E46, Honda CBR 600RR..." },
];

const AdvancedSearch = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [mode, setMode] = useState<SearchMode>("name");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof partsData>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const results = partsData.filter((p) => {
      switch (mode) {
        case "name":
          return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
        case "oe":
          return p.oeNumber.toLowerCase().replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
                 p.catalogNumber.toLowerCase().includes(q);
        case "vehicle":
          return p.compatibility.toLowerCase().includes(q);
      }
    });
    setSuggestions(results);
    setShowSuggestions(true);
  }, [query, mode]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  const currentMode = searchModes.find((m) => m.mode === mode)!;

  return (
    <div ref={wrapperRef} className="relative max-w-2xl mx-auto">
      {/* Mode tabs */}
      <div className="flex gap-1 mb-3 justify-center">
        {searchModes.map((m) => (
          <button
            key={m.mode}
            onClick={() => { setMode(m.mode); setQuery(""); setSuggestions([]); inputRef.current?.focus(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
              mode === m.mode
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <m.icon className="w-3 h-3" />
            {m.label}
          </button>
        ))}
      </div>

      {/* Search input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={currentMode.placeholder}
            className="w-full py-4 px-6 pr-14 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setSuggestions([]); onSearch(""); }}
              className="absolute right-14 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary rounded-md text-primary-foreground hover:bg-accent transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Autocomplete suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-xl z-20 max-h-72 overflow-y-auto">
          {suggestions.map((part) => (
            <button
              key={part.id}
              onClick={() => {
                navigate(`/part/${part.id}`);
                setShowSuggestions(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border last:border-b-0 flex justify-between items-center gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{part.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {part.brand} · {part.compatibility}
                  {mode === "oe" && <span className="ml-2 font-mono">OE: {part.oeNumber}</span>}
                </p>
              </div>
              <p className="shrink-0 text-sm font-heading font-bold text-primary">
                od {Math.min(...part.offers.map((o) => o.price)).toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
