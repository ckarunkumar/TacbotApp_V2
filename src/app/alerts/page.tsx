"use client";

import React, { Suspense } from "react";
import PageLayout from "@/components/PageLayout";
import AlertsModule from "@/components/alerts/AlertsModule";

function AlertsPageContent() {
  return (
    <PageLayout
      activeNavId="alerts"
      breadcrumbTitle="Dashboard > Alerts"
      primaryActionLabel="+ Create Case"
      onPrimaryAction={() => {
        alert("Create Case modal triggered");
      }}
      showDatePicker={true}
      dateRangeText="2020-11-08 → 2020-11-08"
      contentClassName="flex flex-col flex-1 min-h-0 gap-1.5 w-full pt-1 px-2 pb-2 h-full"
    >
      <AlertsModule />
    </PageLayout>
  );
}

export default function AlertsPage() {
  return (
    <Suspense
      fallback={<div className="p-4 text-xs text-[#7790A9]">Loading alerts...</div>}
    >
      <AlertsPageContent />
    </Suspense>
  );
}
