import { useContext } from 'react';
import PropTypes from 'prop-types';
import { RoutesContext } from './Routes';

export default function Route({ to = null, element }) {
  const hash = useContext(RoutesContext);

  if (hash === to || (hash === '' && to === null)) {
    return element;
  }

  return null;
}

Route.propTypes = {
  to: PropTypes.string,
  element: PropTypes.element.isRequired,
};

Route.defaultProps = {
  to: null,
};
