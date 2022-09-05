import { useCallback, useEffect, useState } from 'react';

export const HASH_ABOUT = '#about';
export const HASH_PROJECTS = '#projects';

export function useLocationHash() {
  const [hash, setHash] = useState(window.location.hash);

  const hashChange = useCallback(() => setHash(window.location.hash), []);

  useEffect(() => {
    window.addEventListener('hashchange', hashChange);

    return () => {
      window.removeEventListener('hashchange', hashChange);
    };
  }, []);

  return hash;
}
