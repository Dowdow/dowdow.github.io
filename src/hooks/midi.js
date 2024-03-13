import { useEffect, useReducer, useState } from 'react';
import { MIDI_TYPE_CC, MIDI_TYPE_NOTE_OFF, MIDI_TYPE_NOTE_ON } from '../utils/midi';

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

export default function useMidi(rules, addLog) {
  const [midiOutputs, dispatch] = useReducer(reducer, []);
  const [support, setSupport] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  function add(midiOutput) {
    dispatch({ type: ADD, midiOutput });
  }

  function remove(id) {
    dispatch({ type: REMOVE, id });
  }

  function toggle(id) {
    dispatch({ type: TOGGLE, id });
  }

  function send(gamepadIndexParam, buttonTypeParam, buttonIndexParam, buttonValueParam) {
    const activatedMIDIOutputs = midiOutputs.filter((mo) => mo.activated === true);

    if (activatedMIDIOutputs.length === 0) return;

    rules.forEach((rule) => {
      const { midiMessageType, midiMessageChannel, midiMessageValue1, midiMessageValue2, gamepadIndex, buttonType, buttonIndex } = rule;

      if (gamepadIndex !== gamepadIndexParam) return;
      if (buttonType !== buttonTypeParam || buttonIndex !== buttonIndexParam) return;

      if (
        (midiMessageType === MIDI_TYPE_NOTE_ON && buttonValueParam === 1)
        || (midiMessageType === MIDI_TYPE_NOTE_OFF && buttonValueParam === 0)
      ) {
        sendMidiNoteOnMessage(activatedMIDIOutputs, midiMessageChannel, midiMessageValue1, midiMessageValue2);
        addLog(MIDI_TYPE_NOTE_ON, midiMessageChannel, midiMessageValue1, midiMessageValue2, gamepadIndex, buttonType, buttonIndex);
      } else if (
        (midiMessageType === MIDI_TYPE_NOTE_ON && buttonValueParam === 0)
        || (midiMessageType === MIDI_TYPE_NOTE_OFF && buttonValueParam === 1)
      ) {
        sendMidiNoteOffMessage(activatedMIDIOutputs, midiMessageChannel, midiMessageValue1, midiMessageValue2);
        addLog(MIDI_TYPE_NOTE_OFF, midiMessageChannel, midiMessageValue1, midiMessageValue2, gamepadIndex, buttonType, buttonIndex);
      } else if (midiMessageType === MIDI_TYPE_CC) {
        sendMidiCCMessage(activatedMIDIOutputs, midiMessageChannel, midiMessageValue1, Math.round(buttonValueParam * 127));
        addLog(MIDI_TYPE_CC, midiMessageChannel, midiMessageValue1, Math.round(buttonValueParam * 127), gamepadIndex, buttonType, buttonIndex);
      }
    });
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
    MIDIAccess = midiAccess;
    MIDIAccess.onstatechange = onMIDIAccessStateChange;
    const ports = Array.from(MIDIAccess.outputs.values());
    ports.map((p) => add(createDataFromMIDIPort(p)));
  }

  function onMIDIFailure() {
    setErrorMessage('An error occured while trying to get Midi device informations.');
  }

  useEffect(() => {
    const midiSupport = typeof navigator.requestMIDIAccess !== 'undefined';
    setSupport(midiSupport);

    if (midiSupport) {
      navigator.permissions.query({ name: 'midi' })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
            navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
          } else {
            setErrorMessage('Permissions for Midi device use are denied. Check your browser settings.');
          }
        })
        .catch(() => {
          setErrorMessage('An error occured while asking for Midi device permissions.');
        });
    }
  }, []);

  return [midiOutputs, support, errorMessage, toggle, send];
}
