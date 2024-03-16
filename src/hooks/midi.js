import { useEffect, useReducer, useState } from 'react';
import usePrevious from './usePrevious';

export const MIDI_TYPE_NOTE_ON = 0;
export const MIDI_TYPE_NOTE_OFF = 1;
export const MIDI_TYPE_CC = 2;

const ADD = 'add';
const REMOVE = 'remove';
const TOGGLE = 'toggle';

function reducer(state = [], action = {}) {
  switch (action.type) {
    case ADD:
      if (state.filter((mo) => mo.id === action.midiOutput.id).length === 0) {
        return [...state, action.midiOutput];
      }
      return state;
    case REMOVE:
      return [...state.filter((mo) => mo.id !== action.id)];
    case TOGGLE: {
      const indexMO = state.findIndex((mo) => mo.id === action.id);
      if (indexMO !== -1) {
        const midiOutput = { ...state[indexMO] };
        state.splice(indexMO, 1);
        midiOutput.activated = !midiOutput.activated;
        return [...state, midiOutput];
      }
      return state;
    }
    default:
      return state;
  }
}

export default function useMidi(rules, addLog) {
  const [midiAccess, setMidiAccess] = useState(null);
  const [midiOutputs, dispatch] = useReducer(reducer, []);
  const [support, setSupport] = useState(null);
  const [permissionState, setPermissionState] = useState(null);
  const previousPermissionState = usePrevious(permissionState);

  function add(midiPort) {
    const { id, manufacturer, name, version } = midiPort;
    dispatch({ type: ADD, midiOutput: { id, manufacturer, name, version, activated: false } });
  }

  function remove(id) {
    dispatch({ type: REMOVE, id });
  }

  function toggle(id) {
    dispatch({ type: TOGGLE, id });
  }

  function sendMidiMessage(byte1, byte2, byte3) {
    midiOutputs
      .filter((mo) => mo.activated)
      .forEach((mo) => {
        const o = midiAccess.outputs.get(mo.id);
        o.send([byte1, byte2, byte3]);
        addLog([o.name.substring(0, 20), byte1, byte2, byte3]);
      });
  }

  function sendMidiNoteOnMessage(channel, value1, value2) {
    sendMidiMessage(144 + channel, value1, value2);
  }

  function sendMidiNoteOffMessage(channel, value1, value2) {
    sendMidiMessage(128 + channel, value1, value2);
  }

  function sendMidiCCMessage(channel, value1, value2) {
    sendMidiMessage(176 + channel, value1, value2);
  }

  function onAxeValueChanged(event) {
    const { gamepadIndex, axeIndex, value } = event.detail;
    rules
      .filter((r) => r.activated && r.gamepadIndex === gamepadIndex && r.buttonType === 1 && r.buttonIndex === axeIndex)
      .forEach((r) => {
        if ((r.midiMessageType === MIDI_TYPE_NOTE_ON && value === 1) || (r.midiMessageType === MIDI_TYPE_NOTE_OFF && value === 0)) {
          sendMidiNoteOnMessage(r.midiMessageChannel, r.midiMessageValue1, r.midiMessageValue2);
        } else if ((r.midiMessageType === MIDI_TYPE_NOTE_ON && value === 0) || (r.midiMessageType === MIDI_TYPE_NOTE_OFF && value === 1)) {
          sendMidiNoteOffMessage(r.midiMessageChannel, r.midiMessageValue1, r.midiMessageValue2);
        } else if (r.midiMessageType === MIDI_TYPE_CC) {
          sendMidiCCMessage(r.midiMessageChannel, r.midiMessageValue1, Math.round(value * 127));
        }
      });
  }

  function onButtonValueChanged(event) {
    const { gamepadIndex, buttonIndex, value } = event.detail;
    rules
      .filter((r) => r.activated && r.gamepadIndex === gamepadIndex && r.buttonType === 0 && r.buttonIndex === buttonIndex)
      .forEach((r) => {
        if ((r.midiMessageType === MIDI_TYPE_NOTE_ON && value === 1) || (r.midiMessageType === MIDI_TYPE_NOTE_OFF && value === 0)) {
          sendMidiNoteOnMessage(r.midiMessageChannel, r.midiMessageValue1, r.midiMessageValue2);
        } else if ((r.midiMessageType === MIDI_TYPE_NOTE_ON && value === 0) || (r.midiMessageType === MIDI_TYPE_NOTE_OFF && value === 1)) {
          sendMidiNoteOffMessage(r.midiMessageChannel, r.midiMessageValue1, r.midiMessageValue2);
        } else if (r.midiMessageType === MIDI_TYPE_CC) {
          sendMidiCCMessage(r.midiMessageChannel, r.midiMessageValue1, Math.round(value * 127));
        }
      });
  }

  function onMidiAccessStateChange(event) {
    const { port } = event;
    if (port.type === 'output') {
      if (port.state === 'connected') {
        add(port);
      } else {
        remove(port.id);
      }
    }
  }

  async function requestMidiAccess() {
    try {
      const mA = await navigator.requestMIDIAccess();
      mA.addEventListener('statechange', onMidiAccessStateChange);
      Array.from(mA.outputs.values()).map((p) => add(p));
      setMidiAccess(mA);
      setPermissionState('granted');
    } catch (e) {
      setPermissionState('denied');
    }
  }

  async function setupPermissions() {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'midi' });
      permissionStatus.addEventListener('change', (event) => setPermissionState(event.target.state));
      setPermissionState(permissionStatus.state);
    } catch (e) {
      setPermissionState('denied');
    }
  }

  useEffect(() => {
    setSupport(typeof navigator.requestMIDIAccess !== 'undefined');
    setupPermissions();
  }, []);

  useEffect(() => {
    if (previousPermissionState !== 'prompt' && permissionState === 'granted') {
      requestMidiAccess();
    }
  }, [permissionState]);

  useEffect(() => {
    window.addEventListener('axe-value-changed', onAxeValueChanged);
    window.addEventListener('button-value-changed', onButtonValueChanged);
    return () => {
      window.removeEventListener('axe-value-changed', onAxeValueChanged);
      window.removeEventListener('button-value-changed', onButtonValueChanged);
    };
  }, [midiOutputs, rules]);

  return [midiOutputs, support, permissionState, requestMidiAccess, toggle];
}

export function midiTypeNameFromId(midiType) {
  switch (midiType) {
    case MIDI_TYPE_NOTE_ON:
      return 'Note On';
    case MIDI_TYPE_NOTE_OFF:
      return 'Note Off';
    case MIDI_TYPE_CC:
      return 'CC';
    default:
      return 'Unknown';
  }
}
