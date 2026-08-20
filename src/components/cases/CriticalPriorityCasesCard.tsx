"use client";

import React, { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import VendorIcon from "@/components/cases/VendorIcon";

interface CriticalCaseItem {
  id: string;
  vendor: string;
  ticketNumber: string;
  title: string;
  timestamp: string;
  assignee: string;
  slaTimeLeft: string;
}

const CRITICAL_CASES: CriticalCaseItem[] = [
  {
    id: "case-1",
    vendor: "Arista",
    ticketNumber: "SR2349293842",
    title: "E2E Test - CC Vendor Initiated",
    timestamp: "11/22/2023 08:16 AM",
    assignee: "Alex Holmes",
    slaTimeLeft: "18m left",
  },
  {
    id: "case-2",
    vendor: "Cisco",
    ticketNumber: "SR2349293842",
    title: "E2E Test - CC Vendor Initiated",
    timestamp: "11/22/2023 08:16 AM",
    assignee: "Alex Holmes",
    slaTimeLeft: "18m left",
  },
  {
    id: "case-3",
    vendor: "Fortinet",
    ticketNumber: "SR2349293842",
    title: "E2E Test - CC Vendor Initiated",
    timestamp: "11/22/2023 08:16 AM",
    assignee: "Alex Holmes",
    slaTimeLeft: "18m left",
  },
  {
    id: "case-4",
    vendor: "AWS",
    ticketNumber: "SR2349293842",
    title: "E2E Test - CC Vendor Initiated",
    timestamp: "11/22/2023 08:16 AM",
    assignee: "Alex Holmes",
    slaTimeLeft: "18m left",
  },
];

export interface CriticalPriorityCasesCardProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export default function CriticalPriorityCasesCard({
  isMinimized: propMinimized,
  onToggleMinimize,
}: CriticalPriorityCasesCardProps) {
  const [localMinimized, setLocalMinimized] = useState<boolean>(false);

  const isMinimized = propMinimized !== undefined ? propMinimized : localMinimized;
  const toggleMinimize = () => {
    if (onToggleMinimize) {
      onToggleMinimize();
    } else {
      setLocalMinimized((prev) => !prev);
    }
  };

  // ── COLLAPSED / MINIMIZED STATE (Single-strip coral bar matching screenshot) ──
  if (isMinimized) {
    return (
      <div className="bg-[#fee2e2]/70 dark:bg-[#450a0a]/50 border border-[#fecaca] dark:border-[#991b1b]/50 rounded-[8px] px-4 py-2.5 shadow-xs flex items-center justify-between w-full h-10 select-none transition-all animate-in fade-in duration-200">
        {/* Left Title */}
        <h3 className="text-xs font-semibold text-[#991b1b] dark:text-red-300 tracking-tight">
          Critical / High Priority Cases
        </h3>

        {/* Right Count & Expand Icon */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#991b1b] dark:text-red-300 font-mono">
            110
          </span>
          <button
            type="button"
            onClick={toggleMinimize}
            className="text-[#dc2626] dark:text-red-400 hover:opacity-80 transition-opacity cursor-pointer p-0.5"
            title="Expand Critical Cases"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // ── EXPANDED FULL STATE ──
  return (
    <div className="bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] shadow-xs flex flex-col justify-between h-full overflow-hidden transition-all animate-in fade-in duration-200">
      {/* Header with coral/light-red tint */}
      <div className="bg-[#fee2e2]/70 dark:bg-[#450a0a]/50 border-b border-[#fecaca] dark:border-[#991b1b]/50 px-4 py-2 flex items-center justify-between select-none">
        <h3 className="text-xs font-semibold text-[#991b1b] dark:text-red-300 tracking-tight">
          Critical / High Priority Cases
        </h3>
        <button
          type="button"
          onClick={toggleMinimize}
          className="text-[#dc2626] dark:text-red-400 hover:opacity-80 transition-opacity cursor-pointer p-1 rounded-[4px]"
          title="Minimize Critical Cases"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2x2 Grid of Priority Cards */}
      <div className="p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
        {CRITICAL_CASES.map((item) => (
          <div
            key={item.id}
            className="bg-[#F9FBFF] dark:bg-[#081024] rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056] p-2.5 flex flex-col justify-between hover:border-[#D4E4FE] hover:shadow-xs transition-all cursor-pointer group"
          >
            {/* Top row: Vendor Logo + Ticket Number */}
            <div className="flex items-center gap-1.5 mb-1">
              <VendorIcon vendor={item.vendor} size={16} />
              <span className="text-xs font-semibold text-[#002E5D] dark:text-blue-300 tracking-tight group-hover:underline flex items-center gap-1">
                <span>{item.ticketNumber}</span>
              </span>
            </div>

            {/* Middle: Title & Date */}
            <div className="flex flex-col mb-1.5">
              <h4 className="text-[11px] font-semibold text-[#2C3746] dark:text-slate-200 line-clamp-1">
                {item.title}
              </h4>
              <span className="text-[10px] text-[#7790A9] dark:text-slate-400 font-mono">
                {item.timestamp}
              </span>
            </div>

            {/* Bottom row: Assignee + SLA Countdown */}
            <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-[#EAEEF3] dark:border-[#1e3056]">
              <span className="text-[#576B81] dark:text-slate-400 font-medium">
                {item.assignee}
              </span>
              <span className="text-[#dc2626] dark:text-red-400 font-semibold flex items-center gap-1">
                {item.slaTimeLeft}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
