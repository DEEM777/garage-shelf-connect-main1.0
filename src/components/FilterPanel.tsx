import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { allBrands, allSources, allCategories } from "@/data/parts";

export type Filters = {
  priceMin: number;
  priceMax: number;
  brands: string[];
  vehicleType: "all" | "samochód" | "motocykl";
  sources: string[];
  categories: string[];
  inStockOnly: boolean;
};

export const defaultFilters: Filters = {
  priceMin: 0,
  priceMax: 1000,
  brands: [],
  vehicleType: "all",
  sources: [],
  categories: [],
  inStockOnly: false,
};

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
};

const FilterSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-sm font-heading font-semibold text-foreground mb-2">
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && children}
    </div>
  );
};

const CheckboxItem = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded border-border bg-secondary accent-primary w-4 h-4"
    />
    {label}
  </label>
);

const FilterPanel = ({ filters, onChange }: Props) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleArrayFilter = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const activeCount =
    filters.brands.length + filters.sources.length + filters.categories.length +
    (filters.vehicleType !== "all" ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceMin > 0 || filters.priceMax < 1000 ? 1 : 0);

  const content = (
    <div className="space-y-4">
      {/* Price range */}
      <FilterSection title="Cena (PLN)">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => onChange({ ...filters, priceMin: Math.max(0, Number(e.target.value)) })}
              placeholder="Od"
              className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
              placeholder="Do"
              className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={filters.priceMax}
            onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
      </FilterSection>

      {/* Vehicle type */}
      <FilterSection title="Typ pojazdu">
        <div className="flex gap-2">
          {([["all", "Wszystkie"], ["samochód", "Samochody"], ["motocykl", "Motocykle"]] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => onChange({ ...filters, vehicleType: val })}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-all ${
                filters.vehicleType === val
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Kategoria">
        <div className="space-y-2">
          {allCategories.map((cat) => (
            <CheckboxItem
              key={cat}
              label={cat}
              checked={filters.categories.includes(cat)}
              onChange={() => onChange({ ...filters, categories: toggleArrayFilter(filters.categories, cat) })}
            />
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Marka">
        <div className="space-y-2">
          {allBrands.map((brand) => (
            <CheckboxItem
              key={brand}
              label={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => onChange({ ...filters, brands: toggleArrayFilter(filters.brands, brand) })}
            />
          ))}
        </div>
      </FilterSection>

      {/* Sources */}
      <FilterSection title="Źródło" defaultOpen={false}>
        <div className="space-y-2">
          {allSources.map((src) => (
            <CheckboxItem
              key={src}
              label={src}
              checked={filters.sources.includes(src)}
              onChange={() => onChange({ ...filters, sources: toggleArrayFilter(filters.sources, src) })}
            />
          ))}
        </div>
      </FilterSection>

      {/* In stock */}
      <FilterSection title="Dostępność">
        <CheckboxItem
          label="Tylko dostępne"
          checked={filters.inStockOnly}
          onChange={(v) => onChange({ ...filters, inStockOnly: v })}
        />
      </FilterSection>

      {/* Reset */}
      {activeCount > 0 && (
        <button
          onClick={() => onChange(defaultFilters)}
          className="w-full py-2 text-sm text-muted-foreground hover:text-destructive border border-border rounded-md transition-colors"
        >
          Wyczyść filtry ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-30 flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full shadow-lg glow-primary font-heading font-semibold text-sm"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtry
        {activeCount > 0 && (
          <span className="w-5 h-5 bg-primary-foreground text-primary text-xs rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 lg:hidden p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-lg font-bold">Filtry</h3>
              <button onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 gradient-card border border-border rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <h3 className="font-heading text-base font-bold">Filtry</h3>
          </div>
          {content}
        </div>
      </aside>
    </>
  );
};

export default FilterPanel;
