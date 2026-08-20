"use client";

import React, { useMemo, useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import AiIcon from "@/components/icons/AiIcon";
import {
  Plus,
  Search,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Sparkles,
  Bot,
  Users,
  CheckCircle2,
  Server,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Clock,
  Timer,
  AlertTriangle,
  Trash2,
  Wand2,
} from "lucide-react";
import { WidgetType, WidgetCatalogItem, CustomUserWidget } from "@/types/dashboard";
import Badge from "@/components/Badge";
import SlidingDrawer from "@/components/SlidingDrawer";
import WidgetHoverPreview from "@/components/WidgetHoverPreview";
import ShareWidgetButton from "@/components/ShareWidgetButton";

// Expanded Predefined Operations Library matching user's design
const PREDEFINED_OPERATIONS_LIBRARY: WidgetCatalogItem[] = [
  {
    type: "custom-kpi",
    name: "AI Sentiment & Risk",
    category: "AI & Automations",
    description: "NLP risk detection scoring on customer support escalations.",
    defaultColSpan: 1,
    defaultRowSpan: 1,
    iconName: "Sparkles",
  },
  {
    type: "custom-kpi",
    name: "Engineer Workload & Capacity",
    category: "SLA & Performance",
    description: "Staffing capacity, active ticket queues, and shift utilization.",
    defaultColSpan: 2,
    defaultRowSpan: 1,
    iconName: "Users",
  },
  {
    type: "custom-kpi",
    name: "First Contact Resolution (FCR)",
    category: "SLA & Performance",
    description: "First-touch case resolution velocity (78.4% benchmark).",
    defaultColSpan: 1,
    defaultRowSpan: 1,
    iconName: "CheckCircle2",
  },
  {
    type: "custom-kpi",
    name: "AI Auto-Remediation Rate",
    category: "AI & Automations",
    description: "Percentage of Level-1 network events resolved by autonomous scripts.",
    defaultColSpan: 1,
    defaultRowSpan: 1,
    iconName: "Bot",
  },
  {
    type: "custom-kpi",
    name: "Edge Gateway Status",
    category: "Connectivity & NOC",
    description: "Multi-datacenter peering link health and latency index.",
    defaultColSpan: 2,
    defaultRowSpan: 1,
    iconName: "Server",
  },
  {
    type: "case-summary",
    name: "Case Summary (Quarterly Bars)",
    category: "Analytics & Volume",
    description: "Quarterly volume and trend of incoming support access across quarters.",
    defaultColSpan: 1,
    defaultRowSpan: 2,
    iconName: "BarChart3",
  },
  {
    type: "sla-summary",
    name: "SLA Summary (Donut Ratio)",
    category: "SLA & Performance",
    description: "Breakdown of cases met, near breach, and breached thresholds.",
    defaultColSpan: 1,
    defaultRowSpan: 2,
    iconName: "PieChart",
  },
  {
    type: "total-cases",
    name: "Total Cases (Spline Trend)",
    category: "Analytics & Volume",
    description: "Monthly historical and forecasted case resolution volume trend.",
    defaultColSpan: 1,
    defaultRowSpan: 2,
    iconName: "TrendingUp",
  },
  {
    type: "treemap",
    name: "Case Summary Treemap",
    category: "Connectivity & NOC",
    description: "Distribution and concentration of support cases by network vendor.",
    defaultColSpan: 2,
    defaultRowSpan: 2,
    iconName: "Grid",
  },
  {
    type: "sla-health",
    name: "SLA Health Gauge",
    category: "SLA & Performance",
    description: "Real-time compliance gauge with contract threshold progress bar.",
    defaultColSpan: 1,
    defaultRowSpan: 1,
    iconName: "Activity",
  },
  {
    type: "avg-resolution",
    name: "Avg. Resolution Tracker",
    category: "SLA & Performance",
    description: "Mean time to resolution (MTTR) with day-over-day delta.",
    defaultColSpan: 1,
    defaultRowSpan: 1,
    iconName: "Clock",
  },
  {
    type: "alerts",
    name: "Alerts & Incidents Stream",
    category: "Alerts & Cases",
    description: "Live feed of high-severity alerts, vendor sync, and case flags.",
    defaultColSpan: 1,
    defaultRowSpan: 4,
    iconName: "Bell",
  },
  {
    type: "vendor-response",
    name: "Vendor Response Times",
    category: "SLA & Performance",
    description: "Compare real-time resolution and response delays per vendor.",
    defaultColSpan: 1,
    defaultRowSpan: 1,
    iconName: "Timer",
  },
  {
    type: "critical-escalations",
    name: "Critical Escalations",
    category: "Alerts & Cases",
    description: "Priority 1 and Priority 2 incident stream with auto-assignment.",
    defaultColSpan: 1,
    defaultRowSpan: 1,
    iconName: "AlertTriangle",
  },
];

export default function AddWidgetModal() {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    addWidget,
    userCustomWidgets,
    createCustomWidget,
    addCustomWidgetToDashboard,
    deleteCustomWidget,
    isDarkMode,
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Predefined");
  const [isCreateAccordionOpen, setIsCreateAccordionOpen] = useState(false);
  // Tracks how the in-progress widget was started, so the customize form renders
  // on the left (manual) or in the right-side preview panel (TAI-generated).
  const [creationSource, setCreationSource] = useState<"manual" | "tai" | null>(null);

  // State for the dedicated preview panel (right side of the drawer)
  const [hoveredPreviewItem, setHoveredPreviewItem] = useState<
    WidgetCatalogItem | CustomUserWidget | null
  >(null);

  // TAI (AI-assisted) widget generation
  const [taiPrompt, setTaiPrompt] = useState("");

  // Form states for creating custom widget
  const [customName, setCustomName] = useState("");
  const [customType, setCustomType] = useState<WidgetType>("custom-kpi");
  const [customCols, setCustomCols] = useState<1 | 2 | 3 | 4>(1);
  const [customRows, setCustomRows] = useState<1 | 2 | 3 | 4>(1);
  const [customMetric, setCustomMetric] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [customBadge, setCustomBadge] = useState("");
  const [customCategory, setCustomCategory] = useState("AI & Automations");

  // Extra config fields for chart-based custom widgets (bar/donut/spline/treemap)
  const [customVendor, setCustomVendor] = useState("All Vendors");
  const [customGroupBy, setCustomGroupBy] = useState("Vendor");
  const [customFilters, setCustomFilters] = useState<string[]>([]);
  const [customTimeStart, setCustomTimeStart] = useState("");
  const [customTimeEnd, setCustomTimeEnd] = useState("");

  const isChartType = customType !== "custom-kpi";
  const VENDOR_OPTIONS = ["All Vendors", "Cisco", "Juniper", "Arista", "Fortinet"];
  const GROUP_BY_OPTIONS = ["Vendor", "Severity", "Status", "Region", "Day"];
  const FILTER_OPTIONS = ["Breached", "Near SLA", "Met", "Critical", "High Priority"];

  const toggleCustomFilter = (filter: string) => {
    setCustomFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const liveCustomPreviewItem: CustomUserWidget | null = useMemo(() => {
    if (!isCreateAccordionOpen) return null;
    return {
      id: "live-preview",
      name: customName.trim() || "New Custom Widget",
      type: customType,
      colSpan: customCols,
      rowSpan: customRows,
      metricValue: customMetric.trim() || "100%",
      subtitle: customSubtitle.trim() || "Custom TAC Metric",
      badge: customBadge.trim() || "Active",
      category: customCategory,
      createdAt: "",
      vendor: customVendor,
      groupBy: customGroupBy,
      filters: customFilters,
      timeRangeStart: customTimeStart,
      timeRangeEnd: customTimeEnd,
    };
  }, [
    isCreateAccordionOpen,
    customName,
    customType,
    customCols,
    customRows,
    customMetric,
    customSubtitle,
    customBadge,
    customCategory,
    customVendor,
    customGroupBy,
    customFilters,
    customTimeStart,
    customTimeEnd,
  ]);

  const panelPreviewItem = isCreateAccordionOpen ? liveCustomPreviewItem : hoveredPreviewItem;

  const filterTabs = ["Predefined", "My Widgets"];

  // Preview panel is "sticky": hovering a card updates it, but moving the
  // mouse away leaves the last-previewed widget showing until another card is hovered.
  const handleCardMouseEnter = (item: WidgetCatalogItem | CustomUserWidget) => {
    setHoveredPreviewItem(item);
  };

  // Lightweight keyword-based "AI" widget generator — infers a sensible
  // type/category/name from the natural-language prompt, then hands off to
  // the same create form + live preview so the user can fine-tune before saving.
  const handleTaiGenerate = () => {
    const prompt = taiPrompt.trim();
    if (!prompt) return;
    const lower = prompt.toLowerCase();

    // Explicit chart-type mentions ("bar chart", "donut", ...) take priority
    // over vaguer descriptive words ("trend", "volume") that can appear alongside them.
    let inferredType: WidgetType = "custom-kpi";
    if (/(bar chart|bar graph)/.test(lower)) inferredType = "case-summary";
    else if (/(donut|pie chart|ratio|breakdown|split)/.test(lower)) inferredType = "sla-summary";
    else if (/(treemap|tree map)/.test(lower)) inferredType = "treemap";
    else if (/(line chart|line plot|spline)/.test(lower)) inferredType = "total-cases";
    else if (/(trend|over time|timeline|forecast)/.test(lower)) inferredType = "total-cases";
    else if (/(by vendor|distribution)/.test(lower)) inferredType = "treemap";
    else if (/(bar|volume|quarterly|compare)/.test(lower)) inferredType = "case-summary";

    let inferredCategory = "AI & Automations";
    if (/(sla|breach|resolution|response)/.test(lower)) inferredCategory = "SLA & Performance";
    else if (/(vendor|network|edge|gateway|noc)/.test(lower)) inferredCategory = "Connectivity & NOC";
    else if (/(alert|escalation|incident|critical)/.test(lower)) inferredCategory = "Alerts & Cases";

    const inferredVendor =
      VENDOR_OPTIONS.find((v) => lower.includes(v.toLowerCase())) || "All Vendors";

    const title = prompt.length > 48 ? `${prompt.slice(0, 45)}...` : prompt;
    const capitalized = title.charAt(0).toUpperCase() + title.slice(1);

    setCustomName(capitalized);
    setCustomType(inferredType);
    setCustomCategory(inferredCategory);
    setCustomVendor(inferredVendor);
    setCustomSubtitle("Generated by TAI");
    setCustomBadge("AI Suggested");
    setSelectedFilter("My Widgets");
    setCreationSource("tai");
    setIsCreateAccordionOpen(true);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles":
        return (
          <div className="w-7 h-7 rounded-[8px] bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        );
      case "Users":
        return (
          <div className="w-7 h-7 rounded-[8px] bg-blue-50 text-[#002E5D] flex items-center justify-center shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
        );
      case "CheckCircle2":
        return (
          <div className="w-7 h-7 rounded-[8px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        );
      case "Bot":
        return (
          <div className="w-7 h-7 rounded-[8px] bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Bot className="w-3.5 h-3.5" />
          </div>
        );
      case "Server":
        return (
          <div className="w-7 h-7 rounded-[8px] bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Server className="w-3.5 h-3.5" />
          </div>
        );
      case "BarChart3":
        return (
          <div className="w-7 h-7 rounded-[8px] bg-blue-50 text-[#002E5D] flex items-center justify-center shrink-0">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
        );
      case "PieChart":
        return (
          <div className="w-7 h-7 rounded-[8px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <PieChart className="w-3.5 h-3.5" />
          </div>
        );
      case "TrendingUp":
        return (
          <div className="w-7 h-7 rounded-[8px] bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        );
      case "Activity":
        return (
          <div className="w-7 h-7 rounded-[8px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="w-3.5 h-3.5" />
          </div>
        );
      case "Clock":
        return (
          <div className="w-7 h-7 rounded-[8px] bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
        );
      case "Timer":
        return (
          <div className="w-7 h-7 rounded-[8px] bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Timer className="w-3.5 h-3.5" />
          </div>
        );
      case "AlertTriangle":
        return (
          <div className="w-7 h-7 rounded-[8px] bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-[8px] bg-blue-50 text-[#002E5D] flex items-center justify-center shrink-0">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  const filteredPredefined = PREDEFINED_OPERATIONS_LIBRARY.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === "My Widgets") return false;
    return matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    if (isChartType && (!customVendor || !customGroupBy || !customTimeStart || !customTimeEnd)) return;

    createCustomWidget({
      name: customName.trim(),
      type: customType,
      colSpan: customCols,
      rowSpan: customRows,
      metricValue: customMetric.trim() || "100%",
      subtitle: customSubtitle.trim() || "Custom TAC Metric",
      badge: customBadge.trim() || "Active",
      category: customCategory,
      ...(isChartType && {
        vendor: customVendor,
        groupBy: customGroupBy,
        filters: customFilters,
        timeRangeStart: customTimeStart,
        timeRangeEnd: customTimeEnd,
      }),
    });

    setCustomName("");
    setCustomMetric("");
    setCustomSubtitle("");
    setCustomBadge("");
    setCustomVendor("All Vendors");
    setCustomGroupBy("Vendor");
    setCustomFilters([]);
    setCustomTimeStart("");
    setCustomTimeEnd("");
    setIsCreateAccordionOpen(false);
    setCreationSource(null);
  };

  // Customization form. Manually-created widgets render it inline in the left
  // column (under the "Create Custom Widget" trigger); TAI-generated widgets
  // render it in the right-side panel, directly below the live preview.
  const renderCustomizeForm = (
    formClassName = "p-4 border-t border-[#EAEEF3] dark:border-[#162444] flex flex-col gap-3",
    showHeading = true
  ) => (
    <form onSubmit={handleCreateSubmit} className={formClassName}>
      {showHeading && (
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <PlusCircle className="w-3 h-3" />
          Customize This Widget
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
          Widget Name *
        </label>
        <input
          type="text"
          required
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="e.g. Core Switch Uptime Rate"
          className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2.5 py-1.5 focus:outline-none focus:border-[#002E5D] bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100 font-normal"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
            Category
          </label>
          <select
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2 py-1.5 focus:outline-none focus:border-[#002E5D] bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100 font-normal"
          >
            <option value="AI & Automations">AI & Automations</option>
            <option value="SLA & Performance">SLA & Performance</option>
            <option value="Connectivity & NOC">Connectivity & NOC</option>
            <option value="Alerts & Cases">Alerts & Cases</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
            Widget Type
          </label>
          <select
            value={customType}
            onChange={(e) => setCustomType(e.target.value as WidgetType)}
            className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2 py-1.5 focus:outline-none focus:border-[#002E5D] bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100 font-normal"
          >
            <option value="custom-kpi">KPI Metric Card</option>
            <option value="case-summary">Bar Chart</option>
            <option value="sla-summary">Donut Chart</option>
            <option value="total-cases">Spline Line Plot</option>
            <option value="treemap">Treemap Matrix</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
            Columns (Width)
          </label>
          <div className="grid grid-cols-4 gap-1">
            {([1, 2, 3, 4] as const).map((cols) => (
              <button
                key={cols}
                type="button"
                onClick={() => setCustomCols(cols)}
                className={`py-1 text-xs rounded-[8px] cursor-pointer ${
                  customCols === cols
                    ? "bg-[#002E5D] text-white font-semibold"
                    : "bg-white dark:bg-[#091122] border border-[#EAEEF3] dark:border-[#162444] text-slate-600 dark:text-slate-300 hover:bg-[#F9FBFF]"
                }`}
              >
                {cols}W
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
            Rows (Height)
          </label>
          <div className="grid grid-cols-4 gap-1">
            {([1, 2, 3, 4] as const).map((rows) => (
              <button
                key={rows}
                type="button"
                onClick={() => setCustomRows(rows)}
                className={`py-1 text-xs rounded-[8px] cursor-pointer ${
                  customRows === rows
                    ? "bg-[#002E5D] text-white font-semibold"
                    : "bg-white dark:bg-[#091122] border border-[#EAEEF3] dark:border-[#162444] text-slate-600 dark:text-slate-300 hover:bg-[#F9FBFF]"
                }`}
              >
                {rows}H
              </button>
            ))}
          </div>
        </div>
      </div>

      {customType === "custom-kpi" && (
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">
              Metric Value
            </label>
            <input
              type="text"
              value={customMetric}
              onChange={(e) => setCustomMetric(e.target.value)}
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
              value={customSubtitle}
              onChange={(e) => setCustomSubtitle(e.target.value)}
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
              value={customBadge}
              onChange={(e) => setCustomBadge(e.target.value)}
              placeholder="e.g. Optimal"
              className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2 py-1 bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      )}

      {isChartType && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                Vendor *
              </label>
              <select
                required
                value={customVendor}
                onChange={(e) => setCustomVendor(e.target.value)}
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
                required
                value={customGroupBy}
                onChange={(e) => setCustomGroupBy(e.target.value)}
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
                  onClick={() => toggleCustomFilter(filter)}
                  className={`px-2.5 py-1 rounded-[8px] text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                    customFilters.includes(filter)
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
                required
                value={customTimeStart}
                onChange={(e) => setCustomTimeStart(e.target.value)}
                className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2 py-1.5 focus:outline-none focus:border-[#002E5D] bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100 font-normal"
              />
              <input
                type="date"
                required
                value={customTimeEnd}
                onChange={(e) => setCustomTimeEnd(e.target.value)}
                className="text-xs border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] px-2 py-1.5 focus:outline-none focus:border-[#002E5D] bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100 font-normal"
              />
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="mt-1 w-full py-2 bg-[#002E5D] hover:bg-[#0A3492] text-white rounded-[8px] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
      >
        + Save & Add Custom Widget
      </button>
    </form>
  );

  return (
    <>
      <SlidingDrawer
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setHoveredPreviewItem(null);
        }}
        title="Add Widget to Dashboard"
        icon={<LayoutGrid className="w-4 h-4" />}
        widthClass="max-w-[900px]"
        sidePanel={
          <>
            <WidgetHoverPreview item={panelPreviewItem} isDarkMode={isDarkMode} variant="panel" />
            {isCreateAccordionOpen && creationSource === "tai" && renderCustomizeForm()}
          </>
        }
        sidePanelWidthClass="w-[480px]"
        footerLeftContent={
          <span className="text-xs text-slate-500 font-normal">
            {PREDEFINED_OPERATIONS_LIBRARY.length} predefined widgets
          </span>
        }
        primaryButtonText="Done"
        onPrimaryClick={() => {
          setIsAddModalOpen(false);
          setHoveredPreviewItem(null);
        }}
      >
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-[#EAEEF3] dark:border-[#162444] flex flex-col gap-2 bg-white dark:bg-[#091122]">
          {/* Search Input */}
          <div className="relative flex items-center bg-white dark:bg-[#07132a] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] px-4 py-2 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search widgets by name or metric..."
              className="w-full text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none bg-transparent font-normal"
            />
          </div>

          {/* Tabs (exactly one active at all times) */}
          <div className="flex items-center gap-2 pt-1 overflow-hidden">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-3 py-1 rounded-[8px] text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === tab
                    ? "bg-[#002E5D] text-white font-semibold shadow-xs"
                    : "bg-white dark:bg-[#07132a] text-slate-600 dark:text-slate-400 border border-[#EAEEF3] dark:border-[#162444] hover:bg-[#F9FBFF] dark:hover:bg-[#0e1d38] font-normal"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Scrollable Content — outer div owns the scroll/overlay behavior with
            no padding of its own, inner div owns the visual p-4 inset, so the overlay
            scrollbar's own padding compensation doesn't clobber the design padding. */}
        <div className="overlay-scroll flex-1 min-h-0 bg-[#f8fafc] dark:bg-[#050814]">
        <div className="p-4 flex flex-col gap-4">
          {/* SECTION 0: TAI WIDGET (AI-ASSISTED CREATION) — merged into "My Widgets" tab */}
          {selectedFilter === "My Widgets" && (
            <div className="rounded-[8px] border border-purple-200/80 dark:border-purple-800/60 bg-gradient-to-br from-purple-50/70 via-white to-blue-50/40 dark:from-purple-950/30 dark:via-[#07132a] dark:to-blue-950/20 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-[linear-gradient(135deg,#7c3aed_0%,#4f46e5_50%,#2563eb_100%)] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <AiIcon size={16} color="#ffffff" variant="Bold" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Create with TAI
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    Describe the widget in plain language — TAI drafts it for you
                  </p>
                </div>
              </div>

              <textarea
                value={taiPrompt}
                onChange={(e) => setTaiPrompt(e.target.value)}
                placeholder="e.g. Show me a bar chart of case volume trends for Cisco over the last quarter"
                rows={3}
                className="text-xs border border-blue-200/80 dark:border-blue-800/60 rounded-[4px] px-2.5 py-2 focus:outline-none focus:border-[#002E5D] bg-white dark:bg-[#091122] text-slate-800 dark:text-slate-100 font-normal resize-none"
              />

              <button
                type="button"
                onClick={handleTaiGenerate}
                disabled={!taiPrompt.trim()}
                className={`w-full py-2 rounded-[4px] text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5 ${
                  taiPrompt.trim()
                    ? "bg-[linear-gradient(135deg,#7c3aed_0%,#4f46e5_50%,#2563eb_100%)] hover:opacity-95 text-white cursor-pointer"
                    : "bg-blue-100 dark:bg-blue-950/40 text-blue-300 dark:text-blue-700 cursor-not-allowed"
                }`}
              >
                <AiIcon size={14} color="#ffffff" variant="Bold" />
                Generate Widget
              </button>
            </div>
          )}

          {/* SECTION 1: CREATE CUSTOM WIDGET (ACCORDION / BOX) — sits directly below "Create with TAI" */}
          {selectedFilter === "My Widgets" && (
            <div className="border border-dashed border-[#002E5D]/40 bg-blue-50/20 dark:bg-blue-950/20 rounded-[8px] transition-all">
              <div
                onClick={() => {
                  setIsCreateAccordionOpen((prev) => {
                    const next = !prev;
                    setCreationSource(next ? "manual" : null);
                    return next;
                  });
                }}
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-blue-50/40 dark:hover:bg-blue-950/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[8px] bg-[#002E5D] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                      Create Custom Widget
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      Build a new operational telemetry metric card
                    </p>
                  </div>
                </div>
                <div className="text-slate-400 hover:text-slate-600">
                  {isCreateAccordionOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {isCreateAccordionOpen &&
                creationSource === "manual" &&
                renderCustomizeForm(
                  "p-3 border-t border-blue-100 dark:border-blue-900/40 flex flex-col gap-3 bg-white/70 dark:bg-[#07132a]",
                  false
                )}
            </div>
          )}

          {/* SECTION 2: MY CREATED WIDGETS */}
          {selectedFilter === "My Widgets" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  My Created Widgets ({userCustomWidgets.length})
                </span>
              </div>

              {userCustomWidgets.length === 0 ? (
                <div className="p-4 bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] text-center text-xs text-slate-400">
                  No custom widgets created yet. Use the builder above to craft your first custom widget!
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {userCustomWidgets.map((custom) => (
                    <div
                      key={custom.id}
                      onMouseEnter={() => handleCardMouseEnter(custom)}
                      className="relative bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] p-3 shadow-2xs hover:border-[#002E5D]/60 hover:shadow-md transition-all group"
                    >
                      {/* Full-width content row */}
                      <div className="flex items-start gap-2.5 w-full">
                        <div className="w-7 h-7 rounded-[8px] bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {custom.name}
                            </h4>
                            <Badge variant="dimension">
                              {custom.colSpan} × {custom.rowSpan}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal line-clamp-2 mt-1">
                            {custom.subtitle} • Value: {custom.metricValue}
                          </p>
                        </div>
                      </div>

                      {/* Hover action buttons — absolutely overlaid on the right */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1.5 bg-white dark:bg-[#091122] pl-2 rounded-[8px]">
                        <ShareWidgetButton
                          widgetTitle={custom.name}
                          widgetId={custom.id}
                          className="p-1.5 text-slate-400 hover:text-[#002E5D] rounded-[8px] transition-colors cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => deleteCustomWidget(custom.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-[8px] transition-colors"
                          title="Delete Custom Widget"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => addCustomWidgetToDashboard(custom)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#002E5D] hover:bg-[#0A3492] text-white rounded-[8px] text-xs font-semibold shadow-xs transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: PREDEFINED OPERATIONS LIBRARY */}
          {selectedFilter === "Predefined" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Predefined Operations Library
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {filteredPredefined.map((item) => (
                  <div
                    key={item.name}
                    onMouseEnter={() => handleCardMouseEnter(item)}
                    className="relative bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] p-3 shadow-2xs hover:border-[#002E5D]/60 hover:shadow-md transition-all group cursor-pointer"
                  >
                    {/* Full-width content row */}
                    <div className="flex items-start gap-2.5 w-full">
                      {getIcon(item.iconName)}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <Badge variant="dimension">
                            {item.defaultColSpan} × {item.defaultRowSpan}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Hover Add button — absolutely overlaid on the right */}
                    <button
                      onClick={() => addWidget(item)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1 px-3 py-1.5 bg-[#002E5D] hover:bg-[#0A3492] text-white rounded-[8px] text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>

                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      </SlidingDrawer>
    </>
  );
}
