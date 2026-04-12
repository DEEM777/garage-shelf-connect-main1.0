import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => setNeedRefresh(false);

  useEffect(() => {
    if (needRefresh) {
      toast.info("Dostępna jest nowa wersja!", {
        description: "Zaktualizowaliśmy aplikację do wersji Auto-Mechanic. Odśwież teraz, aby zobaczyć zmiany.",
        action: {
          label: "Zaktualizuj",
          onClick: () => updateServiceWorker(true),
        },
        duration: Infinity,
        position: 'top-center',
      });
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}

export default PWAUpdatePrompt;
