import React from 'react';
import PropTypes from 'prop-types';

export default function Link({ to, children, state = {}, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.history.pushState(state, '', to);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  return <a href={to} onClick={handleClick} {...props}>{children}</a>;
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  state: PropTypes.object,
};

Link.defaultProps = {
  state: {},
};
