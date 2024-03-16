import { useCallback, useEffect, useReducer } from 'react';

const ADD = 'add';
const REMOVE = 'remove';
const TOGGLE = 'toggle';

function reducer(state = [], action = {}) {
  switch (action.type) {
    case ADD:
      return [...state, action.rule];
    case REMOVE:
      return state.filter((r) => r.id !== action.id);
    case TOGGLE: {
      const indexRule = state.findIndex((r) => r.id === action.id);
      if (indexRule !== -1) {
        const rule = { ...state[indexRule] };
        state.splice(indexRule, 1);
        rule.activated = !rule.activated;
        return [...state, rule];
      }
      return state;
    }
    default:
      return state;
  }
}

function init(arg) {
  const rules = localStorage.getItem('rules');
  if (rules === null) {
    return arg;
  }

  return JSON.parse(rules);
}

export default function useRules() {
  const [rules, dispatch] = useReducer(reducer, [], init);

  const add = useCallback((rule) => {
    dispatch({ type: ADD, rule });
  }, [dispatch]);

  const remove = useCallback((id) => {
    dispatch({ type: REMOVE, id });
  }, [dispatch]);

  const toggle = useCallback((id) => {
    dispatch({ type: TOGGLE, id });
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('rules', JSON.stringify(rules));
  }, [rules]);

  return [rules, add, remove, toggle];
}
