"use client";

import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const TOOLTIP_WIDTH = 240; // matches w-60
const VIEWPORT_MARGIN = 8;
const GAP = 10;

export default function Tooltip({
  content,
  children,
  position = "top",
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; arrowLeft: number } | null>(
    null
  );
  const triggerRef = useRef<HTMLDivElement>(null);

  const computeCoords = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const anchorX = rect.left + rect.width / 2;

    let top = 0;
    let left = anchorX;

    if (position === "bottom") {
      top = rect.bottom + GAP;
      left = anchorX;
    } else if (position === "top") {
      top = rect.top - GAP;
      left = anchorX;
    } else if (position === "left") {
      top = rect.top + rect.height / 2;
      left = rect.left - GAP;
    } else {
      top = rect.top + rect.height / 2;
      left = rect.right + GAP;
    }

    // Clamp horizontally within the viewport, keep arrow pointing at the trigger
    const isVertical = position === "top" || position === "bottom";
    let clampedLeft = left;
    let arrowLeft = TOOLTIP_WIDTH / 2;

    if (isVertical) {
      const minLeft = VIEWPORT_MARGIN + TOOLTIP_WIDTH / 2;
      const maxLeft = window.innerWidth - VIEWPORT_MARGIN - TOOLTIP_WIDTH / 2;
      clampedLeft = Math.min(Math.max(left, minLeft), maxLeft);
      arrowLeft = TOOLTIP_WIDTH / 2 + (left - clampedLeft);
      arrowLeft = Math.min(Math.max(arrowLeft, 12), TOOLTIP_WIDTH - 12);
    }

    setCoords({ top, left: clampedLeft, arrowLeft });
  };

  const show = () => {
    computeCoords();
    setIsVisible(true);
  };

  const hide = () => setIsVisible(false);

  const getTransform = () => {
    switch (position) {
      case "bottom":
        return "translate(-50%, 0)";
      case "top":
        return "translate(-50%, -100%)";
      case "left":
        return "translate(-100%, -50%)";
      case "right":
      default:
        return "translate(0, -50%)";
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case "bottom":
        return "-top-1.5 border-b-[6px] border-b-[#001F42] border-x-[6px] border-x-transparent border-t-0";
      case "left":
        return "-right-1.5 top-1/2 -translate-y-1/2 border-l-[6px] border-l-[#001F42] border-y-[6px] border-y-transparent border-r-0";
      case "right":
        return "-left-1.5 top-1/2 -translate-y-1/2 border-r-[6px] border-r-[#001F42] border-y-[6px] border-y-transparent border-l-0";
      case "top":
      default:
        return "-bottom-1.5 border-t-[6px] border-t-[#001F42] border-x-[6px] border-x-transparent border-b-0";
    }
  };

  const isVertical = position === "top" || position === "bottom";

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {isVisible &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            className="fixed z-[9999] pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95"
            style={{ top: coords.top, left: coords.left, transform: getTransform() }}
          >
            <div className="relative bg-[#001F42] text-white text-xs leading-relaxed font-normal px-4 py-3 rounded-[4px] shadow-xl w-60 whitespace-normal text-left select-none">
              {content}
              {/* Triangular Arrow Pointer */}
              <div
                className={`absolute w-0 h-0 ${getArrowClasses()}`}
                style={isVertical ? { left: coords.arrowLeft, transform: "translateX(-50%)" } : undefined}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
