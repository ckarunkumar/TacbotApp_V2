"use client";

import React, { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { Plus, RotateCcw, Check, SlidersHorizontal, Bookmark, CheckCircle2 } from "lucide-react";

export default function CustomizeToolbar() {
  const {
    isCustomizing,
    setIsCustomizing,
    setIsAddModalOpen,
    resetToDefault,
    saveCurrentAsTemplate,
    widgets,
  } = useDashboard();

  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isCustomizing) return null;

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;
    saveCurrentAsTemplate(templateName);
    setIsSavingTemplate(false);
    setTemplateName("");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full bg-white text-slate-900 rounded-[2px] p-2.5 mb-2 flex flex-wrap items-center justify-between gap-2 shadow-xs border border-slate-200/90 animate-in fade-in slide-in-from-top-1 duration-150">
      {/* Left Info */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[2px] bg-blue-50 text-[#0047ba] border border-blue-100 flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-semibold tracking-tight text-slate-900 leading-tight">
            Customize Dashboard Layout
          </h3>
          <p className="text-[10px] text-slate-500 font-normal mt-0.5">
            Drag cards to rearrange, drag edges to resize, or drop anywhere on the grid.
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Save as Template Button */}
        {isSavingTemplate ? (
          <form onSubmit={handleSaveTemplate} className="flex items-center gap-1.5 animate-in fade-in">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name..."
              className="text-xs text-slate-800 bg-white border border-slate-300 rounded-[2px] px-2.5 py-1.5 focus:outline-none focus:border-[#0047ba] w-36"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-[#0047ba] hover:bg-[#003d9e] text-white rounded-[2px] text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsSavingTemplate(false)}
              className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[2px] text-xs cursor-pointer"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={() => {
              setTemplateName(`My Custom ${widgets.length}-Card Layout`);
              setIsSavingTemplate(true);
            }}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-medium px-3 py-1.5 rounded-[2px] transition-all cursor-pointer border border-slate-200"
            title="Save current layout as a reusable template"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Saved!</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-[#0047ba]" />
                <span>Save as Template</span>
              </>
            )}
          </button>
        )}

        {/* Add Widget Button (Arista Blue) */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#0047ba] hover:bg-[#003d9e] text-white text-xs font-semibold px-3.5 py-1.5 rounded-[2px] transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Widget</span>
        </button>

        {/* Reset Defaults */}
        <button
          onClick={resetToDefault}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-medium px-3 py-1.5 rounded-[2px] transition-all cursor-pointer border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        {/* Done Button */}
        <button
          onClick={() => setIsCustomizing(false)}
          className="flex items-center gap-1.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold px-3.5 py-1.5 rounded-[2px] transition-all shadow-xs cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
}
