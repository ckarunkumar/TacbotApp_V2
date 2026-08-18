"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Share2, Link as LinkIcon, Check } from "lucide-react";

interface ShareWidgetButtonProps {
  widgetTitle: string;
  widgetId: string;
  className?: string;
  /** What kind of resource this link points at — controls the URL path and copy. Defaults to "widget". */
  resourceType?: "widget" | "dashboard";
}

const POPOVER_WIDTH = 280;

export default function ShareWidgetButton({
  widgetTitle,
  widgetId,
  className,
  resourceType = "widget",
}: ShareWidgetButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/shared/${resourceType}/${widgetId}`
      : "";

  const openPopover = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const left = Math.min(rect.right - POPOVER_WIDTH, window.innerWidth - POPOVER_WIDTH - 8);
    setCoords({ top: rect.bottom + 8, left: Math.max(8, left) });
    setCopied(false);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — the input is still focusable/selectable for manual copy.
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          isOpen ? setIsOpen(false) : openPopover();
        }}
        className={
          className ||
          "w-6 h-6 rounded-[2px] bg-white/95 hover:bg-blue-50 text-slate-500 hover:text-[#0047ba] flex items-center justify-center transition-colors cursor-pointer border border-slate-200/90 shadow-2xs"
        }
        title={resourceType === "dashboard" ? "Share Dashboard" : "Share Widget"}
        aria-label={resourceType === "dashboard" ? "Share Dashboard" : "Share Widget"}
      >
        <Share2 className="w-3 h-3" />
      </button>

      {isOpen &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed z-[9999] w-[280px] bg-white dark:bg-[#091122] rounded-[2px] border border-slate-200 dark:border-[#162444] shadow-xl p-3 animate-in fade-in zoom-in-95 duration-150"
            style={{ top: coords.top, left: coords.left }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Share2 className="w-3.5 h-3.5 text-[#0047ba] shrink-0" />
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                Share &ldquo;{widgetTitle}&rdquo;
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">
              {resourceType === "dashboard"
                ? "Anyone with the link can view this dashboard."
                : "Anyone on this dashboard with the link can view this widget."}
            </p>
            <div className="flex items-center gap-1.5">
              <input
                readOnly
                value={shareUrl}
                onFocus={(e) => e.target.select()}
                className="flex-1 min-w-0 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#07132a] border border-slate-200 dark:border-[#162444] rounded-[2px] px-2 py-1.5 truncate focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-[2px] text-[11px] font-semibold transition-colors cursor-pointer ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-[#0047ba] hover:bg-[#003d9e] text-white"
                }`}
              >
                {copied ? <Check className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
