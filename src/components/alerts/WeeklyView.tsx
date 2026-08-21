"use client";

import React from "react";
import { AlertEvent } from "./types";

interface WeeklyViewProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onDrillToDay?: (date: Date) => void;
  events: AlertEvent[];
}

export default function WeeklyView({
  currentDate,
  selectedDate,
  onSelectDate,
  onDrillToDay,
  events,
}: WeeklyViewProps) {
  // Hours to show in timeline: 08:00 to 19:00
  const hours = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  // Helper to get Monday of the selected date's week
  const getWeekDays = () => {
    const d = new Date(selectedDate);
    const dayOfWeek = d.getDay(); // 0 is Sun, 1 is Mon...
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(d.setDate(diff));

    const weekDays: { name: string; dayNum: number; date: Date; dateStr: string }[] = [];
    const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const dateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, "0")}-${String(dayDate.getDate()).padStart(2, "0")}`;
      weekDays.push({
        name: names[i],
        dayNum: dayDate.getDate(),
        date: dayDate,
        dateStr,
      });
    }
    return weekDays;
  };

  const weekDays = getWeekDays();

  // Helper to calculate top and height in percentage based on 08:00 start and 12-hour span (08:00 to 20:00)
  const calculatePosition = (startTimeStr: string, endTimeStr: string) => {
    const parseTimeToHours = (str: string) => {
      const [h, m] = str.split(":").map(Number);
      return h + m / 60;
    };

    const start = parseTimeToHours(startTimeStr);
    const end = parseTimeToHours(endTimeStr);

    const baseHour = 8; // 08:00
    const totalHours = 12; // 08:00 to 20:00 (12 hours)

    const topPercent = Math.max(0, ((start - baseHour) / totalHours) * 100);
    const durationHours = Math.max(0.5, end - start);
    const heightPercent = (durationHours / totalHours) * 100;

    return { top: `${topPercent}%`, height: `${heightPercent}%` };
  };

  const getBlockStyle = (category: string) => {
    switch (category) {
      case "lifecycle":
        return "bg-[#DCFCE7]/90 dark:bg-[#064E3B]/80 border-[#86EFAC] dark:border-[#047857] text-[#15803D] dark:text-[#86EFAC]";
      case "bug":
        return "bg-[#FEE2E2]/90 dark:bg-[#450A0A]/80 border-[#FCA5A5] dark:border-[#7F1D1D] text-[#B91C1C] dark:text-[#FCA5A5]";
      case "maintenance":
        return "bg-[#FEF3C7]/90 dark:bg-[#451A03]/80 border-[#FDE68A] dark:border-[#78350F] text-[#B45309] dark:text-[#FDE68A]";
      case "software_release":
        return "bg-[#C7D2FE]/80 dark:bg-[#2E1065]/80 border-[#A5B4FC] dark:border-[#5B21B6] text-[#3730A3] dark:text-[#C4B5FD]";
      default:
        return "bg-[#E0E7FF]/90 dark:bg-[#1E1B4B]/80 border-[#C7D2FE] dark:border-[#3730A3] text-[#4338CA] dark:text-[#A5B4FC]";
    }
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#081024] select-none overflow-hidden">
      {/* Header Day Column Names */}
      <div className="flex border-b border-[#EAEEF3] dark:border-[#162444] shrink-0">
        {/* Empty space matching left time column */}
        <div className="w-14 sm:w-16 shrink-0 border-r border-[#EAEEF3] dark:border-[#162444]" />

        {/* 7 Days Headers */}
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((wd) => {
            const isSelected = isSameDay(wd.date, selectedDate);
            return (
              <button
                key={wd.dateStr}
                type="button"
                onClick={() => {
                  onSelectDate(wd.date);
                  onDrillToDay?.(wd.date);
                }}
                className={`py-2 text-center text-xs border-r border-[#EAEEF3] dark:border-[#162444] last:border-r-0 transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#ECF3FF] dark:bg-[#16274a] text-[#002E5D] dark:text-blue-300 font-bold"
                    : "text-[#576B81] dark:text-slate-400 hover:bg-[#F9FBFF] dark:hover:bg-[#0c162e] font-medium"
                }`}
                title={`View ${wd.name} ${wd.dayNum}`}
              >
                <span>
                  {wd.name} {wd.dayNum}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Viewport (Hourly scrollable grid) */}
      <div className="flex-1 flex overflow-y-auto no-scrollbar relative min-h-0">
        {/* Left Time Column */}
        <div className="w-14 sm:w-16 shrink-0 border-r border-[#EAEEF3] dark:border-[#162444] flex flex-col">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-16 flex items-start justify-center pt-1 text-[11px] font-medium text-[#7790A9] dark:text-slate-500 border-b border-[#EAEEF3]/60 dark:border-[#162444]/60"
            >
              {hour}
            </div>
          ))}
        </div>

        {/* 7 Days Columns & Event Blocks */}
        <div className="flex-1 grid grid-cols-7 relative">
          {weekDays.map((wd, colIdx) => {
            const isSelected = isSameDay(wd.date, selectedDate);

            // Filter events on this day that have specific startTime/endTime
            const dayEvents = events.filter((e) => {
              return e.startDate === wd.dateStr && e.startTime && e.endTime;
            });

            return (
              <div
                key={wd.dateStr}
                onClick={() => onSelectDate(wd.date)}
                className={`relative border-r border-[#EAEEF3] dark:border-[#162444] last:border-r-0 h-[768px] ${
                  isSelected
                    ? "bg-[#ECF3FF]/40 dark:bg-[#16274a]/20"
                    : "hover:bg-[#F9FBFF]/60 dark:hover:bg-[#0c162e]/40"
                }`}
              >
                {/* Horizontal hour divider lines */}
                {hours.map((_, hIdx) => (
                  <div
                    key={hIdx}
                    className="h-16 border-b border-[#EAEEF3]/60 dark:border-[#162444]/60 pointer-events-none"
                  />
                ))}

                {/* Event Blocks */}
                {dayEvents.map((evt) => {
                  const pos = calculatePosition(evt.startTime!, evt.endTime!);
                  const style = getBlockStyle(evt.category);

                  return (
                    <div
                      key={evt.id}
                      style={{ top: pos.top, height: pos.height }}
                      className={`absolute left-1 right-1 rounded-[4px] border p-1 text-[10px] font-medium shadow-2xs overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] z-10 flex flex-col justify-start ${style}`}
                      title={`${evt.title} (${evt.startTime} - ${evt.endTime})`}
                    >
                      <div className="truncate font-semibold text-[10px]">{evt.title}</div>
                      <div className="text-[9px] opacity-80 truncate">
                        {evt.startTime} - {evt.endTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
