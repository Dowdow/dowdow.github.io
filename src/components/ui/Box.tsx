import type { HTMLAttributes } from "react";

export default function Box({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`p-6 border border-prim/10 rounded-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
