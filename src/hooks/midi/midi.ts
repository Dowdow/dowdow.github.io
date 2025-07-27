import { useCallback, useEffect, useReducer, useState } from "react";
import usePrevious from "./previous";
import type { Rule } from "./rules";
import type { AxeGamePadEvent, ButtonGamePadEvent } from "./gamepad";

export const MIDI_TYPE_NOTE_ON = 0;
export const MIDI_TYPE_NOTE_OFF = 1;
export const MIDI_TYPE_CC = 2;

const ADD = "add";
const REMOVE = "remove";
const TOGGLE = "toggle";

export interface MidiOutputInfo {
  id: string;
  manufacturer: string;
  name: string;
  version: string;
  activated: boolean;
}

function reducer(
  state: MidiOutputInfo[] = [],
  action: { type: string; midiOutput?: MidiOutputInfo; id?: string } = {
    type: "",
  },
): MidiOutputInfo[] {
  switch (action.type) {
    case ADD:
      if (action.midiOutput === undefined) break;
      if (state.filter((mo) => mo.id === action.midiOutput?.id).length === 0) {
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
  }
  return state;
}

export default function useMidi(
  rules: Rule[],
  addLog: (data: (string | number | null | undefined)[]) => void,
) {
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
  const [midiOutputs, dispatch] = useReducer(reducer, []);
  const [support, setSupport] = useState<boolean | null>(null);
  const [permissionState, setPermissionState] = useState<string | null>(null);
  const previousPermissionState = usePrevious(permissionState);

  const add = useCallback(
    ({ id, manufacturer, name, version }: MIDIOutput | MIDIPort) => {
      dispatch({
        type: ADD,
        midiOutput: { id, manufacturer, name, version, activated: false },
      });
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: string) => {
      dispatch({ type: REMOVE, id });
    },
    [dispatch],
  );

  const toggle = useCallback(
    (id: string) => {
      dispatch({ type: TOGGLE, id });
    },
    [dispatch],
  );

  const requestMidiAccess = useCallback(async () => {
    function onMidiAccessStateChange(event: MIDIConnectionEvent) {
      const port = event.port;
      if (port && port.type === "output") {
        if (port.state === "connected") {
          add(port);
        } else {
          remove(port.id);
        }
      }
    }

    try {
      const mA = await navigator.requestMIDIAccess();
      mA.addEventListener("statechange", onMidiAccessStateChange);
      Array.from(mA.outputs.values()).map((p) => add(p));
      setMidiAccess(mA);
      setPermissionState("granted");
    } catch (e) {
      setPermissionState("denied");
      console.error(e);
    }
  }, [add, remove, setMidiAccess, setPermissionState]);

  useEffect(() => {
    async function setupPermissions() {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "midi",
        });
        permissionStatus.addEventListener("change", (event: Event) => {
          const ps = event.target as PermissionStatus;
          setPermissionState(ps.state);
        });
        setPermissionState(permissionStatus.state);
      } catch (e) {
        setPermissionState("denied");
        console.error(e);
      }
    }

    setSupport("requestMIDIAccess" in navigator);
    setupPermissions();
  }, []);

  useEffect(() => {
    if (previousPermissionState !== "prompt" && permissionState === "granted") {
      requestMidiAccess();
    }
  }, [previousPermissionState, permissionState, requestMidiAccess]);

  useEffect(() => {
    function sendMidiMessage(
      byte1: number,
      byte2: number,
      byte3: number | null,
    ) {
      midiOutputs
        .filter((mo) => mo.activated)
        .forEach((mo) => {
          const o = midiAccess?.outputs.get(mo.id);
          if (o === undefined) return;
          o.send([byte1, byte2, byte3 ?? 0]);
          addLog([o.name?.substring(0, 20), byte1, byte2, byte3]);
        });
    }

    function sendMidiNoteOnMessage(
      channel: number,
      value1: number,
      value2: number | null,
    ) {
      sendMidiMessage(144 + channel, value1, value2);
    }

    function sendMidiNoteOffMessage(
      channel: number,
      value1: number,
      value2: number | null,
    ) {
      sendMidiMessage(128 + channel, value1, value2);
    }

    function sendMidiCCMessage(
      channel: number,
      value1: number,
      value2: number | null,
    ) {
      sendMidiMessage(176 + channel, value1, value2);
    }

    function onAxeValueChanged(event: CustomEventInit<AxeGamePadEvent>) {
      const { gamepadIndex, axeIndex, value } = event.detail as AxeGamePadEvent;
      rules
        .filter(
          (r) =>
            r.activated &&
            r.gamepadIndex === gamepadIndex &&
            r.buttonType === 1 &&
            r.buttonIndex === axeIndex,
        )
        .forEach((r) => {
          if (
            (r.midiMessageType === MIDI_TYPE_NOTE_ON && value === 1) ||
            (r.midiMessageType === MIDI_TYPE_NOTE_OFF && value === 0)
          ) {
            sendMidiNoteOnMessage(
              r.midiMessageChannel,
              r.midiMessageValue1,
              r.midiMessageValue2,
            );
          } else if (
            (r.midiMessageType === MIDI_TYPE_NOTE_ON && value === 0) ||
            (r.midiMessageType === MIDI_TYPE_NOTE_OFF && value === 1)
          ) {
            sendMidiNoteOffMessage(
              r.midiMessageChannel,
              r.midiMessageValue1,
              r.midiMessageValue2,
            );
          } else if (r.midiMessageType === MIDI_TYPE_CC) {
            sendMidiCCMessage(
              r.midiMessageChannel,
              r.midiMessageValue1,
              Math.round(value * 127),
            );
          }
        });
    }

    function onButtonValueChanged(event: CustomEventInit<ButtonGamePadEvent>) {
      const { gamepadIndex, buttonIndex, value } =
        event.detail as ButtonGamePadEvent;
      rules
        .filter(
          (r) =>
            r.activated &&
            r.gamepadIndex === gamepadIndex &&
            r.buttonType === 0 &&
            r.buttonIndex === buttonIndex,
        )
        .forEach((r) => {
          if (
            (r.midiMessageType === MIDI_TYPE_NOTE_ON && value === 1) ||
            (r.midiMessageType === MIDI_TYPE_NOTE_OFF && value === 0)
          ) {
            sendMidiNoteOnMessage(
              r.midiMessageChannel,
              r.midiMessageValue1,
              r.midiMessageValue2,
            );
          } else if (
            (r.midiMessageType === MIDI_TYPE_NOTE_ON && value === 0) ||
            (r.midiMessageType === MIDI_TYPE_NOTE_OFF && value === 1)
          ) {
            sendMidiNoteOffMessage(
              r.midiMessageChannel,
              r.midiMessageValue1,
              r.midiMessageValue2,
            );
          } else if (r.midiMessageType === MIDI_TYPE_CC) {
            sendMidiCCMessage(
              r.midiMessageChannel,
              r.midiMessageValue1,
              Math.round(value * 127),
            );
          }
        });
    }

    window.addEventListener("axe-value-changed", onAxeValueChanged);
    window.addEventListener("button-value-changed", onButtonValueChanged);
    return () => {
      window.removeEventListener("axe-value-changed", onAxeValueChanged);
      window.removeEventListener("button-value-changed", onButtonValueChanged);
    };
  }, [midiAccess?.outputs, midiOutputs, rules, addLog]);

  return [
    midiOutputs,
    support,
    permissionState,
    requestMidiAccess,
    toggle,
  ] as const;
}

export function midiTypeNameFromId(midiType: number): string {
  switch (midiType) {
    case MIDI_TYPE_NOTE_ON:
      return "Note On";
    case MIDI_TYPE_NOTE_OFF:
      return "Note Off";
    case MIDI_TYPE_CC:
      return "CC";
    default:
      return "Unknown";
  }
}
