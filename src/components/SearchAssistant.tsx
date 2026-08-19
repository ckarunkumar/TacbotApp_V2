"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { Send2, ChartCircle, Flash, Chart2, TrendUp } from "iconsax-react";
import { useDashboard } from "@/context/DashboardContext";
import AiIcon from "@/components/icons/AiIcon";

interface SearchAssistantProps {
  onSelectAction?: (actionText: string) => void;
}

export default function SearchAssistant({ onSelectAction }: SearchAssistantProps) {
  const { isDarkMode } = useDashboard();
  const [query, setQuery] = useState("");

  const suggestedActions = [
    { text: "Analyze cases near SLA breach", icon: ChartCircle },
    { text: "Summarize critical escalations", icon: Flash },
    { text: "Check vendor response times", icon: Chart2 },
    { text: "Run auto-assignment workflow", icon: TrendUp },
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
        <span className="font-semibold text-[#002E5D] dark:text-[#38bdf8]">
          Murali
        </span>
        , how can{" "}
        <span className="font-semibold text-[#002E5D] dark:text-[#38bdf8]">
          TAI
        </span>{" "}
        assist your operations today?
      </h1>

      {/* AI Search Bar with Signature Blue Gradient Glow */}
      <div className="w-full max-w-2xl relative mb-4 group">
        {/* Signature Blue Gradient Aura */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#005899]/30 via-blue-500/30 to-[#0181c4]/30 rounded-[8px] blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-500 animate-pulse pointer-events-none" />

        <div
          className={`relative flex items-center rounded-[8px] pl-3.5 pr-1.5 py-1.5 transition-all shadow-md ${
            isDarkMode
              ? "bg-[#0a0f24] border border-[#005899]/60 hover:border-[#38bdf8]"
              : "bg-white/95 backdrop-blur-md border border-[#005899]/30 hover:border-[#005899]"
          }`}
        >
          {/* Sparkles icon in signature blue */}
          <div className="mr-2.5 text-[#005899] dark:text-[#38bdf8] flex items-center justify-center shrink-0">
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
            <div className="mr-2 px-1.5 py-0.5 rounded-[8px] border border-[#005899]/40 bg-[#0d1b3a] text-[10px] font-mono text-blue-200 shrink-0">
              ⌘K
            </div>
          )}

          {/* AI Send Button with Signature Blue Gradient */}
          <button
            type="button"
            className="w-7 h-7 rounded-[8px] bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)] hover:opacity-95 flex items-center justify-center text-white shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            title="Send query"
          >
            <Send2 size={14} color="#ffffff" variant="Bold" className="-ml-0.5 mt-0.5 transform rotate-12" />
          </button>
        </div>
      </div>

      {/* Suggested Actions Row with Arista Blue */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-[#38bdf8] text-[11px] md:text-xs mr-1">
          <AiIcon size={15} color="currentColor" variant="Bold" className="text-[#002E5D] dark:text-[#38bdf8]" />
          <span>Suggested actions</span>
        </div>
        {suggestedActions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => handleActionClick(item.text)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[11px] transition-all cursor-pointer shadow-2xs ${
                isDarkMode
                  ? "bg-[#0a1428] border border-[#16274a] text-slate-200 hover:border-[#002E5D] hover:text-white hover:bg-[#0f1d38]"
                  : "bg-white border border-[#EAEEF3] text-slate-600 hover:border-[#002E5D]/40 hover:text-[#002E5D] hover:bg-[#F9FBFF]"
              }`}
            >
              <Icon size={14} color="currentColor" variant="Linear" className="text-[#002E5D] dark:text-[#38bdf8] shrink-0" />
              <span>{item.text}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
