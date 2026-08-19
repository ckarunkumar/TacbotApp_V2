"use client";

import React, { useState } from "react";
import { Add, CloseSquare, Setting2 } from "iconsax-react";
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
  } = useDashboard();

  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId);

  return (
    <div className="w-full flex items-center justify-between mb-2 px-2 py-1">
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
                className={`text-xs md:text-sm px-2.5 py-1.5 relative transition-all cursor-pointer flex items-center gap-2 rounded-[4px] ${
                  isActive
                    ? "text-[#002E5D] dark:text-[#38bdf8] font-semibold bg-[#ECF3FF] dark:bg-transparent"
                    : "text-[#7790A9] dark:text-slate-400 hover:text-[#2C3746] dark:hover:text-slate-200 hover:bg-[#F2F4F6] dark:hover:bg-transparent font-medium"
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
                    className="p-0.5 hover:bg-[#EAEEF3] dark:hover:bg-slate-700 text-[#7790A9] hover:text-red-500 rounded-[4px] transition-colors cursor-pointer"
                    title={`Delete ${dash.name}`}
                  >
                    <CloseSquare size={14} color="currentColor" variant="Linear" />
                  </span>
                )}
              </button>

              {/* Active Underline Indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002E5D] dark:bg-[#38bdf8] rounded-full" />
              )}
            </div>
          );
        })}

        {/* Plus Button: Create New Dashboard */}
        <button
          onClick={() => createNewDashboard()}
          className="text-[#7790A9] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-[#38bdf8] hover:bg-[#F2F4F6] dark:hover:bg-slate-800 p-1.5 rounded-[4px] transition-all cursor-pointer flex items-center justify-center"
          title="Create New Dashboard"
          aria-label="Create New Dashboard"
        >
          <Add size={16} color="currentColor" variant="Linear" />
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
            className="w-7 h-7 rounded-[4px] flex items-center justify-center transition-all cursor-pointer p-1.5 bg-white dark:bg-transparent border border-[#EAEEF3] dark:border-transparent text-[#7790A9] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-[#38bdf8] hover:bg-[#F9FBFF] dark:hover:bg-slate-800 shadow-2xs"
          />
        )}
        <button
          onClick={toggleCustomizing}
          className={`w-7 h-7 rounded-[4px] flex items-center justify-center transition-all cursor-pointer p-1.5 ${
            isCustomizing
              ? "bg-[#002E5D] dark:bg-[#38bdf8] text-white dark:text-slate-900 shadow-sm"
              : "bg-white dark:bg-transparent border border-[#EAEEF3] dark:border-transparent text-[#7790A9] dark:text-slate-400 hover:text-[#2C3746] dark:hover:text-slate-200 hover:bg-[#F9FBFF] dark:hover:bg-slate-800 shadow-2xs"
          }`}
          title={isCustomizing ? "Exit Customization" : "Customize Dashboard Layout"}
        >
          <Setting2 size={16} color="currentColor" variant="Linear" className={isCustomizing ? "animate-spin-slow" : ""} />
        </button>
      </div>
    </div>
  );
}
