import React from 'react';
import PropTypes from 'prop-types';

export default function Box({ className = '', children }) {
  return (
    <div className={`p-6 border border-prim/10 rounded-md ${className}`}>
      {children}
    </div>
  );
}

Box.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Box.defaultProps = {
  className: '',
};
