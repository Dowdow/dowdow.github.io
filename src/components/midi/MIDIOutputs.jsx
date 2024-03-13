import React from 'react';
import PropTypes from 'prop-types';
import Box from '../ui/Box';
import Switch from '../ui/Switch';

export default function MIDIOutputs({ outputs, support = null, errorMessage = null, toggle }) {
  if (support === null) {
    return (
      <Box>
        <span>Checking Midi API support...</span>
      </Box>
    );
  }

  if (support === false) {
    return (
      <Box className="bg-red-600/10">
        <span>The Midi API is not supported on your browser.</span>
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box className="bg-red-600/10">
        <span>{errorMessage}</span>
      </Box>
    );
  }

  if (outputs.length === 0) {
    return (
      <div className="flex items-center p-6 text-xl font-bold tracking-tight animate-pulse">
        Connect a Midi device to continue.
      </div>
    );
  }

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
  support: PropTypes.bool,
  errorMessage: PropTypes.string,
  toggle: PropTypes.func.isRequired,
};

MIDIOutputs.defaultProps = {
  support: null,
  errorMessage: null,
};

MIDIOutput.propTypes = {
  id: PropTypes.string.isRequired,
  activated: PropTypes.bool.isRequired,
  manufacturer: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
};
