import { useContext, useEffect, useMemo } from "react";
import { RoutesContext, type Params } from "./context";

interface RouteProps {
  to?: string;
  element: React.ReactNode;
}

const paramRegex = /\{[A-Za-z0-9]+\}/g;

export default function Route({ to = "", element }: RouteProps) {
  const { hash, addParams } = useContext(RoutesContext);

  const regex = useMemo(
    (): string => to.replaceAll(paramRegex, "([A-Za-z0-9\\-]+)"),
    [to],
  );

  const paramKeys = useMemo(
    (): string[] =>
      to.match(paramRegex)?.map((t) => t.replace("{", "").replace("}", "")) ??
      [],
    [to],
  );

  const matches = hash.match(regex);

  useEffect(() => {
    if (matches !== null && matches.includes(hash)) {
      matches.shift();
      addParams(
        paramKeys.reduce((acc: Params, key, index) => {
          acc[key] = matches[index];
          return acc;
        }, {}),
      );
    }
  }, [hash, regex, paramKeys, matches, addParams]);

  if (matches === null || !matches.includes(hash)) {
    return null;
  }

  return element;
}
