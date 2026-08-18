"use client";

import React, { useState } from "react";
import { Sparkles, Send, PieChart, Zap, BarChart2, Rocket } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

interface SearchAssistantProps {
  onSelectAction?: (actionText: string) => void;
}

export default function SearchAssistant({ onSelectAction }: SearchAssistantProps) {
  const { isDarkMode } = useDashboard();
  const [query, setQuery] = useState("");

  const suggestedActions = [
    { text: "Analyze cases near SLA breach", icon: PieChart },
    { text: "Summarize critical escalations", icon: Zap },
    { text: "Check vendor response times", icon: BarChart2 },
    { text: "Run auto-assignment workflow", icon: Rocket },
  ];

  const handleActionClick = (action: string) => {
    setQuery(action);
    if (onSelectAction) onSelectAction(action);
  };

  return (
    <section className="w-full flex flex-col items-center justify-center p-2 mb-2">
      {/* Title Greeting */}
      <h1 className="text-xl md:text-2xl font-normal text-center mb-4 tracking-tight text-slate-900 dark:text-white">
        Hi{" "}
        <span className="font-semibold text-[#0047ba] dark:text-[#38bdf8]">
          Murali
        </span>
        , how can{" "}
        <span className="font-semibold bg-gradient-to-r from-[#9333ea] via-[#c084fc] to-[#d946ef] bg-clip-text text-transparent">
          TAI
        </span>{" "}
        assist your operations today?
      </h1>

      {/* AI Glowing Search Bar with Animated Gradient Aura */}
      <div className="w-full max-w-2xl relative mb-4 group">
        {/* Animated Multi-Color AI Aura */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500/40 via-purple-500/50 to-pink-500/40 rounded-[4px] blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-500 animate-pulse pointer-events-none" />

        <div
          className={`relative flex items-center rounded-[4px] px-3.5 py-1.5 transition-all shadow-md ${
            isDarkMode
              ? "bg-[#0a0f24] border border-purple-400/60 hover:border-purple-400"
              : "bg-white/95 backdrop-blur-md border border-purple-300/80 hover:border-purple-400"
          }`}
        >
          {/* Sparkles icon in AI purple */}
          <div className="mr-2.5 text-[#9333ea] dark:text-[#c084fc] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask TAI to analyze cases, check vendor SLAs, or trigger automations..."
            className="w-full text-xs md:text-[13px] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none bg-transparent font-normal"
          />

          {/* Keyboard shortcut hint in dark mode */}
          {isDarkMode && (
            <div className="mr-2 px-1.5 py-0.5 rounded-[2px] border border-[#2b2456] bg-[#141033] text-[10px] font-mono text-purple-200 shrink-0">
              ⌘K
            </div>
          )}

          {/* AI Send Button with Gradient */}
          <button
            type="button"
            className="w-7 h-7 rounded-[2px] bg-gradient-to-r from-[#9333ea] to-[#d946ef] hover:from-[#7e22ce] hover:to-[#c026d3] flex items-center justify-center text-white shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            title="Send query"
          >
            <Send className="w-3.5 h-3.5 -ml-0.5 mt-0.5 transform rotate-12" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Suggested Actions Row with Arista Blue & AI Glow */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-[#c084fc] text-[11px] md:text-xs mr-1">
          <Sparkles className="w-3.5 h-3.5 text-[#9333ea] dark:text-[#c084fc]" />
          <span>Suggested actions</span>
        </div>
        {suggestedActions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => handleActionClick(item.text)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[11px] transition-all cursor-pointer shadow-2xs ${
                isDarkMode
                  ? "bg-[#0a1428] border border-[#16274a] text-slate-200 hover:border-[#0047ba] hover:text-white hover:bg-[#0f1d38]"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:border-[#0047ba]/40 hover:text-[#0047ba] hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3 h-3 text-[#0047ba] dark:text-[#38bdf8] shrink-0" />
              <span>{item.text}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
