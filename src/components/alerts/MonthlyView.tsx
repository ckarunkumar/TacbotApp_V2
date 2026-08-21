"use client";

import React, { useState } from "react";
import { AlertEvent } from "./types";

interface MonthlyViewProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onDrillToDay?: (date: Date) => void;
  events: AlertEvent[];
}

interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
  dayNum: string;
  dateStr: string;
}

// A rendered segment for a spanning (or single) event in one week row
interface EventSegment {
  event: AlertEvent;
  startCol: number; // 0-6
  spanCols: number; // how many columns it spans this week
  isStart: boolean; // first week of this event
  isEnd: boolean;   // last week of this event
  row: number;      // which visual slot row (0, 1, 2...)
}

export default function MonthlyView({
  currentDate,
  selectedDate,
  onSelectDate,
  onDrillToDay,
  events,
}: MonthlyViewProps) {
  const [popoverDay, setPopoverDay] = useState<{
    dateStr: string;
    events: AlertEvent[];
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const weekdays = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];

  // ── Build 6×7 day grid (Mon-Sun) ─────────────────────────────────────────
  const buildWeeks = (): DayCell[][] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Mon=0 … Sun=6
    let dow = firstDay.getDay() - 1;
    if (dow === -1) dow = 6;

    const all: DayCell[] = [];

    // Prev-month fill
    const prevLast = new Date(year, month, 0).getDate();
    for (let i = dow - 1; i >= 0; i--) {
      const day = prevLast - i;
      const d = new Date(year, month - 1, day);
      all.push({
        date: d,
        isCurrentMonth: false,
        dayNum: String(day).padStart(2, "0"),
        dateStr: fmt(d),
      });
    }

    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      all.push({
        date: d,
        isCurrentMonth: true,
        dayNum: String(i).padStart(2, "0"),
        dateStr: fmt(d),
      });
    }

    // Next-month fill
    const rem = 42 - all.length;
    for (let i = 1; i <= rem; i++) {
      const d = new Date(year, month + 1, i);
      all.push({
        date: d,
        isCurrentMonth: false,
        dayNum: String(i).padStart(2, "0"),
        dateStr: fmt(d),
      });
    }

    const weeks: DayCell[][] = [];
    for (let i = 0; i < 42; i += 7) weeks.push(all.slice(i, i + 7));
    return weeks;
  };

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const weeks = buildWeeks();

  // ── Layout engine: assign row slots per week ──────────────────────────────
  // For each week row we compute: segments[] with a row slot, and per-day overflow counts
  const layoutWeek = (
    week: DayCell[],
    weekIdx: number
  ): {
    segments: EventSegment[];
    overflowByCol: number[]; // how many events are hidden per column
    visibleByCol: number[];  // how many event rows are used per column (for mt offset)
  } => {
    const weekStart = week[0].dateStr;
    const weekEnd = week[6].dateStr;

    // Collect all events that overlap this week
    const overlapping = events.filter(
      (e) => e.endDate >= weekStart && e.startDate <= weekEnd
    );

    const MAX_ROWS = 2; // max event rows before "+N more"

    // slot occupancy: slot[col][row] = true means occupied
    const occupied: boolean[][] = Array.from({ length: 7 }, () =>
      Array(MAX_ROWS + 5).fill(false)
    );

    const segments: EventSegment[] = [];

    // Sort: multi-day first (by duration desc), then single-day
    const sorted = [...overlapping].sort((a, b) => {
      const durA = dateDiff(a.startDate, a.endDate);
      const durB = dateDiff(b.startDate, b.endDate);
      return durB - durA;
    });

    for (const evt of sorted) {
      // Clamp to this week
      const segStart = evt.startDate > weekStart ? evt.startDate : weekStart;
      const segEnd = evt.endDate < weekEnd ? evt.endDate : weekEnd;

      const startCol = week.findIndex((d) => d.dateStr === segStart);
      const endCol = week.findIndex((d) => d.dateStr === segEnd);
      if (startCol === -1 || endCol === -1) continue;

      const spanCols = endCol - startCol + 1;

      // Find the lowest row that is free across all spanned columns
      let row = -1;
      for (let r = 0; r < MAX_ROWS + 5; r++) {
        const allFree = Array.from(
          { length: spanCols },
          (_, k) => !occupied[startCol + k][r]
        ).every(Boolean);
        if (allFree) {
          row = r;
          break;
        }
      }
      if (row === -1) row = MAX_ROWS + 1; // overflow

      // Mark occupied
      for (let c = startCol; c <= endCol; c++) {
        occupied[c][row] = true;
      }

      segments.push({
        event: evt,
        startCol,
        spanCols,
        isStart: evt.startDate >= weekStart,
        isEnd: evt.endDate <= weekEnd,
        row,
      });
    }

    // Compute per-column overflow (rows >= MAX_ROWS) and visible used rows
    const overflowByCol = Array(7).fill(0);
    const visibleByCol = Array(7).fill(0);

    for (const seg of segments) {
      for (let c = seg.startCol; c < seg.startCol + seg.spanCols; c++) {
        if (seg.row >= MAX_ROWS) {
          overflowByCol[c]++;
        } else {
          visibleByCol[c] = Math.max(visibleByCol[c], seg.row + 1);
        }
      }
    }

    return { segments, overflowByCol, visibleByCol };
  };

  const dateDiff = (a: string, b: string) => {
    const da = new Date(a).getTime();
    const db = new Date(b).getTime();
    return Math.abs(db - da) / 86400000;
  };

  // ── Pill / bar styles ─────────────────────────────────────────────────────
  const getStyle = (category: string) => {
    switch (category) {
      case "lifecycle":
        return {
          bg: "bg-[#DCFCE7] dark:bg-[#064E3B]/70",
          border: "border-[#86EFAC] dark:border-[#047857]",
          text: "text-[#15803D] dark:text-[#86EFAC]",
          dot: "#16A34A",
        };
      case "bug":
        return {
          bg: "bg-[#FEE2E2] dark:bg-[#450A0A]/70",
          border: "border-[#FCA5A5] dark:border-[#7F1D1D]",
          text: "text-[#B91C1C] dark:text-[#FCA5A5]",
          dot: "#DC2626",
        };
      case "maintenance":
        return {
          bg: "bg-[#FEF3C7] dark:bg-[#451A03]/70",
          border: "border-[#FDE68A] dark:border-[#78350F]",
          text: "text-[#B45309] dark:text-[#FDE68A]",
          dot: "#D97706",
        };
      case "software_release":
        return {
          bg: "bg-[#EDE9FE] dark:bg-[#2E1065]/70",
          border: "border-[#DDD6FE] dark:border-[#5B21B6]",
          text: "text-[#6D28D9] dark:text-[#C4B5FD]",
          dot: "#7C3AED",
        };
      default:
        return {
          bg: "bg-[#E0E7FF] dark:bg-[#1E1B4B]/70",
          border: "border-[#C7D2FE] dark:border-[#3730A3]",
          text: "text-[#4338CA] dark:text-[#A5B4FC]",
          dot: "#4F46E5",
        };
    }
  };

  const ROW_H = 18;     // px height of each event bar
  const ROW_GAP = 2;    // px gap between rows
  const DAY_NUM_H = 20; // px reserved for day number at top

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#081024] select-none overflow-hidden relative">
      {/* Weekday Header Row */}
      <div className="grid grid-cols-7 border-b border-[#EAEEF3] dark:border-[#162444] shrink-0">
        {weekdays.map((day) => (
          <div
            key={day}
            className="py-1.5 text-center text-xs font-semibold text-[#576B81] dark:text-slate-400 border-r border-[#EAEEF3] dark:border-[#162444] last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 6-Week Calendar Grid */}
      <div className="flex-1 grid grid-rows-6 min-h-0">
        {weeks.map((week, weekIdx) => {
          const { segments, overflowByCol, visibleByCol } = layoutWeek(week, weekIdx);

          return (
            <div
              key={weekIdx}
              className="relative grid grid-cols-7 border-b border-[#EAEEF3] dark:border-[#162444] last:border-b-0 min-h-0"
              style={{ minHeight: "80px" }}
            >
              {/* ── Day Cells ── */}
              {week.map((dayItem, colIdx) => {
                const isSelected =
                  dayItem.date.getFullYear() === selectedDate.getFullYear() &&
                  dayItem.date.getMonth() === selectedDate.getMonth() &&
                  dayItem.date.getDate() === selectedDate.getDate();

                const usedRows = visibleByCol[colIdx]; // how many event rows are rendered above
                const overflow = overflowByCol[colIdx];

                // Top offset for "+N more" label
                const moreTopPx =
                  DAY_NUM_H + usedRows * (ROW_H + ROW_GAP) + 2;

                return (
                  <div
                    key={colIdx}
                    onClick={() => onSelectDate(dayItem.date)}
                    onDoubleClick={() => onDrillToDay?.(dayItem.date)}
                    className={`relative border-r border-[#EAEEF3] dark:border-[#162444] last:border-r-0 flex flex-col transition-colors cursor-pointer ${
                      !dayItem.isCurrentMonth
                        ? "bg-[#F9FBFF]/60 dark:bg-[#070D18]/60"
                        : "bg-white dark:bg-[#081024] hover:bg-[#F9FBFF] dark:hover:bg-[#0c162e]"
                    } ${
                      isSelected
                        ? "ring-2 ring-inset ring-[#2F6ADB]/50 bg-[#ECF3FF]/40 dark:bg-blue-900/20"
                        : ""
                    }`}
                  >
                    {/* Day Number */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDate(dayItem.date);
                        onDrillToDay?.(dayItem.date);
                      }}
                      style={{ height: `${DAY_NUM_H}px` }}
                      className={`text-[11px] font-medium leading-none text-left px-1 pt-1 w-full transition-colors cursor-pointer hover:font-bold ${
                        !dayItem.isCurrentMonth
                          ? "text-[#B3C1D0] dark:text-slate-600"
                          : "text-[#576B81] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-white"
                      }`}
                      title="View Day"
                    >
                      {dayItem.dayNum}
                    </button>

                    {/* "+N More" overflow link */}
                    {overflow > 0 && (
                      <button
                        type="button"
                        style={{ top: `${moreTopPx}px` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Collect all events on this day
                          const allEvts = events.filter(
                            (ev) =>
                              dayItem.dateStr >= ev.startDate &&
                              dayItem.dateStr <= ev.endDate
                          );
                          setPopoverDay({ dateStr: dayItem.dateStr, events: allEvts });
                        }}
                        className="absolute left-1 right-1 text-[10px] font-semibold text-[#2F6ADB] dark:text-blue-400 hover:underline cursor-pointer text-left px-1 z-20"
                      >
                        +{overflow} more
                      </button>
                    )}
                  </div>
                );
              })}

              {/* ── Spanning Event Bars (absolute overlay) ── */}
              {segments
                .filter((seg) => seg.row < 2) // only render visible rows (0, 1)
                .map((seg, sIdx) => {
                  const style = getStyle(seg.event.category);
                  const topPx = DAY_NUM_H + seg.row * (ROW_H + ROW_GAP);
                  const leftCalc = `calc((100% / 7) * ${seg.startCol} + 2px)`;
                  const widthCalc = `calc((100% / 7) * ${seg.spanCols} - 4px)`;

                  const isMultiDay = seg.event.startDate !== seg.event.endDate;
                  const borderRadius = isMultiDay
                    ? `${seg.isStart ? "4px" : "0"} ${seg.isEnd ? "4px" : "0"} ${seg.isEnd ? "4px" : "0"} ${seg.isStart ? "4px" : "0"}`
                    : "4px";

                  return (
                    <div
                      key={`${seg.event.id}-${weekIdx}-${sIdx}`}
                      style={{
                        position: "absolute",
                        top: `${topPx}px`,
                        left: leftCalc,
                        width: widthCalc,
                        height: `${ROW_H}px`,
                        borderRadius,
                        zIndex: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Clicking a spanning bar selects the start date
                        const d = new Date(seg.event.startDate + "T00:00:00");
                        onSelectDate(d);
                      }}
                      className={`flex items-center gap-1 px-1.5 border text-[10px] font-medium shadow-2xs cursor-pointer hover:opacity-90 transition-opacity overflow-hidden ${style.bg} ${style.border} ${style.text}`}
                      title={`${seg.event.title} — ${seg.event.startDate} → ${seg.event.endDate}`}
                    >
                      {seg.isStart && (
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: style.dot }}
                        />
                      )}
                      {/* Only show text if wide enough (>=2 cols or start) */}
                      {(seg.spanCols >= 2 || seg.isStart) && (
                        <span className="truncate leading-tight">
                          {seg.event.title}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>

      {/* "+N More" Popover */}
      {popoverDay && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={() => setPopoverDay(null)}
        >
          <div
            className="w-80 bg-white dark:bg-[#081024] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] shadow-2xl p-4 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAEEF3] dark:border-[#162444] pb-2">
              <h4 className="text-xs font-semibold text-[#2C3746] dark:text-slate-100">
                All alerts on {popoverDay.dateStr}
              </h4>
              <button
                type="button"
                onClick={() => setPopoverDay(null)}
                className="text-[#7790A9] hover:text-[#2C3746] dark:hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto overlay-scroll">
              {popoverDay.events.map((evt) => {
                const s = getStyle(evt.category);
                return (
                  <div
                    key={evt.id}
                    className={`p-2 rounded-[4px] border text-xs ${s.bg} ${s.border} ${s.text} flex flex-col gap-1 cursor-pointer hover:opacity-90`}
                    onClick={() => {
                      const d = new Date(evt.startDate + "T00:00:00");
                      onSelectDate(d);
                      setPopoverDay(null);
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold flex items-center gap-1.5 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: s.dot }}
                        />
                        <span className="truncate">{evt.title}</span>
                      </span>
                      <span className="text-[10px] opacity-80 shrink-0">
                        {evt.timeRangeText || evt.startTime}
                      </span>
                    </div>
                    <div className="text-[10px] opacity-80">
                      {evt.incidentId} • {evt.tag}
                    </div>
                    {evt.startDate !== evt.endDate && (
                      <div className="text-[10px] opacity-70">
                        {evt.startDate} → {evt.endDate}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
