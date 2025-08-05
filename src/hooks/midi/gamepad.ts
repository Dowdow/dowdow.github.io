import { useCallback, useEffect, useReducer, useState } from "react";

const ADD = "add";
const REMOVE = "remove";
const TOGGLE = "toggle";

export interface GamepadInfo {
  id: string;
  index: number;
  activated: boolean;
}

export interface AxeGamePadEvent {
  gamepadIndex: number;
  axeIndex: number;
  value: number;
}

export interface ButtonGamePadEvent {
  gamepadIndex: number;
  buttonIndex: number;
  value: number;
}

function reducer(
  state: GamepadInfo[] = [],
  action: { type: string; gamepad?: GamepadInfo; index?: number } = {
    type: "",
  },
): GamepadInfo[] {
  switch (action.type) {
    case ADD:
      if (action.gamepad === undefined) break;
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
  }
  return state;
}

export default function useGamepads() {
  const [gamepads, dispatch] = useReducer(reducer, []);
  const [gamepadsData, setGamepadsData] = useState<Array<Gamepad | null>>([]);
  const [previousGamepadsData, setPreviousGamepadsData] = useState<
    Array<Gamepad | null>
  >([]);
  const [support, setSupport] = useState<boolean | null>(null);

  const add = useCallback(
    (gamepad: GamepadInfo) => {
      dispatch({ type: ADD, gamepad });
    },
    [dispatch],
  );

  const remove = useCallback(
    (index: number) => {
      dispatch({ type: REMOVE, index });
    },
    [dispatch],
  );

  const toggle = useCallback(
    (index: number) => {
      dispatch({ type: TOGGLE, index });
    },
    [dispatch],
  );

  useEffect(() => {
    const gamepadSupport = "getGamepads" in navigator;
    setSupport(gamepadSupport);

    if (gamepadSupport) {
      navigator.getGamepads().forEach((g) => {
        if (g === null) return;
        add({ id: g.id, index: g.index, activated: true });
      });
    }

    function gamepadConnected(event: GamepadEvent) {
      const { gamepad } = event;
      add({ id: gamepad.id, index: gamepad.index, activated: true });
    }

    function gamepadDisconnected(event: GamepadEvent) {
      const { gamepad } = event;
      remove(gamepad.index);
    }

    window.addEventListener("gamepadconnected", gamepadConnected);
    window.addEventListener("gamepaddisconnected", gamepadDisconnected);

    return () => {
      window.removeEventListener("gamepadconnected", gamepadConnected);
      window.removeEventListener("gamepaddisconnected", gamepadDisconnected);
    };
  }, [add, remove]);

  useEffect(() => {
    let interval = undefined;
    if (support)
      interval = setInterval(
        () => setGamepadsData(navigator.getGamepads()),
        10,
      );
    return () => clearInterval(interval);
  }, [support]);

  useEffect(() => {
    setPreviousGamepadsData(gamepadsData);

    if (previousGamepadsData.length === 0) return;

    gamepads
      .filter((g) => g.activated)
      .forEach((g) => {
        gamepadsData[g.index]?.axes.forEach((a, i) => {
          if (previousGamepadsData[g.index]?.axes[i] !== a) {
            window.dispatchEvent(
              new CustomEvent("axe-value-changed", {
                detail: {
                  gamepadIndex: g.index,
                  axeIndex: i,
                  value: (Math.min(Math.max(a, -1), 1) + 1) / 2,
                },
              }),
            );
          }
        });

        gamepadsData[g.index]?.buttons.forEach((b, i) => {
          if (previousGamepadsData[g.index]?.buttons[i].value !== b.value) {
            window.dispatchEvent(
              new CustomEvent("button-value-changed", {
                detail: {
                  gamepadIndex: g.index,
                  buttonIndex: i,
                  value: Math.min(Math.max(b.value, 0), 1),
                },
              }),
            );
          }
        });
      });
  }, [gamepads, gamepadsData, previousGamepadsData]);

  return [gamepads, gamepadsData, support, toggle] as const;
}
