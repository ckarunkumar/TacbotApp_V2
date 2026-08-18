"use client";

import React from "react";
import { Info, CheckSquare } from "lucide-react";
import Tooltip from "@/components/Tooltip";

export default function AvgResolutionCard() {
  return (
    <div className="bg-white dark:bg-[#091122] rounded-[2px] border border-slate-200/85 dark:border-[#162444] p-4 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-white tracking-tight">
          Avg. Resolution Time
        </h3>
        <Tooltip content="Mean duration in hours required to resolve customer TAC support cases" position="top">
          <button
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            aria-label="Resolution Time Information"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>

      {/* 3 Metric Columns */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1">Today</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">4.2 hrs</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1">This Week</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">4.5 hrs</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1">This Month</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">5.1 hrs</div>
        </div>
      </div>

      {/* Footer Trend note */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#059669] dark:text-[#34d399]">
        <CheckSquare className="w-3.5 h-3.5" strokeWidth={2.2} />
        <span>12% than last month (6.7 hrs)</span>
      </div>
    </div>
  );
}
