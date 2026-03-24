import { X, MapPin, ExternalLink, ShoppingCart, TrendingDown, TrendingUp } from "lucide-react";
import type { PartWithOffers } from "@/data/parts";
import { useCart } from "@/contexts/CartContext";

type Props = {
  part: PartWithOffers;
  onClose: () => void;
};

const PriceCompareModal = ({ part, onClose }: Props) => {
  const { addItem } = useCart();
  const sorted = [...part.offers].sort((a, b) => a.price - b.price);
  const lowest = sorted[0]?.price ?? 0;
  const highest = sorted[sorted.length - 1]?.price ?? 0;
  const savings = highest - lowest;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-card border border-border rounded-xl z-50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">{part.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{part.brand} · {part.compatibility}</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          {savings > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-2 rounded-lg">
              <TrendingDown className="w-4 h-4" />
              <span>Oszczędź do <strong>{savings.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN</strong> wybierając najtańszą ofertę</span>
            </div>
          )}
        </div>

        {/* Offers */}
        <div className="p-5 max-h-80 overflow-y-auto space-y-3">
          {sorted.map((offer, i) => {
            const isCheapest = offer.price === lowest;
            const isMostExpensive = offer.price === highest && sorted.length > 1;

            return (
              <div
                key={offer.source}
                className={`rounded-lg p-4 border transition-all ${
                  isCheapest
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-secondary/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                      {offer.sourceType === "hurtownia" ? (
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{offer.source}</p>
                      <p className="text-xs text-muted-foreground">
                        {offer.sourceType === "hurtownia" ? "Hurtownia" : "Portal internetowy"}
                        {offer.inStock ? " · Dostępny" : " · Brak w magazynie"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className={`font-heading font-bold text-lg ${isCheapest ? "text-primary" : "text-foreground"}`}>
                        {offer.price.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN
                      </p>
                      {isCheapest && sorted.length > 1 && (
                        <span className="text-xs text-primary flex items-center gap-1 justify-end">
                          <TrendingDown className="w-3 h-3" /> Najlepsza cena
                        </span>
                      )}
                      {isMostExpensive && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                          <TrendingUp className="w-3 h-3" /> Najdroższa
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        addItem({
                          partId: `${part.id}-${offer.source}`,
                          name: part.name,
                          brand: part.brand,
                          price: offer.price,
                          source: offer.source,
                        });
                      }}
                      disabled={!offer.inStock}
                      className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PriceCompareModal;
