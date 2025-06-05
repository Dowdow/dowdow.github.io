import PropTypes from "prop-types";

export default function FormLabel({ children }) {
  return <label className="font-medium text-prim/60">{children}</label>;
}

FormLabel.propTypes = {
  children: PropTypes.node.isRequired,
};
