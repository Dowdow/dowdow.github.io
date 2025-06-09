import type { LabelHTMLAttributes } from "react";

export default function FormLabel({
  className = "",
  children,
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`font-medium text-prim/60 ${className}`}>
      {children}
    </label>
  );
}
