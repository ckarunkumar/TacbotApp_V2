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
    <header className="w-full flex items-center justify-between px-2 py-2 select-none">
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
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] text-xs font-semibold shadow-xs transition-all cursor-pointer bg-[linear-gradient(135deg,#7c3aed_0%,#4f46e5_50%,#2563eb_100%)] text-white hover:opacity-95 ${
            isTaiChatOpen
              ? "ring-2 ring-blue-300/80 shadow-md scale-[1.02]"
              : ""
          }`}
          title={isTaiChatOpen ? "Close TAI Chat" : "Open TAI Chat"}
        >
          <AiIcon size={15} color="currentColor" variant="Bold" className={isTaiChatOpen ? "text-blue-100 animate-spin-slow" : "text-white"} />
          <span>TAI Chat</span>
        </button>
      </div>
    </header>
  );
}
