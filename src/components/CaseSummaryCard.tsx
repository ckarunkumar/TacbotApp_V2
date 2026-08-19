"use client";

import React, { useState } from "react";
import { Info, ArrowUpRight } from "lucide-react";
import Tooltip from "@/components/Tooltip";
import Badge from "@/components/Badge";
import { useDashboard } from "@/context/DashboardContext";

export default function CaseSummaryCard() {
  const { isDarkMode } = useDashboard();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const bars = [
    { label: "Q1", value: 55, count: "55.2K", color: isDarkMode ? "#f8fafc" : "#e0f2fe", hoverColor: "#ffffff" },
    { label: "Q2", value: 105, count: "105.4K", color: isDarkMode ? "#38bdf8" : "#bae6fd", hoverColor: "#60a5fa" },
    { label: "Q3", value: 125, count: "125.8K", color: isDarkMode ? "#7dd3fc" : "#7dd3fc", hoverColor: "#93c5fd" },
    { label: "Q4", value: 75, count: "75.1K", color: isDarkMode ? "#0284c7" : "#38bdf8", hoverColor: "#0ea5e9" },
    { label: "Current", value: 45, count: "45.0K", color: isDarkMode ? "#0369a1" : "#0284c7", hoverColor: "#0284c7" },
  ];

  const yTicks = [
    { value: 140, label: "140K" },
    { value: 120, label: "120K" },
    { value: 100, label: "100K" },
    { value: 80, label: "80K" },
    { value: 60, label: "60K" },
    { value: 40, label: "40K" },
    { value: 20, label: "20K" },
    { value: 0, label: "0" },
  ];

  const maxVal = 140;

  return (
    <div className="bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] p-4 shadow-xs flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-white tracking-tight">Case Summary</h3>
        <Tooltip content="Quarterly Volume and trend of incoming support access across quarters" position="bottom">
          <button
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            aria-label="Case Summary Information"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>

      {/* Main Metric */}
      <div className="flex items-center gap-2 mb-2 shrink-0">
        <span className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">5.42K</span>
        <Badge variant="success">
          <ArrowUpRight className="w-3 h-3" />
          <span>22.41%</span>
        </Badge>
      </div>

      {/* Fully Responsive Auto-Expanding Bar Chart */}
      <div className="relative flex-1 w-full min-h-[140px] flex">
        {/* Y Axis Labels */}
        <div className="flex flex-col justify-between h-full pr-2 text-[9px] font-medium text-slate-400 dark:text-slate-500 select-none pb-6 text-right w-8 shrink-0">
          {yTicks.map((tick) => (
            <span key={tick.value} className="leading-none">
              {tick.label}
            </span>
          ))}
        </div>

        {/* Chart Bars & Grid */}
        <div className="relative flex-1 h-full flex flex-col justify-between">
          {/* Gridlines */}
          <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none">
            {yTicks.map((tick) => (
              <div key={tick.value} className="w-full border-b border-slate-100 dark:border-[#14223d] h-0" />
            ))}
          </div>

          {/* Dynamic Auto-Expanding Bars */}
          <div className="relative z-10 flex items-end justify-between flex-1 px-2 pb-1">
            {bars.map((bar, idx) => {
              const heightPercent = (bar.value / maxVal) * 100;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={bar.label}
                  className="flex-1 flex flex-col items-center group relative h-full justify-end px-2"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-7 bg-[#182235] dark:bg-[#060b17] text-white text-[10px] py-1 px-2 rounded-[8px] shadow-xl whitespace-nowrap z-30 pointer-events-none font-medium animate-in fade-in zoom-in-95">
                      {bar.count}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-t-[4px] border-t-[#182235] dark:border-t-[#060b17] border-x-[4px] border-x-transparent" />
                    </div>
                  )}

                  {/* Bar graphic */}
                  <div
                    className="w-full max-w-[36px] rounded-t-[8px] transition-all duration-200 cursor-pointer"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: isHovered ? bar.hoverColor : bar.color,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* X Axis Labels */}
          <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 border-t border-[#EAEEF3] dark:border-[#162444] shrink-0">
            {bars.map((bar) => (
              <div key={bar.label} className="flex-1 text-center text-[10px]">
                {bar.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
