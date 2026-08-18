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
      className={`rounded-[2px] border border-dashed transition-all flex flex-col items-center justify-center p-2 min-h-[112px] h-full ${
        isOver
          ? "border-[#0047ba] bg-[#0047ba]/10 scale-[1.01]"
          : "border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300"
      }`}
      style={{
        gridColumn: `${col} / span 1`,
        gridRow: `${row} / span 1`,
      }}
    >
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-[#0047ba] font-medium transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Drop or Add</span>
      </button>
    </div>
  );
}

function DashboardContent() {
  const { widgets, isCustomizing, isDarkMode } = useDashboard();

  // In customize mode, identify open grid slots across 4 cols and 5 rows
  const maxRows = 5;
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
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-200 ${
        isDarkMode ? "dark text-slate-100" : "bg-[#f1f4fa] text-slate-900"
      }`}
      style={{
        background: isDarkMode
          ? "radial-gradient(ellipse 90% 45% at 50% 0%, rgba(0, 84, 148, 0.28) 0%, rgba(5, 8, 20, 0) 75%), #050814"
          : "#f1f4fa",
      }}
    >
      <div className="flex flex-1 min-h-0">
        {/* Navigation Sidebar — always visible; its own robot button collapses the icon list */}
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation Bar */}
          <Header />

          {/* Main Container */}
          <main className="w-full max-w-[1440px] mx-auto px-4 py-2 flex-1 flex flex-col">
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
      </div>

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
