import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { RoutesContext } from "./Routes";
import { match } from "../../hooks/routing";

export default function Route({ to = null, element }) {
  const { hash, addMatch } = useContext(RoutesContext);
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    const m = match(hash, to);
    setMatched(m);
    if (m) {
      addMatch(to);
    }
  }, [hash]);

  return matched ? element : null;
}

Route.propTypes = {
  to: PropTypes.string,
  element: PropTypes.element.isRequired,
};

Route.defaultProps = {
  to: null,
};
