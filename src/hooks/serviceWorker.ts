import { useCallback, useEffect, useState } from "react";
import swUrl from "../service-worker.js?url";

export default function useServiceWorker() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [state, setState] = useState<ServiceWorkerState | null>(null);
  const [error, setError] = useState<boolean>(false);

  const init = useCallback(
    async (register = true) => {
      try {
        let registration;
        if (register) {
          registration = await navigator.serviceWorker.register(swUrl);
        } else {
          registration = await navigator.serviceWorker.ready;
        }

        const serviceWorker = registration.installing ?? registration.active;
        if (null === serviceWorker) {
          setError(true);
          return;
        }

        setState(serviceWorker.state);

        serviceWorker.addEventListener("statechange", (event: Event) => {
          const sw = event?.target as ServiceWorker;
          setState(sw?.state);
        });
      } catch (e) {
        setError(true);
        console.error(e);
      }
    },
    [setState, setError],
  );

  const unregister = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.unregister();
    } catch (e) {
      setError(true);
      console.error(e);
    }
  }, [setError]);

  useEffect(() => {
    const swSupported = "serviceWorker" in navigator;
    setSupported(swSupported);

    if (swSupported) {
      init(false);
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        init(false);
      });
    }
  }, [init]);

  return [supported, state, error, init, unregister] as const;
}
