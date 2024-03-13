import React from 'react';
import Gamepads from './midi/Gamepads';
import MIDIOutputs from './midi/MIDIOutputs';
import useGamepads from '../hooks/gamepad';
import useLogs from '../hooks/logs';
import useMidi from '../hooks/midi';
import useRules from '../hooks/rules';
import Rules from './midi/Rules';
import RuleForm from './midi/RuleForm';
import Logs from './midi/Logs';

export default function Midi() {
  const [rules, addRule, removeRule, toggleRule] = useRules();
  const [logs, addLog, clearLogs] = useLogs();
  const [gamepads, supportGamepad, toggleGamepad] = useGamepads();
  const [midiOutputs, supportMidi, errorMessageMidi, toggleMidi, send] = useMidi(rules, addLog);

  return (
    <section>
      <div className="flex flex-col justify-center items-center gap-y-2 h-40">
        <h1 className="text-6xl font-bold tracking-tighter">Midi</h1>
        <span className="text-lg text-prim/60">Send MIDI signals with your gamepad.</span>
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
          <Rules rules={rules} add={addRule} remove={removeRule} toggle={toggleRule} />
        </div>
        <div className="grid md:col-span-2 lg:col-span-1 xl:col-span-4 gap-6">
          <Gamepads gamepads={gamepads} support={supportGamepad} toggle={toggleGamepad} send={send} />
        </div>
        <div className="grid xl:col-span-3 gap-6">
          <MIDIOutputs outputs={midiOutputs} support={supportMidi} errorMessage={errorMessageMidi} toggle={toggleMidi} />
        </div>
      </div>
    </section>
  );
}
