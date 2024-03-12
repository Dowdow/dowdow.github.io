import React from 'react';
import PropTypes from 'prop-types';
import Box from '../ui/Box';
import Switch from '../ui/Switch';

export default function MIDIOutputs({ outputs, toggle }) {
  return (
    <>
      {outputs
        .sort((a, b) => { if (a.id > b.id) return 1; if (a.id < b.id) return -1; return 0; })
        .map((mo) => (
          <MIDIOutput
            key={mo.id}
            id={mo.id}
            activated={mo.activated}
            manufacturer={mo.manufacturer}
            name={mo.name}
            version={mo.version}
            toggle={toggle}
          />
        ))}
    </>
  );
}

function MIDIOutput({ id, activated, manufacturer, name, version, toggle }) {
  return (
    <Box className="flex justify-between items-center gap-x-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">{name}</h2>
        <div className="text-sm tracking-tight text-prim/50">{manufacturer}</div>
        <div className="text-xs tracking-tight text-prim/50">{version}</div>
      </div>
      <Switch init={activated} toggle={() => toggle(id)} />
    </Box>
  );
}

MIDIOutputs.propTypes = {
  outputs: PropTypes.array.isRequired,
  toggle: PropTypes.func.isRequired,
};

MIDIOutput.propTypes = {
  id: PropTypes.string.isRequired,
  activated: PropTypes.bool.isRequired,
  manufacturer: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
};
