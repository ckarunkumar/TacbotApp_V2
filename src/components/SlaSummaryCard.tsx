"use client";

import React, { useState, useRef } from "react";
import { Info } from "lucide-react";
import Tooltip from "@/components/Tooltip";
import { useDashboard } from "@/context/DashboardContext";

export default function SlaSummaryCard() {
  const { isDarkMode } = useDashboard();
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const radius = 68;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  const bluePercent = 0.76;
  const greenPercent = 0.15;
  const redPercent = 0.09;

  const blueDash = bluePercent * circumference;
  const greenDash = greenPercent * circumference;
  const redDash = redPercent * circumference;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (chartContainerRef.current) {
      const rect = chartContainerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#091122] rounded-[2px] border border-slate-200/85 dark:border-[#162444] p-4 shadow-xs flex flex-col justify-between h-full w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-white tracking-tight">SLA Summary</h3>
        <Tooltip content="Overview of SLA compliance, nearing breach, and breached totals" position="bottom">
          <button
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            aria-label="SLA Summary Information"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>

      {/* Donut Chart */}
      <div className="relative flex-1 w-full min-h-0 flex items-center justify-center py-1">
        <div
          ref={chartContainerRef}
          onMouseMove={handleMouseMove}
          className="relative w-36 h-36 max-w-[144px] max-h-[144px] aspect-square flex items-center justify-center shrink-0"
        >
          {/* Butter-Smooth Dynamic Floating Tooltip */}
          {hoveredSegment && mousePos && (
            <div
              className="absolute z-40 pointer-events-none transition-[left,top,opacity,transform] duration-150 ease-out animate-in fade-in zoom-in-95"
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y - 36}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="bg-[#182235] dark:bg-[#060b17] text-white text-[10px] font-semibold py-1 px-2.5 rounded-[2px] shadow-2xl whitespace-nowrap flex items-center gap-1.5 backdrop-blur-sm">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: hoveredSegment.includes("Met")
                      ? "#0284c7"
                      : hoveredSegment.includes("Target")
                      ? "#10b981"
                      : "#ef4444",
                  }}
                />
                <span>{hoveredSegment}</span>
              </div>
            </div>
          )}

          {/* SVG Donut Chart */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 170 170">
            {/* Background track circle */}
            <circle
              cx="85"
              cy="85"
              r={radius}
              fill="transparent"
              stroke={isDarkMode ? "#0d182e" : "#f1f5f9"}
              strokeWidth={strokeWidth}
            />

            {/* Blue Segment - SLA Met */}
            <circle
              cx="85"
              cy="85"
              r={radius}
              fill="transparent"
              stroke="#0284c7"
              strokeWidth={strokeWidth}
              strokeDasharray={`${blueDash} ${circumference - blueDash}`}
              strokeDashoffset="0"
              className="transition-all duration-300 ease-out cursor-pointer hover:opacity-95 hover:stroke-[26]"
              onMouseEnter={(e) => {
                setHoveredSegment("SLA Met: 76.8K (76%)");
                handleMouseMove(e);
              }}
              onMouseLeave={() => {
                setHoveredSegment(null);
                setMousePos(null);
              }}
            />

            {/* Red Segment - Breached */}
            <circle
              cx="85"
              cy="85"
              r={radius}
              fill="transparent"
              stroke="#ef4444"
              strokeWidth={strokeWidth}
              strokeDasharray={`${redDash} ${circumference - redDash}`}
              strokeDashoffset={-blueDash}
              className="transition-all duration-300 ease-out cursor-pointer hover:opacity-95 hover:stroke-[26]"
              onMouseEnter={(e) => {
                setHoveredSegment("Breached: 9.1K (9%)");
                handleMouseMove(e);
              }}
              onMouseLeave={() => {
                setHoveredSegment(null);
                setMousePos(null);
              }}
            />

            {/* Green Segment - On Target */}
            <circle
              cx="85"
              cy="85"
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth={strokeWidth}
              strokeDasharray={`${greenDash} ${circumference - greenDash}`}
              strokeDashoffset={-(blueDash + redDash)}
              className="transition-all duration-300 ease-out cursor-pointer hover:opacity-95 hover:stroke-[26]"
              onMouseEnter={(e) => {
                setHoveredSegment("On Target: 15.2K (15%)");
                handleMouseMove(e);
              }}
              onMouseLeave={() => {
                setHoveredSegment(null);
                setMousePos(null);
              }}
            />
          </svg>

          {/* Center Text (Permanently fixed inside circle) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white leading-tight">
              101.1K
            </span>
            <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-400 tracking-wider uppercase mt-1">
              TOTAL CASES
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
