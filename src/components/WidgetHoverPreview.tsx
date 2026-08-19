"use client";

import React from "react";
import { WidgetCatalogItem, CustomUserWidget } from "@/types/dashboard";
import {
  ArrowUpRight,
  ArrowUp,
  CheckSquare,
  LayoutGrid,
} from "lucide-react";

interface HoverPosition {
  top: number;
  right: number;
}

interface WidgetHoverPreviewProps {
  item: WidgetCatalogItem | CustomUserWidget | null;
  position?: HoverPosition | null;
  isDarkMode?: boolean;
  /** "floating" = positioned tooltip-style card (default). "panel" = fills a static, always-visible container (e.g. the drawer's dedicated preview pane). */
  variant?: "floating" | "panel";
}

export default function WidgetHoverPreview({
  item,
  position,
  isDarkMode = false,
  variant = "floating",
}: WidgetHoverPreviewProps) {
  if (variant === "floating" && (!item || !position)) return null;

  if (variant === "panel" && !item) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-2.5">
        <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#091122] border border-[#EAEEF3] dark:border-[#162444] flex items-center justify-center text-slate-300 dark:text-slate-600">
          <LayoutGrid className="w-5 h-5" />
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
          Hover a widget, or start building a custom one, to see a live preview here.
        </p>
      </div>
    );
  }

  if (!item) return null;

  const renderMiniChart = () => {
    switch (item.type) {
      case "case-summary":
        return (
          <div className="flex flex-col gap-2 w-full pt-1">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-slate-900 dark:text-white">5.42K</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +22.41%
              </span>
            </div>
            {/* 5 mini bars */}
            <div className="h-16 flex items-end justify-between gap-2 px-1 border-b border-[#EAEEF3] dark:border-[#162444] pb-1">
              <div className="w-full bg-slate-200 dark:bg-[#F2F4F6] rounded-t-[1px] h-[45%]" />
              <div className="w-full bg-sky-300 dark:bg-sky-400 rounded-t-[1px] h-[75%]" />
              <div className="w-full bg-sky-400 dark:bg-sky-300 rounded-t-[1px] h-[100%]" />
              <div className="w-full bg-sky-600 dark:bg-sky-500 rounded-t-[1px] h-[60%]" />
              <div className="w-full bg-sky-800 dark:bg-sky-600 rounded-t-[1px] h-[40%]" />
            </div>
            <div className="flex justify-between text-[8px] text-slate-400 font-medium px-0.5">
              <span>Q1</span>
              <span>Q2</span>
              <span>Q3</span>
              <span>Q4</span>
              <span>Cur</span>
            </div>
          </div>
        );

      case "sla-summary":
        return (
          <div className="flex items-center justify-center py-2 w-full">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke={isDarkMode ? "#0d182e" : "#f1f5f9"} strokeWidth="12" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0284c7" strokeWidth="12" strokeDasharray="170 238" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ef4444" strokeWidth="12" strokeDasharray="25 238" strokeDashoffset="-170" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="43 238" strokeDashoffset="-195" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">101.1K</span>
                <span className="text-[7px] text-slate-400 uppercase mt-0.5 font-semibold">TOTAL</span>
              </div>
            </div>
          </div>
        );

      case "total-cases":
        return (
          <div className="flex flex-col gap-2 w-full pt-1">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-slate-900 dark:text-white">101.1K</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                <ArrowUp className="w-3 h-3" /> 8%
              </span>
            </div>
            <div className="h-16 w-full relative border-b border-[#EAEEF3] dark:border-[#162444]">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path d="M 0,45 Q 50,30 100,10 T 200,8" fill="none" stroke={isDarkMode ? "#38bdf8" : "#002E5D"} strokeWidth="2" />
                <path d="M 0,50 Q 50,42 100,25 T 200,20" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="100" cy="10" r="3" fill="#ffffff" stroke="#002E5D" strokeWidth="1.5" />
                <circle cx="200" cy="8" r="3" fill="#ffffff" stroke="#002E5D" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="flex justify-between text-[8px] text-slate-400 font-medium">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </div>
        );

      case "treemap":
        return (
          <div className="grid grid-cols-12 gap-1.5 h-20 w-full pt-1">
            <div className="col-span-6 bg-[#34d399] rounded-[8px] p-1.5 flex flex-col justify-between">
              <span className="text-[9px] font-bold text-slate-950">Cisco</span>
              <span className="text-xs font-bold text-slate-950">820</span>
            </div>
            <div className="col-span-3 bg-[#10b981] rounded-[8px] p-1.5 flex flex-col justify-between">
              <span className="text-[8px] font-bold text-slate-950">Juniper</span>
              <span className="text-[10px] font-bold text-slate-950">510</span>
            </div>
            <div className="col-span-3 flex flex-col gap-1">
              <div className="bg-[#059669] rounded-[8px] p-1 flex-1 text-white">
                <div className="text-[8px] font-bold">Arista 320</div>
              </div>
              <div className="bg-[#047857] rounded-[8px] p-1 flex-1 text-white">
                <div className="text-[8px] font-bold">Fortinet 210</div>
              </div>
            </div>
          </div>
        );

      case "sla-health":
        return (
          <div className="flex flex-col gap-2.5 w-full py-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Compliance</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">98.2%</span>
            </div>
            <div className="w-full h-2 rounded-full flex overflow-hidden bg-[#F2F4F6] dark:bg-slate-800">
              <div className="bg-[#10b981] h-full" style={{ width: "75%" }} />
              <div className="bg-[#f59e0b] h-full" style={{ width: "18%" }} />
              <div className="bg-[#ef4444] h-full" style={{ width: "7%" }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400">
              <span className="text-[#10b981] font-semibold">● Met: 284</span>
              <span className="text-[#f59e0b] font-semibold">● Near: 92</span>
              <span className="text-[#ef4444] font-semibold">● Breach: 21</span>
            </div>
          </div>
        );

      case "avg-resolution":
        return (
          <div className="flex flex-col gap-2 w-full py-1">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#F9FBFF] dark:bg-[#121c33] p-1.5 rounded-[8px] border border-slate-100 dark:border-[#1e2e4a]">
                <div className="text-[8px] text-slate-400 font-medium">Today</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">4.2h</div>
              </div>
              <div className="bg-[#F9FBFF] dark:bg-[#121c33] p-1.5 rounded-[8px] border border-slate-100 dark:border-[#1e2e4a]">
                <div className="text-[8px] text-slate-400 font-medium">Week</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">4.5h</div>
              </div>
              <div className="bg-[#F9FBFF] dark:bg-[#121c33] p-1.5 rounded-[8px] border border-slate-100 dark:border-[#1e2e4a]">
                <div className="text-[8px] text-slate-400 font-medium">Month</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">5.1h</div>
              </div>
            </div>
            <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              <span>12% faster than last month</span>
            </div>
          </div>
        );

      case "alerts":
      case "critical-escalations":
        return (
          <div className="flex flex-col gap-1.5 w-full py-1">
            <div className="p-1.5 rounded-[8px] bg-[#F9FBFF] dark:bg-[#121c33] border border-[#EAEEF3] dark:border-[#1e2e4a] flex items-center justify-between text-[9px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shrink-0" />
                <span className="truncate font-semibold text-slate-800 dark:text-slate-100">Arista Cloudvision SSO</span>
              </div>
              <span className="text-[#ef4444] font-bold shrink-0">Breached</span>
            </div>
            <div className="p-1.5 rounded-[8px] bg-[#F9FBFF] dark:bg-[#121c33] border border-[#EAEEF3] dark:border-[#1e2e4a] flex items-center justify-between text-[9px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shrink-0" />
                <span className="truncate font-semibold text-slate-800 dark:text-slate-100">Cisco Prime High CPU</span>
              </div>
              <span className="text-[#f59e0b] font-medium shrink-0">45m left</span>
            </div>
          </div>
        );

      default:
        // Custom KPI or generic metric
        return (
          <div className="flex flex-col gap-2 w-full py-1">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {"metricValue" in item ? item.metricValue : "98.5%"}
              </span>
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-[#002E5D] dark:text-[#38bdf8] text-[9px] font-bold rounded-[8px] border border-blue-200/60 dark:border-blue-800/60">
                {"badge" in item ? item.badge : "Optimal"}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
              {"subtitle" in item ? item.subtitle : ("description" in item ? item.description : "")}
            </div>
          </div>
        );
    }
  };

  const colSpan = "defaultColSpan" in item ? item.defaultColSpan : item.colSpan;
  const rowSpan = "defaultRowSpan" in item ? item.defaultRowSpan : item.rowSpan;
  const descriptionText = "description" in item ? item.description : item.subtitle;

  const wrapperClassName =
    variant === "panel"
      ? "p-4 animate-in fade-in duration-150"
      : "fixed w-[320px] bg-white dark:bg-[#091122] rounded-[8px] border border-slate-300 dark:border-[#1e325c] shadow-2xl z-[9999] p-4 animate-in fade-in slide-in-from-right-3 duration-200 pointer-events-none transition-[top,right] duration-150 ease-out";

  return (
    <div
      style={
        variant === "floating" && position
          ? { top: `${position.top}px`, right: `${position.right}px` }
          : undefined
      }
      className={wrapperClassName}
    >
      {/* Dynamic Arrow Indicator pointing right to the hovered card (floating variant only) */}
      {variant === "floating" && (
        <>
          <div className="absolute top-6 -right-2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-slate-300 dark:border-l-[#1e325c]" />
          <div className="absolute top-6 -right-[7px] w-0 h-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-white dark:border-l-[#091122]" />
        </>
      )}

      {/* Top Preview Badge Header */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100 dark:border-[#14223d]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#002E5D] dark:bg-[#38bdf8] animate-ping" />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase">
            Live Widget Preview
          </span>
        </div>
        <div className="px-1.5 py-0.5 bg-[#F2F4F6] dark:bg-[#14223d] text-slate-700 dark:text-slate-300 text-[10px] font-semibold rounded-[8px]">
          {colSpan} × {rowSpan} Grid
        </div>
      </div>

      {/* Widget Title & Category */}
      <div className="mb-2">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
          {item.name}
        </h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal line-clamp-1 mt-0.5">
          {item.category} • {descriptionText}
        </p>
      </div>

      {/* Rendered Visual Preview */}
      <div className="bg-[#F9FBFF]/70 dark:bg-[#060b17] border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] p-3 shadow-inner">
        {renderMiniChart()}
      </div>

      {/* Footer Helper text */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-[#14223d] flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <span>Click &ldquo;Add&rdquo; to place on canvas</span>
        <span className="text-[#002E5D] dark:text-[#38bdf8] font-semibold">+ Instant Add</span>
      </div>
    </div>
  );
}
