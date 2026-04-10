import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Truck, CreditCard, MapPin, User, Mail, Phone } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type FormData = {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const ORDERS_KEY = "autoczesci-orders";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", street: "", city: "", zip: "", notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-xl text-muted-foreground mb-4">Twój koszyk jest pusty</p>
            <button onClick={() => navigate("/")} className="text-primary hover:underline font-heading font-bold">
              Wróć do sklepu
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Imię i nazwisko jest wymagane";
    if (!form.email.trim()) e.email = "Email jest wymagany";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Nieprawidłowy email";
    if (!form.phone.trim()) e.phone = "Numer telefonu jest wymagany";
    else if (!/^[\d\s+()-]{9,}$/.test(form.phone)) e.phone = "Nieprawidłowy numer";
    if (!form.street.trim()) e.street = "Ulica jest wymagana";
    if (!form.city.trim()) e.city = "Miasto jest wymagane";
    if (!form.zip.trim()) e.zip = "Kod pocztowy jest wymagany";
    else if (!/^\d{2}-\d{3}$/.test(form.zip)) e.zip = "Format: 00-000";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    // Simulate processing
    setTimeout(() => {
      const order = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: [...items],
        total: totalPrice,
        customer: { ...form },
      };

      try {
        const existing = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
        existing.push(order);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(existing));
      } catch { /* ignore */ }

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Powrót
          </button>

          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8">
            <span className="text-primary">Zamówienie</span>
          </h1>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Form fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal info */}
              <div className="gradient-card border border-border rounded-lg p-6">
                <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Dane osobowe
                </h2>
                <div className="space-y-4">
                  <Field icon={<User className="w-4 h-4" />} label="Imię i nazwisko" value={form.name} error={errors.name}
                    onChange={(v) => update("name", v)} placeholder="Jan Kowalski" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field icon={<Mail className="w-4 h-4" />} label="Email" value={form.email} error={errors.email}
                      onChange={(v) => update("email", v)} placeholder="jan@email.pl" type="email" />
                    <Field icon={<Phone className="w-4 h-4" />} label="Telefon" value={form.phone} error={errors.phone}
                      onChange={(v) => update("phone", v)} placeholder="+48 123 456 789" type="tel" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="gradient-card border border-border rounded-lg p-6">
                <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Adres dostawy
                </h2>
                <div className="space-y-4">
                  <Field icon={<Truck className="w-4 h-4" />} label="Ulica i numer" value={form.street} error={errors.street}
                    onChange={(v) => update("street", v)} placeholder="ul. Mechaników 15/3" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Miasto" value={form.city} error={errors.city}
                      onChange={(v) => update("city", v)} placeholder="Warszawa" />
                    <Field label="Kod pocztowy" value={form.zip} error={errors.zip}
                      onChange={(v) => update("zip", v)} placeholder="00-000" />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="gradient-card border border-border rounded-lg p-6">
                <h2 className="font-heading text-lg font-bold mb-4">Uwagi do zamówienia</h2>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Dodatkowe informacje (opcjonalnie)"
                  rows={3}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <div className="gradient-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-primary" /> Podsumowanie
                </h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.partId}-${item.source}`} className="flex justify-between text-sm">
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.brand} · {item.source} · x{item.quantity}</p>
                      </div>
                      <p className="text-foreground font-medium ml-3 whitespace-nowrap">
                        {(item.price * item.quantity).toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Suma:</span>
                    <span className="font-heading text-2xl font-bold text-primary">
                      {totalPrice.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-heading font-bold rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="animate-pulse">Przetwarzanie...</span>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" /> Złóż zamówienie
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

/* Reusable form field */
const Field = ({
  label, value, error, onChange, placeholder, type = "text", icon,
}: {
  label: string; value: string; error?: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; icon?: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-secondary/50 border rounded-lg ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
          error ? "border-destructive focus:border-destructive" : "border-border focus:border-primary/50"
        }`}
      />
    </div>
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

export default Checkout;
