import { useEffect, useRef } from "react";

export default function usePrevious(value: string | null) {
  const ref = useRef<string | null>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
