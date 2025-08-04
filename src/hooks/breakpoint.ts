import { useState, useEffect } from "react";

export default function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<"sm" | "md" | "lg">("sm");

  useEffect(() => {
    const breakpoints = {
      sm: window.matchMedia("(min-width: 640px)"),
      md: window.matchMedia("(min-width: 768px)"),
      lg: window.matchMedia("(min-width: 1024px)"),
    };

    const determineBreakpoint = () => {
      if (breakpoints.lg.matches) setBreakpoint("lg");
      else if (breakpoints.md.matches) setBreakpoint("md");
      else if (breakpoints.sm.matches) setBreakpoint("sm");
      else setBreakpoint("sm");
    };

    Object.values(breakpoints).forEach((mq) => {
      mq.addEventListener("change", determineBreakpoint);
    });

    determineBreakpoint();

    return () => {
      Object.values(breakpoints).forEach((mq) => {
        mq.removeEventListener("change", determineBreakpoint);
      });
    };
  }, []);

  return breakpoint;
}
