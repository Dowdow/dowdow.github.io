import React from 'react';
import PropTypes from 'prop-types';
import Box from '../ui/Box';
import Button from '../ui/Button';

export default function Logs({ logs, clear }) {
  const handleClearLogs = (event) => {
    event.stopPropagation();
    clear();
  };

  return (
    <Box>
      <div className="flex justify-between items-center gap-x-6">
        <div className="grow">
          <h2 className="text-lg font-bold tracking-tight">Logs</h2>
          <div className="text-sm tracking-tight text-prim/50">Midi history log</div>
        </div>
        <Button type="button" onClick={handleClearLogs}>Clear</Button>
      </div>
      <div className="flex flex-col w-full lg:h-[22rem] xl:h-48 mt-5 lg:overflow-y-scroll">
        {logs
          .sort((a, b) => b.id - a.id)
          // eslint-disable-next-line react/no-array-index-key
          .map((l, index) => <Log key={`${l.id}-${index}`} id={l.id} data={l.data} />)}
      </div>
    </Box>
  );
}

function Log({ id, data }) {
  const date = new Date(id);
  return (
    <div className="flex flex-row justify-between pr-3">
      <span className=" w-24 text-blue-600">{`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}:${date.getMilliseconds().toString().padStart(3, '0')}`}</span>
      {// eslint-disable-next-line react/no-array-index-key
      data.map((d, i) => <span key={i}>{d}</span>)
      }
    </div>
  );
}

Logs.propTypes = {
  logs: PropTypes.array.isRequired,
  clear: PropTypes.func.isRequired,
};

Log.propTypes = {
  id: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
};
