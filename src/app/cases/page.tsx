"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import CasesCategoryTabs from "@/components/cases/CasesCategoryTabs";
import CasesDistributionCard from "@/components/cases/CasesDistributionCard";
import CriticalPriorityCasesCard from "@/components/cases/CriticalPriorityCasesCard";
import CasesTable from "@/components/cases/CasesTable";
import { DashboardProvider } from "@/context/DashboardContext";

function CasesPageBody() {
  const searchParams = useSearchParams();
  const initialMain = searchParams.get("mainCategory") || "All";
  const initialSub = searchParams.get("subCategory") || "All";

  const [activeMainCategory, setActiveMainCategory] = useState<string>(initialMain);
  const [activeSubCategory, setActiveSubCategory] = useState<string>(initialSub);

  useEffect(() => {
    const mainParam = searchParams.get("mainCategory");
    const subParam = searchParams.get("subCategory");
    if (mainParam) setActiveMainCategory(mainParam);
    if (subParam) setActiveSubCategory(subParam);
  }, [searchParams]);

  // Shared minimize state: clicking minimize on either card collapses/expands both together —
  // also auto-toggled by the table's own internal scroll position below, so scrolling the table
  // rows progressively collapses the distribution/priority cards to give the table more room
  // (with a CSS transition on the cards so it reads as a smooth collapse, not a snap), and
  // scrolling back to the top restores them. The tabs above stay put either way — they live
  // outside the table's own scroll region, so they never need "sticky" to remain visible.
  const [isOverviewMinimized, setIsOverviewMinimized] = useState<boolean>(false);
  const toggleOverviewMinimized = () => setIsOverviewMinimized((prev) => !prev);

  const SCROLL_COLLAPSE_THRESHOLD = 24;
  const handleTableBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsOverviewMinimized((prev) => {
      if (scrollTop > SCROLL_COLLAPSE_THRESHOLD && !prev) return true;
      if (scrollTop <= SCROLL_COLLAPSE_THRESHOLD && prev) return false;
      return prev;
    });
  };

  return (
    <PageLayout
      activeNavId="cases"
      breadcrumbTitle="Cases"
      primaryActionLabel="+ Create Case"
      onPrimaryAction={() => {
        alert("Create Case modal triggered");
      }}
      showDatePicker={true}
      dateRangeText="2020-11-08 → 2020-11-08"
      contentClassName="flex flex-col flex-1 min-h-0 gap-1.5 w-full pt-2 px-2 pb-2 h-full"
    >
      {/* ── Category & Sub-category Filter Tabs ── */}
      <CasesCategoryTabs
        activeMainCategory={activeMainCategory}
        onSelectMainCategory={(main) => {
          setActiveMainCategory(main);
        }}
        activeSubCategory={activeSubCategory}
        onSelectSubCategory={(sub) => {
          setActiveSubCategory(sub);
        }}
      />

      {/* ── Middle Metrics & Distribution Row (Synchronized Collapse / Expand) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch shrink-0">
        {/* Cases Distribution Card (Left: 7 cols on desktop) */}
        <div className="lg:col-span-7 h-full">
          <CasesDistributionCard
            isMinimized={isOverviewMinimized}
            onToggleMinimize={toggleOverviewMinimized}
            onSelectVendorFilter={(vendorName) => {
              setActiveMainCategory("Vendor");
              setActiveSubCategory(vendorName);
            }}
          />
        </div>

        {/* Critical / High Priority Cases Card (Right: 5 cols on desktop) */}
        <div className="lg:col-span-5 h-full">
          <CriticalPriorityCasesCard
            isMinimized={isOverviewMinimized}
            onToggleMinimize={toggleOverviewMinimized}
          />
        </div>
      </div>

      {/* ── Bottom Section: Cases List Table (its own internal scroll region again;
          scrolling it drives the metrics row's progressive collapse above) ── */}
      <div className="w-full flex-1 flex flex-col min-h-0">
        <CasesTable
          mainCategoryFilter={activeMainCategory}
          subCategoryFilter={activeSubCategory}
          isOverviewMinimized={isOverviewMinimized}
          onBodyScroll={handleTableBodyScroll}
        />
      </div>
    </PageLayout>
  );
}

export default function CasesPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs text-slate-500">Loading cases...</div>}>
      <CasesPageBody />
    </Suspense>
  );
}
