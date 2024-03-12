import { useEffect, useReducer } from 'react';

const ADD = 'add';
const REMOVE = 'remove';
const TOGGLE = 'toggle';

function reducer(state = [], action = {}) {
  switch (action.type) {
    case ADD:
      return [...state, action.gamepad];
    case REMOVE:
      return [...state.filter((g) => g.index !== action.index)];
    case TOGGLE: {
      const indexGamepad = state.findIndex((g) => g.index === action.index);
      if (indexGamepad !== -1) {
        const gamepad = { ...state[indexGamepad] };
        state.splice(indexGamepad, 1);
        gamepad.activated = !gamepad.activated;
        return [...state, gamepad];
      }
      return state;
    }
    default:
      return state;
  }
}

export default function useGamepads() {
  const [gamepads, dispatch] = useReducer(reducer, []);

  function add(gamepad) {
    dispatch({ type: ADD, gamepad });
  }

  function remove(index) {
    dispatch({ type: REMOVE, index });
  }

  function toggle(index) {
    dispatch({ type: TOGGLE, index });
  }

  function gamepadConnected(event) {
    const { gamepad } = event;
    add({ id: gamepad.id, index: gamepad.index, activated: true });
  }

  function gamepadDisconnected(event) {
    const { gamepad } = event;
    remove(gamepad.index);
  }

  useEffect(() => {
    navigator.getGamepads().forEach((g) => {
      if (g === null) return;
      add({ id: g.id, index: g.index, activated: true });
    });

    window.addEventListener('gamepadconnected', gamepadConnected);
    window.addEventListener('gamepaddisconnected', gamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', gamepadConnected);
      window.removeEventListener('gamepaddisconnected', gamepadDisconnected);
    };
  }, []);

  return [gamepads, toggle];
}
