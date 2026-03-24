import { Car, Menu, X, ShoppingCart, Settings } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="w-6 h-6 text-primary" />
          <span className="font-heading text-xl font-bold tracking-tight">
            <span className="text-primary">Auto</span>Części
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/hurtownie" className="text-sm text-muted-foreground hover:text-primary transition-colors">Hurtownie</Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Portale</Link>
          <Link to="/allegro-setup" className="flex items-center gap-2 text-sm text-primary font-semibold hover:text-primary/80 transition-colors">
            <Settings className="w-4 h-4" />
            Allegro
            <Badge variant="default" className="text-xs">NOWE</Badge>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse-glow">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

       {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 py-4 flex flex-col gap-3">
          <Link to="/hurtownie" className="text-sm text-muted-foreground hover:text-primary transition-colors">Hurtownie</Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Portale</Link>
          <Link to="/allegro-setup" className="flex items-center gap-2 text-sm text-primary font-semibold hover:text-primary/80 transition-colors">
            <Settings className="w-4 h-4" />
            Allegro
            <Badge variant="default" className="text-xs">NOWE</Badge>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
