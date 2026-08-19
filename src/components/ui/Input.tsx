"use client";

import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

export type InputSize = "sm" | "md" | "lg";
export type InputState = "default" | "focus" | "success" | "error" | "disabled";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: InputSize;
  state?: InputState;
  label?: string;
  required?: boolean;
  leftIcon?: React.ComponentType<any>;
  rightIcon?: React.ComponentType<any>;
  onRightIconClick?: () => void;
  helperText?: string;
  errorText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputSize = "md",
      state = "default",
      label,
      required = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      helperText,
      errorText,
      className = "",
      disabled = false,
      placeholder = "Enter text...",
      ...props
    },
    ref
  ) => {
    const isError = state === "error" || Boolean(errorText);
    const isDisabled = disabled || state === "disabled";

    // Size styles for input element
    const sizeStyles = {
      sm: "h-7 py-1 text-[11px]",
      md: "h-8 py-1.5 text-xs",
      lg: "h-10 py-2 text-sm",
    }[inputSize];

    // Padding adjust based on icons
    const paddingLeft = LeftIcon ? (inputSize === "sm" ? "pl-7" : inputSize === "lg" ? "pl-9" : "pl-8") : (inputSize === "sm" ? "px-2.5" : inputSize === "lg" ? "px-3.5" : "px-3");
    const paddingRight = RightIcon ? (inputSize === "sm" ? "pr-7" : inputSize === "lg" ? "pr-9" : "pr-8") : (inputSize === "sm" ? "px-2.5" : inputSize === "lg" ? "px-3.5" : "px-3");

    // Icon size
    const iconSizeClass = {
      sm: "w-3.5 h-3.5",
      md: "w-4 h-4",
      lg: "w-4.5 h-4.5",
    }[inputSize];

    // Left icon positioning
    const leftIconPos = {
      sm: "left-2",
      md: "left-2.5",
      lg: "left-3",
    }[inputSize];

    // Right icon positioning
    const rightIconPos = {
      sm: "right-2",
      md: "right-2.5",
      lg: "right-3",
    }[inputSize];

    // State styles
    const stateStyles = {
      default:
        "bg-white dark:bg-[#081024] border border-[#EAEEF3] dark:border-[#1e3056] text-[#2C3746] dark:text-slate-100 placeholder-[#7790A9] dark:placeholder-slate-500 hover:border-[#D4E4FE] focus:border-[#005899] focus:ring-2 focus:ring-[#005899]/20",
      focus:
        "bg-white dark:bg-[#081024] border border-[#005899] dark:border-[#38bdf8] ring-2 ring-[#005899]/20 text-[#2C3746] dark:text-slate-100 placeholder-[#7790A9]",
      success:
        "bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20 text-[#2C3746] dark:text-slate-100 placeholder-emerald-400",
      error:
        "bg-red-50/30 dark:bg-red-950/20 border border-red-500 dark:border-red-400 ring-2 ring-red-500/20 text-[#2C3746] dark:text-slate-100 placeholder-red-400",
      disabled:
        "bg-[#F2F4F6] dark:bg-[#121c33] border border-[#EAEEF3] dark:border-[#1a2948] text-[#B3C1D0] dark:text-slate-600 placeholder-[#B3C1D0] cursor-not-allowed opacity-80",
    }[isError ? "error" : isDisabled ? "disabled" : state];

    return (
      <div className="w-full flex flex-col gap-1">
        {/* Input Label */}
        {label && (
          <label className="text-xs font-semibold text-[#2C3746] dark:text-slate-200 flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-red-500 font-bold">*</span>}
          </label>
        )}

        {/* Input Wrapper Container */}
        <div className="relative w-full flex items-center">
          {/* Left Icon */}
          {LeftIcon && (
            <div
              className={`absolute ${leftIconPos} flex items-center justify-center text-[#7790A9] dark:text-slate-400 pointer-events-none`}
            >
              <LeftIcon className={iconSizeClass} />
            </div>
          )}

          {/* Text Input */}
          <input
            ref={ref}
            disabled={isDisabled}
            placeholder={placeholder}
            className={`w-full rounded-[4px] font-normal transition-all outline-none ${sizeStyles} ${paddingLeft} ${paddingRight} ${stateStyles} ${className}`}
            {...props}
          />

          {/* Right Icon */}
          {RightIcon && (
            <div
              onClick={onRightIconClick}
              className={`absolute ${rightIconPos} flex items-center justify-center text-[#7790A9] dark:text-slate-400 ${
                onRightIconClick ? "cursor-pointer hover:text-[#005899]" : "pointer-events-none"
              }`}
            >
              <RightIcon className={iconSizeClass} />
            </div>
          )}
        </div>

        {/* Helper or Error Message */}
        {(isError && errorText) || helperText ? (
          <p
            className={`text-[11px] font-medium mt-0.5 ${
              isError ? "text-red-500 dark:text-red-400" : "text-[#7790A9] dark:text-slate-400"
            }`}
          >
            {isError ? errorText : helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
