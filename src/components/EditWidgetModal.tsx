"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { SlidersHorizontal } from "lucide-react";
import SlidingDrawer from "@/components/SlidingDrawer";
import { WidgetType } from "@/types/dashboard";
import Select from "@/components/ui/Select";

const CATEGORY_SELECT_OPTIONS = [
  { value: "AI & Automations", label: "AI & Automations" },
  { value: "SLA & Performance", label: "SLA & Performance" },
  { value: "Connectivity & NOC", label: "Connectivity & NOC" },
  { value: "Alerts & Cases", label: "Alerts & Cases" },
  { value: "Analytics & Volume", label: "Analytics & Volume" },
];

const WIDGET_TYPE_OPTIONS = [
  { value: "custom-kpi", label: "KPI Metric Card" },
  { value: "case-summary", label: "Bar Chart" },
  { value: "sla-summary", label: "Donut Chart" },
  { value: "total-cases", label: "Spline Line Plot" },
  { value: "treemap", label: "Treemap Matrix" },
  { value: "sla-health", label: "SLA Health Gauge" },
  { value: "avg-resolution", label: "Avg. Resolution Tracker" },
  { value: "alerts", label: "Alerts & Incidents Stream" },
  { value: "vendor-response", label: "Vendor Response Times" },
  { value: "critical-escalations", label: "Critical Escalations" },
];

const VENDOR_OPTIONS = ["All Vendors", "Cisco", "Juniper", "Arista", "Fortinet"];
const GROUP_BY_OPTIONS = ["Vendor", "Severity", "Status", "Region", "Day"];
const FILTER_OPTIONS = ["Breached", "Near SLA", "Met", "Critical", "High Priority"];

