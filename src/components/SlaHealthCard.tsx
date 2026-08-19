"use client";

import React from "react";
import { Info } from "lucide-react";
import Tooltip from "@/components/Tooltip";

export default function SlaHealthCard() {
  return (
    <div className="bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] p-4 shadow-xs flex flex-col justify-between h-full">
      {/* Header with Title and Percentage */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-white tracking-tight">SLA Health</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">98.2%</span>
          <Tooltip content="Overall percentage of cases resolved within contract SLA thresholds" position="top">
            <button
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              aria-label="SLA Health Information"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Segmented Horizontal Progress Bar */}
      <div className="w-full h-2 rounded-full flex overflow-hidden mb-2 bg-[#F2F4F6] dark:bg-[#060b17]">
        {/* Green SLA Met Bar */}
        <div className="bg-[#10b981] h-full" style={{ width: "75%" }} />
        {/* Orange Near Breach Bar */}
        <div className="bg-[#f59e0b] h-full" style={{ width: "18%" }} />
        {/* Red Breached Bar */}
        <div className="bg-[#ef4444] h-full" style={{ width: "7%" }} />
      </div>

      {/* Legend Row */}
      <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-[8px] bg-[#10b981]" />
          <span>SLA: <strong className="font-semibold text-slate-900 dark:text-white">284</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-[8px] bg-[#f59e0b]" />
          <span>Near: <strong className="font-semibold text-slate-900 dark:text-white">92</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-[8px] bg-[#ef4444]" />
          <span>Breach: <strong className="font-semibold text-slate-900 dark:text-white">21</strong></span>
        </div>
      </div>
    </div>
  );
}
