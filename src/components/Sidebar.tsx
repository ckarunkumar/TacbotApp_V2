"use client";

import React, { useState } from "react";
import {
  Category,
  ClipboardText,
  Flag,
  People,
  Timer1,
  Chart,
  Notification,
  Flash,
  AddSquare,
  Setting2,
  ProfileCircle,
  Logout,
} from "iconsax-react";
import AiIcon from "@/components/icons/AiIcon";
import { useDashboard } from "@/context/DashboardContext";

const NAV_ICONS = [
  { icon: AiIcon, label: "AI Insights", id: "ai" },
  { icon: Category, label: "Widgets", id: "widgets" },
  { icon: ClipboardText, label: "Cases", id: "cases" },
  { icon: Flag, label: "Escalations", id: "escalations" },
  { icon: People, label: "Vendors", id: "vendors" },
  { icon: Timer1, label: "SLA Timers", id: "sla" },
  { icon: Chart, label: "Analytics", id: "analytics" },
  { icon: Notification, label: "Alerts", id: "alerts" },
  { icon: Flash, label: "Automations", id: "automations" },
  { icon: AddSquare, label: "Add Module", id: "add" },
];

export default function Sidebar() {
  const { isSidebarCollapsed, toggleSidebarCollapse } = useDashboard();
  const [activeId, setActiveId] = useState("widgets");

  return (
    <>
      {/* Spacer in flex layout to reserve width only when expanded */}
      <div
        className={`shrink-0 h-screen transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] pointer-events-none ${
          isSidebarCollapsed ? "w-0" : "w-14 md:w-16"
        }`}
      />

      {/* Floating / Sticky Navigation Sidebar */}
      <aside
        aria-label="Main Navigation"
        className={`fixed top-0 left-0 z-40 shrink-0 bg-[#031d3d] flex flex-col items-center select-none border-r border-[#002E5D]/50 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          isSidebarCollapsed
            ? "w-14 md:w-16 h-14 md:h-16 py-3 px-2 rounded-none shadow-lg border-b border-[#002E5D]"
            : "w-14 md:w-16 h-screen py-4 px-2 justify-between"
        }`}
      >
        {/* Top Logo Button (Always visible; clicking toggles collapsed state) */}
        <button
          type="button"
          onClick={toggleSidebarCollapse}
          className="flex items-center justify-center p-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none"
          title={isSidebarCollapsed ? "Expand Navigation" : "Collapse Navigation"}
        >
          <img
            src="/tacbot-logo-white.svg"
            alt="Tacbot Logo"
            className="w-6 h-7 md:w-7 md:h-8 object-contain"
          />
        </button>

        {/* Navigation Icons Column & Bottom Actions (Hidden when isSidebarCollapsed is true) */}
        <div
          className={`w-full flex-1 flex flex-col items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
            isSidebarCollapsed
              ? "max-h-0 opacity-0 pointer-events-none overflow-hidden mt-0"
              : "max-h-[1000px] opacity-100 mt-6"
          }`}
        >
        {/* Main Icon Navigation */}
        <nav className="w-full flex flex-col items-center gap-2.5">
          {NAV_ICONS.map(({ icon: Icon, label, id }) => {
            const isActive = activeId === id;
            const isAi = id === "ai" || label.toLowerCase().includes("ai");
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveId(id)}
                title={label}
                className={`w-9 h-9 md:w-10 md:h-10 rounded-[4px] flex items-center justify-center transition-all cursor-pointer ${
                  isAi
                    ? "bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)] text-white shadow-xs hover:opacity-95"
                    : isActive
                    ? "text-white bg-[#002E5D] shadow-xs"
                    : "text-[#7097c2] hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={20} color="currentColor" variant={isActive || isAi ? "Bold" : "Linear"} />
              </button>
            );
          })}
        </nav>

        {/* Bottom Pinned Action Icons */}
        <div className="w-full flex flex-col items-center gap-2.5 pt-2 border-t border-[#002E5D]/60 mt-auto">
          <button
            type="button"
            title="Settings"
            className="w-9 h-9 md:w-10 md:h-10 rounded-[8px] flex items-center justify-center text-[#7097c2] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Setting2 size={20} color="currentColor" variant="Linear" />
          </button>
          <button
            type="button"
            title="Profile"
            className="w-9 h-9 md:w-10 md:h-10 rounded-[8px] flex items-center justify-center text-[#7097c2] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ProfileCircle size={22} color="currentColor" variant="Linear" />
          </button>
          <button
            type="button"
            title="Logout"
            className="w-9 h-9 md:w-10 md:h-10 rounded-[8px] flex items-center justify-center text-[#7097c2] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Logout size={20} color="currentColor" variant="Linear" />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
