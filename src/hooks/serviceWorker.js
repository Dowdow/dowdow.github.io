import { useCallback, useEffect, useState } from 'react';

const PATH = '/service-worker.js';

export default function useServiceWorker() {
  const [supported, setSupported] = useState(null);
  const [state, setState] = useState(null);
  const [error, setError] = useState(false);

  const init = useCallback(async (register = true) => {
    try {
      let registration;
      if (register) {
        registration = await navigator.serviceWorker.register(PATH);
      } else {
        registration = await navigator.serviceWorker.ready;
      }

      const serviceWorker = registration.installing ?? registration.installing ?? registration.active;
      setState(serviceWorker.state);

      serviceWorker.addEventListener('statechange', (event) => {
        setState(event.target.state);
      });
    } catch (e) {
      setError(true);
    }
  }, [setState, setError]);

  const unregister = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.unregister();
    } catch (e) {
      setError(true);
    }
  }, [setError]);

  useEffect(() => {
    const swSupported = 'serviceWorker' in navigator;
    setSupported(swSupported);

    if (swSupported) {
      init(false);
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        init(false);
      });
    }
  }, []);

  return [supported, state, error, init, unregister];
}
