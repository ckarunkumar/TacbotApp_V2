"use client";

import React from "react";
import { AlertEvent } from "./types";
import { AlertCircle, Clock } from "lucide-react";

interface DailyViewProps {
  selectedDate: Date;
  events: AlertEvent[];
}

export default function DailyView({ selectedDate, events }: DailyViewProps) {
  const hours = [
    "00:00",
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
  ];

  const dateStr = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  // Filter events active on this selected day
  const dayEvents = events.filter((e) => {
    return dateStr >= e.startDate && dateStr <= e.endDate;
  });

  const getBlockStyle = (category: string) => {
    switch (category) {
      case "lifecycle":
        return {
          bg: "bg-[#DCFCE7]/90 dark:bg-[#064E3B]/80",
          border: "border-[#86EFAC] dark:border-[#047857]",
          text: "text-[#15803D] dark:text-[#86EFAC]",
          dot: "bg-[#16A34A]",
        };
      case "bug":
        return {
          bg: "bg-[#FEE2E2]/90 dark:bg-[#450A0A]/80",
          border: "border-[#FCA5A5] dark:border-[#7F1D1D]",
          text: "text-[#B91C1C] dark:text-[#FCA5A5]",
          dot: "bg-[#DC2626]",
        };
      case "maintenance":
        return {
          bg: "bg-[#FEF3C7]/90 dark:bg-[#451A03]/80",
          border: "border-[#FDE68A] dark:border-[#78350F]",
          text: "text-[#B45309] dark:text-[#FDE68A]",
          dot: "bg-[#D97706]",
        };
      case "software_release":
        return {
          bg: "bg-[#EDE9FE]/90 dark:bg-[#2E1065]/80",
          border: "border-[#DDD6FE] dark:border-[#5B21B6]",
          text: "text-[#6D28D9] dark:text-[#C4B5FD]",
          dot: "bg-[#7C3AED]",
        };
      default:
        return {
          bg: "bg-[#E0E7FF]/90 dark:bg-[#1E1B4B]/80",
          border: "border-[#C7D2FE] dark:border-[#3730A3]",
          text: "text-[#4338CA] dark:text-[#A5B4FC]",
          dot: "bg-[#4F46E5]",
        };
    }
  };

  // Helper to convert HH:mm to grid offset in pixels (08:00 is base row index 1)
  const getEventStyle = (evt: AlertEvent, index: number) => {
    let topPx = 194; // default 10:00
    let heightPx = 58;

    if (evt.startTime) {
      const [h, m] = evt.startTime.split(":").map(Number);
      if (h === 0) {
        topPx = 2 + (m / 60) * 64;
      } else if (h >= 8 && h <= 18) {
        const hourOffset = h - 8 + 1; // row 0 is 00:00, row 1 is 08:00, row 2 is 09:00, row 3 is 10:00...
        topPx = hourOffset * 64 + (m / 60) * 64 + 2;
      } else {
        topPx = Math.min(index * 68 + 194, 700);
      }
    } else {
      topPx = index * 68 + 194;
    }

    if (evt.startTime && evt.endTime) {
      const [sh, sm] = evt.startTime.split(":").map(Number);
      const [eh, em] = evt.endTime.split(":").map(Number);
      const durationHours = Math.max(0.7, eh + em / 60 - (sh + sm / 60));
      heightPx = Math.min(durationHours * 64 - 4, 180);
    }

    return { top: `${topPx}px`, height: `${heightPx}px` };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#081024] select-none overflow-hidden">
      {/* Scrollable Hourly Day Grid */}
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

        {/* Full-width Day Content Area */}
        <div className="flex-1 relative min-h-[768px]">
          {/* Hourly Background Divider Rows */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-16 border-b border-[#EAEEF3]/60 dark:border-[#162444]/60 hover:bg-[#F9FBFF]/40 dark:hover:bg-[#0c162e]/30 transition-colors"
            />
          ))}

          {/* Render Full-width Alert Event Cards */}
          <div className="absolute inset-0 pointer-events-none p-2">
            {dayEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center text-[#7790A9] dark:text-slate-500 gap-2">
                <Clock className="w-8 h-8 opacity-40" />
                <p className="text-xs font-medium">No alerts scheduled for this day</p>
                <p className="text-[10px] opacity-75">Click another date from the left sidebar to view its timeline</p>
              </div>
            ) : (
              dayEvents.map((evt, idx) => {
                const pos = getEventStyle(evt, idx);
                const style = getBlockStyle(evt.category);

                return (
                  <div
                    key={evt.id}
                    style={{ top: pos.top, height: pos.height }}
                    className={`absolute left-2 right-2 rounded-[4px] border p-2 flex items-center shadow-2xs pointer-events-auto cursor-pointer transition-all hover:scale-[1.005] hover:shadow-xs z-10 ${style.bg} ${style.border} ${style.text}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                        <span className="font-semibold text-xs truncate">{evt.title}</span>
                        <span className="text-[10px] opacity-80 shrink-0">
                          {evt.incidentId} • {evt.tag}
                        </span>
                      </div>
                      <span className="text-[10px] opacity-80 shrink-0 font-medium ml-2">
                        {evt.timeRangeText || `${evt.startTime || "09:00"} - ${evt.endTime || "10:00"}`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
