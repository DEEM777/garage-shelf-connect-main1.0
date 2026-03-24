import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Package, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ORDERS_KEY = "autoczesci-orders";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  let order: any = null;
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    order = orders.find((o: any) => o.id === orderId);
  } catch { /* ignore */ }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-4 text-center">
          <p className="text-xl text-muted-foreground mb-4">Zamówienie nie zostało znalezione</p>
          <button onClick={() => navigate("/")} className="text-primary hover:underline">Wróć do strony głównej</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              Zamówienie <span className="text-primary">złożone!</span>
            </h1>
            <p className="text-muted-foreground">Dziękujemy za zakup. Otrzymasz potwierdzenie na email.</p>
          </div>

          <div className="gradient-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-primary" />
              <h2 className="font-heading text-lg font-bold">Szczegóły zamówienia</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
              <div>
                <p className="text-muted-foreground">Nr zamówienia</p>
                <p className="font-mono font-medium text-foreground">{order.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Data</p>
                <p className="font-medium text-foreground">
                  {new Date(order.date).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Klient</p>
                <p className="font-medium text-foreground">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{order.customer.email}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              {order.items.map((item: any) => (
                <div key={`${item.partId}-${item.source}`} className="flex justify-between text-sm">
                  <span className="text-foreground">{item.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                  <span className="font-medium text-foreground">
                    {(item.price * item.quantity).toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
              <span className="text-muted-foreground font-heading font-bold">Suma:</span>
              <span className="font-heading text-2xl font-bold text-primary">
                {order.total.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN
              </span>
            </div>
          </div>

          <div className="gradient-card border border-border rounded-lg p-6 mb-8">
            <h2 className="font-heading text-lg font-bold mb-3">Adres dostawy</h2>
            <p className="text-sm text-foreground">{order.customer.name}</p>
            <p className="text-sm text-muted-foreground">{order.customer.street}</p>
            <p className="text-sm text-muted-foreground">{order.customer.zip} {order.customer.city}</p>
            <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-heading font-bold rounded-lg hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Wróć do sklepu
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
