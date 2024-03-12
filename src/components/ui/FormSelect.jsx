import React from 'react';
import PropTypes from 'prop-types';

export default function FormSelect({ children, ...props }) {
  return (
    <select
      className="flex w-full h-10 px-3 py-2 bg-transparent *:bg-back border border-prim/10 rounded placeholder:text-prim/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {children}
    </select>
  );
}

FormSelect.propTypes = {
  children: PropTypes.node.isRequired,
};
