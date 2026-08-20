"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SearchAssistant from "@/components/SearchAssistant";
import DashboardTabs from "@/components/DashboardTabs";
import CustomizeToolbar from "@/components/CustomizeToolbar";
import AddWidgetModal from "@/components/AddWidgetModal";
import EditWidgetModal from "@/components/EditWidgetModal";
import CreateDashboardModal from "@/components/CreateDashboardModal";
import EmptyDashboardState from "@/components/EmptyDashboardState";
import WidgetWrapper from "@/components/WidgetWrapper";
import TaiChatPanel from "@/components/TaiChatPanel";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import { Plus } from "lucide-react";

function EmptyGridSlot({
  col,
  row,
}: {
  col: number;
  row: number;
}) {
  const { placeWidgetAtPosition, draggedWidgetId, setIsAddModalOpen } = useDashboard();
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const widgetId = e.dataTransfer.getData("text/plain") || draggedWidgetId;
    if (widgetId) {
      placeWidgetAtPosition(widgetId, col, row);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-[8px] border border-dashed transition-all flex flex-col items-center justify-center p-2 min-h-[112px] h-full ${
        isOver
          ? "border-[#002E5D] bg-[#002E5D]/10 scale-[1.01]"
          : "border-[#EAEEF3] bg-[#F9FBFF] hover:bg-[#F2F4F6] hover:border-[#7790A9]"
      }`}
      style={{
        gridColumn: `${col} / span 1`,
        gridRow: `${row} / span 1`,
      }}
    >
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-[#002E5D] font-medium transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Drop or Add</span>
      </button>
    </div>
  );
}

function DashboardContent() {
  const { widgets, isCustomizing, isDarkMode, isTaiChatOpen } = useDashboard();

  // In customize mode, identify open grid slots across 4 cols and dynamic max rows
  const maxRows = Math.max(6, ...widgets.map((w) => (w.rowStart || 1) + w.rowSpan - 1));
  const gridSlots = [];
  if (isCustomizing && widgets.length > 0) {
    for (let r = 1; r <= maxRows; r++) {
      for (let c = 1; c <= 4; c++) {
        // Check if any widget currently starts or spans this cell
        const isOccupied = widgets.some((w) => {
          const wColStart = w.colStart || 1;
          const wRowStart = w.rowStart || 1;
          const wColEnd = wColStart + w.colSpan - 1;
          const wRowEnd = wRowStart + w.rowSpan - 1;
          return c >= wColStart && c <= wColEnd && r >= wRowStart && r <= wRowEnd;
        });

        if (!isOccupied) {
          gridSlots.push({ col: c, row: r });
        }
      }
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-row font-sans antialiased transition-colors duration-200 overflow-x-hidden ${
        isDarkMode ? "dark bg-[#050814] text-slate-100" : "bg-[#F2F4F6] text-slate-900"
      }`}
      style={{
        background: isDarkMode
          ? "radial-gradient(ellipse 90% 45% at 50% 0%, rgba(0, 46, 93, 0.28) 0%, rgba(5, 8, 20, 0) 75%), #050814"
          : "#F2F4F6",
      }}
    >
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navigation Bar */}
        <Header />

        {/* Main Content Area */}
        <main className="w-full px-2 py-2 flex-1 flex flex-col transition-all duration-300">
          {/* TAI Assistant Greeting & Search Bar */}
          <SearchAssistant />

          {/* Dashboard Navigation Tabs & Settings */}
          <DashboardTabs />

          {/* Customization Toolbar (active in customize mode) */}
          <CustomizeToolbar />

          {/* Render Empty State if 0 widgets exist on this dashboard */}
          {widgets.length === 0 ? (
            <EmptyDashboardState />
          ) : (
            /* Dynamic 4-Column Grid with Taller Reference Height (144px base row) */
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 items-stretch flex-1"
              style={{
                gridAutoRows: "144px",
              }}
            >
              {widgets.map((widget, index) => (
                <WidgetWrapper key={widget.id} widget={widget} index={index} />
              ))}

              {/* Empty Drop Slots visible only in Customize Mode */}
              {isCustomizing &&
                gridSlots.map((slot) => (
                  <EmptyGridSlot
                    key={`slot-${slot.col}-${slot.row}`}
                    col={slot.col}
                    row={slot.row}
                  />
                ))}
            </div>
          )}
        </main>
      </div>

      {/* TAI Chat Side Panel (seamless right column of the screen) */}
      <TaiChatPanel />

      {/* Create New Dashboard Archetype Modal */}
      <CreateDashboardModal />

      {/* Add Widget Catalog Modal */}
      <AddWidgetModal />

      {/* Edit Widget Config Modal */}
      <EditWidgetModal />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
