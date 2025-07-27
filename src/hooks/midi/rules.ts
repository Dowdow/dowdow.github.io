import { useCallback, useEffect, useReducer } from "react";

const ADD = "add";
const REMOVE = "remove";
const TOGGLE = "toggle";

export interface Rule {
  id: number;
  activated: boolean;
  midiMessageType: number;
  midiMessageChannel: number;
  midiMessageValue1: number;
  midiMessageValue2: number | null;
  gamepadIndex: number;
  buttonType: number;
  buttonIndex: number;
}

function reducer(
  state: Rule[] = [],
  action: { type: string; rule?: Rule; id?: number } = { type: "" },
): Rule[] {
  switch (action.type) {
    case ADD:
      if (action.rule === undefined) break;
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
  }
  return state;
}

function init(arg: Rule[]): Rule[] {
  const rules = localStorage.getItem("rules");
  if (rules === null) {
    return arg;
  }

  return JSON.parse(rules);
}

export default function useRules() {
  const [rules, dispatch] = useReducer(reducer, [], init);

  const add = useCallback(
    (rule: Rule) => {
      dispatch({ type: ADD, rule });
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      dispatch({ type: REMOVE, id });
    },
    [dispatch],
  );

  const toggle = useCallback(
    (id: number) => {
      dispatch({ type: TOGGLE, id });
    },
    [dispatch],
  );

  useEffect(() => {
    localStorage.setItem("rules", JSON.stringify(rules));
  }, [rules]);

  return [rules, add, remove, toggle] as const;
}
