import { useReducer } from 'react';

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

  function add(midiMessageType, midiMessageChannel, midiMessageValue1, midiMessageValue2, controllerIndex, buttonType, buttonIndex) {
    dispatch({
      type: ADD,
      log: {
        id: Date.now(),
        data: {
          midiMessageType, midiMessageChannel, midiMessageValue1, midiMessageValue2, controllerIndex, buttonType, buttonIndex,
        },
      },
    });
  }

  function clear() {
    dispatch({ type: CLEAR });
  }

  return [logs, add, clear];
}
