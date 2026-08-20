"use client";

import React, { useMemo } from "react";
import Table, { CaseRecord, INITIAL_TABLE_CASES } from "@/components/ui/Table";

export interface CasesTableProps {
  mainCategoryFilter?: string;
  subCategoryFilter?: string;
  isOverviewMinimized?: boolean;
}

export default function CasesTable({
  mainCategoryFilter,
  subCategoryFilter,
  isOverviewMinimized = false,
}: CasesTableProps) {
  // Filter cases based on active parent category & sub-category (e.g., Vendor -> Cisco)
  const filteredData = useMemo(() => {
    if (!subCategoryFilter || subCategoryFilter === "All") {
      return INITIAL_TABLE_CASES;
    }

    const normSub = subCategoryFilter.toLowerCase().replace(/\s+/g, "");

    return INITIAL_TABLE_CASES.filter((row) => {
      const normVendor = row.vendor.toLowerCase().replace(/\s+/g, "");
      // Match vendor name or category
      return normVendor.includes(normSub) || normSub.includes(normVendor);
    });
  }, [subCategoryFilter]);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 mt-0">
      <Table
        title={
          subCategoryFilter && subCategoryFilter !== "All"
            ? `Cases List (${subCategoryFilter} Filtered)`
            : "Cases List"
        }
        data={filteredData}
        showToolbar={true}
        showPagination={true}
        isOverviewMinimized={isOverviewMinimized}
        className="flex-1 min-h-0"
      />
    </div>
  );
}

export type { CaseRecord };
