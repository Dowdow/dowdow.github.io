import { useState } from "react";
import PropTypes from "prop-types";

export default function Switch({ toggle, init = false, disabled = false }) {
  const [checked, setChecked] = useState(init);

  const onToggle = () => {
    toggle();
    setChecked(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-prim data-[state=unchecked]:bg-prim/20"
      onClick={onToggle}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className="pointer-events-none block h-5 w-5 rounded-full bg-back shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      />
    </button>
  );
}

Switch.propTypes = {
  toggle: PropTypes.func.isRequired,
  init: PropTypes.bool,
  disabled: PropTypes.bool,
};

Switch.defaultProps = {
  init: false,
  disabled: false,
};
