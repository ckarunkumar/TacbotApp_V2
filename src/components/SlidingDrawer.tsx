"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface SlidingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  isPrimaryDisabled?: boolean;
  isPrimaryLoading?: boolean;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
  footerLeftContent?: React.ReactNode;
  /** Overrides the drawer's max width (default 480px). e.g. "max-w-[860px]" */
  widthClass?: string;
  /** Optional dedicated right-hand panel rendered alongside `children`, splitting the drawer body into two columns. */
  sidePanel?: React.ReactNode;
  /** Width of the sidePanel column (default 340px). e.g. "w-[460px]" */
  sidePanelWidthClass?: string;
}

export default function SlidingDrawer({
  isOpen,
  onClose,
  title,
  icon,
  children,
  primaryButtonText,
  onPrimaryClick,
  isPrimaryDisabled = false,
  isPrimaryLoading = false,
  secondaryButtonText,
  onSecondaryClick,
  footerLeftContent,
  widthClass = "max-w-[480px]",
  sidePanel,
  sidePanelWidthClass = "w-[340px]",
}: SlidingDrawerProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Right Sliding Window Drawer with Uniform Exact 480px Width */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen ${widthClass} bg-white shadow-2xl border-l border-[#EAEEF3] flex flex-col animate-in slide-in-from-right duration-300 ease-out rounded-l-[8px]`}>
          {/* Drawer Top Header (Strict standard: No description, clean title + icon + close) */}
          <div className="px-4 py-3.5 border-b border-[#EAEEF3] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="w-8 h-8 rounded-[8px] bg-blue-50 text-[#002E5D] border border-blue-100 flex items-center justify-center shrink-0">
                  {icon}
                </div>
              )}
              <h2 className="text-sm font-semibold text-slate-900 tracking-tight leading-none">
                {title}
              </h2>
            </div>

            {/* Clean Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-[8px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-[#F9FBFF] transition-colors cursor-pointer border border-[#EAEEF3] shadow-2xs shrink-0"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          {sidePanel ? (
            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* No overlay-scroll here — children (AddWidgetModal) owns its own
                  internal overlay-scroll container. Nesting two would force this
                  wrapper's overflow-x to "auto" too (a CSS rule: overflow-y != visible
                  forces overflow-x to compute as auto), which clips the inner
                  container's negative-margin bleed instead of letting it overlap. */}
              <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">{children}</div>
              <div className={`${sidePanelWidthClass} shrink-0 border-l border-[#EAEEF3] dark:border-[#162444] overlay-scroll bg-[#F9FBFF]/60 dark:bg-[#050814]`}>
                {sidePanel}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overlay-scroll">{children}</div>
          )}

          {/* Drawer Bottom Footer with One Primary Button */}
          {(primaryButtonText || secondaryButtonText || footerLeftContent) && (
            <div className="p-4 border-t border-[#EAEEF3] bg-white flex items-center justify-between shrink-0">
              <div>{footerLeftContent}</div>

              <div className="flex items-center gap-2">
                {secondaryButtonText && (
                  <button
                    type="button"
                    onClick={onSecondaryClick || onClose}
                    className="px-4 py-2 bg-[#F2F4F6] hover:bg-slate-200 text-slate-700 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer border border-[#EAEEF3]"
                  >
                    {secondaryButtonText}
                  </button>
                )}

                {primaryButtonText && (
                  <button
                    type="button"
                    onClick={onPrimaryClick}
                    disabled={isPrimaryDisabled || isPrimaryLoading}
                    className={`px-5 py-2 bg-[#002E5D] hover:bg-[#0A3492] text-white rounded-[8px] text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      isPrimaryDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {primaryButtonText}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
