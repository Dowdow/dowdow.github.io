import React from 'react';
import PropTypes from 'prop-types';
import { useLocationHash } from '../../hooks/location';

export const RoutesContext = React.createContext();

export default function Routes({ children }) {
  const hash = useLocationHash();

  return (
    <RoutesContext.Provider value={hash}>
      {children}
    </RoutesContext.Provider>
  );
}

Routes.propTypes = {
  children: PropTypes.node.isRequired,
};
