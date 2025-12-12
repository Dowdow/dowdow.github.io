import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type PropsWithChildren,
} from "react";
import { RoutesContext, type Params } from "./context";

const ADD = "add";
const RESET = "reset";

interface ReducerType {
  type: string;
  payload: Params;
}

function reducer(
  state: Params = {},
  action: ReducerType = { type: "", payload: {} },
): Params {
  switch (action.type) {
    case ADD:
      return { ...state, ...action.payload };
    case RESET:
      return {};
    default:
      return state;
  }
}

export default function Routes({ children }: PropsWithChildren) {
  const [hash, setHash] = useState(window.location.hash);
  const [params, dispatch] = useReducer(reducer, {});

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

  const addParams = useCallback((params: Params) => {
    dispatch({ type: ADD, payload: params });
  }, []);

  const payload = useMemo(
    () => ({ hash, params, addParams }),
    [hash, params, addParams],
  );

  return (
    <RoutesContext.Provider value={payload}>{children}</RoutesContext.Provider>
  );
}
