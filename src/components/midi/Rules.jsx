import React from 'react';
import PropTypes from 'prop-types';
import Box from '../ui/Box';
import Switch from '../ui/Switch';
import { midiTypeNameFromId } from '../../utils/midi';
import trash from '../../assets/trash.svg';

export default function Rules({ rules, remove, toggle }) {
  return (
    <Box>
      <h2 className="text-lg font-bold tracking-tight">Rules</h2>
      <div className="text-sm tracking-tight text-prim/50 mb-6">Define rules to bind gamepad button to Midi messages.</div>
      <div className="border border-prim/10 rounded overflow-x-scroll">
        <table className="w-full text-sm">
          <thead className="text-prim/60">
            <tr className="*:h-12 *:px-4">
              <th>G ID</th>
              <th>B/A ID</th>
              <th>Type</th>
              <th>Chan</th>
              <th>Val 1</th>
              <th>Val 2</th>
              <th>Del</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {rules
              .sort((r1, r2) => r2.id - r1.id)
              .map((r) => (
                <tr key={r.id} className="*:h-12 *:px-4 *:align-middle hover:bg-prim/5 border-t border-prim/10">
                  <td>
                    G
                    <span className="font-bold">{r.gamepadIndex}</span>
                  </td>
                  <td>
                    {r.buttonType === 0 ? 'B' : 'Axe '}
                    <span className="font-bold">{r.buttonIndex}</span>
                  </td>
                  <td>{midiTypeNameFromId(r.midiMessageType)}</td>
                  <td>
                    CH
                    <span className="font-bold ml-1">{r.midiMessageChannel + 1}</span>
                  </td>
                  <td>
                    {r.midiMessageValue1}
                  </td>
                  <td>
                    {r.midiMessageValue2 ?? '%'}
                  </td>
                  <td>
                    <button type="button" onClick={() => remove(r.id)} className="opacity-80">
                      <img src={trash} alt="Remove rule" className="h-4" />
                    </button>
                  </td>
                  <td>
                    <Switch init={r.activated} toggle={() => toggle(r.id)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Box>
  );
}

Rules.propTypes = {
  rules: PropTypes.array.isRequired,
  remove: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};
