import { useEffect, useReducer } from 'react';
import { MIDI_TYPE_CC, MIDI_TYPE_NOTE_OFF, MIDI_TYPE_NOTE_ON } from '../utils/midi';

const ADD = 'add';
const REMOVE = 'remove';
const TOGGLE = 'toggle';

let MIDIAccess = null;

function createDataFromMIDIPort(port) {
  const { id, manufacturer, name, version } = port;
  return {
    id,
    manufacturer,
    name,
    version,
    activated: false,
  };
}

function sendMidiMessage(MIDIOutputs, byte1, byte2, byte3) {
  MIDIOutputs.forEach((mo) => {
    const output = MIDIAccess.outputs.get(mo.id);
    if (output) {
      output.send([byte1, byte2, byte3]);
    }
  });
}

function sendMidiNoteOnMessage(MIDIOutputs, channel, value1, value2) {
  sendMidiMessage(MIDIOutputs, 144 + channel, value1, value2);
}

function sendMidiNoteOffMessage(MIDIOutputs, channel, value1, value2) {
  sendMidiMessage(MIDIOutputs, 128 + channel, value1, value2);
}

function sendMidiCCMessage(MIDIOutputs, channel, value1, value2) {
  sendMidiMessage(MIDIOutputs, 176 + channel, value1, value2);
}

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
        const MIDIOutput = { ...state[indexMO] };
        state.splice(indexMO, 1);
        MIDIOutput.activated = !MIDIOutput.activated;
        return [...state, MIDIOutput];
      }
      return state;
    }
    default:
      return state;
  }
}

export default function useMidi(rules, addLog) {
  const [midiOutputs, dispatch] = useReducer(reducer, []);

  function add(midiOutput) {
    dispatch({ type: ADD, midiOutput });
  }

  function remove(id) {
    dispatch({ type: REMOVE, id });
  }

  function toggle(id) {
    dispatch({ type: TOGGLE, id });
  }

  function onMIDIAccessStateChange(event) {
    const { port } = event;
    if (port.type === 'output') {
      if (port.state === 'connected') {
        add(createDataFromMIDIPort(port));
      } else {
        remove(port.id);
      }
    }
  }

  function onMIDISuccess(midiAccess) {
    midiAccess.onstatechange = onMIDIAccessStateChange;
    const ports = Array.from(midiAccess.outputs.values());
    ports.map((p) => add(createDataFromMIDIPort(p)));
    MIDIAccess = midiAccess;
  }

  function onMIDIFailure() {
    // Add error message
  }

  function send(controllerIndexParam, buttonTypeParam, buttonIndexParam, buttonValueParam) {
    const activatedMIDIOutputs = midiOutputs.filter((mo) => mo.activated === true);

    if (activatedMIDIOutputs.length === 0) return;

    rules.forEach((rule) => {
      const { activated, midiMessageType, midiMessageChannel, midiMessageValue1, midiMessageValue2, controllerIndex, buttonType, buttonIndex } = rule;

      if (!activated) return;
      if (controllerIndex !== controllerIndexParam) return;
      if (buttonType !== buttonTypeParam || buttonIndex !== buttonIndexParam) return;

      if (
        (midiMessageType === MIDI_TYPE_NOTE_ON && buttonValueParam === 1)
        || (midiMessageType === MIDI_TYPE_NOTE_OFF && buttonValueParam === 0)
      ) {
        sendMidiNoteOnMessage(activatedMIDIOutputs, midiMessageChannel, midiMessageValue1, midiMessageValue2);
        addLog(MIDI_TYPE_NOTE_ON, midiMessageChannel, midiMessageValue1, midiMessageValue2, controllerIndex, buttonType, buttonIndex);
      } else if (
        (midiMessageType === MIDI_TYPE_NOTE_ON && buttonValueParam === 0)
        || (midiMessageType === MIDI_TYPE_NOTE_OFF && buttonValueParam === 1)
      ) {
        sendMidiNoteOffMessage(activatedMIDIOutputs, midiMessageChannel, midiMessageValue1, midiMessageValue2);
        addLog(MIDI_TYPE_NOTE_OFF, midiMessageChannel, midiMessageValue1, midiMessageValue2, controllerIndex, buttonType, buttonIndex);
      } else if (midiMessageType === MIDI_TYPE_CC) {
        sendMidiCCMessage(activatedMIDIOutputs, midiMessageChannel, midiMessageValue1, Math.round(buttonValueParam * 127));
        addLog(MIDI_TYPE_CC, midiMessageChannel, midiMessageValue1, Math.round(buttonValueParam * 127), controllerIndex, buttonType, buttonIndex);
      }
    });
  }

  useEffect(() => {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  }, []);

  return [midiOutputs, toggle, send];
}
