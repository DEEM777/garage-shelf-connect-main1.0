import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, ExternalLink, ShoppingCart, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { partsData } from "@/data/parts";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

const PartDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const part = partsData.find((p) => p.id === id);

  if (!part) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Część nie została znaleziona</p>
          <button onClick={() => navigate("/")} className="text-primary hover:underline">Wróć do strony głównej</button>
        </div>
      </div>
    );
  }

  const sorted = [...part.offers].sort((a, b) => a.price - b.price);
  const cheapest = sorted[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Powrót
          </button>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center border border-border">
              <span className="text-muted-foreground">Brak zdjęcia</span>
            </div>

            <div>
              <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">{part.category}</span>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-1">{part.name}</h1>
              <p className="text-muted-foreground mb-1">{part.brand} · {part.compatibility}</p>
              <p className="text-xs text-muted-foreground mb-6">
                {part.vehicleType === "samochód" ? "🚗" : "🏍️"} {part.vehicleType}
              </p>

              <div className="gradient-card border border-border rounded-lg p-5 mb-6">
                <p className="text-xs text-muted-foreground mb-1">Najlepsza cena od</p>
                <p className="text-4xl font-heading font-bold text-primary">
                  {cheapest.price.toLocaleString("pl-PL", { minimumFractionDigits: 2 })}
                  <span className="text-lg ml-1">PLN</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{cheapest.source} · {part.offers.length} ofert</p>
                <button
                  onClick={() => addItem({ partId: part.id, name: part.name, brand: part.brand, price: cheapest.price, source: cheapest.source })}
                  className="mt-4 w-full py-3 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-heading font-bold rounded-lg hover:bg-accent transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" /> Dodaj do koszyka
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-secondary/50 border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Numer OE</p>
                  <p className="text-sm font-mono font-medium text-foreground mt-0.5">{part.oeNumber}</p>
                </div>
                <div className="bg-secondary/50 border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Nr katalogowy</p>
                  <p className="text-sm font-mono font-medium text-foreground mt-0.5">{part.catalogNumber}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> Specyfikacja
                </h2>
                <div className="gradient-card border border-border rounded-lg overflow-hidden">
                  {Object.entries(part.specs).map(([key, val], i) => (
                    <div key={key} className={`flex justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? "bg-secondary/30" : ""}`}>
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium text-foreground">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-heading text-2xl font-bold mb-4">Historia <span className="text-primary">cen</span></h2>
            <div className="gradient-card border border-border rounded-lg p-6">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={part.priceHistory}>
                  <XAxis dataKey="date" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} unit=" PLN" width={70} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(220, 18%, 14%)", border: "1px solid hsl(220, 15%, 22%)", borderRadius: "8px", color: "hsl(40, 10%, 90%)" }}
                    formatter={(value: number) => [`${value.toFixed(2)} PLN`, "Cena"]}
                  />
                  <Line type="monotone" dataKey="price" stroke="hsl(30, 95%, 55%)" strokeWidth={2.5} dot={{ fill: "hsl(30, 95%, 55%)", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-heading text-2xl font-bold mb-4">Porównanie <span className="text-primary">ofert</span></h2>
            <div className="space-y-3">
              {sorted.map((offer) => (
                <div key={offer.source} className={`gradient-card border rounded-lg p-4 flex items-center justify-between ${
                  offer.price === cheapest.price ? "border-primary/50" : "border-border"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {offer.sourceType === "hurtownia" ? <MapPin className="w-5 h-5 text-muted-foreground" /> : <ExternalLink className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{offer.source}</p>
                      <p className="text-xs text-muted-foreground">
                        {offer.sourceType === "hurtownia" ? "Hurtownia" : "Portal"} · {offer.inStock ? "Dostępny" : "Niedostępny"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-heading text-xl font-bold ${offer.price === cheapest.price ? "text-primary" : "text-foreground"}`}>
                      {offer.price.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN
                    </p>
                    <button
                      onClick={() => addItem({ partId: `${part.id}-${offer.source}`, name: part.name, brand: part.brand, price: offer.price, source: offer.source })}
                      disabled={!offer.inStock}
                      className="p-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PartDetail;
