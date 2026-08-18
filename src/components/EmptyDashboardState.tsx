"use client";

import React from "react";
import { Plus, LayoutGrid, Sparkles } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function EmptyDashboardState() {
  const { setIsAddModalOpen, setIsCreateModalOpen } = useDashboard();

  return (
    <div className="w-full min-h-[420px] flex flex-col items-center justify-center p-8 bg-white/70 border-2 border-dashed border-slate-200/90 rounded-[2px] text-center my-4 animate-in fade-in duration-300">
      {/* Modern Clean Empty Dashboard Illustration */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-[2px] bg-blue-50/80 border border-blue-100 flex items-center justify-center text-[#0047ba] shadow-xs">
          <LayoutGrid className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-[2px] bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <h3 className="text-sm md:text-base font-semibold text-slate-900 tracking-tight">
        This dashboard is empty
      </h3>
      <p className="text-xs text-slate-500 font-normal mt-1 max-w-md leading-relaxed">
        Start building your operational telemetry canvas by adding widgets from the library or choosing a pre-configured template.
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 mt-5">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0047ba] hover:bg-[#003d9e] text-white rounded-[2px] text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Widget</span>
        </button>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[2px] text-xs font-semibold transition-colors cursor-pointer border border-slate-200/80"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Choose a Template</span>
        </button>
      </div>
    </div>
  );
}
