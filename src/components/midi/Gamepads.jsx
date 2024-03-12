import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Gamepad from './Gamepad';

export default function Gamepads({ gamepads, toggle, send }) {
  const [gamepadData, setGamepadData] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setGamepadData(navigator.getGamepads());
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (gamepads.length === 0) {
    return (
      <div className="flex items-center p-6 text-xl font-bold tracking-tight animate-pulse">
        Press a button or move a stick to enable the gamepad.
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
  toggle: PropTypes.func.isRequired,
  send: PropTypes.func.isRequired,
};
