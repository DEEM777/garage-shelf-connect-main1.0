import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, QrCode } from "lucide-react";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Install = () => {
  const [copied, setCopied] = useState(false);
  const appUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }

    return "https://garage-shelf-connect-main1-0.vercel.app";
  }, []);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(appUrl)}`;

  const copyLink = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-16 px-4">
        <div className="max-w-5xl mx-auto py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                <Download className="w-4 h-4" />
                Pobierz aplikację
              </span>
              <h1 className="mt-6 text-4xl font-heading font-bold tracking-tight sm:text-5xl">
                Szybkie pobranie na telefon
              </h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                Użytkownicy mogą zeskanować kod QR i otworzyć aplikację w telefonie bez zbędnych kliknięć. Jeśli jesteś na komputerze,
                wyświetl ten kod w telefonie albo skopiuj link.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={copyLink} variant="default">
                  {copied ? "Skopiowano!" : "Kopiuj link"}
                </Button>
                <Link to="/" className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent">
                  Powrót do wyszukiwarki
                </Link>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <QrCode className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold">Skanuj kod QR</h2>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Zeskanuj kod telefonem, aby szybko otworzyć aplikację i dodać ją do ekranu głównego.
                </p>
                <div className="mt-6 flex justify-center">
                  <img
                    src={qrUrl}
                    alt="Kod QR do pobrania aplikacji"
                    className="h-72 w-72 rounded-3xl border border-border bg-background object-contain"
                  />
                </div>
              </div>

              <div className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div>
                  <h3 className="text-base font-semibold">Jak to działa?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Zeskanuj kod i otwórz stronę w przeglądarce telefonu. Następnie wybierz opcję „Dodaj do ekranu głównego”.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold">Android</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    W Chrome naciśnij trzy kropki w prawym górnym rogu, a następnie wybierz „Dodaj do ekranu głównego”.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold">iOS</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    W Safari dotknij ikony udostępniania, a potem wybierz „Dodaj do ekranu początkowego”.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Install;
