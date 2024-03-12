import React from 'react';
import PropTypes from 'prop-types';
import Box from '../ui/Box';
import GamepadButton from './GamepadButton';
import Switch from '../ui/Switch';

export default function Gamepad({ activated, data, toggle, send }) {
  if (data === null) {
    return null;
  }

  return (
    <Box>
      <div className="flex justify-between items-center gap-x-6">
        <div className="grow">
          <h2 className="text-lg font-bold tracking-tight">{`Gamepad ${data.index}`}</h2>
          <div className="text-sm tracking-tight text-prim/50">{data.id}</div>
        </div>
        <Switch init={activated} toggle={() => toggle(data.index)} />
      </div>
      <div className="flex flex-row flex-wrap gap-1 pt-3">
        {data.buttons.map((button, i) => (
          <GamepadButton
            key={`button-${data.index}-${i}`}
            type={0}
            activated={activated}
            controllerIndex={data.index}
            index={i}
            value={button.value}
            send={send}
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap gap-1 pt-3">
        {data.axes.map((axe, i) => (
          <GamepadButton
            key={`axe-${data.index}-${i}`}
            type={1}
            activated={activated}
            controllerIndex={data.index}
            index={i}
            value={axe}
            send={send}
          />
        ))}
      </div>
    </Box>
  );
}

Gamepad.propTypes = {
  activated: PropTypes.bool.isRequired,
  data: PropTypes.object,
  toggle: PropTypes.func.isRequired,
  send: PropTypes.func.isRequired,
};

Gamepad.defaultProps = {
  data: null,
};
