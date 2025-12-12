import { useContext } from "react";
import { RoutesContext, type Params } from "../../components/routes/context";

export const HASH_POSTS = "#posts";
export const HASH_POST = "#posts#{slug}";
export const HASH_MIDI = "#midi";

export function generateRoute(route: string, params: Params = {}) {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
    route,
  );
}

export function useParams(): Params {
  const { params } = useContext(RoutesContext);
  return params;
}
