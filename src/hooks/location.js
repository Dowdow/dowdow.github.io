import { useEffect, useState } from 'react';

export const HASH_MIDI = '#midi';

export function useLocationHash() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    function hashChange() {
      setHash(window.location.hash);
    }

    window.addEventListener('hashchange', hashChange);
    return () => {
      window.removeEventListener('hashchange', hashChange);
    };
  }, []);

  return hash;
}
