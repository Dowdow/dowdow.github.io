import { useEffect, useReducer } from 'react';

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

  function add(rule) {
    dispatch({ type: ADD, rule });
  }

  function remove(id) {
    dispatch({ type: REMOVE, id });
  }

  function toggle(id) {
    dispatch({ type: TOGGLE, id });
  }

  useEffect(() => {
    localStorage.setItem('rules', JSON.stringify(rules));
  }, [rules]);

  return [rules, add, remove, toggle];
}
