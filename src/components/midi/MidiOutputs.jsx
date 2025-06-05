import PropTypes from "prop-types";
import Box from "../ui/Box";
import Switch from "../ui/Switch";
import Button from "../ui/Button";

export default function MidiOutputs({
  outputs,
  support = null,
  permissionState = null,
  request,
  toggle,
}) {
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

  if (permissionState === "denied") {
    return (
      <Box className="bg-red-600/10">
        <span>
          Permissions for Midi device use are denied. Check your browser
          settings.
        </span>
      </Box>
    );
  }

  if (permissionState === "prompt") {
    return (
      <Box className="flex justify-between items-center gap-6 bg-blue-600/10">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Midi permissions</h2>
          <div className="text-sm tracking-tight text-prim/50">
            You need to authorize Midi device use.
          </div>
        </div>
        <Button onClick={request}>Allow</Button>
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

  return outputs
    .sort((a, b) => {
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
      return 0;
    })
    .map((mo) => (
      <Box key={mo.id} className="flex justify-between items-center gap-x-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight">{mo.name}</h2>
          <div className="text-sm tracking-tight text-prim/50">
            {mo.manufacturer}
          </div>
          <div className="text-xs tracking-tight text-prim/50">
            {mo.version}
          </div>
        </div>
        <Switch init={mo.activated} toggle={() => toggle(mo.id)} />
      </Box>
    ));
}

MidiOutputs.propTypes = {
  outputs: PropTypes.array.isRequired,
  support: PropTypes.bool,
  permissionState: PropTypes.string,
  request: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

MidiOutputs.defaultProps = {
  support: null,
  permissionState: null,
};
