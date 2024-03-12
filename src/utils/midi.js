export const MIDI_TYPE_NOTE_ON = 0;
export const MIDI_TYPE_NOTE_OFF = 1;
export const MIDI_TYPE_CC = 2;

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
