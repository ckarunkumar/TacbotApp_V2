"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  colorDot?: string; // e.g. '#dc2626' for critical, '#d97706' for warning
  icon?: React.ComponentType<any>;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  size?: SelectSize;
  disabled?: boolean;
  errorText?: string;
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  label,
  required = false,
  placeholder = "Select an option...",
  size = "md",
  disabled = false,
  errorText,
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(value || "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (val: string) => {
    if (disabled) return;
    setSelectedValue(val);
    if (onChange) onChange(val);
    setIsOpen(false);
  };

  // Size styling math
  const sizeStyles = {
    sm: "h-7 px-2.5 text-[11px]",
    md: "h-8 px-3 text-xs",
    lg: "h-10 px-3.5 text-sm",
  }[size];

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  }[size];

  return (
    <div ref={containerRef} className={`w-full flex flex-col gap-1 relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="text-xs font-semibold text-[#2C3746] dark:text-slate-200 flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}

      {/* Main Select Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className={`w-full rounded-[4px] font-normal transition-all outline-none flex items-center justify-between text-left select-none cursor-pointer border ${sizeStyles} ${
          disabled
            ? "bg-[#F2F4F6] dark:bg-[#121c33] border-[#EAEEF3] dark:border-[#1a2948] text-[#B3C1D0] cursor-not-allowed"
            : errorText
            ? "bg-red-50/30 border-red-500 text-[#2C3746] dark:text-slate-100 ring-2 ring-red-500/20"
            : isOpen
            ? "bg-white dark:bg-[#081024] border-[#002E5D] dark:border-[#38bdf8] ring-2 ring-[#002E5D]/20 text-[#2C3746] dark:text-slate-100 shadow-2xs"
            : "bg-white dark:bg-[#081024] border-[#EAEEF3] dark:border-[#1e3056] text-[#2C3746] dark:text-slate-100 hover:border-[#D4E4FE] hover:bg-[#F9FBFF]"
        }`}
      >
        {/* Left Value Preview */}
        <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
          {selectedOption ? (
            <>
              {selectedOption.colorDot && (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: selectedOption.colorDot }}
                />
              )}
              {selectedOption.icon && (
                <selectedOption.icon size={iconSizes} className="text-[#002E5D] shrink-0" />
              )}
              <span className="truncate font-medium text-[#2C3746] dark:text-slate-100">
                {selectedOption.label}
              </span>
              {selectedOption.sublabel && (
                <span className="text-[10px] text-[#7790A9] font-normal truncate hidden sm:inline">
                  ({selectedOption.sublabel})
                </span>
              )}
            </>
          ) : (
            <span className="text-[#7790A9] dark:text-slate-500">{placeholder}</span>
          )}
        </div>

        {/* Custom Animated Chevron Arrow */}
        <ChevronDown
          size={iconSizes}
          className={`text-[#7790A9] transition-transform duration-200 shrink-0 ${
            isOpen ? "transform rotate-180 text-[#002E5D]" : ""
          }`}
        />
      </button>

      {/* Custom Dropdown Menu Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#0d172e] border border-[#EAEEF3] dark:border-[#1e3056] rounded-[4px] shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            const Icon = option.icon;

            return (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#ECF3FF] dark:bg-blue-950/60 text-[#002E5D] dark:text-[#38bdf8] font-semibold"
                    : "text-[#2C3746] dark:text-slate-200 hover:bg-[#F9FBFF] dark:hover:bg-[#0f1d38] hover:text-[#002E5D]"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  {option.colorDot && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: option.colorDot }}
                    />
                  )}
                  {Icon && <Icon size={14} className="shrink-0 text-[#002E5D]" />}
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{option.label}</span>
                    {option.sublabel && (
                      <span className="text-[10px] text-[#7790A9] dark:text-slate-400 font-normal truncate">
                        {option.sublabel}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check size={14} className="text-[#002E5D] dark:text-[#38bdf8] shrink-0 ml-2" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Error Message */}
      {errorText && (
        <p className="text-[11px] font-medium text-red-500 mt-0.5">{errorText}</p>
      )}
    </div>
  );
}
