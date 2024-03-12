import React from 'react';
import PropTypes from 'prop-types';
import Box from '../ui/Box';
import Button from '../ui/Button';
import { midiTypeNameFromId } from '../../utils/midi';

export default function Logs({ logs, clear }) {
  const handleClearLogs = (event) => {
    event.stopPropagation();
    clear();
  };

  return (
    <Box className="h-full">
      <div className="flex justify-between items-center gap-x-6">
        <div className="grow">
          <h2 className="text-lg font-bold tracking-tight">Logs</h2>
          <div className="text-sm tracking-tight text-prim/50">Midi history log</div>
        </div>
        <Button type="button" onClick={handleClearLogs}>Clear</Button>
      </div>
      <div className="flex flex-col w-full h-52 mt-3 overflow-y-scroll">
        {logs
          .sort((a, b) => b.id - a.id)
          .map((l, index) => <Log key={`${l.id}-${index}`} id={l.id} data={l.data} />)}
      </div>
    </Box>
  );
}

function Log({ id, data }) {
  const date = new Date(id);
  return (
    <div className="flex flex-row justify-between pr-3">
      <span className="w-28 text-blue-600">{`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}:${date.getMilliseconds().toString().padStart(3, '0')}`}</span>
      <span className="w-8">{`C${data.controllerIndex}`}</span>
      <span className="w-8">{`${data.buttonType === 0 ? 'B' : 'A'}${data.buttonIndex}`}</span>
      <span className="w-20 uppercase">{midiTypeNameFromId(data.midiMessageType)}</span>
      <span className="w-9">{`CH${data.midiMessageChannel}`}</span>
      <span className="w-8 text-center">{data.midiMessageValue1}</span>
      <span className="w-8 text-center">{data.midiMessageValue2}</span>
    </div>
  );
}

Logs.propTypes = {
  logs: PropTypes.array.isRequired,
  clear: PropTypes.func.isRequired,
};

Log.propTypes = {
  id: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
};
