import { useState, type ChangeEvent, type FormEvent } from "react";
import Box from "../ui/Box";
import Button from "../ui/Button";
import FormGroup from "../ui/FormGroup";
import FormLabel from "../ui/FormLabel";
import FormSelect from "../ui/FormSelect";
import FormInput from "../ui/FormInput";
import {
  MIDI_TYPE_CC,
  MIDI_TYPE_NOTE_OFF,
  MIDI_TYPE_NOTE_ON,
} from "../../hooks/midi/midi";
import type { Rule } from "../../hooks/midi/rules";

interface RuleFormProps {
  add: (rule: Rule) => void;
}

export default function RuleForm({ add }: RuleFormProps) {
  const [midiMessageType, setMidiMessageType] = useState(MIDI_TYPE_NOTE_ON);
  const [midiMessageChannel, setMidiMessageChannel] = useState(0);
  const [midiMessageValue1, setMidiMessageValue1] = useState(127);
  const [midiMessageValue2, setMidiMessageValue2] = useState(127);

  const [gamepadIndex, setGamepadIndex] = useState(0);
  const [buttonType, setButtonType] = useState(0);
  const [buttonIndex, setButtonIndex] = useState(0);

  const midiValue2Disabled = midiMessageType === MIDI_TYPE_CC;

  const handleMidiMessageTypeChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setMidiMessageType(parseInt(event.target.value, 10));
  };

  const handleMidiMessageChannelChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setMidiMessageChannel(parseInt(event.target.value, 10));
  };

  const handleMidiMessageValue1Change = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setMidiMessageValue1(parseInt(event.target.value, 10));
  };

  const handleMidiMessageValue2Change = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setMidiMessageValue2(parseInt(event.target.value, 10));
  };

  const handleGamepadIndexChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") return;
    setGamepadIndex(parseInt(event.target.value, 10));
  };

  const handleButtonTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setButtonType(parseInt(event.target.value, 10));
  };

  const handleButtonIndexChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") return;
    setButtonIndex(parseInt(event.target.value, 10));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    add({
      id: Date.now(),
      activated: true,
      midiMessageType,
      midiMessageChannel,
      midiMessageValue1,
      midiMessageValue2: midiValue2Disabled ? null : midiMessageValue2,
      gamepadIndex,
      buttonType,
      buttonIndex,
    });
  };

  return (
    <Box>
      <h2 className="text-lg font-bold tracking-tight">New rule</h2>
      <div className="text-sm tracking-tight text-prim/50">
        Define a new binding rule.
      </div>
      <form onSubmit={handleSubmit} className="grid gap-3 pt-3">
        <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-3">
          <FormGroup className="col-span-2">
            <FormLabel>MIDI Message</FormLabel>
            <FormSelect
              value={midiMessageType}
              onChange={handleMidiMessageTypeChange}
            >
              <option value={MIDI_TYPE_NOTE_ON}>Note ON</option>
              <option value={MIDI_TYPE_NOTE_OFF}>Note OFF</option>
              <option value={MIDI_TYPE_CC}>Continuous Control</option>
            </FormSelect>
          </FormGroup>
          <FormGroup>
            <FormLabel>MIDI Channel</FormLabel>
            <FormSelect
              value={midiMessageChannel}
              onChange={handleMidiMessageChannelChange}
            >
              {[...Array(16).keys()].map((v) => (
                <option key={v} value={v}>
                  {v + 1}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup>
            <FormLabel>MIDI Value 1</FormLabel>
            <FormSelect
              value={midiMessageValue1}
              onChange={handleMidiMessageValue1Change}
            >
              {[...Array(128).keys()].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup>
            <FormLabel>MIDI Value 2</FormLabel>
            <FormSelect
              value={midiMessageValue2}
              onChange={handleMidiMessageValue2Change}
              disabled={midiValue2Disabled}
            >
              {[...Array(128).keys()].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          <FormGroup>
            <FormLabel>Gamepad ID</FormLabel>
            <FormInput
              type="number"
              min={0}
              value={gamepadIndex}
              step={1}
              onChange={handleGamepadIndexChange}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Button or Axe</FormLabel>
            <FormSelect value={buttonType} onChange={handleButtonTypeChange}>
              <option value={0}>Button</option>
              <option value={1}>Axe</option>
            </FormSelect>
          </FormGroup>
          <FormGroup>
            <FormLabel>Button/Axe ID</FormLabel>
            <FormInput
              type="number"
              min={0}
              value={buttonIndex}
              step={1}
              onChange={handleButtonIndexChange}
            />
          </FormGroup>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Add</Button>
        </div>
      </form>
    </Box>
  );
}
