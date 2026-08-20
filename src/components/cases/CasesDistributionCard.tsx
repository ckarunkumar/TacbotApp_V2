"use client";

import React, { useState } from "react";
import {
  X,
  Minimize2,
  Maximize2,
  List,
  AlertCircle,
  AlertTriangle,
  Circle,
} from "lucide-react";

interface VendorData {
  name: string;
  count: number;
  pct: string;
  sublabel?: string;
  bgLight: string;
  borderLight: string;
  bgDark: string;
  borderDark: string;
}

const VENDOR_ITEMS: Record<string, VendorData> = {
  Cisco: {
    name: "Cisco",
    count: 820,
    pct: "38.2%",
    bgLight: "bg-[#94d47c]",
    borderLight: "border-[#83c66a]",
    bgDark: "dark:bg-[#22c55e]/30",
    borderDark: "dark:border-[#22c55e]/50",
  },
  Juniper: {
    name: "Juniper",
    count: 510,
    pct: "23.8%",
    bgLight: "bg-[#b6e6a1]",
    borderLight: "border-[#a3da8b]",
    bgDark: "dark:bg-[#16a34a]/30",
    borderDark: "dark:border-[#16a34a]/50",
  },
  Arista: {
    name: "Arista",
    count: 320,
    pct: "14.9%",
    bgLight: "bg-[#daf2cb]",
    borderLight: "border-[#cbe6bb]",
    bgDark: "dark:bg-[#15803d]/30",
    borderDark: "dark:border-[#15803d]/50",
  },
  Fortinet: {
    name: "Fortinet",
    count: 210,
    pct: "9.9%",
    bgLight: "bg-[#e6f7db]",
    borderLight: "border-[#d6ebd0]",
    bgDark: "dark:bg-[#166534]/30",
    borderDark: "dark:border-[#166534]/50",
  },
  "Palo Alto": {
    name: "Palo Alto",
    count: 140,
    pct: "6.6%",
    bgLight: "bg-[#f0fae8]",
    borderLight: "border-[#e1f0d8]",
    bgDark: "dark:bg-[#14532d]/30",
    borderDark: "dark:border-[#14532d]/50",
  },
  F5: {
    name: "F5",
    count: 82,
    pct: "3.6%",
    bgLight: "bg-[#f6fcf0]",
    borderLight: "border-[#e8f5e1]",
    bgDark: "dark:bg-[#064e3b]/30",
    borderDark: "dark:border-[#064e3b]/50",
  },
  Others: {
    name: "Others",
    count: 66,
    pct: "(12 Vendors)",
    sublabel: "(12 Vendors)",
    bgLight: "bg-[#fafefa]",
    borderLight: "border-[#eef8eb]",
    bgDark: "dark:bg-[#022c22]/30",
    borderDark: "dark:border-[#022c22]/50",
  },
};

