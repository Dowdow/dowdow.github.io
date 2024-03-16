import { useCallback, useReducer } from 'react';

const ADD = 'ADD';
const CLEAR = 'CLEAR';

function reducer(state = [], action = {}) {
  switch (action.type) {
    case ADD:
      return [...state.sort((a, b) => a.id - b.id).slice(-15), action.log];
    case CLEAR:
      return [];
    default:
      return state;
  }
}

export default function useLogs() {
  const [logs, dispatch] = useReducer(reducer, []);

  const add = useCallback((data) => {
    dispatch({ type: ADD, log: { id: Date.now(), data } });
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch({ type: CLEAR });
  }, [dispatch]);

  return [logs, add, clear];
}
