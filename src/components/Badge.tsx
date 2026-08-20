"use client";

import React from "react";

export type BadgeVariant =
  | "dimension"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "solid-danger"
  | "info"
  | "purple";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "dimension":
      case "neutral":
        return "bg-[#F2F4F6] dark:bg-[#121c33] text-[#7790A9] dark:text-slate-400 border border-[#EAEEF3] dark:border-[#1e3056] text-[9px] font-medium px-1.5 py-0.5";
      case "success":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 text-[10px] font-semibold px-2 py-0.5";
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 text-[10px] font-semibold px-2 py-0.5";
      case "danger":
        return "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-800/60 text-[10px] font-semibold px-2 py-0.5";
      case "solid-danger":
        return "bg-[#dc2626] text-white text-[10px] font-semibold px-2 py-0.5";
      case "info":
        return "bg-[#ECF3FF] dark:bg-[#002E5D]/30 text-[#002E5D] dark:text-blue-300 border border-[#D4E4FE] dark:border-[#002E5D] text-[10px] font-semibold px-2 py-0.5";
      case "purple":
        return "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 text-[10px] font-semibold px-2 py-0.5";
      default:
        return "bg-[#F2F4F6] dark:bg-[#121c33] text-[#7790A9] dark:text-slate-400 border border-[#EAEEF3] dark:border-[#1e3056] text-[9px] font-medium px-1.5 py-0.5";
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded-[4px] leading-none select-none ${getVariantStyles()} ${className}`}
    >
      {children}
    </span>
  );
}
