"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft, ChevronDown, Check, GripVertical } from "lucide-react";

export interface CasesCategoryTabsProps {
  activeMainCategory?: string;
  onSelectMainCategory?: (category: string) => void;
  activeSubCategory?: string;
  onSelectSubCategory?: (subCategory: string) => void;
}

export type ParentCategory = string;

const INITIAL_PARENT_CATEGORIES: string[] = [
  "All",
  "Vendor",
  "Customer",
  "Internal group",
  "External",
  "Automation Group",
  "Internal Vendors",
];

const INITIAL_ADDITIONAL_PARENT_ITEMS: string[] = [
  "Third Party Integrations",
  "Security & Compliance",
  "Database Services",
  "Storage & Backup",
  "Edge Network",
  "API Gateway",
  "Custom Operations",
];

const INITIAL_ADDITIONAL_CHILD_ITEMS: string[] = [
  "BGP Routing",
  "DNS Management",
  "SSL/TLS Certificates",
  "Load Balancing",
  "Firewall Rules",
  "VPC Peering",
  "SDN Controller",
];

const INITIAL_CHILDREN_BY_PARENT: Record<string, string[]> = {
  All: [
    "All",
    "Cloud",
    "Connectivity",
    "Hardware",
    "IPAM",
    "VPN",
    "Internal Service",
    "Customers",
    "IT Support",
    "Automation Service Type",
    "Internal Service Type",
    "A Type",
  ],
  Vendor: [
    "All",
    "Cloud",
    "Connectivity",
    "Hardware",
    "IPAM",
    "VPN",
    "Internal Service",
    "Customers",
    "IT Support",
    "Automation Service Type",
    "Internal Service Type",
    "A Type",
  ],
  Customer: [
    "All",
    "Enterprise",
    "Government",
    "Financial",
    "Healthcare",
    "Education",
  ],
  "Internal group": [
    "All",
    "TAC Tier 1",
    "TAC Tier 2",
    "Escalation Lead",
    "SRE Ops",
  ],
  External: ["All", "Carrier", "ISP", "Third-Party Support"],
  "Automation Group": [
    "All",
    "Auto-Remediation",
    "Script Runner",
    "Bot Dispatcher",
  ],
  "Internal Vendors": ["All", "In-House Infrastructure", "Lab Services"],
};

