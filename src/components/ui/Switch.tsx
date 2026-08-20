"use client";

import React from "react";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
}

export default function Switch({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className = "",
  id,
  name,
  "aria-label": ariaLabel,
}: SwitchProps) {
  const isSm = size === "sm";

  return (
    <button
      type="button"
      role="switch"
      id={id}
      name={name}
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2F6ADB] focus-visible:ring-offset-2 select-none ${
        isSm ? "h-4 w-7" : "h-5 w-9"
      } ${
        disabled
          ? "opacity-50 cursor-not-allowed bg-slate-200 dark:bg-slate-700"
          : checked
          ? "bg-[#002E5D] dark:bg-[#2F6ADB]"
          : "bg-[#D5DEE7] hover:bg-[#B3C1D0] dark:bg-slate-700 dark:hover:bg-slate-600"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block transform rounded-full bg-white shadow-xs ring-0 transition-transform duration-200 ease-in-out ${
          isSm
            ? `h-3 w-3 ${checked ? "translate-x-3" : "translate-x-0"}`
            : `h-4 w-4 ${checked ? "translate-x-4" : "translate-x-0"}`
        }`}
      />
    </button>
  );
}
