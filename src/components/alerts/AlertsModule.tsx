"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CasesCategoryTabs from "@/components/cases/CasesCategoryTabs";
import AlertsLeftSidebar from "./AlertsLeftSidebar";
import AlertsListView from "./AlertsListView";
import MonthlyView from "./MonthlyView";
import WeeklyView from "./WeeklyView";
import DailyView from "./DailyView";
import YearlyView from "./YearlyView";
import { AlertCategory, CalendarViewType } from "./types";
import { INITIAL_ALERT_EVENTS } from "./alertsData";

export default function AlertsModule() {
  // Active calendar view: Yearly, Monthly, Weekly, Daily
  const [activeView, setActiveView] = useState<CalendarViewType>("Monthly");

  // Selected date (Defaults to 2026-08-13 as in showcase images)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 7, 13)); // August 13, 2026
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 13)); // Current view anchor

  // Filter category state
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | "all">("all");

  // Top Tabs category states
  const [activeMainCategory, setActiveMainCategory] = useState<string>("Vendor");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Suffix helper for daily title (e.g. 13th August 2026)
  const getDaySuffix = (d: number) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  // Dynamic Navigation Title based on Active View
  const getNavTitle = () => {
    if (activeView === "Yearly") {
      return `${currentDate.getFullYear()}`;
    }
    if (activeView === "Daily") {
      const dayNum = selectedDate.getDate();
      const monthName = monthNames[selectedDate.getMonth()];
      const yearNum = selectedDate.getFullYear();
      return `${dayNum}${getDaySuffix(dayNum)} ${monthName} ${yearNum}`;
    }
    // Monthly & Weekly:
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  // Navigate back / forward in time
  const handlePrev = () => {
    if (activeView === "Yearly") {
      setCurrentDate((prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
    } else if (activeView === "Monthly") {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else if (activeView === "Weekly") {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() - 7);
      setSelectedDate(nextDate);
      setCurrentDate(nextDate);
    } else if (activeView === "Daily") {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() - 1);
      setSelectedDate(nextDate);
      setCurrentDate(nextDate);
    }
  };

  const handleNext = () => {
    if (activeView === "Yearly") {
      setCurrentDate((prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
    } else if (activeView === "Monthly") {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    } else if (activeView === "Weekly") {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 7);
      setSelectedDate(nextDate);
      setCurrentDate(nextDate);
    } else if (activeView === "Daily") {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);
      setSelectedDate(nextDate);
      setCurrentDate(nextDate);
    }
  };

  // Filter events based on selected category filter
  const filteredEvents = INITIAL_ALERT_EVENTS.filter((evt) => {
    if (selectedCategory !== "all" && evt.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const views: CalendarViewType[] = ["Yearly", "Monthly", "Weekly", "Daily"];

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full select-none">
      {/* ── Top Category & Subcategory Filter Tabs ── */}
      <CasesCategoryTabs
        activeMainCategory={activeMainCategory}
        onSelectMainCategory={setActiveMainCategory}
        activeSubCategory={activeSubCategory}
        onSelectSubCategory={setActiveSubCategory}
      />

      {/* ── Main 3-Column Calendar Dashboard Container ── */}
      <div className="flex-1 flex min-h-0 bg-white dark:bg-[#081024] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] shadow-xs overflow-hidden mt-1">
        {/* ── Left Column: Mini Calendar & Category Filter List ── */}
        <AlertsLeftSidebar
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDate={(d) => {
            setSelectedDate(d);
            setCurrentDate(d);
          }}
          onPrevMonth={() =>
            setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
          }
          onNextMonth={() =>
            setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
          }
          onDrillToYear={() => setActiveView("Yearly")}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          events={INITIAL_ALERT_EVENTS}
        />

        {/* ── Center Column: Calendar Viewport with View Switcher Header ── */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 border-r border-[#EAEEF3] dark:border-[#162444]">
          {/* Top Control Bar: View Switcher (Yearly/Monthly/Weekly/Daily) + Navigation Date */}
          <div className="h-10 px-3 border-b border-[#EAEEF3] dark:border-[#162444] flex items-center justify-between shrink-0 bg-white dark:bg-[#081024]">
            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1">
              {views.map((v) => {
                const isActive = activeView === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setActiveView(v)}
                    className={`px-3 py-1 text-xs transition-colors cursor-pointer rounded-[4px] ${
                      isActive
                        ? "text-[#002E5D] dark:text-[#38bdf8] font-bold bg-[#ECF3FF] dark:bg-[#16274a]"
                        : "text-[#576B81] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-slate-200 font-medium"
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>

            {/* Date Range / Navigation Header with < and > */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                className="w-6 h-6 rounded-[4px] hover:bg-[#F2F4F6] dark:hover:bg-[#121c33] text-[#7790A9] dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                title="Previous"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeView === "Daily" || activeView === "Weekly") {
                    setActiveView("Monthly");
                  } else if (activeView === "Monthly") {
                    setActiveView("Yearly");
                  }
                }}
                className="text-xs font-semibold text-[#2C3746] dark:text-slate-100 px-1 min-w-28 text-center hover:text-[#002E5D] dark:hover:text-blue-300 transition-colors cursor-pointer"
                title="Click to zoom out view"
              >
                {getNavTitle()}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-6 h-6 rounded-[4px] hover:bg-[#F2F4F6] dark:hover:bg-[#121c33] text-[#7790A9] dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                title="Next"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Calendar Body */}
          <div className="flex-1 flex flex-col min-h-0">
            {activeView === "Monthly" && (
              <MonthlyView
                currentDate={currentDate}
                selectedDate={selectedDate}
                onSelectDate={(d) => {
                  setSelectedDate(d);
                  setCurrentDate(d);
                }}
                onDrillToDay={(d) => {
                  setSelectedDate(d);
                  setCurrentDate(d);
                  setActiveView("Daily");
                }}
                events={filteredEvents}
              />
            )}

            {activeView === "Weekly" && (
              <WeeklyView
                currentDate={currentDate}
                selectedDate={selectedDate}
                onSelectDate={(d) => {
                  setSelectedDate(d);
                  setCurrentDate(d);
                }}
                onDrillToDay={(d) => {
                  setSelectedDate(d);
                  setCurrentDate(d);
                  setActiveView("Daily");
                }}
                events={filteredEvents}
              />
            )}

            {activeView === "Daily" && (
              <DailyView selectedDate={selectedDate} events={filteredEvents} />
            )}

            {activeView === "Yearly" && (
              <YearlyView
                currentDate={currentDate}
                selectedDate={selectedDate}
                onSelectDate={(d) => {
                  setSelectedDate(d);
                  setCurrentDate(d);
                }}
                onSelectMonth={(mIdx) => {
                  setCurrentDate(new Date(currentDate.getFullYear(), mIdx, 1));
                  setActiveView("Monthly");
                }}
                onDrillToDay={(d) => {
                  setSelectedDate(d);
                  setCurrentDate(d);
                  setActiveView("Daily");
                }}
                events={filteredEvents}
              />
            )}
          </div>
        </div>

        {/* ── Right Column: Collapsible List View ── */}
        <AlertsListView
          events={filteredEvents}
          selectedDate={selectedDate}
          activeView={activeView}
        />
      </div>
    </div>
  );
}
