import { useEffect, useState } from "react";

export default function useNetwork() {
  const [isOnline, setOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    function onOnline() {
      setOnline(true);
    }

    function onOffline() {
      setOnline(false);
    }

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return isOnline;
}
