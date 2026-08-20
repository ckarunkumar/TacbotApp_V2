"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Check,
  X,
  RotateCcw,
} from "lucide-react";

export interface DateRange {
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
}

export interface DateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

const PRESETS = [
  { label: "Today", days: 0 },
  { label: "Yesterday", days: 1, offset: 1 },
  { label: "Last 7 Days", days: 7 },
  { label: "Last 14 Days", days: 14 },
  { label: "Last 30 Days", days: 30 },
  { label: "This Month", type: "thisMonth" },
  { label: "Last Month", type: "lastMonth" },
  { label: "All Time (2020 Data)", customStart: "2020-11-01", customEnd: "2020-11-30" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDate(str: string): Date {
  if (!str) return new Date();
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DateRangePicker({
  isOpen,
  onClose,
  value = { startDate: "2020-11-08", endDate: "2020-11-08" },
  onChange,
}: DateRangePickerProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  const [tempStart, setTempStart] = useState<string>(value.startDate || "2020-11-08");
  const [tempEnd, setTempEnd] = useState<string>(value.endDate || "2020-11-08");
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string>("Today");

  // Base month view (Left calendar view)
  const initialDate = parseDate(value.startDate || "2020-11-08");
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

  useEffect(() => {
    if (isOpen) {
      setTempStart(value.startDate || "2020-11-08");
      setTempEnd(value.endDate || "2020-11-08");
      const d = parseDate(value.startDate || "2020-11-08");
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [isOpen, value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Month 2 is next month
  const month2Year = viewMonth === 11 ? viewYear + 1 : viewYear;
  const month2Month = viewMonth === 11 ? 0 : viewMonth + 1;

  const handleDateClick = (dateStr: string) => {
    if (!tempStart || (tempStart && tempEnd && tempStart !== tempEnd)) {
      // Starting new range
      setTempStart(dateStr);
      setTempEnd("");
      setActivePreset("Custom");
    } else if (tempStart && !tempEnd) {
      // Completing range
      if (dateStr < tempStart) {
        setTempEnd(tempStart);
        setTempStart(dateStr);
      } else {
        setTempEnd(dateStr);
      }
      setActivePreset("Custom");
    } else {
      setTempStart(dateStr);
      setTempEnd(dateStr);
    }
  };

  const handlePresetSelect = (preset: typeof PRESETS[number]) => {
    setActivePreset(preset.label);
    const refDate = parseDate("2020-11-08"); // Benchmark reference date

    if (preset.customStart && preset.customEnd) {
      setTempStart(preset.customStart);
      setTempEnd(preset.customEnd);
      const d = parseDate(preset.customStart);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
      return;
    }

    if (preset.type === "thisMonth") {
      const start = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
      const end = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0);
      setTempStart(formatDate(start));
      setTempEnd(formatDate(end));
      setViewYear(refDate.getFullYear());
      setViewMonth(refDate.getMonth());
      return;
    }

    if (preset.type === "lastMonth") {
      const start = new Date(refDate.getFullYear(), refDate.getMonth() - 1, 1);
      const end = new Date(refDate.getFullYear(), refDate.getMonth(), 0);
      setTempStart(formatDate(start));
      setTempEnd(formatDate(end));
      setViewYear(start.getFullYear());
      setViewMonth(start.getMonth());
      return;
    }

    if (preset.offset) {
      const d = new Date(refDate);
      d.setDate(d.getDate() - preset.offset);
      const str = formatDate(d);
      setTempStart(str);
      setTempEnd(str);
      return;
    }

    if (preset.days === 0) {
      const str = formatDate(refDate);
      setTempStart(str);
      setTempEnd(str);
      return;
    }

    const days = preset.days ?? 7;
    const end = new Date(refDate);
    const start = new Date(refDate);
    start.setDate(start.getDate() - (days - 1));
    setTempStart(formatDate(start));
    setTempEnd(formatDate(end));
    setViewYear(start.getFullYear());
    setViewMonth(start.getMonth());
  };

  const handleApply = () => {
    const finalStart = tempStart || "2020-11-08";
    const finalEnd = tempEnd || finalStart;
    if (onChange) {
      onChange({ startDate: finalStart, endDate: finalEnd });
    }
    onClose();
  };

  const handleReset = () => {
    setTempStart("2020-11-08");
    setTempEnd("2020-11-08");
    setActivePreset("Today");
    setViewYear(2020);
    setViewMonth(10); // November
  };

  // Render Calendar Grid for Year & Month
  const renderCalendarMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      days.push({
        dayNum,
        isCurrentMonth: false,
        dateStr: formatDate(new Date(year, month - 1, dayNum)),
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        dayNum: d,
        isCurrentMonth: true,
        dateStr: formatDate(new Date(year, month, d)),
      });
    }

    // Next month padding to fill 42 cells (6 rows x 7 cols)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        dayNum: d,
        isCurrentMonth: false,
        dateStr: formatDate(new Date(year, month + 1, d)),
      });
    }

    return (
      <div className="flex flex-col gap-1 w-56">
        <div className="text-xs font-bold text-[#002E5D] dark:text-sky-300 text-center py-1">
          {MONTH_NAMES[month]} {year}
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-[#7790A9] dark:text-slate-400 py-0.5">
          {DAYS_OF_WEEK.map((dw) => (
            <div key={dw} className="h-6 flex items-center justify-center">
              {dw}
            </div>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {days.map(({ dayNum, isCurrentMonth, dateStr }, index) => {
            const isStart = tempStart === dateStr;
            const isEnd = tempEnd === dateStr;
            const isHoverTarget = hoverDate === dateStr;

            // In between range
            const effectiveEnd = tempEnd || hoverDate || tempStart;
            const inRange =
              tempStart &&
              effectiveEnd &&
              ((dateStr > tempStart && dateStr < effectiveEnd) ||
                (dateStr < tempStart && dateStr > effectiveEnd));

            return (
              <button
                key={`${dateStr}-${index}`}
                type="button"
                onClick={() => handleDateClick(dateStr)}
                onMouseEnter={() => !tempEnd && setHoverDate(dateStr)}
                onMouseLeave={() => setHoverDate(null)}
                className={`h-7 text-xs font-medium transition-all relative flex items-center justify-center cursor-pointer ${
                  !isCurrentMonth ? "opacity-30 text-slate-400" : ""
                } ${
                  isStart && isEnd
                    ? "bg-[#002E5D] dark:bg-[#2F6ADB] text-white rounded-[4px] font-bold z-10 shadow-2xs"
                    : isStart
                    ? "bg-[#002E5D] dark:bg-[#2F6ADB] text-white rounded-l-[4px] font-bold z-10 shadow-2xs"
                    : isEnd
                    ? "bg-[#002E5D] dark:bg-[#2F6ADB] text-white rounded-r-[4px] font-bold z-10 shadow-2xs"
                    : inRange
                    ? "bg-[#ECF3FF] dark:bg-[#16294d] text-[#002E5D] dark:text-sky-300 rounded-none font-medium"
                    : isHoverTarget && !tempEnd
                    ? "bg-blue-100 dark:bg-blue-900/40 text-[#002E5D] dark:text-white rounded-[4px]"
                    : "text-[#2C3746] dark:text-slate-200 hover:bg-[#F2F4F6] dark:hover:bg-[#162444] rounded-[4px]"
                }`}
              >
                <span>{dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 select-none w-auto max-w-[95vw]"
    >
      {/* Main Pickers Area */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-[#EAEEF3] dark:divide-[#162444]">
        {/* Left: Quick Presets */}
        <div className="w-full sm:w-44 p-2 bg-[#F9FBFF] dark:bg-[#081024] flex flex-col gap-0.5">
          <div className="px-2 py-1 text-[10px] font-bold text-[#7790A9] dark:text-slate-400 uppercase tracking-wider">
            Quick Ranges
          </div>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handlePresetSelect(p)}
              className={`w-full px-2.5 py-1.5 rounded-[4px] text-xs font-medium text-left transition-colors flex items-center justify-between cursor-pointer ${
                activePreset === p.label
                  ? "bg-[#ECF3FF] dark:bg-[#16294d] text-[#002E5D] dark:text-sky-300 font-semibold shadow-2xs"
                  : "text-[#576B81] dark:text-slate-300 hover:bg-[#F2F4F6] dark:hover:bg-[#0e1b38] hover:text-[#002E5D] dark:hover:text-white"
              }`}
            >
              <span>{p.label}</span>
              {activePreset === p.label && <Check className="w-3.5 h-3.5 text-[#002E5D] dark:text-sky-300" />}
            </button>
          ))}
        </div>

        {/* Right: Dual Month Calendar View */}
        <div className="p-3 flex flex-col gap-3">
          {/* Top Month Navigators */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] text-[#576B81] dark:text-slate-300 hover:bg-[#F2F4F6] dark:hover:bg-[#16294d] flex items-center justify-center cursor-pointer transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="text-xs font-semibold text-[#002E5D] dark:text-sky-300 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-[#2F6ADB] dark:text-sky-400" />
              <span>Select Date Range</span>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] text-[#576B81] dark:text-slate-300 hover:bg-[#F2F4F6] dark:hover:bg-[#16294d] flex items-center justify-center cursor-pointer transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dual Calendars */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {renderCalendarMonth(viewYear, viewMonth)}
            <div className="hidden md:block w-px h-64 bg-[#EAEEF3] dark:bg-[#162444]" />
            <div className="hidden md:block">
              {renderCalendarMonth(month2Year, month2Month)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Inputs & Actions */}
      <div className="px-3 py-2 bg-[#F9FBFF] dark:bg-[#081024] border-t border-[#EAEEF3] dark:border-[#162444] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#7790A9] dark:text-slate-400">Start:</span>
            <input
              type="text"
              value={tempStart}
              onChange={(e) => setTempStart(e.target.value)}
              className="w-24 px-2 py-1 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#0e1b38] text-xs font-mono text-[#2C3746] dark:text-slate-100 focus:outline-hidden focus:border-[#2F6ADB]"
              placeholder="YYYY-MM-DD"
            />
          </div>
          <span className="text-[#7790A9] dark:text-slate-500 font-bold">&rarr;</span>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#7790A9] dark:text-slate-400">End:</span>
            <input
              type="text"
              value={tempEnd || tempStart}
              onChange={(e) => setTempEnd(e.target.value)}
              className="w-24 px-2 py-1 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#0e1b38] text-xs font-mono text-[#2C3746] dark:text-slate-100 focus:outline-hidden focus:border-[#2F6ADB]"
              placeholder="YYYY-MM-DD"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] text-[#576B81] dark:text-slate-300 text-xs font-medium hover:bg-[#F2F4F6] dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset to default benchmark range"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-[4px] text-xs text-[#576B81] dark:text-slate-400 hover:bg-[#F2F4F6] dark:hover:bg-slate-800 font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-1 rounded-[4px] bg-[#002E5D] dark:bg-[#2F6ADB] hover:bg-[#003D7A] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Apply Range
          </button>
        </div>
      </div>
    </div>
  );
}
