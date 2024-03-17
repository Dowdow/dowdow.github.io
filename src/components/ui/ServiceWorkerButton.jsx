import React from 'react';
import PropTypes from 'prop-types';
import useNetwork from '../../hooks/network';

export default function ServiceWorkerButton({ supported = null, state = null, error = false, register, unregister }) {
  const isOnline = useNetwork();

  const onClick = () => {
    if (state === null || state === 'redundant') {
      register();
    } else {
      unregister();
    }
  };

  if (supported === false) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      data-error={error ? 'true' : 'false'}
      disabled={!isOnline}
      className="flex items-center gap-2 px-3.5 md:px-2 rounded-md
      font-mono text-sm text-prim/70
      bg-transparent data-[error=true]:bg-red-600/10 hover:bg-prim/15 disabled:hover:bg-transparent
      disabled:cursor-not-allowed"
    >
      <div
        data-state={state ?? 'redundant'}
        className="w-3 h-3 rounded-full
       data-[state=redundant]:bg-gray-500
       data-[state=installing]:bg-orange-500 data-[state=installing]:animate-pulse
       data-[state=installed]:bg-orange-500
       data-[state=activating]:bg-green-500 data-[state=activating]:animate-pulse
       data-[state=activated]:bg-green-500"
      />
      <div className="hidden md:block">
        {state === null || state === 'redundant' ? 'register' : state}
      </div>
    </button>
  );
}

ServiceWorkerButton.propTypes = {
  supported: PropTypes.bool,
  state: PropTypes.string,
  error: PropTypes.bool,
  register: PropTypes.func.isRequired,
  unregister: PropTypes.func.isRequired,
};

ServiceWorkerButton.defaultProps = {
  supported: null,
  state: null,
  error: false,
};
