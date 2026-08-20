"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Plus, Calendar } from "lucide-react";
import AiIcon from "@/components/icons/AiIcon";
import { useDashboard } from "@/context/DashboardContext";

export interface PageHeaderProps {
  breadcrumbTitle?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  showDatePicker?: boolean;
  dateRangeText?: string;
  onDateRangeClick?: () => void;
  className?: string;
}

export default function PageHeader({
  breadcrumbTitle = "Cases",
  primaryActionLabel = "+ Create Case",
  onPrimaryAction,
  showDatePicker = true,
  dateRangeText = "2020-11-08 → 2020-11-08",
  onDateRangeClick,
  className = "",
}: PageHeaderProps) {
  const [askQuery, setAskQuery] = useState("");

  // Safely consume Dashboard Context
  let toggleTaiChat: (() => void) | undefined;
  let isSidebarCollapsed = false;
  let toggleSidebarCollapse: (() => void) | undefined;

  try {
    const context = useDashboard();
    toggleTaiChat = context.toggleTaiChat;
    isSidebarCollapsed = context.isSidebarCollapsed;
    toggleSidebarCollapse = context.toggleSidebarCollapse;
  } catch (e) {
    toggleTaiChat = undefined;
    isSidebarCollapsed = false;
    toggleSidebarCollapse = undefined;
  }

  return (
    <header
      className={`sticky top-0 z-30 w-full h-[49px] bg-white/95 backdrop-blur-md border-b border-[#EAEEF3] shadow-2xs select-none transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-stretch ${className}`}
    >
      {/* Relocated Sidebar Logo — flush square block, full header height, same
          width/color as the sidebar rail it stands in for. Appears ONLY when
          the sidebar is collapsed, sitting at the exact top-left corner (no
          padding/gap before it) rather than as a small inline button. */}
      {isSidebarCollapsed && (
        <button
          type="button"
          onClick={toggleSidebarCollapse}
          className="sidebar-relocated-logo w-14 md:w-16 h-full shrink-0 bg-[#031d3d] hover:bg-[#002E5D] text-white transition-all flex items-center justify-center cursor-pointer"
          title="Expand Navigation Sidebar"
        >
          <img
            src="/tacbot-logo-white.svg"
            alt="Tacbot Logo"
            className="w-5 h-6 md:w-6 md:h-7 object-contain"
          />
        </button>
      )}

      <div className="flex-1 min-w-0 flex items-center justify-between px-2">
        {/* Left Section: Breadcrumbs + Ask TAI Pill Input */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium">
            <Link
              href="/"
              className="text-[#7790A9] hover:text-[#002E5D] transition-colors"
            >
              Home
            </Link>
            <span className="text-[#B3C1D0] font-normal">&gt;</span>
            <span className="text-[#002E5D] font-semibold tracking-tight">
              {breadcrumbTitle}
            </span>
          </nav>

          {/* Ask TAI Search Input — soft gradient glow (no border, box-shadow only) */}
          <div className="relative flex items-center">
            {/* Sparkle icon */}
            <div className="absolute left-3 flex items-center pointer-events-none z-10">
              <AiIcon size={15} color="#7c3aed" variant="Bold" />
            </div>
            <input
              type="text"
              value={askQuery}
              onChange={(e) => setAskQuery(e.target.value)}
              placeholder="Ask TAI"
              className="h-8 w-52 sm:w-64 md:w-72 bg-white dark:bg-[#0d1424] border border-gray-100 dark:border-[#1e2d4a] pl-8 pr-4 text-sm text-[#2C3746] dark:text-slate-100 placeholder-gray-400 focus:outline-none font-normal transition-shadow"
              style={{
                borderRadius: "10px",
                boxShadow:
                  "-4px 4px 12px rgba(167, 139, 250, 0.35), 4px -4px 12px rgba(147, 197, 253, 0.35), 0 0 8px rgba(249, 168, 212, 0.2)",
              }}
            />
          </div>

        </div>

        {/* Right Section: Date Range + Primary Action + TAI Chat Button */}
        <div className="flex items-center gap-2">
          {/* Date Range Picker Selector */}
          {showDatePicker && (
            <button
              type="button"
              onClick={onDateRangeClick}
              className="h-8 px-3 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#081024] text-[#2C3746] dark:text-slate-200 text-xs font-mono flex items-center gap-2 hover:bg-[#F9FBFF] hover:border-[#D4E4FE] transition-all cursor-pointer shadow-2xs"
              title="Filter by Date Range"
            >
              <Calendar className="w-3.5 h-3.5 text-[#7790A9]" />
              <span>{dateRangeText}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7790A9]" />
            </button>
          )}

          {/* Primary Page Action Button */}
          {primaryActionLabel && (
            <button
              type="button"
              onClick={onPrimaryAction}
              className="h-8 px-3.5 rounded-[4px] bg-[#002E5D] hover:bg-[#0A3492] text-white text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {primaryActionLabel.startsWith("+") ? null : <Plus className="w-3.5 h-3.5" />}
              <span>{primaryActionLabel}</span>
            </button>
          )}

          {/* Signature TAI Chat Button */}
          <button
            type="button"
            onClick={toggleTaiChat}
            className="h-8 px-3.5 rounded-[4px] bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)] text-white text-xs font-semibold shadow-2xs hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Open TAI Assistant Chat"
          >
            <AiIcon size={14} color="#ffffff" variant="Bold" />
            <span>TAI Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
}