export default function EditWidgetModal() {
  const { editingWidget, setEditingWidget, editWidget } = useDashboard();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<WidgetType>("custom-kpi");
  const [category, setCategory] = useState("AI & Automations");
  const [colSpan, setColSpan] = useState<1 | 2 | 3 | 4>(1);
  const [rowSpan, setRowSpan] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // KPI fields
  const [metricValue, setMetricValue] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("");

  // Chart fields
  const [vendor, setVendor] = useState("All Vendors");
  const [groupBy, setGroupBy] = useState("Vendor");
  const [filters, setFilters] = useState<string[]>([]);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  const isChartType = type !== "custom-kpi";

  useEffect(() => {
    if (editingWidget) {
      setTitle(editingWidget.customTitle || editingWidget.title);
      setType(editingWidget.type);
      setCategory(editingWidget.category || "AI & Automations");
      setColSpan(editingWidget.colSpan);
      setRowSpan(editingWidget.rowSpan);
      setMetricValue(editingWidget.customMetricValue || "");
      setSubtitle(editingWidget.customSubtitle || "");
      setBadge(editingWidget.customBadge || "");
      setVendor(editingWidget.settings?.vendor || "All Vendors");
      setGroupBy(editingWidget.settings?.groupBy || "Vendor");
      setFilters(editingWidget.settings?.filters || []);
      setTimeStart(editingWidget.settings?.timeRangeStart || "");
      setTimeEnd(editingWidget.settings?.timeRangeEnd || "");
    }
  }, [editingWidget]);

  const toggleFilter = (filter: string) => {
    setFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const handleSave = () => {
    if (!editingWidget) return;
    editWidget(editingWidget.id, {
      customTitle: title.trim() || editingWidget.title,
      type,
      category,
      colSpan,
      rowSpan,
      customMetricValue: metricValue.trim() || undefined,
      customSubtitle: subtitle.trim() || undefined,
      customBadge: badge.trim() || undefined,
      settings: isChartType
        ? {
            vendor,
            groupBy,
            filters,
            timeRangeStart: timeStart,
            timeRangeEnd: timeEnd,
          }
        : editingWidget.settings,
    });
  };

  return (
    <SlidingDrawer
      isOpen={Boolean(editingWidget)}
      onClose={() => setEditingWidget(null)}
      title="Edit Widget Configuration"
      icon={<SlidersHorizontal className="w-4 h-4" />}
      secondaryButtonText="Cancel"
      onSecondaryClick={() => setEditingWidget(null)}
      primaryButtonText="Save Changes"
      onPrimaryClick={handleSave}
    >
      <div className="p-4 flex flex-col gap-4">
        {/* Custom Title Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Widget Display Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Core Network Operations"
            className="w-full text-xs text-slate-800 dark:text-slate-100 bg-white dark:bg-[#091122] border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#002E5D] font-normal"
          />
        </div>

        {/* Category & Widget Type */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Category
            </label>
            <Select
              value={category}
              onChange={(val) => setCategory(val)}
              options={CATEGORY_SELECT_OPTIONS}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Widget Type
            </label>
            <Select
              value={type}
              onChange={(val) => setType(val as WidgetType)}
              options={WIDGET_TYPE_OPTIONS}
            />
          </div>
        </div>

        {/* Dimension Settings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Columns (Width)
            </label>
            <div className="grid grid-cols-4 gap-1">
              {([1, 2, 3, 4] as const).map((cols) => (
                <button
                  key={cols}
                  type="button"
                  onClick={() => setColSpan(cols)}
                  className={`py-1.5 text-xs rounded-[8px] transition-all cursor-pointer ${
                    colSpan === cols
                      ? "bg-[#002E5D] text-white font-semibold shadow-xs"
                      : "bg-white dark:bg-[#091122] border border-[#EAEEF3] dark:border-[#162444] text-slate-600 dark:text-slate-300 hover:bg-[#F9FBFF] dark:hover:bg-[#0e1d38]"
                  }`}
                >
                  {cols}W
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Rows (Height)
            </label>
            <div className="grid grid-cols-6 gap-1">
              {([1, 2, 3, 4, 5, 6] as const).map((rows) => (
                <button
                  key={rows}
                  type="button"
                  onClick={() => setRowSpan(rows)}
                  className={`py-1.5 text-xs rounded-[8px] transition-all cursor-pointer ${
                    rowSpan === rows
                      ? "bg-[#002E5D] text-white font-semibold shadow-xs"
                      : "bg-white dark:bg-[#091122] border border-[#EAEEF3] dark:border-[#162444] text-slate-600 dark:text-slate-300 hover:bg-[#F9FBFF] dark:hover:bg-[#0e1d38]"
                  }`}
                >
                  {rows}H
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI-specific fields */}
        {!isChartType && (
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                Metric Value
              </label>
              <input
                type="text"
                value={metricValue}
                onChange={(e) => setMetricValue(e.target.value)}
                placeholder="e.g. 99.8%"
                className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2 py-1 bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. SLA Compliant"
                className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2 py-1 bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Optimal"
                className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2 py-1 bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        )}

        {/* Chart-specific fields */}
        {isChartType && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  Vendor *
                </label>
                <select
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2 py-1.5 focus:outline-none focus:border-[#002E5D] bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100 font-normal"
                >
                  {VENDOR_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  Group By *
                </label>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2 py-1.5 focus:outline-none focus:border-[#002E5D] bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100 font-normal"
                >
                  {GROUP_BY_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                Filter
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FILTER_OPTIONS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => toggleFilter(filter)}
                    className={`px-2.5 py-1 rounded-[8px] text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                      filters.includes(filter)
                        ? "bg-[#002E5D] text-white font-semibold shadow-xs"
                        : "bg-white dark:bg-[#091122] text-slate-600 dark:text-slate-400 border border-[#EAEEF3] dark:border-[#162444] hover:bg-[#F9FBFF] dark:hover:bg-[#0e1d38] font-normal"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                Time Range *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2 py-1.5 focus:outline-none focus:border-[#002E5D] bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100 font-normal"
                />
                <input
                  type="date"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2 py-1.5 focus:outline-none focus:border-[#002E5D] bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100 font-normal"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </SlidingDrawer>
  );
}