export default function CasesCategoryTabs({
  activeMainCategory: propMain,
  onSelectMainCategory,
  activeSubCategory: propSub,
  onSelectSubCategory,
}: CasesCategoryTabsProps) {
  const [parentTabs, setParentTabs] = useState<string[]>(INITIAL_PARENT_CATEGORIES);
  const [moreParentItems, setMoreParentItems] = useState<string[]>(INITIAL_ADDITIONAL_PARENT_ITEMS);
  const [childrenByParent, setChildrenByParent] = useState<Record<string, string[]>>(INITIAL_CHILDREN_BY_PARENT);
  const [moreChildItems, setMoreChildItems] = useState<string[]>(INITIAL_ADDITIONAL_CHILD_ITEMS);

  const [internalParent, setInternalParent] = useState<string>("All");
  const [internalChildMap, setInternalChildMap] = useState<Record<string, string>>({
    All: "All",
    Vendor: "All",
  });
  const [isLevel1MoreOpen, setIsLevel1MoreOpen] = useState(false);
  const [isLevel2MoreOpen, setIsLevel2MoreOpen] = useState(false);
  const [draggedParentItem, setDraggedParentItem] = useState<string | null>(null);
  const [draggedChildItem, setDraggedChildItem] = useState<string | null>(null);

  const parentScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollParentRight, setCanScrollParentRight] = useState(false);
  const [canScrollParentLeft, setCanScrollParentLeft] = useState(false);
  const [isParentOverflowing, setIsParentOverflowing] = useState(false);

  const childScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollChildRight, setCanScrollChildRight] = useState(false);
  const [canScrollChildLeft, setCanScrollChildLeft] = useState(false);
  const [isChildOverflowing, setIsChildOverflowing] = useState(false);

  const activeParent = propMain || internalParent;
  const currentChildren = childrenByParent[activeParent] || childrenByParent.All || ["All"];
  const activeChild = propSub || internalChildMap[activeParent] || "All";

  useEffect(() => {
    const checkParentScroll = () => {
      const el = parentScrollRef.current;
      if (!el) return;
      const isOverflowing = el.scrollWidth > el.clientWidth + 2;
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 6;
      const isAtStart = el.scrollLeft <= 6;

      setIsParentOverflowing(isOverflowing);
      setCanScrollParentRight(isOverflowing && !isAtEnd);
      setCanScrollParentLeft(isOverflowing && !isAtStart);
    };

    checkParentScroll();
    const el = parentScrollRef.current;
    if (el) el.addEventListener("scroll", checkParentScroll);
    window.addEventListener("resize", checkParentScroll);

    return () => {
      if (el) el.removeEventListener("scroll", checkParentScroll);
      window.removeEventListener("resize", checkParentScroll);
    };
  }, [parentTabs]);

  useEffect(() => {
    const checkChildScroll = () => {
      const el = childScrollRef.current;
      if (!el) return;
      const isOverflowing = el.scrollWidth > el.clientWidth + 2;
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 6;
      const isAtStart = el.scrollLeft <= 6;

      setIsChildOverflowing(isOverflowing);
      setCanScrollChildRight(isOverflowing && !isAtEnd);
      setCanScrollChildLeft(isOverflowing && !isAtStart);
    };

    checkChildScroll();
    const el = childScrollRef.current;
    if (el) el.addEventListener("scroll", checkChildScroll);
    window.addEventListener("resize", checkChildScroll);

    return () => {
      if (el) el.removeEventListener("scroll", checkChildScroll);
      window.removeEventListener("resize", checkChildScroll);
    };
  }, [currentChildren]);

  const scrollParentNextPage = () => {
    const el = parentScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  const scrollParentPrevPage = () => {
    const el = parentScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
  };

  const scrollChildNextPage = () => {
    const el = childScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  const scrollChildPrevPage = () => {
    const el = childScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
  };

  const handleParentClick = (parent: string) => {
    setInternalParent(parent);
    if (onSelectMainCategory) onSelectMainCategory(parent);
    const nextChild = internalChildMap[parent] || "All";
    if (onSelectSubCategory) onSelectSubCategory(nextChild);
  };

  const handleChildClick = (child: string) => {
    setInternalChildMap((prev) => ({ ...prev, [activeParent]: child }));
    if (onSelectSubCategory) onSelectSubCategory(child);
  };

  const addParentFromDropdown = (item: string) => {
    if (!parentTabs.includes(item)) {
      setParentTabs((prev) => [...prev, item]);
      setMoreParentItems((prev) => prev.filter((i) => i !== item));
    }
    handleParentClick(item);
    setIsLevel1MoreOpen(false);
  };

  const addChildFromDropdown = (item: string) => {
    setChildrenByParent((prev) => {
      const currentList = prev[activeParent] || ["All"];
      if (!currentList.includes(item)) {
        return { ...prev, [activeParent]: [...currentList, item] };
      }
      return prev;
    });
    setMoreChildItems((prev) => prev.filter((i) => i !== item));
    handleChildClick(item);
    setIsLevel2MoreOpen(false);
  };

  const level1CountFormatted = String(moreParentItems.length).padStart(2, "0");
  const level2CountFormatted = String(moreChildItems.length).padStart(2, "0");

  return (
    <div className="w-full flex flex-col mb-0 select-none sticky top-0 z-30 bg-[#F2F4F6] dark:bg-[#070D18]">
      {/* ── Level 1: Primary Navigation (Parent Categories) ── */}
      <div className="w-full px-0 pt-0 pb-0 flex items-center justify-between gap-1.5 relative z-30">
        <div
          ref={parentScrollRef}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const item = e.dataTransfer.getData("text/plain") || draggedParentItem;
            if (item) {
              addParentFromDropdown(item);
              setDraggedParentItem(null);
            }
          }}
          className="flex-1 min-w-0 flex items-center gap-1 text-xs shrink-0 items-end overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth"
        >
          {parentTabs.map((parent) => {
            const isParentActive = activeParent === parent;
            return (
              <button
                key={parent}
                type="button"
                onClick={() => handleParentClick(parent)}
                style={
                  isParentActive
                    ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                    : undefined
                }
                className={`py-1.5 px-2 rounded-t-[6px] !rounded-b-none transition-colors duration-150 ease-out cursor-pointer whitespace-nowrap text-xs md:text-[13px] relative z-20 ${
                  isParentActive
                    ? "bg-white dark:bg-[#091122] text-[#002E5D] dark:text-white font-bold shadow-2xs after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-1.5 after:bg-white dark:after:bg-[#091122] after:z-30"
                    : "bg-transparent text-[#576B81] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-slate-200 font-medium"
                }`}
              >
                {parent}
              </button>
            );
          })}
        </div>

        {/* Right Actions: Chevron Pagination Controls + View More + Failure Queue (Unclipped) */}
        <div className="flex items-center gap-1.5 shrink-0 pr-1 pb-1 relative z-40 overflow-visible">
          {isParentOverflowing && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={scrollParentPrevPage}
                disabled={!canScrollParentLeft}
                className={`w-6.5 h-6.5 rounded-[4px] bg-white dark:bg-[#091122] border border-[#EAEEF3] dark:border-[#1e3056] text-[#576B81] dark:text-slate-400 flex items-center justify-center transition-colors shadow-2xs ${
                  canScrollParentLeft
                    ? "hover:text-[#002E5D] dark:hover:text-white cursor-pointer opacity-100"
                    : "opacity-30 cursor-not-allowed"
                }`}
                title="Previous page of tabs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={scrollParentNextPage}
                disabled={!canScrollParentRight}
                className={`w-6.5 h-6.5 rounded-[4px] bg-white dark:bg-[#091122] border border-[#EAEEF3] dark:border-[#1e3056] text-[#576B81] dark:text-slate-400 flex items-center justify-center transition-colors shadow-2xs ${
                  canScrollParentRight
                    ? "hover:text-[#002E5D] dark:hover:text-white cursor-pointer opacity-100"
                    : "opacity-30 cursor-not-allowed"
                }`}
                title="Next page of tabs"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLevel1MoreOpen((prev) => !prev)}
              className="h-6.5 px-2 rounded-[4px] bg-[#E2E8F0]/70 dark:bg-slate-800/80 text-[#576B81] dark:text-slate-300 text-xs font-medium hover:bg-[#E2E8F0] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>View More</span>
              <span className="px-1.5 py-0.5 rounded-[3px] bg-[#7790A9]/20 text-[#002E5D] dark:text-blue-300 text-[10px] font-bold leading-none">
                {level1CountFormatted}
              </span>
              <ChevronDown className="w-3 h-3 text-[#7790A9]" />
            </button>

            {isLevel1MoreOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-[#081024] border border-[#EAEEF3] dark:border-[#1e3056] rounded-[8px] shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-[#7790A9] dark:text-slate-400 uppercase tracking-wider border-b border-[#EAEEF3] dark:border-[#1e3056] flex items-center justify-between">
                  <span>More Categories (Drag & Drop)</span>
                  <span className="bg-[#ECF3FF] dark:bg-[#002E5D]/50 text-[#002E5D] dark:text-blue-300 px-1.5 py-0.5 rounded text-[9px] font-bold">
                    {level1CountFormatted}
                  </span>
                </div>
                <div className="py-1 flex flex-col max-h-60 overflow-y-auto no-scrollbar">
                  {moreParentItems.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-[#7790A9] text-center italic">
                      All categories added
                    </div>
                  ) : (
                    moreParentItems.map((item) => (
                      <div
                        key={item}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", item);
                          e.dataTransfer.effectAllowed = "move";
                          setDraggedParentItem(item);
                        }}
                        onClick={() => addParentFromDropdown(item)}
                        className="w-full px-3 py-1.5 text-xs font-medium text-[#2C3746] dark:text-slate-200 hover:bg-[#F2F4F6] dark:hover:bg-[#121c33] transition-colors flex items-center justify-between cursor-grab active:cursor-grabbing group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <GripVertical className="w-3.5 h-3.5 text-[#A0AEC0] group-hover:text-[#002E5D] dark:group-hover:text-blue-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                        {activeParent === item && (
                          <Check className="w-3.5 h-3.5 text-[#002E5D] dark:text-[#38bdf8] shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="h-6.5 px-2 rounded-[4px] bg-[#fde8e8] dark:bg-[#450a0a]/50 text-[#e02424] dark:text-red-300 text-xs font-semibold hover:bg-[#fbd5d5] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Failure Queue</span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#e02424] text-white text-[9px] font-bold flex items-center justify-center leading-none">
              16
            </span>
          </button>
        </div>
      </div>

      {/* ── Level 2: Secondary Navigation (Children of Active Parent Context — Full Width Flat Row) ── */}
      <div className="w-full bg-white dark:bg-[#091122] border-b border-[#EAEEF3] dark:border-[#162444] px-0 py-1 flex items-center justify-between gap-1.5 relative z-10">
        <div
          ref={childScrollRef}
          key={activeParent}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const item = e.dataTransfer.getData("text/plain") || draggedChildItem;
            if (item) {
              addChildFromDropdown(item);
              setDraggedChildItem(null);
            }
          }}
          className="flex-1 min-w-0 flex items-center gap-1 text-xs md:text-[13px] shrink-0 overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth animate-in fade-in duration-200"
        >
          {currentChildren.map((child) => {
            const isChildActive = activeChild === child;
            return (
              <button
                key={child}
                type="button"
                onClick={() => handleChildClick(child)}
                className={`py-1 px-2 transition-colors duration-150 ease-out cursor-pointer relative whitespace-nowrap ${
                  isChildActive
                    ? "text-[#002E5D] dark:text-[#38bdf8] font-bold"
                    : "text-[#7790A9] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-slate-200 font-medium"
                }`}
              >
                {child}
                {isChildActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#002E5D] dark:bg-[#38bdf8] rounded-full animate-in fade-in duration-150" />
                )}
              </button>
            );
          })}
        </div>

        <div className="relative shrink-0 pr-3 z-40 overflow-visible flex items-center gap-2">
          {isChildOverflowing && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollChildPrevPage}
                disabled={!canScrollChildLeft}
                className={`w-6 h-6 rounded-[4px] bg-[#F2F4F6] dark:bg-[#0c162d] text-[#576B81] dark:text-slate-400 flex items-center justify-center transition-colors ${
                  canScrollChildLeft
                    ? "hover:text-[#002E5D] dark:hover:text-white cursor-pointer opacity-100"
                    : "opacity-30 cursor-not-allowed"
                }`}
                title="Previous page of sub-tabs"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={scrollChildNextPage}
                disabled={!canScrollChildRight}
                className={`w-6 h-6 rounded-[4px] bg-[#F2F4F6] dark:bg-[#0c162d] text-[#576B81] dark:text-slate-400 flex items-center justify-center transition-colors ${
                  canScrollChildRight
                    ? "hover:text-[#002E5D] dark:hover:text-white cursor-pointer opacity-100"
                    : "opacity-30 cursor-not-allowed"
                }`}
                title="Next page of sub-tabs"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsLevel2MoreOpen((prev) => !prev)}
            className="h-7 px-2.5 rounded-[4px] bg-[#F2F4F6] dark:bg-[#0c162d] text-[#576B81] dark:text-slate-300 text-[11px] font-medium hover:bg-[#EAEEF3] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>View More</span>
            <span className="px-1.5 py-0.5 rounded-[3px] bg-[#7790A9]/20 text-[#002E5D] dark:text-blue-300 text-[10px] font-bold leading-none">
              {level2CountFormatted}
            </span>
            <ChevronDown className="w-3 h-3 text-[#7790A9]" />
          </button>

          {isLevel2MoreOpen && (
            <div className="absolute right-3 top-full mt-1.5 w-56 bg-white dark:bg-[#081024] border border-[#EAEEF3] dark:border-[#1e3056] rounded-[8px] shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-[#7790A9] dark:text-slate-400 uppercase tracking-wider border-b border-[#EAEEF3] dark:border-[#1e3056] flex items-center justify-between">
                <span>More Sub-Categories (Drag & Drop)</span>
                <span className="bg-[#ECF3FF] dark:bg-[#002E5D]/50 text-[#002E5D] dark:text-blue-300 px-1.5 py-0.5 rounded text-[9px] font-bold">
                  {level2CountFormatted}
                </span>
              </div>
              <div className="py-1 flex flex-col max-h-60 overflow-y-auto no-scrollbar">
                {moreChildItems.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-[#7790A9] text-center italic">
                    All sub-categories added
                  </div>
                ) : (
                  moreChildItems.map((item) => (
                    <div
                      key={item}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", item);
                        e.dataTransfer.effectAllowed = "move";
                        setDraggedChildItem(item);
                      }}
                      onClick={() => addChildFromDropdown(item)}
                      className="w-full px-3 py-1.5 text-xs font-medium text-[#2C3746] dark:text-slate-200 hover:bg-[#F2F4F6] dark:hover:bg-[#121c33] transition-colors flex items-center justify-between cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <GripVertical className="w-3.5 h-3.5 text-[#A0AEC0] group-hover:text-[#002E5D] dark:group-hover:text-blue-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                      {activeChild === item && (
                        <Check className="w-3.5 h-3.5 text-[#002E5D] dark:text-[#38bdf8] shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
