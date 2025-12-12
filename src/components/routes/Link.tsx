import type { AnchorHTMLAttributes, MouseEvent } from "react";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  state?: object;
}

export default function Link({
  to,
  state = {},
  children,
  ...props
}: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.history.pushState(state, "", to);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
