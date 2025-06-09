import type { HTMLAttributes } from "react";

export default function FormGroup({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`grid gap-1 ${className}`} {...props}>
      {children}
    </div>
  );
}
