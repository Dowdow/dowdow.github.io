import { createContext } from "react";

interface RoutesContextType {
  hash: string;
  matches: Array<string>;
  addMatch: (match: string) => void;
}

export const RoutesContext = createContext<RoutesContextType>({
  hash: "",
  matches: [],
  addMatch: () => {},
});
