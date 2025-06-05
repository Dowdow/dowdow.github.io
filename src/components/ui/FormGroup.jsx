import PropTypes from "prop-types";

export default function FormGroup({ children, className = "" }) {
  return <div className={`grid gap-1 ${className}`}>{children}</div>;
}

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

FormGroup.defaultProps = {
  className: "",
};
