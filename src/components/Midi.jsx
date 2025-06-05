import Gamepads from "./midi/Gamepads";
import MidiOutputs from "./midi/MidiOutputs";
import useGamepads from "../hooks/gamepad";
import useLogs from "../hooks/logs";
import useMidi from "../hooks/midi";
import useRules from "../hooks/rules";
import Rules from "./midi/Rules";
import RuleForm from "./midi/RuleForm";
import Logs from "./midi/Logs";

export default function Midi() {
  const [rules, addRule, removeRule, ruleToggle] = useRules();
  const [logs, addLog, clearLogs] = useLogs();
  const [gamepads, gamepadsData, gamepadSupport, gamepadToggle] = useGamepads();
  const [
    midiOutputs,
    midiSupport,
    midiPermissionState,
    requestMidiAccess,
    midiToggle,
  ] = useMidi(rules, addLog);

  return (
    <section>
      <div className="flex flex-col justify-center items-center gap-y-2 h-40 text-center">
        <h1 className="text-6xl font-bold tracking-tighter">Midi</h1>
        <span className="text-lg text-prim/60">
          Send Midi signals with your gamepad.
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <RuleForm add={addRule} />
        </div>
        <div className="xl:col-span-2">
          <Logs logs={logs} clear={clearLogs} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-12 items-start gap-6 pt-6">
        <div className="md:col-span-3 lg:col-span-1 xl:col-span-5">
          <Rules
            rules={rules}
            add={addRule}
            remove={removeRule}
            toggle={ruleToggle}
          />
        </div>
        <div className="grid md:col-span-2 lg:col-span-1 xl:col-span-4 gap-6">
          <Gamepads
            gamepads={gamepads}
            gamepadsData={gamepadsData}
            support={gamepadSupport}
            toggle={gamepadToggle}
          />
        </div>
        <div className="grid xl:col-span-3 gap-6">
          <MidiOutputs
            outputs={midiOutputs}
            support={midiSupport}
            permissionState={midiPermissionState}
            request={requestMidiAccess}
            toggle={midiToggle}
          />
        </div>
      </div>
    </section>
  );
}
