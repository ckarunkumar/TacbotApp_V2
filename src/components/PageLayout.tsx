"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader, { PageHeaderProps } from "@/components/PageHeader";
import TaiChatPanel from "@/components/TaiChatPanel";

export interface PageLayoutProps extends PageHeaderProps {
  activeNavId?: string;
  children: React.ReactNode;
  contentClassName?: string;
  showTaiChatPanel?: boolean;
  /** When true, <main> itself becomes the single scroll region (page-level
   * scroll) instead of staying overflow-hidden and deferring to whatever
   * internal component scrolls (the app's default, "scroll isolation" pattern
   * documented in the design system). Opt in per page — default false keeps
   * every other PageLayout consumer's behavior unchanged. */
  mainScrollable?: boolean;
  /** Fires on scroll of <main> when mainScrollable is true — lets a page react
   * to page-level scroll position (e.g. auto-collapsing a section on scroll). */
  onMainScroll?: (e: React.UIEvent<HTMLElement>) => void;
}

export default function PageLayout({
  activeNavId = "cases",
  breadcrumbTitle = "Cases",
  primaryActionLabel = "+ Create Case",
  onPrimaryAction,
  showDatePicker = true,
  dateRangeText = "2020-11-08 → 2020-11-08",
  onDateRangeClick,
  onDateRangeChange,
  children,
  contentClassName = "",
  showTaiChatPanel = true,
  mainScrollable = false,
  onMainScroll,
}: PageLayoutProps) {
  return (
    <div className="h-screen bg-[#F2F4F6] dark:bg-[#070D18] text-[#2C3746] dark:text-[#E2E8F0] font-sans antialiased flex flex-row w-full relative overflow-hidden">
      {/* ── Sidebar Rail (OPEN: 68px wide; COLLAPSED: 0px / Unmounted) ── */}
      <Sidebar activeId={activeNavId} />

      {/* ── Main Content Container (OPEN: 100% minus 68px; COLLAPSED: 100% Full Width) ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]">
        {/* ── Standardized Topbar Header (Full width, logo relocates here when collapsed) ── */}
        <PageHeader
          breadcrumbTitle={breadcrumbTitle}
          primaryActionLabel={primaryActionLabel}
          onPrimaryAction={onPrimaryAction}
          showDatePicker={showDatePicker}
          dateRangeText={dateRangeText}
          onDateRangeClick={onDateRangeClick}
          onDateRangeChange={onDateRangeChange}
        />

        {/* ── Main Page Content Viewport (Full available width) ── */}
        <main
          onScroll={mainScrollable ? onMainScroll : undefined}
          className={`flex-1 flex flex-col min-h-0 ${
            mainScrollable ? "overlay-scroll" : "overflow-hidden"
          } ${contentClassName ? contentClassName : "pt-2 px-2 pb-2"}`}
        >
          {children}
        </main>
      </div>

      {/* ── Slide-in TAI Assistant Panel ── */}
      {showTaiChatPanel && <TaiChatPanel />}
    </div>
  );
}
