import PropTypes from "prop-types";
import Box from "../ui/Box";
import Switch from "../ui/Switch";

export default function Gamepads({
  gamepads,
  gamepadsData,
  support = null,
  toggle,
}) {
  if (support === null) {
    return (
      <Box>
        <span>Checking Gamepad API support...</span>
      </Box>
    );
  }

  if (support === false) {
    return (
      <Box className="bg-red-600/10">
        <span>The Gamepad API is not supported on your browser.</span>
      </Box>
    );
  }

  if (gamepads.length === 0) {
    return (
      <div className="flex items-center p-6 text-xl font-bold tracking-tight animate-pulse">
        Press a button or move a stick to enable your gamepad.
      </div>
    );
  }

  return gamepads
    .sort((a, b) => a.index - b.index)
    .map((g) => {
      if (!gamepadsData[g.index]) return null;
      return (
        <Box key={g.index}>
          <div className="flex justify-between items-center gap-x-6">
            <div className="grow">
              <h2 className="text-lg font-bold tracking-tight">{`Gamepad ${g.index}`}</h2>
              <div className="text-sm tracking-tight text-prim/50">{g.id}</div>
            </div>
            <Switch init={g.activated} toggle={() => toggle(g.index)} />
          </div>
          <div className="flex flex-row flex-wrap gap-1 pt-3">
            {gamepadsData[g.index].buttons.map((button, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <GamepadButton
                key={`button-${g.index}-${i}`}
                index={i}
                value={button.value}
              />
            ))}
          </div>
          <div className="flex flex-row flex-wrap gap-1 pt-3">
            {gamepadsData[g.index].axes.map((axe, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <GamepadAxe key={`axe-${g.index}-${i}`} index={i} value={axe} />
            ))}
          </div>
        </Box>
      );
    });
}

function GamepadButton({ index, value }) {
  const y2 = 40 - Math.min(Math.max(value, 0), 1) * 40;

  return (
    <div className="flex flex-row w-16">
      <svg className="relative mr-2 w-2 h-10 bg-prim/20">
        <line x1="4" y1="40" x2="4" y2={y2} strokeWidth="8" stroke="#fafafa" />
      </svg>
      <div className="flex flex-col">
        <span className="text-sm text-prim/70">{`B${index}`}</span>
        <span className="">
          {(Math.round((value + Number.EPSILON) * 100) / 100).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function GamepadAxe({ index, value }) {
  const y2 = 40 - ((Math.min(Math.max(value, -1), 1) + 1) / 2) * 40;

  return (
    <div className="flex flex-row w-16">
      <svg className="relative mr-2 w-2 h-10 bg-prim/20">
        <line x1="4" y1="20" x2="4" y2={y2} strokeWidth="8" stroke="#fafafa" />
      </svg>
      <div className="flex flex-col">
        <span className="text-sm text-prim/70">{`Axis ${index}`}</span>
        <span className="">
          {(Math.round((value + Number.EPSILON) * 100) / 100).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

Gamepads.propTypes = {
  gamepads: PropTypes.array.isRequired,
  gamepadsData: PropTypes.array.isRequired,
  support: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
};

Gamepads.defaultProps = {
  support: null,
};

GamepadButton.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

GamepadAxe.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
