import { useContext, useEffect, useState } from "react";
import { match } from "../../hooks/routes/routing";
import { RoutesContext } from "./context";

interface RouteProps {
  to?: string;
  element: React.ReactNode;
}

export default function Route({ to = "", element }: RouteProps) {
  const { hash, addMatch } = useContext(RoutesContext);
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    const m = match(hash, to);
    setMatched(m);
    if (m) {
      addMatch(to);
    }
  }, [hash, to, addMatch]);

  return matched ? element : null;
}
