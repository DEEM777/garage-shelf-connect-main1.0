import { MapPin, ExternalLink, ShoppingCart, BarChart3, Eye } from "lucide-react";
import type { PartWithOffers } from "@/data/parts";
import { useCart } from "@/contexts/CartContext";

type Props = {
  part: PartWithOffers;
  onCompare: (part: PartWithOffers) => void;
  onDetails: () => void;
};

const PartCard = ({ part, onCompare, onDetails }: Props) => {
  const { addItem } = useCart();
  const cheapest = [...part.offers].sort((a, b) => a.price - b.price)[0];
  const hasMultipleOffers = part.offers.length > 1;
  const anyInStock = part.offers.some((o) => o.inStock);

  return (
    <div className="gradient-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all group">
      <button onClick={onDetails} className="w-full aspect-[4/3] bg-secondary flex items-center justify-center overflow-hidden cursor-pointer relative">
        <div className="text-muted-foreground text-sm">Brak zdjęcia</div>
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Eye className="w-6 h-6 text-primary" />
        </div>
      </button>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <button onClick={onDetails} className="text-left">
            <h3 className="font-heading text-base font-semibold leading-tight text-foreground hover:text-primary transition-colors">{part.name}</h3>
          </button>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
            anyInStock ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
          }`}>
            {anyInStock ? "Dostępny" : "Brak"}
          </span>
        </div>

        <p className="text-xs text-muted-foreground mb-0.5">{part.brand} · {part.compatibility}</p>
        <p className="text-xs text-muted-foreground mb-3 font-mono">OE: {part.oeNumber}</p>

        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">od</p>
            <p className="text-2xl font-heading font-bold text-primary">
              {cheapest.price.toLocaleString("pl-PL", { minimumFractionDigits: 2 })}
              <span className="text-sm ml-1">PLN</span>
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {cheapest.sourceType === "hurtownia" ? <MapPin className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
            <span>{part.offers.length} ofert</span>
          </div>
        </div>

        <div className="flex gap-2">
          {hasMultipleOffers && (
            <button
              onClick={() => onCompare(part)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Porównaj
            </button>
          )}
          <button
            onClick={() => {
              addItem({ partId: part.id, name: part.name, brand: part.brand, price: cheapest.price, source: cheapest.source });
            }}
            disabled={!anyInStock}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Do koszyka
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartCard;
