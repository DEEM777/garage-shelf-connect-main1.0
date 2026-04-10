import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Handshake, Store, Globe, ArrowRight } from "lucide-react";

const Wspolpraca = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-6">
            <Handshake className="w-4 h-4" />
            Współpraca
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Zostań naszym <span className="text-primary">Partnerem</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Prowadzisz hurtownię, sklep motoryzacyjny czy popularny profil? Łączymy kierowców i mechaników z najlepszymi dostawcami części. Dołącz do naszej sieci i docieraj do tysięcy klientów każdego dnia.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16 text-left">
            <div className="p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <Store className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Dla Hurtowni i Sklepów</h3>
              <p className="text-muted-foreground mb-6">
                Zintegruj swoją ofertę bezpośrednio w naszej wyszukiwarce. Udostępniamy bezpieczne API do automatycznej wymiany cenników, dzięki czemu Twoje produkty zawsze będą wyświetlane na wysokich pozycjach.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2 text-sm"><ArrowRight className="w-4 h-4 text-primary" /> Bezpośrednie API REST</li>
                <li className="flex items-center gap-2 text-sm"><ArrowRight className="w-4 h-4 text-primary" /> Aktualizacja stanów magazynowych na żywo</li>
                <li className="flex items-center gap-2 text-sm"><ArrowRight className="w-4 h-4 text-primary" /> Panel analityczny dla Partnerów</li>
              </ul>
              <button className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                Integracja B2B
              </button>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <Globe className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Program Afiliacyjny</h3>
              <p className="text-muted-foreground mb-6">
                Chcesz polecać naszą platformę lub zarabiać na linkach zewnętrznych? Integrujemy potężne kanały sprzedaży takie jak Allegro, Amazon, czy eBay w oparciu o zatwierdzone linki.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2 text-sm"><ArrowRight className="w-4 h-4 text-primary" /> Prowizje od wygenerowanego ruchu</li>
                <li className="flex items-center gap-2 text-sm"><ArrowRight className="w-4 h-4 text-primary" /> Gotowe szablony i banery na stronę</li>
                <li className="flex items-center gap-2 text-sm"><ArrowRight className="w-4 h-4 text-primary" /> Pełne wsparcie programów Amazon / eBay</li>
              </ul>
              <button className="w-full py-3 border border-border bg-background text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors">
                Dołącz do programu Afiliacyjnego
              </button>
            </div>
          </div>

          <div className="p-8 md:p-12 rounded-3xl bg-secondary/50 border border-border text-center">
            <h2 className="text-2xl font-bold mb-4">Masz nietypową propozycję?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Zawsze chętnie wysłuchamy nowych i innowacyjnych pomysłów na współpracę. Skontaktuj się z naszym zespołem do spraw rozwoju biznesu i omówmy szczegóły.
            </p>
            <a href="mailto:kontakt@auto-mechanic.pl" className="inline-block px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-colors">
              Napisz do nas
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wspolpraca;
