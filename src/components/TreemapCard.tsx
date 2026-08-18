"use client";

import React, { useState } from "react";
import { Info, ChevronLeft } from "lucide-react";
import Tooltip from "@/components/Tooltip";
import { useDashboard } from "@/context/DashboardContext";

interface SeverityBand {
  label: "High" | "Medium" | "Low";
  value: number;
  pct: string;
}

interface VendorSeverity {
  [vendor: string]: SeverityBand[];
}

// Severity breakdown per vendor — the drill-down target when a mosaic block is clicked,
// and the source data for the "Low Severity" / "All Cases" filter pills.
const VENDOR_SEVERITY: VendorSeverity = {
  Cisco: [
    { label: "High", value: 290, pct: "35.4%" },
    { label: "Medium", value: 330, pct: "40.2%" },
    { label: "Low", value: 200, pct: "24.4%" },
  ],
  Juniper: [
    { label: "High", value: 150, pct: "29.4%" },
    { label: "Medium", value: 230, pct: "45.1%" },
    { label: "Low", value: 130, pct: "25.5%" },
  ],
  Arista: [
    { label: "High", value: 110, pct: "34.4%" },
    { label: "Medium", value: 140, pct: "43.8%" },
    { label: "Low", value: 70, pct: "21.9%" },
  ],
  Fortinet: [
    { label: "High", value: 70, pct: "33.3%" },
    { label: "Medium", value: 90, pct: "42.9%" },
    { label: "Low", value: 50, pct: "23.8%" },
  ],
  "Palo Alto": [
    { label: "High", value: 40, pct: "28.6%" },
    { label: "Medium", value: 60, pct: "42.9%" },
    { label: "Low", value: 40, pct: "28.6%" },
  ],
  F5: [
    { label: "High", value: 22, pct: "26.8%" },
    { label: "Medium", value: 35, pct: "42.7%" },
    { label: "Low", value: 25, pct: "30.5%" },
  ],
  Others: [
    { label: "High", value: 15, pct: "22.7%" },
    { label: "Medium", value: 26, pct: "39.4%" },
    { label: "Low", value: 25, pct: "37.9%" },
  ],
};

// Vendor totals (all severities combined) — the "Connectivity" default view.
const VENDOR_TOTALS: Record<string, { value: number; pct: string; sublabel: string }> = {
  Cisco: { value: 820, pct: "38.2%", sublabel: "38.2%" },
  Juniper: { value: 510, pct: "23.8%", sublabel: "23.8%" },
  Arista: { value: 320, pct: "14.9%", sublabel: "14.9%" },
  Fortinet: { value: 210, pct: "9.8%", sublabel: "9.8%" },
  "Palo Alto": { value: 140, pct: "6.6%", sublabel: "6.6%" },
  F5: { value: 82, pct: "3.8%", sublabel: "3.8%" },
  Others: { value: 66, pct: "3.1%", sublabel: "(12 vendors)" },
};

// Low-severity case count per vendor, with share recomputed against the Low-severity total (540).
const VENDOR_LOW_SEVERITY: Record<string, { value: number; pct: string }> = {
  Cisco: { value: 200, pct: "37.0%" },
  Juniper: { value: 130, pct: "24.1%" },
  Arista: { value: 70, pct: "13.0%" },
  Fortinet: { value: 50, pct: "9.3%" },
  "Palo Alto": { value: 40, pct: "7.4%" },
  F5: { value: 25, pct: "4.6%" },
  Others: { value: 25, pct: "4.6%" },
};

// Aggregate severity mix across every vendor combined — the "All Cases" view.
const TOTAL_SEVERITY: SeverityBand[] = [
  { label: "Medium", value: 911, pct: "42.4%" },
  { label: "High", value: 697, pct: "32.5%" },
  { label: "Low", value: 540, pct: "25.1%" },
];

// Severity is a status, not an identity — reuse the app's reserved status colors.
const SEVERITY_STYLES: Record<SeverityBand["label"], string> = {
  High: "bg-[#fca5a5] dark:bg-[#ef4444] border-[#f87171] dark:border-[#dc2626]",
  Medium: "bg-[#fcd34d] dark:bg-[#f59e0b] border-[#fbbf24] dark:border-[#d97706]",
  Low: "bg-[#6ee7b7] dark:bg-[#10b981] border-[#34d399] dark:border-[#059669]",
};

type FilterTab = "Connectivity" | "Low Severity" | "All Cases";

