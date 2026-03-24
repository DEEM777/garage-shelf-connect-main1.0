import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PartCard from "./PartCard";
import PriceCompareModal from "./PriceCompareModal";
import FilterPanel, { type Filters, defaultFilters } from "./FilterPanel";
import { partsData, type PartWithOffers } from "@/data/parts";
import AllegroResults from "./AllegroResults";

const PartsGrid = ({ searchQuery }: { searchQuery: string }) => {
  const [comparePart, setComparePart] = useState<PartWithOffers | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const navigate = useNavigate();

  const filtered = partsData.filter((p) => {
    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesText =
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.compatibility.toLowerCase().includes(q) ||
        p.oeNumber.toLowerCase().replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
        p.catalogNumber.toLowerCase().includes(q);
      if (!matchesText) return false;
    }

    // Vehicle type
    if (filters.vehicleType !== "all" && p.vehicleType !== filters.vehicleType) return false;

    // Category
    if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;

    // Brand
    if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;

    // Source
    if (filters.sources.length > 0 && !p.offers.some((o) => filters.sources.includes(o.source))) return false;

    // Price range
    const minPrice = Math.min(...p.offers.map((o) => o.price));
    if (minPrice < filters.priceMin || minPrice > filters.priceMax) return false;

    // Stock
    if (filters.inStockOnly && !p.offers.some((o) => o.inStock)) return false;

    return true;
  });

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-heading">
            {searchQuery ? (
              <>Wyniki dla: <span className="text-primary">"{searchQuery}"</span></>
            ) : (
              <>Popularne <span className="text-primary">części</span></>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} wyników</p>
        </div>

        <div className="flex gap-8">
          <FilterPanel filters={filters} onChange={setFilters} />

          <div className="flex-1 min-w-0">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((part) => (
                  <PartCard
                    key={part.id}
                    part={part}
                    onCompare={setComparePart}
                    onDetails={() => navigate(`/part/${part.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">Nie znaleziono części</p>
                <p className="text-sm mt-2">Spróbuj zmienić filtry lub frazę wyszukiwania</p>
              </div>
            )}
          </div>

        </div>

        <AllegroResults searchQuery={searchQuery} />

      </div>

      {comparePart && (
        <PriceCompareModal part={comparePart} onClose={() => setComparePart(null)} />
      )}
    </section>
  );
};

export default PartsGrid;
