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
        return "bg-slate-100 text-slate-600 border border-slate-200/60 text-[9px] font-medium px-1.5 py-0.5";
      case "success":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-semibold px-2 py-0.5";
      case "warning":
        return "bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-semibold px-2 py-0.5";
      case "danger":
        return "bg-red-50 text-red-700 border border-red-200/60 text-[10px] font-semibold px-2 py-0.5";
      case "solid-danger":
        return "bg-[#ef4444] text-white text-[10px] font-semibold px-2 py-0.5";
      case "info":
        return "bg-blue-50 text-[#0047ba] border border-blue-200/60 text-[10px] font-semibold px-2 py-0.5";
      case "purple":
        return "bg-purple-50 text-purple-700 border border-purple-200/60 text-[10px] font-semibold px-2 py-0.5";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200/60 text-[9px] font-medium px-1.5 py-0.5";
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded-[2px] leading-none select-none ${getVariantStyles()} ${className}`}
    >
      {children}
    </span>
  );
}
