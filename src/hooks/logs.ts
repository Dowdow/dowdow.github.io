import { useCallback, useReducer } from "react";

const ADD = "ADD";
const CLEAR = "CLEAR";

export interface Log {
  id: number;
  data: (string | number | null | undefined)[];
}

function reducer(
  state: Log[] = [],
  action: { type: string; log?: Log } = {
    type: "",
  },
): Log[] {
  switch (action.type) {
    case ADD:
      if (action.log === undefined) break;
      return [...state.sort((a, b) => a.id - b.id).slice(-15), action.log];
    case CLEAR:
      return [];
  }
  return state;
}

export default function useLogs() {
  const [logs, dispatch] = useReducer(reducer, []);

  const add = useCallback(
    (data: (string | number | null | undefined)[]) => {
      dispatch({ type: ADD, log: { id: Date.now(), data } });
    },
    [dispatch],
  );

  const clear = useCallback(() => {
    dispatch({ type: CLEAR });
  }, [dispatch]);

  return [logs, add, clear] as const;
}
