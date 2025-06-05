import PropTypes from "prop-types";

export default function Button({
  type = "button",
  className = "",
  children,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 rounded-sm font-medium bg-prim/20 hover:bg-prim/15 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  type: "button",
  className: "",
  onClick: undefined,
  disabled: false,
};
