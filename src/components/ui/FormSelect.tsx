import type { SelectHTMLAttributes } from "react";

export default function FormSelect({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`flex w-full h-10 px-3 py-2 bg-transparent *:bg-back border border-prim/10 rounded-sm placeholder:text-prim/50 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
