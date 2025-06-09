import { useContext } from "react";
import { RoutesContext } from "../components/routes/context";

export const HASH_POSTS = "#posts";
export const HASH_POST = "#posts#{slug}";
export const HASH_MIDI = "#midi";

export function generateRoute(
  route: string,
  params: { [s: string]: string } = {},
) {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
    route,
  );
}

export function useParams(): { [s: string]: string } {
  const { hash, matches } = useContext(RoutesContext);

  const params: { [s: string]: string } = {};

  const hashes = hash.split("#");
  hashes.shift();

  matches.forEach((element) => {
    const m = element.split("#");
    if (m[0] === "") {
      m.shift();
    }

    let i = 0;
    do {
      if (m[i].startsWith("{") && m[i].endsWith("}")) {
        params[m[i].slice(1, -1)] = hashes[i];
      }

      i += 1;
    } while (i < hashes.length && i < m.length);
  });

  return params;
}

export function match(hash: string, to: string): boolean {
  const hashes = hash.split("#");
  hashes.shift();

  if (!to) {
    return hashes.length === 0;
  }

  const toHash = to.split("#");
  if (toHash[0] === "") {
    toHash.shift();
  }

  if (hashes.length !== toHash.length) {
    return false;
  }

  let i = 0;
  do {
    if (
      hashes[i] !== toHash[i] &&
      !toHash[i].startsWith("{") &&
      !toHash[i].endsWith("}")
    ) {
      return false;
    }

    i += 1;
  } while (i < hashes.length && i < toHash.length);

  return true;
}
