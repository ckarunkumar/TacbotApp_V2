"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export type ButtonVariant = "primary" | "ai" | "secondary" | "outline" | "disabled";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ComponentType<any>;
  rightIcon?: React.ComponentType<any>;
  iconOnly?: boolean;
  children?: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  iconOnly = false,
  children,
  className = "",
  disabled = false,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || variant === "disabled";

  // Base styles: strictly rounded-[4px], font-semibold, inline-flex, gap-2 (8px)
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-[4px] font-semibold transition-all select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#002E5D]/30";

  // Size styles
  const sizeStyles = {
    sm: iconOnly
      ? "w-7 h-7 p-0 text-[11px]"
      : "px-2.5 py-1 text-[11px] min-h-[28px]",
    md: iconOnly
      ? "w-8 h-8 p-0 text-xs"
      : "px-3.5 py-1.5 text-xs min-h-[32px]",
    lg: iconOnly
      ? "w-10 h-10 p-0 text-sm"
      : "px-4 py-2 text-sm min-h-[40px]",
  };

  // Icon sizing based on button size
  const iconSizeClass = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-4.5 h-4.5",
  }[size];

  // Variant styles: Primary is solid Arista Navy (no gradient), AI variant holds the special AI gradient
  const variantStyles = {
    primary:
      "bg-[#002E5D] text-white hover:bg-[#0A3492] shadow-xs active:scale-[0.98]",
    ai:
      "bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)] text-white hover:opacity-95 shadow-xs active:scale-[0.98]",
    secondary:
      "bg-[#ECF3FF] text-[#002E5D] hover:bg-[#D4E4FE] shadow-xs active:scale-[0.98]",
    outline:
      "bg-white dark:bg-[#081024] border border-[#EAEEF3] dark:border-[#1e3056] text-[#2C3746] dark:text-slate-200 hover:text-[#002E5D] dark:hover:text-[#38bdf8] hover:bg-[#F9FBFF] dark:hover:bg-[#0f1d38] hover:border-[#D4E4FE] dark:hover:border-[#002E5D] shadow-2xs active:scale-[0.98]",
    disabled:
      "bg-[#EAEEF3] dark:bg-[#121c33] text-[#B3C1D0] dark:text-slate-600 border border-[#EAEEF3] dark:border-[#1a2948] cursor-not-allowed shadow-none opacity-80 pointer-events-none",
  };

  const appliedVariant = isDisabled ? "disabled" : variant;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[appliedVariant]} ${className}`}
      {...props}
    >
      {LeftIcon && <LeftIcon className={iconSizeClass} />}
      {!iconOnly && children && <span>{children}</span>}
      {RightIcon && <RightIcon className={iconSizeClass} />}
    </button>
  );
}
