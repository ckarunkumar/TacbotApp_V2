"use client";

import React, { useState } from "react";
import { Settings, Plus, X } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import ShareWidgetButton from "@/components/ShareWidgetButton";

export default function DashboardTabs() {
  const {
    dashboards,
    activeDashboardId,
    setActiveDashboardId,
    createNewDashboard,
    deleteDashboard,
    isCustomizing,
    toggleCustomizing,
    isDarkMode,
  } = useDashboard();

  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId);

  return (
    <div className="w-full flex items-center justify-between border-b border-slate-200/80 dark:border-[#162444] mb-2 px-2 py-1">
      {/* Left Tabs List */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {dashboards.map((dash) => {
          const isActive = activeDashboardId === dash.id;
          const isHovered = hoveredTabId === dash.id;

          return (
            <div
              key={dash.id}
              onMouseEnter={() => setHoveredTabId(dash.id)}
              onMouseLeave={() => setHoveredTabId(null)}
              className="relative flex items-center group"
            >
              <button
                onClick={() => setActiveDashboardId(dash.id)}
                className={`text-xs md:text-sm px-2.5 py-1.5 relative transition-all cursor-pointer flex items-center gap-2 rounded-[2px] ${
                  isActive
                    ? "text-[#0047ba] dark:text-[#38bdf8] font-semibold bg-blue-50/40 dark:bg-transparent"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-transparent font-medium"
                }`}
              >
                <span>{dash.name === "Dashboard 1" ? "TAC Operations Overview" : dash.name}</span>

                {/* Close/Delete tab button if more than 1 dashboard exists */}
                {dashboards.length > 1 && (isHovered || isCustomizing) && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDashboard(dash.id);
                    }}
                    className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 rounded-[2px] transition-colors cursor-pointer"
                    title={`Delete ${dash.name}`}
                  >
                    <X className="w-3 h-3" />
                  </span>
                )}
              </button>

              {/* Active Underline Indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047ba] dark:bg-[#38bdf8] rounded-full" />
              )}
            </div>
          );
        })}

        {/* Plus Button: Create New Dashboard */}
        <button
          onClick={() => createNewDashboard()}
          className="text-slate-500 dark:text-slate-400 hover:text-[#0047ba] dark:hover:text-[#38bdf8] hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-[2px] transition-all cursor-pointer flex items-center justify-center"
          title="Create New Dashboard"
          aria-label="Create New Dashboard"
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
        </button>
      </div>

      {/* Right Actions: Share Dashboard + Settings (Customize Dashboard) */}
      <div className="shrink-0 ml-2 flex items-center gap-1.5">
        {activeDashboard && (
          <ShareWidgetButton
            widgetTitle={
              activeDashboard.name === "Dashboard 1"
                ? "TAC Operations Overview"
                : activeDashboard.name
            }
            widgetId={activeDashboard.id}
            resourceType="dashboard"
            className="w-7 h-7 rounded-[2px] flex items-center justify-center transition-all cursor-pointer p-1.5 bg-white dark:bg-transparent border border-slate-200/80 dark:border-transparent text-slate-500 dark:text-slate-400 hover:text-[#0047ba] dark:hover:text-[#38bdf8] hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs"
          />
        )}
        <button
          onClick={toggleCustomizing}
          className={`w-7 h-7 rounded-[2px] flex items-center justify-center transition-all cursor-pointer p-1.5 ${
            isCustomizing
              ? "bg-[#0047ba] dark:bg-[#38bdf8] text-white dark:text-slate-900 shadow-sm"
              : "bg-white dark:bg-transparent border border-slate-200/80 dark:border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs"
          }`}
          title={isCustomizing ? "Exit Customization" : "Customize Dashboard Layout"}
        >
          <Settings className={`w-4 h-4 ${isCustomizing ? "animate-spin-slow" : ""}`} />
        </button>
      </div>
    </div>
  );
}
