"use client";

import React from "react";
import { Sparkles, Moon, Sun } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function Header() {
  const { isDarkMode, toggleDarkMode, isTaiChatOpen, toggleTaiChat } = useDashboard();

  return (
    <header className="w-full flex items-center justify-end px-4 py-2">
      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* TAI Chat Button */}
        <button
          onClick={toggleTaiChat}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] text-xs font-semibold shadow-xs transition-all cursor-pointer ${
            isTaiChatOpen
              ? "bg-gradient-to-r from-[#0047ba] via-[#7c3aed] to-[#9333ea] text-white ring-2 ring-purple-400/50 shadow-md scale-[1.02]"
              : isDarkMode
              ? "bg-[#0047ba] hover:bg-[#003d9e] text-white border border-[#0047ba]/80"
              : "bg-[#0047ba] hover:bg-[#003d9e] text-white"
          }`}
          title={isTaiChatOpen ? "Close TAI Chat" : "Open TAI Chat"}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isTaiChatOpen ? "text-purple-200 animate-spin-slow" : "text-blue-200"}`} />
          <span>TAI Chat</span>
        </button>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className={`w-8 h-8 rounded-[2px] flex items-center justify-center transition-all shadow-2xs cursor-pointer p-1.5 ${
            isDarkMode
              ? "bg-[#0c1630] border border-[#1d305e] text-slate-300 hover:bg-[#122045] hover:text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-slate-300" strokeWidth={2} />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" strokeWidth={2} />
          )}
        </button>
      </div>
    </header>
  );
}
