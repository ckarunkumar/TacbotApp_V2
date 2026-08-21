"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Calendar, AlertCircle } from "lucide-react";
import { AlertEvent } from "./types";

interface AlertsListViewProps {
  events: AlertEvent[];
  selectedDate: Date;
  activeView: string;
}

export default function AlertsListView({
  events,
  selectedDate,
  activeView,
}: AlertsListViewProps) {
  // Format selected date key: YYYY-MM-DD
  const selectedDateKey = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  // Map of open/closed accordion sections by date key
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [selectedDateKey]: true,
  });

  // Whenever selectedDate changes, make sure its section is expanded
  useEffect(() => {
    setOpenSections((prev) => ({
      ...prev,
      [selectedDateKey]: true,
    }));
  }, [selectedDateKey]);

  const toggleSection = (dateKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey] !== undefined ? !prev[dateKey] : false,
    }));
  };

  // Helper to format date header: "Sunday, Aug 2, 2026"
  const formatDateHeader = (dateStr: string) => {
    const parts = dateStr.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);

    const weekdayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${weekdayNames[d.getDay()]}, ${monthShort[month]} ${day}, ${year}`;
  };

  // Group events by date (spanning events grouped under active days)
  const groupedEvents: Record<string, AlertEvent[]> = {};

  events.forEach((evt) => {
    // If single day:
    if (evt.startDate === evt.endDate) {
      if (!groupedEvents[evt.startDate]) groupedEvents[evt.startDate] = [];
      if (!groupedEvents[evt.startDate].some((e) => e.id === evt.id)) {
        groupedEvents[evt.startDate].push(evt);
      }
    } else {
      // Spanning event: include in startDate
      if (!groupedEvents[evt.startDate]) groupedEvents[evt.startDate] = [];
      if (!groupedEvents[evt.startDate].some((e) => e.id === evt.id)) {
        groupedEvents[evt.startDate].push(evt);
      }
      // Also include in selectedDate if selectedDate is within range
      if (selectedDateKey >= evt.startDate && selectedDateKey <= evt.endDate) {
        if (!groupedEvents[selectedDateKey]) groupedEvents[selectedDateKey] = [];
        if (!groupedEvents[selectedDateKey].some((e) => e.id === evt.id)) {
          groupedEvents[selectedDateKey].push(evt);
        }
      }
    }
  });

  // Ensure the selectedDateKey exists in list if in Daily view
  if (!groupedEvents[selectedDateKey]) {
    groupedEvents[selectedDateKey] = [];
  }

  // Sort dates
  const allDateKeys = Object.keys(groupedEvents).sort();

  // In Daily View: show the selected day at the top
  // In other views: show all days sorted, with selected day highlighted
  const displayedDateKeys =
    activeView === "Daily"
      ? [selectedDateKey, ...allDateKeys.filter((k) => k !== selectedDateKey && groupedEvents[k].length > 0)]
      : allDateKeys.filter((k) => groupedEvents[k].length > 0 || k === selectedDateKey);

  // Category badge styles
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case "lifecycle":
        return "bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#059669] dark:text-[#6EE7B7] border-[#A7F3D0] dark:border-[#047857]";
      case "bug":
        return "bg-[#FEF2F2] dark:bg-[#450A0A]/40 text-[#DC2626] dark:text-[#FCA5A5] border-[#FECACA] dark:border-[#7F1D1D]";
      case "maintenance":
        return "bg-[#FFFBEB] dark:bg-[#451A03]/40 text-[#D97706] dark:text-[#FDE68A] border-[#FDE68A] dark:border-[#78350F]";
      case "software_release":
        return "bg-[#F5F3FF] dark:bg-[#2E1065]/40 text-[#7C3AED] dark:text-[#C4B5FD] border-[#DDD6FE] dark:border-[#5B21B6]";
      default:
        return "bg-[#EEF2FF] dark:bg-[#1E1B4B]/40 text-[#4F46E5] dark:text-[#A5B4FC] border-[#C7D2FE] dark:border-[#3730A3]";
    }
  };

  const getDotStyle = (category: string) => {
    switch (category) {
      case "lifecycle":
        return "bg-[#10B981]";
      case "bug":
        return "bg-[#EF4444]";
      case "maintenance":
        return "bg-[#F59E0B]";
      case "software_release":
        return "bg-[#8B5CF6]";
      default:
        return "bg-[#818CF8]";
    }
  };

  return (
    <aside className="w-80 lg:w-96 shrink-0 bg-white dark:bg-[#081024] border-l border-[#EAEEF3] dark:border-[#162444] flex flex-col h-full select-none">
      {/* List View Title Header */}
      <div className="px-4 py-3 border-b border-[#EAEEF3] dark:border-[#162444] shrink-0 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[#2C3746] dark:text-slate-100 tracking-tight">
          List View
        </h3>
        <span className="text-[10px] text-[#7790A9] dark:text-slate-400 font-medium">
          {formatDateHeader(selectedDateKey)}
        </span>
      </div>

      {/* Accordion Groups */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 flex flex-col gap-3">
        {displayedDateKeys.map((dateKey) => {
          const dateEvents = groupedEvents[dateKey] || [];
          const isSelected = dateKey === selectedDateKey;
          const isExpanded = openSections[dateKey] !== false;
          const headerLabel = formatDateHeader(dateKey);

          return (
            <div
              key={dateKey}
              className={`flex flex-col border rounded-[6px] p-2 transition-all ${
                isSelected
                  ? "bg-[#F9FBFF] dark:bg-[#0c162e] border-[#A1C4FC] dark:border-blue-500/40 shadow-xs"
                  : "bg-transparent border-[#EAEEF3]/70 dark:border-[#162444]/70"
              }`}
            >
              {/* Section Header Accordion Trigger */}
              <button
                type="button"
                onClick={() => toggleSection(dateKey)}
                className="flex items-center justify-between py-1 text-left cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#2C3746] dark:text-slate-200">
                  <span
                    className={`text-[13px] ${
                      isSelected
                        ? "font-bold text-[#002E5D] dark:text-blue-300"
                        : "font-semibold"
                    }`}
                  >
                    {headerLabel}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-1.5 py-0.2 rounded-full ${
                      dateEvents.length > 0
                        ? "bg-[#ECF3FF] dark:bg-[#002E5D]/50 text-[#002E5D] dark:text-blue-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }`}
                  >
                    {dateEvents.length}
                  </span>
                </div>
                <div className="text-[#7790A9] group-hover:text-[#2C3746] dark:group-hover:text-white transition-colors">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Section Items List */}
              {isExpanded && (
                <div className="flex flex-col gap-2 mt-2 pl-1 animate-in fade-in duration-150">
                  {dateEvents.length === 0 ? (
                    <div className="py-2 text-[11px] text-[#7790A9] dark:text-slate-500 italic pl-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 opacity-60" />
                      <span>No active alerts on this date</span>
                    </div>
                  ) : (
                    dateEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-2.5 rounded-[6px] bg-white dark:bg-[#091122] border border-[#EAEEF3] dark:border-[#162444] hover:border-[#A1C4FC] dark:hover:border-blue-500/40 transition-all flex flex-col gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
                      >
                        {/* Top: Category Pill Badge */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] border text-[10px] font-medium ${getBadgeStyle(
                              evt.category
                            )}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDotStyle(
                                evt.category
                              )}`}
                            />
                            <span>{evt.categoryLabel}</span>
                          </span>

                          {evt.timeRangeText && (
                            <span className="text-[10px] text-[#7790A9] dark:text-slate-400 font-normal">
                              {evt.timeRangeText}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-[#2C3746] dark:text-slate-100 leading-snug">
                          {evt.title}
                        </h4>

                        {/* Metadata Details Row */}
                        <div className="flex items-center gap-1.5 text-[10px] text-[#7790A9] dark:text-slate-400 font-normal flex-wrap">
                          <span className="text-[#002E5D] dark:text-blue-300 font-medium">
                            {evt.incidentId}
                          </span>
                          <span>•</span>
                          <span>{evt.tag}</span>
                          <span>•</span>
                          <span>{evt.durationText}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
