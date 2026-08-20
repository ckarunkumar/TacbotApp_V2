"use client";

import { Moon, Sun1 } from "iconsax-react";
import { useDashboard } from "@/context/DashboardContext";
import AiIcon from "@/components/icons/AiIcon";

export default function Header() {
  const {
    isDarkMode,
    toggleDarkMode,
    isTaiChatOpen,
    toggleTaiChat,
    isSidebarCollapsed,
    toggleSidebarCollapse,
  } = useDashboard();

  return (
    <header className="w-full flex items-center justify-between px-4 py-2 select-none">
      {/* Left Section: Relocated Logo Button (Appears ONLY when Sidebar is Collapsed) */}
      <div className="flex items-center gap-2">
        {isSidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebarCollapse}
            className="p-1.5 rounded-[4px] bg-[#031d3d] hover:bg-[#002E5D] text-white transition-all flex items-center justify-center cursor-pointer shadow-2xs shrink-0 active:scale-95"
            title="Expand Navigation Sidebar"
          >
            <img
              src="/tacbot-logo-white.svg"
              alt="Tacbot Logo"
              className="w-4 h-5 md:w-5 md:h-5 object-contain"
            />
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* TAI Chat Button */}
        <button
          onClick={toggleTaiChat}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] text-xs font-semibold shadow-xs transition-all cursor-pointer bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)] text-white hover:opacity-95 ${
            isTaiChatOpen
              ? "ring-2 ring-blue-300/80 shadow-md scale-[1.02]"
              : ""
          }`}
          title={isTaiChatOpen ? "Close TAI Chat" : "Open TAI Chat"}
        >
          <AiIcon size={15} color="currentColor" variant="Bold" className={isTaiChatOpen ? "text-blue-100 animate-spin-slow" : "text-white"} />
          <span>TAI Chat</span>
        </button>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className={`w-8 h-8 rounded-[4px] flex items-center justify-center transition-all shadow-2xs cursor-pointer p-1.5 ${
            isDarkMode
              ? "bg-[#001F42] border border-[#005899] text-slate-300 hover:bg-[#002E5D] hover:text-white"
              : "bg-white border border-[#EAEEF3] text-[#7790A9] hover:text-[#2C3746] hover:bg-[#F2F4F6]"
          }`}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun1 size={16} color="#fde047" variant="Linear" />
          ) : (
            <Moon size={16} color="currentColor" variant="Linear" />
          )}
        </button>
      </div>
    </header>
  );
}
