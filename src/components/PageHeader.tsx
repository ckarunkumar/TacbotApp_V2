"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Plus, Calendar } from "lucide-react";
import AiIcon from "@/components/icons/AiIcon";
import { useDashboard } from "@/context/DashboardContext";
import DateRangePicker, { DateRange } from "@/components/ui/DateRangePicker";

const BREADCRUMB_ROUTE_MAP: Record<string, string> = {
  Home: "/",
  Dashboard: "/",
  Alerts: "/alerts",
  Cases: "/cases",
  "AI Insights": "/ai",
  Widgets: "/",
  "Design System": "/design-system",
};

export interface PageHeaderProps {
  breadcrumbTitle?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  showDatePicker?: boolean;
  dateRangeText?: string;
  onDateRangeClick?: () => void;
  onDateRangeChange?: (range: DateRange) => void;
  className?: string;
}

export default function PageHeader({
  breadcrumbTitle = "Cases",
  primaryActionLabel = "+ Create Case",
  onPrimaryAction,
  showDatePicker = true,
  dateRangeText = "2020-11-08 → 2020-11-08",
  onDateRangeClick,
  onDateRangeChange,
  className = "",
}: PageHeaderProps) {
  const [askQuery, setAskQuery] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>(() => {
    const parts = dateRangeText.split(/\s*→\s*/);
    return {
      startDate: parts[0] || "2020-11-08",
      endDate: parts[1] || parts[0] || "2020-11-08",
    };
  });

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

  const handleRangeChange = (range: DateRange) => {
    setSelectedRange(range);
    if (onDateRangeChange) {
      onDateRangeChange(range);
    }
  };

  const displayText =
    selectedRange.startDate === selectedRange.endDate
      ? `${selectedRange.startDate} → ${selectedRange.endDate}`
      : `${selectedRange.startDate} → ${selectedRange.endDate}`;

  return (
    <header
      className={`sticky top-0 z-30 w-full h-[49px] bg-white/95 dark:bg-[#081024]/95 backdrop-blur-md border-b border-[#EAEEF3] dark:border-[#162444] shadow-2xs select-none transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-stretch ${className}`}
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
              className="text-[#7790A9] hover:text-[#002E5D] dark:hover:text-blue-300 transition-colors"
            >
              Home
            </Link>

            {(() => {
              const segments = breadcrumbTitle.split(/\s+[>\/]\s+/);
              return segments.map((seg, idx) => {
                const isLast = idx === segments.length - 1;
                const targetHref =
                  BREADCRUMB_ROUTE_MAP[seg] || (idx === 0 ? `/${seg.toLowerCase()}` : undefined);

                return (
                  <React.Fragment key={`${seg}-${idx}`}>
                    <span className="text-[#B3C1D0] dark:text-slate-600 font-normal">&gt;</span>
                    {isLast || !targetHref ? (
                      <span className="text-[#002E5D] dark:text-[#93C5FD] font-semibold tracking-tight">
                        {seg}
                      </span>
                    ) : (
                      <Link
                        href={targetHref}
                        className="text-[#7790A9] hover:text-[#002E5D] dark:hover:text-blue-300 transition-colors font-medium"
                      >
                        {seg}
                      </Link>
                    )}
                  </React.Fragment>
                );
              });
            })()}
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
                  "-1.5px 1.5px 5px rgba(167, 139, 250, 0.4), 1.5px -1.5px 5px rgba(147, 197, 253, 0.4), 0 0 4px rgba(249, 168, 212, 0.25), 0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
            />
          </div>

        </div>

        {/* Right Section: Date Range + Primary Action + TAI Chat Button */}
        <div className="flex items-center gap-2 relative">
          {/* Date Range Picker Selector */}
          {showDatePicker && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsDatePickerOpen((prev) => !prev);
                  if (onDateRangeClick) onDateRangeClick();
                }}
                className={`h-8 px-3 rounded-[4px] border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                  isDatePickerOpen
                    ? "border-[#2F6ADB] bg-[#ECF3FF] dark:bg-[#16294d] text-[#002E5D] dark:text-sky-300 ring-2 ring-[#2F6ADB]/20"
                    : "border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#081024] text-[#2C3746] dark:text-slate-200 hover:bg-[#F9FBFF] dark:hover:bg-[#0e1b38] hover:border-[#D4E4FE]"
                }`}
                title="Filter by Date Range"
              >
                <Calendar className="w-3.5 h-3.5 text-[#7790A9] dark:text-slate-400" />
                <span>{displayText}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#7790A9] dark:text-slate-400 transition-transform ${
                    isDatePickerOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Interactive Popover Picker */}
              <DateRangePicker
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                value={selectedRange}
                onChange={handleRangeChange}
              />
            </div>
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
            className="h-8 px-3.5 rounded-[4px] bg-[linear-gradient(135deg,#7c3aed_0%,#4f46e5_50%,#2563eb_100%)] text-white text-xs font-semibold shadow-2xs hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
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