export default function TreemapCard() {
  const { isDarkMode } = useDashboard();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Connectivity");
  const filters: FilterTab[] = ["Connectivity", "Low Severity", "All Cases"];
  const [zoomedVendor, setZoomedVendor] = useState<string | null>(null);

  const severity = zoomedVendor ? VENDOR_SEVERITY[zoomedVendor] : null;

  const selectFilter = (f: FilterTab) => {
    setActiveFilter(f);
    setZoomedVendor(null);
  };

  // Connectivity → vendor totals. Low Severity → vendor blocks resized to their
  // low-severity count only. Both keep the same fixed mosaic proportions/positions;
  // only the displayed value/percent changes.
  const getVendorMetric = (vendor: string) => {
    if (activeFilter === "Low Severity") {
      const m = VENDOR_LOW_SEVERITY[vendor];
      return { value: m.value, sublabel: m.pct };
    }
    const m = VENDOR_TOTALS[vendor];
    return { value: m.value, sublabel: m.sublabel };
  };

  const showVendorMosaic = activeFilter !== "All Cases" && !zoomedVendor;
  const showAggregateSeverity = activeFilter === "All Cases" && !zoomedVendor;

  return (
    <div className="bg-white dark:bg-[#091122] rounded-[2px] border border-slate-200/85 dark:border-[#162444] p-4 shadow-xs flex flex-col justify-between h-full">
      {/* Header with Title and Filter Tabs + Info Icon */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-white tracking-tight">
          Case Summary Treemap
        </h3>

        {/* Right Section: Filter Pills and Info Icon */}
        <div className="flex items-center gap-2">
          {!zoomedVendor && (
            <div className="flex items-center gap-2 text-[11px]">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => selectFilter(f)}
                  className={`px-1.5 py-0.5 transition-colors cursor-pointer text-[11px] ${
                    activeFilter === f
                      ? "text-[#0047ba] dark:text-[#38bdf8] font-semibold border-b border-[#0047ba] dark:border-[#38bdf8]"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {zoomedVendor && (
            <button
              onClick={() => setZoomedVendor(null)}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#0047ba] dark:text-[#38bdf8] hover:underline cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" />
              All Vendors
            </button>
          )}

          <Tooltip
            content={
              activeFilter === "All Cases"
                ? "Overall severity mix across every vendor combined"
                : activeFilter === "Low Severity"
                ? "Vendors by low-severity case volume — click a block to see its full severity mix"
                : "Distribution and concentration of support cases by network vendor — click a block to see its severity mix"
            }
            position="top"
          >
            <button
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              aria-label="Treemap Information"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {showVendorMosaic && (
        /* Treemap Mosaic Grid — vendors (original design, unchanged proportions).
           Displayed value/percent switches between vendor totals and low-severity-only. */
        <div className="grid grid-cols-12 gap-2 flex-1 min-h-[180px] w-full select-none">
          {/* Cisco (Leftmost Large Block - 5 cols) */}
          <button
            onClick={() => setZoomedVendor("Cisco")}
            className="col-span-5 bg-[#94d47c] dark:bg-[#34d399] hover:opacity-95 transition-all rounded-[2px] p-3 flex flex-col justify-start items-start border border-[#83c66a] dark:border-[#22c55e] cursor-pointer text-left"
          >
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-950 mb-1">Cisco</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-950 leading-none mb-1">
              {getVendorMetric("Cisco").value}
            </div>
            <div className="text-[11px] font-medium text-slate-800 dark:text-slate-900">
              {getVendorMetric("Cisco").sublabel}
            </div>
          </button>

          {/* Juniper (Middle Block - 3 cols) */}
          <button
            onClick={() => setZoomedVendor("Juniper")}
            className="col-span-3 bg-[#b6e6a1] dark:bg-[#10b981] hover:opacity-95 transition-all rounded-[2px] p-3 flex flex-col justify-start items-start border border-[#a3da8b] dark:border-[#059669] cursor-pointer text-left"
          >
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-950 mb-1">Juniper</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-950 leading-none mb-1">
              {getVendorMetric("Juniper").value}
            </div>
            <div className="text-[11px] font-medium text-slate-800 dark:text-slate-900">
              {getVendorMetric("Juniper").sublabel}
            </div>
          </button>

          {/* Right Section (4 cols split vertically into 2 rows) */}
          <div className="col-span-4 flex flex-col gap-2 h-full">
            {/* Top Sub-row (Arista & Fortinet) */}
            <div className="grid grid-cols-2 gap-2 flex-1">
              {/* Arista */}
              <button
                onClick={() => setZoomedVendor("Arista")}
                className="bg-[#daf2cb] dark:bg-[#059669] hover:opacity-95 transition-all rounded-[2px] p-2 flex flex-col justify-start items-start border border-[#cbe6bb] dark:border-[#047857] cursor-pointer text-slate-900 dark:text-white text-left"
              >
                <span className="text-[11px] font-semibold mb-0.5">Arista</span>
                <div className="text-sm font-bold leading-none mb-0.5">{getVendorMetric("Arista").value}</div>
                <div className="text-[10px] opacity-80 font-medium">{getVendorMetric("Arista").sublabel}</div>
              </button>

              {/* Fortinet */}
              <button
                onClick={() => setZoomedVendor("Fortinet")}
                className="bg-[#e6f7db] dark:bg-[#047857] hover:opacity-95 transition-all rounded-[2px] p-2 flex flex-col justify-start items-start border border-[#d6ebd0] dark:border-[#065f46] cursor-pointer text-slate-900 dark:text-white text-left"
              >
                <span className="text-[11px] font-semibold mb-0.5">Fortinet</span>
                <div className="text-sm font-bold leading-none mb-0.5">{getVendorMetric("Fortinet").value}</div>
                <div className="text-[10px] opacity-80 font-medium">{getVendorMetric("Fortinet").sublabel}</div>
              </button>
            </div>

            {/* Bottom Sub-row (Palo Alto, F5, Others) */}
            <div className="grid grid-cols-3 gap-2 flex-1">
              {/* Palo Alto */}
              <button
                onClick={() => setZoomedVendor("Palo Alto")}
                className="bg-[#f0fae8] dark:bg-[#065f46] hover:opacity-95 transition-all rounded-[2px] p-1.5 flex flex-col justify-start items-start border border-[#e1f0d8] dark:border-[#0f766e] cursor-pointer text-slate-900 dark:text-white text-left"
              >
                <span className="text-[9px] font-semibold truncate mb-0.5">Palo Alto</span>
                <div className="text-xs font-bold leading-none mb-0.5">{getVendorMetric("Palo Alto").value}</div>
                <div className="text-[8px] opacity-80 font-medium">{getVendorMetric("Palo Alto").sublabel}</div>
              </button>

              {/* F5 */}
              <button
                onClick={() => setZoomedVendor("F5")}
                className="bg-[#f6fcf0] dark:bg-[#0f766e] hover:opacity-95 transition-all rounded-[2px] p-1.5 flex flex-col justify-start items-start border border-[#e8f5e1] dark:border-[#115e59] cursor-pointer text-slate-900 dark:text-white text-left"
              >
                <span className="text-[9px] font-semibold truncate mb-0.5">F5</span>
                <div className="text-xs font-bold leading-none mb-0.5">{getVendorMetric("F5").value}</div>
                <div className="text-[8px] opacity-80 font-medium">{getVendorMetric("F5").sublabel}</div>
              </button>

              {/* Others */}
              <button
                onClick={() => setZoomedVendor("Others")}
                className="bg-[#fafefa] dark:bg-[#134e4a] hover:opacity-95 transition-all rounded-[2px] p-1.5 flex flex-col justify-start items-start border border-[#eef8eb] dark:border-[#115e59] cursor-pointer text-slate-900 dark:text-white text-left"
              >
                <span className="text-[9px] font-semibold truncate mb-0.5">Others</span>
                <div className="text-xs font-bold leading-none mb-0.5">{getVendorMetric("Others").value}</div>
                <div className="text-[7px] opacity-80 leading-tight font-medium">
                  {activeFilter === "Low Severity" ? getVendorMetric("Others").sublabel : "(12 vendors)"}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {(showAggregateSeverity || zoomedVendor) && (
        /* Severity mosaic — same visual language (rounded-[2px] blocks, big/medium/small
           proportions). Shows either one vendor's severity mix (drilled in) or the
           aggregate mix across all vendors ("All Cases" tab). */
        <div className="grid grid-cols-12 gap-2 flex-1 min-h-[180px] w-full select-none animate-in fade-in duration-200">
          {[...(severity ?? TOTAL_SEVERITY)]
            .sort((a, b) => b.value - a.value)
            .map((band, idx) => {
              const spanClass = idx === 0 ? "col-span-6" : idx === 1 ? "col-span-4" : "col-span-2";
              const sharedClass = `${spanClass} ${SEVERITY_STYLES[band.label]} hover:opacity-95 transition-all rounded-[2px] p-3 flex flex-col justify-start items-start border text-slate-900 dark:text-slate-950`;
              const content = (
                <>
                  <span className="text-xs font-semibold mb-1">{band.label}</span>
                  <div className="text-2xl font-bold leading-none mb-1">{band.value}</div>
                  <div className="text-[11px] font-medium opacity-90">{band.pct}</div>
                </>
              );

              // In the aggregate ("All Cases") view, the Low block is a shortcut into
              // the "Low Severity" tab's per-vendor breakdown — the only severity that
              // has a matching filter pill. Drilled-in vendor severity blocks stay inert.
              if (showAggregateSeverity && band.label === "Low") {
                return (
                  <button
                    key={band.label}
                    onClick={() => selectFilter("Low Severity")}
                    className={`${sharedClass} cursor-pointer text-left`}
                    title="View low-severity cases by vendor"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <div key={band.label} className={sharedClass}>
                  {content}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
