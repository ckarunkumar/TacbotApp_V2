"use client";

import React, { useState, useRef } from "react";
import { DashboardWidget } from "@/types/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import {
  X,
  Edit2,
  Info,
} from "lucide-react";
import Tooltip from "@/components/Tooltip";
import Badge from "@/components/Badge";
import ShareWidgetButton from "@/components/ShareWidgetButton";
import CaseSummaryCard from "@/components/CaseSummaryCard";
import SlaSummaryCard from "@/components/SlaSummaryCard";
import TotalCasesCard from "@/components/TotalCasesCard";
import TreemapCard from "@/components/TreemapCard";
import SlaHealthCard from "@/components/SlaHealthCard";
import AvgResolutionCard from "@/components/AvgResolutionCard";
import AlertsSidebar from "@/components/AlertsSidebar";
import VendorResponseCard from "@/components/VendorResponseCard";
import CriticalEscalationsCard from "@/components/CriticalEscalationsCard";

interface WidgetWrapperProps {
  widget: DashboardWidget;
  index?: number;
}

export default function WidgetWrapper({ widget }: WidgetWrapperProps) {
  const {
    isCustomizing,
    removeWidget,
    setEditingWidget,
    reorderWidgetById,
    resizeWidget,
    draggedWidgetId,
    setDraggedWidgetId,
  } = useDashboard();

  const [isDragOver, setIsDragOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Render widget based on type
  const renderWidgetContent = () => {
    switch (widget.type) {
      case "case-summary":
        return <CaseSummaryCard />;
      case "sla-summary":
        return <SlaSummaryCard />;
      case "total-cases":
        return <TotalCasesCard />;
      case "treemap":
        return <TreemapCard />;
      case "sla-health":
        return <SlaHealthCard />;
      case "avg-resolution":
        return <AvgResolutionCard />;
      case "alerts":
        return <AlertsSidebar />;
      case "vendor-response":
        return <VendorResponseCard />;
      case "critical-escalations":
        return <CriticalEscalationsCard />;
      case "custom-kpi":
      default:
        return (
          <div className="bg-white rounded-[8px] border border-[#EAEEF3] p-4 shadow-xs flex flex-col justify-between h-full hover:bg-[#F9FBFF] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-[#2C3746] tracking-tight">
                {widget.customTitle || widget.title}
              </h3>
              <Tooltip content={widget.customSubtitle || "Custom configured operational telemetry widget"} position="bottom">
                <button
                  className="text-[#7790A9] hover:text-[#2C3746] transition-colors cursor-pointer"
                  aria-label="Widget Information"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl md:text-2xl font-semibold text-[#2C3746] tracking-tight">
                {widget.customMetricValue || "100%"}
              </span>
              {widget.customBadge && (
                <Badge variant="success">{widget.customBadge}</Badge>
              )}
            </div>

            {widget.customSubtitle && (
              <p className="text-[10px] text-[#7790A9] font-normal truncate">
                {widget.customSubtitle}
              </p>
            )}
          </div>
        );
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent) => {
    if (!isCustomizing) return;
    e.dataTransfer.setData("text/plain", widget.id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedWidgetId(widget.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isCustomizing || draggedWidgetId === widget.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isCustomizing) return;
    e.preventDefault();
    setIsDragOver(false);
    const sourceId = e.dataTransfer.getData("text/plain") || draggedWidgetId;
    if (sourceId && sourceId !== widget.id) {
      reorderWidgetById(sourceId, widget.id);
    }
    setDraggedWidgetId(null);
  };

  const handleDragEnd = () => {
    setDraggedWidgetId(null);
    setIsDragOver(false);
  };

  // --- Multi-Directional Edge Drag-to-Resize ---
  const startResize = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialColSpan = widget.colSpan;
    const initialRowSpan = widget.rowSpan;

    // Thresholds: ~160px for column step, ~80px for row step
    const colStepPx = 160;
    const rowStepPx = 80;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newColSpan = initialColSpan;
      let newRowSpan = initialRowSpan;

      if (direction.includes("right")) {
        const addedCols = Math.round(deltaX / colStepPx);
        newColSpan = Math.max(1, Math.min(4, initialColSpan + addedCols)) as 1 | 2 | 3 | 4;
      } else if (direction.includes("left")) {
        const addedCols = Math.round(-deltaX / colStepPx);
        newColSpan = Math.max(1, Math.min(4, initialColSpan + addedCols)) as 1 | 2 | 3 | 4;
      }

      if (direction.includes("bottom")) {
        const addedRows = Math.round(deltaY / rowStepPx);
        newRowSpan = Math.max(1, Math.min(6, initialRowSpan + addedRows)) as 1 | 2 | 3 | 4 | 5 | 6;
      } else if (direction.includes("top")) {
        const addedRows = Math.round(-deltaY / rowStepPx);
        newRowSpan = Math.max(1, Math.min(6, initialRowSpan + addedRows)) as 1 | 2 | 3 | 4 | 5 | 6;
      }

      if (newColSpan !== widget.colSpan || newRowSpan !== widget.rowSpan) {
        resizeWidget(widget.id, newColSpan, newRowSpan);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const isBeingDragged = draggedWidgetId === widget.id;

  return (
    <div
      ref={containerRef}
      draggable={isCustomizing}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`group/widget relative transition-all duration-150 flex flex-col h-full w-full select-none ${
        isBeingDragged ? "opacity-30 scale-[0.99]" : "opacity-100"
      } ${
        isDragOver
          ? "ring-2 ring-[#002E5D] ring-offset-1 scale-[1.01] shadow-md rounded-[8px] z-20"
          : ""
      }`}
      style={{
        gridColumn: widget.colStart
          ? `${widget.colStart} / span ${widget.colSpan}`
          : `span ${widget.colSpan}`,
        gridRow: widget.rowStart
          ? `${widget.rowStart} / span ${widget.rowSpan}`
          : `span ${widget.rowSpan}`,
      }}
    >
      {/* Drop Target Indicator when dragged over */}
      {isDragOver && (
        <div className="absolute inset-0 bg-[#002E5D]/10 border-2 border-dashed border-[#002E5D] rounded-[8px] z-30 pointer-events-none flex items-center justify-center backdrop-blur-2xs">
          <span className="bg-[#0b2545] text-white text-xs font-semibold px-4 py-2 rounded-[8px] shadow-sm">
            Drop to Place Here
          </span>
        </div>
      )}

      {/* Customize Overlay Controls (Clean, Unobtrusive B2B Styling) */}
      {isCustomizing && (
        <div className="absolute inset-0 z-20 pointer-events-none rounded-[8px] border border-[#002E5D]/30 ring-1 ring-[#002E5D]/20 bg-[#002E5D]/[0.01] transition-all">
          {/* Subtle Top-Right Quick Action Buttons */}
          <div className="absolute top-2 right-2 flex items-center gap-1 pointer-events-auto z-30">
            <ShareWidgetButton widgetTitle={widget.customTitle || widget.title} widgetId={widget.id} />
            <button
              onClick={() => setEditingWidget(widget)}
              className="w-6 h-6 rounded-[8px] bg-white/95 hover:bg-[#ECF3FF] text-[#7790A9] hover:text-[#002E5D] flex items-center justify-center transition-colors cursor-pointer border border-[#EAEEF3] shadow-2xs"
              title="Edit Widget"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => removeWidget(widget.id)}
              className="w-6 h-6 rounded-[8px] bg-white/95 hover:bg-red-50 text-[#7790A9] hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer border border-[#EAEEF3] shadow-2xs"
              title="Remove Widget"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Discreet Multi-Directional Edge & Corner Resize Handles */}
          {/* Right Edge Handle */}
          <div
            onMouseDown={(e) => startResize(e, "right")}
            className="absolute top-8 bottom-8 -right-1 w-2 pointer-events-auto cursor-ew-resize flex items-center justify-center group z-30"
            title="Drag right/left to resize columns"
          >
            <div className="w-1 h-6 rounded-full bg-slate-300 group-hover:bg-[#002E5D] group-hover:w-1.5 group-hover:h-10 transition-all" />
          </div>

          {/* Bottom Edge Handle */}
          <div
            onMouseDown={(e) => startResize(e, "bottom")}
            className="absolute left-8 right-8 -bottom-1 h-2 pointer-events-auto cursor-ns-resize flex items-center justify-center group z-30"
            title="Drag down/up to resize rows"
          >
            <div className="h-1 w-6 rounded-full bg-slate-300 group-hover:bg-[#002E5D] group-hover:w-10 group-hover:h-1.5 transition-all" />
          </div>

          {/* Left Edge Handle */}
          <div
            onMouseDown={(e) => startResize(e, "left")}
            className="absolute top-8 bottom-8 -left-1 w-2 pointer-events-auto cursor-ew-resize flex items-center justify-center group z-30"
            title="Drag to resize columns"
          >
            <div className="w-1 h-6 rounded-full bg-slate-300 group-hover:bg-[#002E5D] group-hover:w-1.5 group-hover:h-10 transition-all" />
          </div>

          {/* Top Edge Handle */}
          <div
            onMouseDown={(e) => startResize(e, "top")}
            className="absolute left-8 right-8 -top-1 h-2 pointer-events-auto cursor-ns-resize flex items-center justify-center group z-30"
            title="Drag to resize rows"
          >
            <div className="h-1 w-6 rounded-full bg-slate-300 group-hover:bg-[#002E5D] group-hover:w-10 group-hover:h-1.5 transition-all" />
          </div>

          {/* Bottom-Right Corner Handle */}
          <div
            onMouseDown={(e) => startResize(e, "bottom-right")}
            className="absolute -bottom-1 -right-1 w-4 h-4 pointer-events-auto cursor-nwse-resize flex items-center justify-center group z-30"
            title="Drag corner to resize both columns and rows"
          >
            <div className="w-2.5 h-2.5 rounded-br-md bg-slate-300 group-hover:bg-[#002E5D] group-hover:scale-125 transition-transform border border-white" />
          </div>
        </div>
      )}

      {/* Share action — visible on hover in normal (non-customize) view mode.
          Floats just outside the card's corner (not top-2 right-2) so it never
          overlaps each card's own top-right info/help icon. */}
      {!isCustomizing && (
        <div className="absolute -top-2 -right-2 z-20 opacity-0 group-hover/widget:opacity-100 transition-opacity pointer-events-none group-hover/widget:pointer-events-auto">
          <ShareWidgetButton
            widgetTitle={widget.customTitle || widget.title}
            widgetId={widget.id}
            className="w-6 h-6 rounded-full bg-white dark:bg-[#091122] hover:bg-blue-50 dark:hover:bg-[#0e1d38] text-slate-500 hover:text-[#002E5D] flex items-center justify-center transition-colors cursor-pointer border border-[#EAEEF3] dark:border-[#162444] shadow-md"
          />
        </div>
      )}

      {/* Actual Rendered Widget */}
      <div className="w-full h-full flex flex-col flex-1">{renderWidgetContent()}</div>
    </div>
  );
}
