"use client";

import React, { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { Setting4, Add, Refresh, TickCircle, Bookmark, TickSquare } from "iconsax-react";

export default function CustomizeToolbar() {
  const {
    isCustomizing,
    setIsCustomizing,
    setIsAddModalOpen,
    resetToDefault,
    saveCurrentAsTemplate,
    autoPackLayout,
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
    <div className="w-full bg-white text-slate-900 rounded-[8px] p-2.5 mb-2 flex flex-wrap items-center justify-between gap-2 shadow-xs border border-[#EAEEF3] animate-in fade-in slide-in-from-top-1 duration-150">
      {/* Left Info */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE] flex items-center justify-center">
          <Setting4 size={18} color="currentColor" variant="Linear" />
        </div>
        <div>
          <h3 className="text-xs font-semibold tracking-tight text-[#2C3746] leading-tight">
            Customize Dashboard Layout
          </h3>
          <p className="text-[10px] text-[#7790A9] font-normal mt-0.5">
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
              className="text-xs text-[#2C3746] bg-white border border-[#EAEEF3] rounded-[4px] px-2.5 py-1.5 focus:outline-none focus:border-[#002E5D] w-36"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-[#002E5D] hover:bg-[#0A3492] text-white rounded-[4px] text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsSavingTemplate(false)}
              className="px-2 py-1.5 bg-[#F2F4F6] hover:bg-[#EAEEF3] text-[#7790A9] rounded-[4px] text-xs cursor-pointer"
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
            className="flex items-center gap-1.5 bg-white hover:bg-[#F9FBFF] text-[#2C3746] hover:text-[#002E5D] text-xs font-medium px-3 py-1.5 rounded-[4px] transition-all cursor-pointer border border-[#EAEEF3]"
            title="Save current layout as a reusable template"
          >
            {savedSuccess ? (
              <>
                <TickSquare size={14} color="#059669" variant="Bold" />
                <span className="text-emerald-600 font-semibold">Saved!</span>
              </>
            ) : (
              <>
                <Bookmark size={14} color="#002E5D" variant="Linear" />
                <span>Save as Template</span>
              </>
            )}
          </button>
        )}

        {/* Add Widget Button (Arista Blue) */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#002E5D] hover:bg-[#0A3492] text-white text-xs font-semibold px-3.5 py-1.5 rounded-[4px] transition-all shadow-xs cursor-pointer"
        >
          <Add size={16} color="currentColor" variant="Linear" />
          <span>Add Widget</span>
        </button>

        {/* Compact Grid / Auto-Pack Button */}
        <button
          onClick={autoPackLayout}
          className="flex items-center gap-1.5 bg-white hover:bg-[#F9FBFF] text-[#2C3746] hover:text-[#002E5D] text-xs font-medium px-3 py-1.5 rounded-[4px] transition-all cursor-pointer border border-[#EAEEF3]"
          title="Auto-pack layout to eliminate empty grid gaps"
        >
          <Refresh size={14} color="#002E5D" variant="Linear" />
          <span>Compact Grid</span>
        </button>

        {/* Reset Defaults */}
        <button
          onClick={resetToDefault}
          className="flex items-center gap-1.5 bg-white hover:bg-[#F9FBFF] text-[#2C3746] hover:text-[#002E5D] text-xs font-medium px-3 py-1.5 rounded-[4px] transition-all cursor-pointer border border-[#EAEEF3]"
        >
          <Refresh size={14} color="currentColor" variant="Linear" />
          <span>Reset Defaults</span>
        </button>

        {/* Done Button */}
        <button
          onClick={() => setIsCustomizing(false)}
          className="flex items-center gap-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold px-3.5 py-1.5 rounded-[4px] transition-all shadow-xs cursor-pointer"
        >
          <TickCircle size={15} color="#ffffff" variant="Bold" />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
}