export interface CasesDistributionCardProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export default function CasesDistributionCard({
  isMinimized: propMinimized,
  onToggleMinimize,
}: CasesDistributionCardProps) {
  const [localMinimized, setLocalMinimized] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>("Connectivity");
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  const isMinimized = propMinimized !== undefined ? propMinimized : localMinimized;
  const toggleMinimize = () => {
    if (onToggleMinimize) {
      onToggleMinimize();
    } else {
      setLocalMinimized((prev) => !prev);
    }
  };

  // ── COLLAPSED / MINIMIZED STATE (Single-strip summary bar matching screenshot) ──
  if (isMinimized) {
    return (
      <div className="bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] px-4 py-2.5 shadow-xs flex items-center justify-between w-full h-10 select-none transition-all">
        {/* Left Title */}
        <h3 className="text-xs font-semibold text-[#002E5D] dark:text-white tracking-tight">
          Cases Distribution
        </h3>

        {/* Right Summary Metrics + Expand Icon */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          {/* Blue Total Cases */}
          <div className="flex items-center gap-1 text-[#2F6ADB] dark:text-[#5E94EE]">
            <List className="w-3.5 h-3.5" />
            <span className="font-mono text-slate-800 dark:text-slate-200">2733</span>
          </div>

          {/* Red Critical / High */}
          <div className="flex items-center gap-1 text-[#dc2626]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] flex items-center justify-center text-[7px] text-white font-bold">
              !
            </span>
            <span className="font-mono text-slate-800 dark:text-slate-200">1521</span>
          </div>

          {/* Orange Medium */}
          <div className="flex items-center gap-1 text-[#d97706]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] flex items-center justify-center text-[7px] text-white font-bold">
              !
            </span>
            <span className="font-mono text-slate-800 dark:text-slate-200">332</span>
          </div>

          {/* Yellow Low */}
          <div className="flex items-center gap-1 text-[#eab308]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] flex items-center justify-center" />
            <span className="font-mono text-slate-800 dark:text-slate-200">880</span>
          </div>

          {/* Expand / Restore Icon */}
          <button
            type="button"
            onClick={toggleMinimize}
            className="text-[#7790A9] hover:text-[#002E5D] dark:hover:text-white transition-colors cursor-pointer p-0.5 ml-1"
            title="Expand Cases Distribution"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // ── EXPANDED FULL STATE ──
  return (
    <div className="bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] p-4 shadow-xs flex flex-col justify-between h-full transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 select-none">
        <h3 className="text-xs font-semibold text-[#002E5D] dark:text-white tracking-tight">
          Cases Distribution
        </h3>

        {/* Right Breadcrumbs Filter + Minimize Toggle */}
        <div className="flex items-center gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 bg-[#F2F4F6] dark:bg-[#121c33] px-2 py-0.5 rounded-[4px] border border-[#EAEEF3] dark:border-[#1a2948] text-[#576B81] dark:text-slate-300">
            <button
              onClick={() => setActiveFilter("Connectivity")}
              className={`hover:text-[#002E5D] dark:hover:text-white transition-colors cursor-pointer ${
                activeFilter === "Connectivity" ? "font-semibold text-[#002E5D] dark:text-white" : ""
              }`}
            >
              Connectivity
            </button>
            <span className="text-[#B3C1D0]">&lt;</span>
            <button
              onClick={() => setActiveFilter("Low")}
              className={`hover:text-[#002E5D] dark:hover:text-white transition-colors cursor-pointer ${
                activeFilter === "Low" ? "font-semibold text-[#002E5D] dark:text-white" : ""
              }`}
            >
              Low
            </button>
            <span className="text-[#B3C1D0]">&lt;</span>
            <button
              onClick={() => setActiveFilter("All Cases")}
              className={`hover:text-[#002E5D] dark:hover:text-white transition-colors cursor-pointer ${
                activeFilter === "All Cases" ? "font-semibold text-[#002E5D] dark:text-white" : ""
              }`}
            >
              All Cases
            </button>
            <button
              type="button"
              className="ml-1 text-[#7790A9] hover:text-[#dc2626] transition-colors cursor-pointer p-0.5"
              title="Clear Filter"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Minimize button */}
          <button
            type="button"
            onClick={toggleMinimize}
            className="text-[#7790A9] hover:text-[#002E5D] dark:hover:text-white transition-colors cursor-pointer p-1 rounded-[4px]"
            title="Minimize Section"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Treemap Mosaic Body */}
      <div className="grid grid-cols-12 gap-2 flex-1 min-h-[170px] w-full select-none">
        {/* Cisco (Leftmost Large Block - 5 cols) */}
        <button
          type="button"
          onClick={() => setSelectedVendor(selectedVendor === "Cisco" ? null : "Cisco")}
          className={`col-span-5 ${VENDOR_ITEMS.Cisco.bgLight} ${VENDOR_ITEMS.Cisco.bgDark} ${VENDOR_ITEMS.Cisco.borderLight} ${VENDOR_ITEMS.Cisco.borderDark} border rounded-[8px] p-3 flex flex-col justify-start items-start hover:opacity-95 transition-all cursor-pointer text-left ${
            selectedVendor === "Cisco" ? "ring-2 ring-[#002E5D]" : ""
          }`}
        >
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Cisco
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">
            820
          </div>
          <div className="text-[11px] font-medium text-slate-800 dark:text-slate-300">
            38.2%
          </div>
        </button>

        {/* Juniper (Middle Block - 3 cols) */}
        <button
          type="button"
          onClick={() => setSelectedVendor(selectedVendor === "Juniper" ? null : "Juniper")}
          className={`col-span-3 ${VENDOR_ITEMS.Juniper.bgLight} ${VENDOR_ITEMS.Juniper.bgDark} ${VENDOR_ITEMS.Juniper.borderLight} ${VENDOR_ITEMS.Juniper.borderDark} border rounded-[8px] p-3 flex flex-col justify-start items-start hover:opacity-95 transition-all cursor-pointer text-left ${
            selectedVendor === "Juniper" ? "ring-2 ring-[#002E5D]" : ""
          }`}
        >
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Juniper
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">
            510
          </div>
          <div className="text-[11px] font-medium text-slate-800 dark:text-slate-300">
            23.8%
          </div>
        </button>

        {/* Right Section (4 cols split vertically into 2 rows) */}
        <div className="col-span-4 flex flex-col gap-2 h-full">
          {/* Top Sub-row (Arista & Fortinet) */}
          <div className="grid grid-cols-2 gap-2 flex-1">
            {/* Arista */}
            <button
              type="button"
              onClick={() => setSelectedVendor(selectedVendor === "Arista" ? null : "Arista")}
              className={`bg-[#daf2cb] dark:bg-[#15803d]/30 border border-[#cbe6bb] dark:border-[#15803d]/50 rounded-[8px] p-2 flex flex-col justify-start items-start hover:opacity-95 transition-all cursor-pointer text-left ${
                selectedVendor === "Arista" ? "ring-2 ring-[#002E5D]" : ""
              }`}
            >
              <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
                Arista
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none mb-0.5">
                320
              </div>
              <div className="text-[10px] text-slate-800 dark:text-slate-300 font-medium">
                14.9%
              </div>
            </button>

            {/* Fortinet */}
            <button
              type="button"
              onClick={() => setSelectedVendor(selectedVendor === "Fortinet" ? null : "Fortinet")}
              className={`bg-[#e6f7db] dark:bg-[#166534]/30 border border-[#d6ebd0] dark:border-[#166534]/50 rounded-[8px] p-2 flex flex-col justify-start items-start hover:opacity-95 transition-all cursor-pointer text-left ${
                selectedVendor === "Fortinet" ? "ring-2 ring-[#002E5D]" : ""
              }`}
            >
              <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
                Fortinet
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none mb-0.5">
                210
              </div>
              <div className="text-[10px] text-slate-800 dark:text-slate-300 font-medium">
                9.9%
              </div>
            </button>
          </div>

          {/* Bottom Sub-row (Palo Alto, F5, Others) */}
          <div className="grid grid-cols-3 gap-2 flex-1">
            {/* Palo Alto */}
            <button
              type="button"
              onClick={() => setSelectedVendor(selectedVendor === "Palo Alto" ? null : "Palo Alto")}
              className={`bg-[#f0fae8] dark:bg-[#14532d]/30 border border-[#e1f0d8] dark:border-[#14532d]/50 rounded-[8px] p-1.5 flex flex-col justify-start items-start hover:opacity-95 transition-all cursor-pointer text-left ${
                selectedVendor === "Palo Alto" ? "ring-2 ring-[#002E5D]" : ""
              }`}
            >
              <span className="text-[9px] font-semibold text-slate-900 dark:text-slate-100 truncate mb-0.5">
                Palo Alto
              </span>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none mb-0.5">
                140
              </div>
              <div className="text-[8px] text-slate-800 dark:text-slate-300 font-medium">
                6.6%
              </div>
            </button>

            {/* F5 */}
            <button
              type="button"
              onClick={() => setSelectedVendor(selectedVendor === "F5" ? null : "F5")}
              className={`bg-[#f6fcf0] dark:bg-[#064e3b]/30 border border-[#e8f5e1] dark:border-[#064e3b]/50 rounded-[8px] p-1.5 flex flex-col justify-start items-start hover:opacity-95 transition-all cursor-pointer text-left ${
                selectedVendor === "F5" ? "ring-2 ring-[#002E5D]" : ""
              }`}
            >
              <span className="text-[9px] font-semibold text-slate-900 dark:text-slate-100 truncate mb-0.5">
                F5
              </span>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none mb-0.5">
                82
              </div>
              <div className="text-[8px] text-slate-800 dark:text-slate-300 font-medium">
                3.6%
              </div>
            </button>

            {/* Others */}
            <button
              type="button"
              onClick={() => setSelectedVendor(selectedVendor === "Others" ? null : "Others")}
              className={`bg-[#fafefa] dark:bg-[#022c22]/30 border border-[#eef8eb] dark:border-[#022c22]/50 rounded-[8px] p-1.5 flex flex-col justify-start items-start hover:opacity-95 transition-all cursor-pointer text-left ${
                selectedVendor === "Others" ? "ring-2 ring-[#002E5D]" : ""
              }`}
            >
              <span className="text-[9px] font-semibold text-slate-900 dark:text-slate-100 truncate mb-0.5">
                Others
              </span>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none mb-0.5">
                66
              </div>
              <div className="text-[7px] text-slate-800 dark:text-slate-300 leading-tight font-medium">
                (12 Vendors)
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
