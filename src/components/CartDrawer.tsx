import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartDrawer = () => {
  const navigate = useNavigate();
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-xl font-bold">Koszyk</h2>
            <span className="text-sm text-muted-foreground">({totalItems})</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Koszyk jest pusty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.partId}-${item.source}`}
                className="bg-secondary/50 rounded-lg p-4 border border-border"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-heading font-semibold text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.brand} · {item.source}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.partId, item.source)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.partId, item.source, item.quantity - 1)}
                      className="w-7 h-7 rounded bg-muted flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.partId, item.source, item.quantity + 1)}
                      className="w-7 h-7 rounded bg-muted flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-heading font-bold text-primary">
                    {(item.price * item.quantity).toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Suma:</span>
              <span className="font-heading text-2xl font-bold text-primary">
                {totalPrice.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN
              </span>
            </div>
            <button
              onClick={() => { setIsOpen(false); navigate("/checkout"); }}
              className="w-full py-3 bg-primary text-primary-foreground font-heading font-bold rounded-lg hover:bg-accent transition-colors"
            >
              Przejdź do zamówienia
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Wyczyść koszyk
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
