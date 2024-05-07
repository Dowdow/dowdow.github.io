import React, { useEffect, useMemo, useReducer, useState } from 'react';
import PropTypes from 'prop-types';

export const RoutesContext = React.createContext();

const ADD = 'add';
const RESET = 'reset';

function reducer(state = [], action = {}) {
  switch (action.type) {
    case ADD:
      return [...state, action.payload];
    case RESET:
      return [];
    default:
      return state;
  }
}

export default function Routes({ children }) {
  const [hash, setHash] = useState(window.location.hash);
  const [matches, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    function hashChange() {
      setHash(window.location.hash);
      dispatch({ type: RESET });
    }

    window.addEventListener('hashchange', hashChange);
    return () => {
      window.removeEventListener('hashchange', hashChange);
    };
  }, []);

  const addMatch = (match) => {
    dispatch({ type: ADD, payload: match });
  };

  const payload = useMemo(() => ({ hash, matches, addMatch }), [hash, matches, addMatch]);

  return (
    <RoutesContext.Provider value={payload}>
      {children}
    </RoutesContext.Provider>
  );
}

Routes.propTypes = {
  children: PropTypes.node.isRequired,
};
