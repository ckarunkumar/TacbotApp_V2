"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Grid2x2,
  ClipboardList,
  Flag,
  Users,
  Timer,
  PieChart,
  AlertCircle,
  Wand2,
  PackagePlus,
  Settings,
  UserCircle2,
} from "lucide-react";

const NAV_ICONS = [
  { icon: Sparkles, label: "AI Insights" },
  { icon: Grid2x2, label: "Widgets" },
  { icon: ClipboardList, label: "Cases" },
  { icon: Flag, label: "Escalations" },
  { icon: Users, label: "Vendors" },
  { icon: Timer, label: "SLA Timers" },
  { icon: PieChart, label: "Analytics" },
  { icon: AlertCircle, label: "Alerts" },
  { icon: Wand2, label: "Automations" },
  { icon: PackagePlus, label: "Add Module" },
];

const ToggleButton = ({
  isExpanded,
  onClick,
}: {
  isExpanded: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
    aria-pressed={isExpanded}
    title={isExpanded ? "Collapse navigation" : "Expand navigation"}
    className={`w-full h-9 rounded-[2px] bg-[#0047ba] flex items-center justify-center shrink-0 cursor-pointer transition-all p-1.5 hover:bg-[#003d9e] ${
      isExpanded ? "ring-2 ring-white/30" : ""
    }`}
  >
    <img src="/tacbot-logo-white.svg" alt="Tacbot Logo" className="w-5 h-6 object-contain" />
  </button>
);

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggle = () => setIsExpanded((prev) => !prev);

  // Collapsed: a floating button only — it takes no layout space, so the
  // main content column reclaims the full width instead of being pushed over.
  if (!isExpanded) {
    return (
      <div className="fixed top-3 left-2 z-40 w-12">
        <ToggleButton isExpanded={false} onClick={toggle} />
      </div>
    );
  }

  // Expanded: a real flex sibling with width, so it pushes the content column over.
  // The page wrapper is min-h-screen (a floor, not a cap) so the dashboard's own
  // content can grow taller than the viewport and scroll. self-stretch would let
  // the sidebar's content height do the same — sticky + h-screen pins its height
  // to the viewport instead, independent of how tall the page grows, so it can
  // never force page-level scroll, and stays in view as the page scrolls past it.
  return (
    <aside className="shrink-0 w-16 h-screen sticky top-0 min-h-0 overflow-hidden bg-[#0b2a5e] flex flex-col items-center px-2 py-3 gap-2 transition-all duration-300 ease-out">
      <ToggleButton isExpanded onClick={toggle} />

      <div className="w-full flex flex-col items-center gap-2 animate-in fade-in duration-200">
        {NAV_ICONS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            title={label}
            className="w-full h-9 rounded-[2px] flex items-center justify-center text-blue-200/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <Icon className="w-4 h-4" strokeWidth={1.75} />
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Bottom-pinned icons */}
      <div className="w-full flex flex-col items-center gap-2 animate-in fade-in duration-200">
        <button
          type="button"
          title="Settings"
          className="w-full h-9 rounded-[2px] flex items-center justify-center text-blue-200/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          title="Profile"
          className="w-full h-9 rounded-[2px] flex items-center justify-center text-blue-200/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <UserCircle2 className="w-5 h-5" strokeWidth={1.75} />
        </button>
      </div>
    </aside>
  );
}
