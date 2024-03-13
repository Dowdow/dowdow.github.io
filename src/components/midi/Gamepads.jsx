import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Gamepad from './Gamepad';
import Box from '../ui/Box';

export default function Gamepads({ gamepads, support = null, toggle, send }) {
  const [gamepadData, setGamepadData] = useState(null);

  useEffect(() => {
    let interval = null;

    if (support) {
      interval = setInterval(() => {
        setGamepadData(navigator.getGamepads());
      }, 10);
    }

    return () => {
      clearInterval(interval);
    };
  }, [support]);

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

  return (
    <>
      {gamepads
        .sort((a, b) => a.index - b.index)
        .map((g) => (
          <Gamepad
            key={g.index}
            activated={g.activated}
            data={gamepadData ? gamepadData[g.index] : null}
            toggle={toggle}
            send={send}
          />
        ))}
    </>
  );
}

Gamepads.propTypes = {
  gamepads: PropTypes.array.isRequired,
  support: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  send: PropTypes.func.isRequired,
};

Gamepads.defaultProps = {
  support: null,
};
