"use client";

import React, { useId, useState } from "react";
import { Info, ArrowUp } from "lucide-react";
import Tooltip from "@/components/Tooltip";
import Badge from "@/components/Badge";
import { useDashboard } from "@/context/DashboardContext";

export default function TotalCasesCard() {
  const { isDarkMode } = useDashboard();
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const gradientId = useId();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const yTicks = ["60K", "50K", "40K", "30K", "20K", "10K"];

  const seriesSolid = [16, 19, 23, 20, 33, 53, 44, 48, 50, 52, 55, 56];
  const seriesDashed = [13, 16, 18, 17, 26, 42, 35, 38, 41, 43, 45, 46];

  const accentColor = isDarkMode ? "#38bdf8" : "#002E5D";
  const mutedColor = isDarkMode ? "#64748b" : "#94a3b8";

  const svgWidth = 320;
  const svgHeight = 110;
  const paddingLeft = 8;
  const paddingRight = 8;
  const paddingTop = 8;
  const paddingBottom = 16;
  const baselineY = svgHeight - paddingBottom;

  const getCoordinates = (values: number[]) => {
    const usableWidth = svgWidth - paddingLeft - paddingRight;
    const usableHeight = svgHeight - paddingTop - paddingBottom;
    const stepX = usableWidth / (values.length - 1);

    return values.map((val, idx) => {
      const x = paddingLeft + idx * stepX;
      const ratio = (val - 10) / (60 - 10);
      const y = svgHeight - paddingBottom - ratio * usableHeight;
      return { x, y, val };
    });
  };

  const solidPoints = getCoordinates(seriesSolid);
  const dashedPoints = getCoordinates(seriesDashed);

  const createSplinePath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? i : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const solidPath = createSplinePath(solidPoints);
  const dashedPath = createSplinePath(dashedPoints);
  const solidAreaPath = `${solidPath} L ${solidPoints[solidPoints.length - 1].x},${baselineY} L ${solidPoints[0].x},${baselineY} Z`;

  const lastSolid = solidPoints[solidPoints.length - 1];

  return (
    <div className="bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] p-4 shadow-xs flex flex-col justify-between h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-white tracking-tight">Total Cases</h3>
        <Tooltip content="Monthly historical and forecasted case resolution volume trend" position="bottom">
          <button
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            aria-label="Total Cases Information"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>

      {/* Main Metric */}
      <div className="flex items-center gap-2 mb-1 shrink-0">
        <span className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">101.1K</span>
        <Badge variant="success">
          <ArrowUp className="w-3 h-3" />
          <span>8%</span>
        </Badge>
      </div>

      {/* Legend — two series, so identity gets both a swatch and a line-style cue, never color alone */}
      <div className="flex items-center gap-3 mb-2 shrink-0 text-[9px] font-medium text-slate-500 dark:text-slate-400 select-none">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: accentColor }} />
          Actual
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-3 h-0.5 rounded-full"
            style={{
              backgroundImage: `repeating-linear-gradient(to right, ${mutedColor} 0 3px, transparent 3px 5px)`,
            }}
          />
          Projected
        </span>
      </div>

      {/* Auto-Expanding Dynamic Chart Section */}
      <div className="flex-1 w-full min-h-[140px] flex">
        {/* Y Axis */}
        <div className="flex flex-col justify-between h-full pr-2 text-[9px] font-medium text-slate-400 dark:text-slate-500 select-none pb-6 text-right w-8 shrink-0">
          {yTicks.map((tick) => (
            <span key={tick} className="leading-none">
              {tick}
            </span>
          ))}
        </div>

        {/* SVG Plot */}
        <div className="flex-1 relative flex flex-col justify-between h-full">
          {/* Horizontal gridlines — hairline, recessive */}
          <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none">
            {yTicks.map((tick) => (
              <div key={tick} className="w-full border-b border-slate-100 dark:border-[#14223d] h-0" />
            ))}
          </div>

          {/* SVG curves auto-growing */}
          <div className="relative flex-1 w-full min-h-[80px]">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.16" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area wash under the primary series — ~10-15% opacity, never a solid block */}
              <path d={solidAreaPath} fill={`url(#${gradientId})`} stroke="none" />

              {/* Dashed secondary line — muted, de-emphasized */}
              <path
                d={dashedPath}
                fill="none"
                stroke={mutedColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1 5"
              />

              {/* Solid primary line */}
              <path
                d={solidPath}
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Crosshair on hover */}
              {hoveredMonth !== null && (
                <line
                  x1={solidPoints[hoveredMonth].x}
                  y1={paddingTop}
                  x2={solidPoints[hoveredMonth].x}
                  y2={baselineY}
                  stroke={mutedColor}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  className="opacity-60"
                />
              )}
            </svg>

            {/* Point markers rendered as HTML dots (not SVG circles) positioned by
                percentage — the SVG above uses preserveAspectRatio="none" so it can
                stretch to fill the container, but that scales x/y independently and
                turns <circle> elements into ellipses. Plain CSS circles sidestep that. */}

            {/* End-of-line marker — the only always-visible dot per series, ≥8px with a surface ring */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${(lastSolid.x / svgWidth) * 100}%`,
                top: `${(lastSolid.y / svgHeight) * 100}%`,
                width: 8,
                height: 8,
                transform: "translate(-50%, -50%)",
                backgroundColor: accentColor,
                boxShadow: `0 0 0 2px ${isDarkMode ? "#091122" : "#ffffff"}`,
              }}
            />

            {/* Direct end-label — value at the end, in text ink (never the series color) */}
            <div
              className="absolute text-[10px] font-semibold text-slate-700 dark:text-slate-200 pointer-events-none whitespace-nowrap"
              style={{
                left: `${(lastSolid.x / svgWidth) * 100}%`,
                top: `${(lastSolid.y / svgHeight) * 100}%`,
                transform: "translate(-100%, -170%)",
              }}
            >
              {seriesSolid[seriesSolid.length - 1]}K
            </div>

            {/* Hover dot — only the hovered point renders, not every point */}
            {hoveredMonth !== null && (
              <div
                className="absolute rounded-full pointer-events-none transition-all duration-100"
                style={{
                  left: `${(solidPoints[hoveredMonth].x / svgWidth) * 100}%`,
                  top: `${(solidPoints[hoveredMonth].y / svgHeight) * 100}%`,
                  width: 9,
                  height: 9,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#ffffff",
                  border: `2.5px solid ${accentColor}`,
                  boxShadow: `0 0 0 2px ${isDarkMode ? "#091122" : "#ffffff"}`,
                }}
              />
            )}

            {/* Invisible per-month hover hit-columns — bigger than the marks themselves */}
            <div className="absolute inset-0 flex">
              {months.map((m, idx) => (
                <div
                  key={m}
                  className="flex-1 h-full cursor-pointer"
                  onMouseEnter={() => setHoveredMonth(idx)}
                  onMouseLeave={() => setHoveredMonth(null)}
                />
              ))}
            </div>

            {/* Hover Tooltip for Spline points */}
            {hoveredMonth !== null && (
              <div
                className="absolute z-20 bg-[#182235] dark:bg-[#060b17] text-white text-[10px] py-1 px-2 rounded-[8px] shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2 animate-in fade-in zoom-in-95"
                style={{
                  left: `${(hoveredMonth / 11) * 100}%`,
                  top: `${solidPoints[hoveredMonth].y}px`,
                }}
              >
                <div className="font-semibold text-center">{months[hoveredMonth]}</div>
                <div className="text-[9px] font-medium whitespace-nowrap flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                  Actual: {seriesSolid[hoveredMonth]}K
                </div>
                <div className="text-[9px] text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: mutedColor }} />
                  Projected: {seriesDashed[hoveredMonth]}K
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-t-[4px] border-t-[#182235] dark:border-t-[#060b17] border-x-[4px] border-x-transparent" />
              </div>
            )}
          </div>

          {/* X Axis Labels */}
          <div className="flex items-center justify-between pt-1 border-t border-[#EAEEF3] dark:border-[#162444] text-[9px] font-medium text-slate-500 dark:text-slate-400 select-none shrink-0">
            {months.map((m, idx) => (
              <span
                key={m}
                className={`transition-colors text-center flex-1 ${
                  hoveredMonth === idx ? "text-[#002E5D] dark:text-[#38bdf8] font-bold" : ""
                }`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
