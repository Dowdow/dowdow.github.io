import type { InputHTMLAttributes } from "react";

export default function FormInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`flex w-full h-10 px-3 py-2 bg-transparent border border-prim/10 rounded-sm placeholder:text-prim/50 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
