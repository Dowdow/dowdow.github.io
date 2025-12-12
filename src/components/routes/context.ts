import { createContext } from "react";

export type Params = { [s: string]: string };

interface RoutesContextType {
  hash: string;
  params: Params;
  addParams: (params: Params) => void;
}

export const RoutesContext = createContext<RoutesContextType>({
  hash: "",
  params: {},
  addParams: () => {},
});
