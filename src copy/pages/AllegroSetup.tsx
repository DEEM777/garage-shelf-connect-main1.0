import { useEffect } from "react";
import { useAllegroAuth } from "@/hooks/useAllegro";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, ExternalLink, Loader2, AlertCircle } from "lucide-react";

const AllegroSetup = () => {
  const { deviceInfo, status, error, initDeviceFlow, checkStatus } = useAllegroAuth();

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-2">Autoryzacja Allegro</h1>
          <p className="text-muted-foreground mb-8">
            Połącz swoje konto Allegro, aby pobierać aktualne oferty części samochodowych.
          </p>

          {status === "authorized" && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30">
              <CheckCircle className="w-6 h-6 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Autoryzacja aktywna</p>
                <p className="text-sm text-muted-foreground">Allegro jest połączone i gotowe do użycia.</p>
              </div>
            </div>
          )}

          {status === "idle" && (
            <button
              onClick={initDeviceFlow}
              className="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-accent transition-colors"
            >
              Rozpocznij autoryzację
            </button>
          )}

          {status === "waiting" && deviceInfo && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary border border-border">
                <p className="text-sm text-muted-foreground mb-2">1. Otwórz link poniżej:</p>
                <a
                  href={deviceInfo.verification_uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  Otwórz stronę autoryzacji Allegro
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="p-4 rounded-lg bg-secondary border border-border">
                <p className="text-sm text-muted-foreground mb-2">2. Wpisz kod:</p>
                <p className="text-2xl font-mono font-bold text-primary tracking-widest">
                  {deviceInfo.user_code}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Oczekiwanie na autoryzację…
              </div>
            </div>
          )}

          {status === "waiting" && !deviceInfo && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Inicjalizacja…
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
              <button
                onClick={initDeviceFlow}
                className="py-2 px-4 rounded-lg border border-border text-sm hover:border-primary/50 transition-colors"
              >
                Spróbuj ponownie
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllegroSetup;
