import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type PropsWithChildren,
} from "react";
import { RoutesContext } from "./context";

const ADD = "add";
const RESET = "reset";

interface ReducerType {
  type: string;
  payload: string;
}

function reducer(
  state: Array<string> = [],
  action: ReducerType = { type: "", payload: "" },
): Array<string> {
  switch (action.type) {
    case ADD:
      return [...state, action.payload];
    case RESET:
      return [];
    default:
      return state;
  }
}

export default function Routes({ children }: PropsWithChildren) {
  const [hash, setHash] = useState(window.location.hash);
  const [matches, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    function hashChange() {
      setHash(window.location.hash);
      dispatch({ type: RESET });
    }

    window.addEventListener("hashchange", hashChange);
    return () => {
      window.removeEventListener("hashchange", hashChange);
    };
  }, []);

  const addMatch = useCallback((match: string) => {
    dispatch({ type: ADD, payload: match });
  }, []);

  const payload = useMemo(
    () => ({ hash, matches, addMatch }),
    [hash, matches, addMatch],
  );

  return (
    <RoutesContext.Provider value={payload}>{children}</RoutesContext.Provider>
  );
}
