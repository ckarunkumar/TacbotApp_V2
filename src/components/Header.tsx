"use client";

import Link from "next/link";
import { Palette } from "lucide-react";
import { Moon, Sun1 } from "iconsax-react";
import { useDashboard } from "@/context/DashboardContext";
import AiIcon from "@/components/icons/AiIcon";

export default function Header() {
  const { isDarkMode, toggleDarkMode, isTaiChatOpen, toggleTaiChat } = useDashboard();

  return (
    <header className="w-full flex items-center justify-end px-4 py-2">
      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Design System Link Button */}
        <Link
          href="/design-system"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
            isDarkMode
              ? "bg-[#001F42] border border-[#005899] text-blue-200 hover:bg-[#002E5D] hover:text-white"
              : "bg-white border border-[#EAEEF3] text-[#002E5D] hover:bg-[#ECF3FF]"
          }`}
          title="View Design System Documentation & Components"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Design System</span>
        </Link>

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
