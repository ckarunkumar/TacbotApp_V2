"use client";

import React, { useState } from "react";
import { Search, Trash2, ChevronDown, Check, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Import, FilterSearch, Setting4, Refresh } from "iconsax-react";
import VendorIcon from "@/components/cases/VendorIcon";
import Badge, { BadgeVariant } from "@/components/Badge";

export type TableVariant = "default" | "striped" | "bordered" | "compact" | "skeleton" | "empty";
export type TableDensity = "comfortable" | "compact";

export interface CaseRecord {
  id: string;
  vendor: string;
  externalTicket: string;
  internalTicket: string;
  subject: string;
  dateTime: string;
  duration: string;
  status: "In Progress" | "Resolved" | "Pending" | "Escalated";
}

export interface TableColumn<T = any> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface TableProps {
  title?: string;
  data?: CaseRecord[];
  columns?: TableColumn<CaseRecord>[];
  variant?: TableVariant;
  density?: TableDensity;
  showToolbar?: boolean;
  showPagination?: boolean;
  selectable?: boolean;
  onRowClick?: (row: CaseRecord) => void;
  className?: string;
  isOverviewMinimized?: boolean;
}

export const getStatusBadgeVariant = (status: CaseRecord["status"]): BadgeVariant => {
  switch (status) {
    case "In Progress":
      return "info";
    case "Resolved":
      return "success";
    case "Pending":
      return "warning";
    case "Escalated":
      return "danger";
    default:
      return "neutral";
  }
};

export const INITIAL_TABLE_CASES: CaseRecord[] = [
  {
    id: "case-row-1",
    vendor: "Arista",
    externalTicket: "SR34677363674",
    internalTicket: "TAC17884INT",
    subject: "Firewall rebooted",
    dateTime: "2020-11-08 & 08:16",
    duration: "15 hours",
    status: "In Progress",
  },
  {
    id: "case-row-2",
    vendor: "Cisco",
    externalTicket: "SR034577263574",
    internalTicket: "TAC17884INT",
    subject: "SPAN config issues on TapAgg Appliance",
    dateTime: "2020-11-08 & 08:16",
    duration: "15 hours",
    status: "Resolved",
  },
  {
    id: "case-row-3",
    vendor: "Paloalto",
    externalTicket: "SR994677363674",
    internalTicket: "TAC17884INT",
    subject: "Firewall rebooted & session drop",
    dateTime: "2020-11-08 & 08:16",
    duration: "15 hours",
    status: "Escalated",
  },
  {
    id: "case-row-4",
    vendor: "Juniper",
    externalTicket: "SR554677363674",
    internalTicket: "TAC17884INT",
    subject: "BGP flapping on edge router",
    dateTime: "2020-11-08 & 08:16",
    duration: "15 hours",
    status: "Pending",
  },
  {
    id: "case-row-5",
    vendor: "Aruba",
    externalTicket: "SR114677363674",
    internalTicket: "TAC17884INT",
    subject: "Wireless controller authentication timeout",
    dateTime: "2020-11-08 & 08:16",
    duration: "15 hours",
    status: "In Progress",
  },
  {
    id: "case-row-6",
    vendor: "AWS",
    externalTicket: "SR884677363674",
    internalTicket: "TAC17884INT",
    subject: "DirectConnect gateway latency spike",
    dateTime: "2020-11-08 & 08:16",
    duration: "15 hours",
    status: "Resolved",
  },
  {
    id: "case-row-7",
    vendor: "Fortinet",
    externalTicket: "SR774677363674",
    internalTicket: "TAC17884INT",
    subject: "P1 High Severity SLA Overdue Incident",
    dateTime: "2020-11-08 & 08:16",
    duration: "15 hours",
    status: "Escalated",
  },
  {
    id: "case-row-8",
    vendor: "F5",
    externalTicket: "SR224677363674",
    internalTicket: "TAC17884INT",
    subject: "BIG-IP SSL handshake failover",
    dateTime: "2020-11-08 & 08:16",
    duration: "15 hours",
    status: "Pending",
  },
  {
    id: "case-row-9",
    vendor: "Arista",
    externalTicket: "SR44910293847",
    internalTicket: "TAC17885INT",
    subject: "EOS buffer memory leak on 7280R switch",
    dateTime: "2020-11-08 & 09:30",
    duration: "12 hours",
    status: "In Progress",
  },
  {
    id: "case-row-10",
    vendor: "Cisco",
    externalTicket: "SR55192039485",
    internalTicket: "TAC17886INT",
    subject: "Nexus 9k interface CRC errors & drop counter",
    dateTime: "2020-11-08 & 10:15",
    duration: "10 hours",
    status: "Resolved",
  },
  {
    id: "case-row-11",
    vendor: "Paloalto",
    externalTicket: "SR33829103948",
    internalTicket: "TAC17887INT",
    subject: "GlobalProtect VPN gateway auth timeout",
    dateTime: "2020-11-08 & 11:00",
    duration: "8 hours",
    status: "In Progress",
  },
  {
    id: "case-row-12",
    vendor: "Juniper",
    externalTicket: "SR77281930495",
    internalTicket: "TAC17888INT",
    subject: "Junos OS upgrade commit check failure",
    dateTime: "2020-11-08 & 11:45",
    duration: "6 hours",
    status: "Pending",
  },
  {
    id: "case-row-13",
    vendor: "Aruba",
    externalTicket: "SR88291049583",
    internalTicket: "TAC17889INT",
    subject: "ClearPass RADIUS cluster sync failure",
    dateTime: "2020-11-08 & 12:20",
    duration: "5 hours",
    status: "Escalated",
  },
  {
    id: "case-row-14",
    vendor: "AWS",
    externalTicket: "SR99102938475",
    internalTicket: "TAC17890INT",
    subject: "VPC Peering packet loss on US-East-1 region",
    dateTime: "2020-11-08 & 13:10",
    duration: "4 hours",
    status: "Resolved",
  },
  {
    id: "case-row-15",
    vendor: "Fortinet",
    externalTicket: "SR11293847562",
    internalTicket: "TAC17891INT",
    subject: "FortiGate HA active-passive sync mismatch",
    dateTime: "2020-11-08 & 13:50",
    duration: "3 hours",
    status: "In Progress",
  },
  {
    id: "case-row-16",
    vendor: "F5",
    externalTicket: "SR66392019485",
    internalTicket: "TAC17892INT",
    subject: "LTM pool member health monitor flap",
    dateTime: "2020-11-08 & 14:15",
    duration: "2 hours",
    status: "Pending",
  },
  {
    id: "case-row-17",
    vendor: "Cisco",
    externalTicket: "SR22938475619",
    internalTicket: "TAC17893INT",
    subject: "ACI fabric spine-leaf link fault degraded",
    dateTime: "2020-11-08 & 14:40",
    duration: "2 hours",
    status: "Escalated",
  },
  {
    id: "case-row-18",
    vendor: "Arista",
    externalTicket: "SR88392019483",
    internalTicket: "TAC17894INT",
    subject: "CloudVision Telemetry streaming agent crash",
    dateTime: "2020-11-08 & 15:05",
    duration: "1 hour",
    status: "Resolved",
  },
  {
    id: "case-row-19",
    vendor: "Paloalto",
    externalTicket: "SR44192039485",
    internalTicket: "TAC17895INT",
    subject: "WildFire malware signature update delay",
    dateTime: "2020-11-08 & 15:30",
    duration: "45 mins",
    status: "In Progress",
  },
  {
    id: "case-row-20",
    vendor: "Juniper",
    externalTicket: "SR55291049583",
    internalTicket: "TAC17896INT",
    subject: "EX4300 PoE port budget exceeded alarm",
    dateTime: "2020-11-08 & 16:00",
    duration: "20 mins",
    status: "Resolved",
  },
];

type SortKey = keyof CaseRecord;
type SortOrder = "asc" | "desc" | null;

export default function Table({
  title = "Cases List",
  data = INITIAL_TABLE_CASES,
  variant = "default",
  density = "comfortable",
  showToolbar = true,
  showPagination = true,
  selectable = true,
  onRowClick,
  className = "",
  isOverviewMinimized = false,
}: TableProps) {
  const [rows, setRows] = useState<CaseRecord[]>(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [activeStatusMenuId, setActiveStatusMenuId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  React.useEffect(() => {
    setRows(data);
    setCurrentPage(1);
  }, [data]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [isOverviewMinimized]);

  const isCompact = density === "compact" || variant === "compact";
  const isStriped = variant === "striped";
  const isBordered = variant === "bordered";

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortKey(null);
        setSortOrder(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredRows = rows.filter((r) => {
    if (variant === "empty") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.vendor.toLowerCase().includes(q) ||
        r.externalTicket.toLowerCase().includes(q) ||
        r.internalTicket.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sortedRows = React.useMemo(() => {
    if (!sortKey || !sortOrder) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const valA = a[sortKey] ?? "";
      const valB = b[sortKey] ?? "";
      const comp = String(valA).localeCompare(String(valB), undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sortOrder === "asc" ? comp : -comp;
    });
  }, [filteredRows, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage));
  const currentPageSafe = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (currentPageSafe - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, sortedRows.length);

  const paginatedRows = React.useMemo(() => {
    return sortedRows.slice(startIndex, endIndex);
  }, [sortedRows, startIndex, endIndex]);

  const isAllSelected =
    filteredRows.length > 0 && filteredRows.every((r) => selectedIds.has(r.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRows.map((r) => r.id)));
    }
  };

  const toggleSelectRow = (id: string, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleDeleteRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (selectedIds.has(id)) {
      const next = new Set(selectedIds);
      next.delete(id);
      setSelectedIds(next);
    }
  };

  const handleStatusChange = (
    id: string,
    newStatus: CaseRecord["status"],
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setActiveStatusMenuId(null);
  };

  const renderSortHeader = (label: string, key: SortKey, alignRight = false) => {
    const isActive = sortKey === key;
    return (
      <th
        key={key}
        onClick={() => handleSort(key)}
        className={`py-2.5 px-3 font-semibold cursor-pointer select-none transition-colors hover:bg-[#e2eaf4] dark:hover:bg-[#122244] group whitespace-nowrap ${
          alignRight ? "text-right pr-4" : ""
        } ${isActive ? "text-[#002E5D] dark:text-[#38bdf8] font-bold" : ""}`}
      >
        <div className={`inline-flex items-center gap-1.5 whitespace-nowrap ${alignRight ? "justify-end w-full" : ""}`}>
          <span className="whitespace-nowrap">{label}</span>
          <span className="shrink-0 text-[#7790A9]">
            {isActive ? (
              sortOrder === "asc" ? (
                <ArrowUp className="w-3 h-3 text-[#002E5D] dark:text-[#38bdf8]" />
              ) : (
                <ArrowDown className="w-3 h-3 text-[#002E5D] dark:text-[#38bdf8]" />
              )
            ) : (
              <ArrowUpDown className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
            )}
          </span>
        </div>
      </th>
    );
  };

  // Skeleton shimmer render
  if (variant === "skeleton") {
    return (
      <div className={`w-full bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] p-4 flex flex-col gap-3 shadow-xs ${className}`}>
        <div className="h-8 bg-[#F2F4F6] dark:bg-[#121d36] rounded-[4px] w-full animate-pulse" />
        <div className="h-10 bg-[#F2F4F6] dark:bg-[#121d36] rounded-[4px] w-full animate-pulse" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-[#F9FBFF] dark:bg-[#0c1527] rounded-[4px] w-full animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`w-full bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] shadow-xs flex flex-col select-none overflow-hidden ${className}`}
    >
      {/* ── Table Top Toolbar ── */}
      {showToolbar && (
        <div className="p-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#EAEEF3] dark:border-[#162444]">
          {/* Left Title & Selected Count */}
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#2C3746] dark:text-white tracking-tight">
              {title}
            </h3>
            {selectedIds.size > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#ECF3FF] text-[#002E5D] dark:bg-[#002E5D] dark:text-blue-200 text-[11px] font-medium border border-[#D4E4FE] dark:border-[#005899]">
                {selectedIds.size} selected
              </span>
            )}
          </div>

          {/* Right Actions Toolbar */}
          <div className="flex items-center gap-1.5">
            {/* Action Buttons */}
            <button
              type="button"
              className="w-8 h-8 rounded-[4px] text-[#576B81] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-white hover:bg-[#E2E8F0]/50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-center cursor-pointer"
              title="Download / Export"
            >
              <Import size="18" color="currentColor" variant="Outline" />
            </button>

            <button
              type="button"
              className="w-8 h-8 rounded-[4px] text-[#576B81] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-white hover:bg-[#E2E8F0]/50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-center cursor-pointer"
              title="Filter Cases"
            >
              <FilterSearch size="18" color="currentColor" variant="Outline" />
            </button>

            <button
              type="button"
              className="w-8 h-8 rounded-[4px] text-[#576B81] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-white hover:bg-[#E2E8F0]/50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-center cursor-pointer"
              title="Configure Columns"
            >
              <Setting4 size="18" color="currentColor" variant="Outline" />
            </button>

            <button
              type="button"
              onClick={() => {
                setRows(INITIAL_TABLE_CASES);
                setSearchQuery("");
                setSelectedIds(new Set());
              }}
              className="w-8 h-8 rounded-[4px] text-[#576B81] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-white hover:bg-[#E2E8F0]/50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-center cursor-pointer"
              title="Reset / Refresh Cases"
            >
              <Refresh size="18" color="currentColor" variant="Outline" />
            </button>

            {/* Search Box */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-[#7790A9] absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="h-8 w-40 sm:w-52 md:w-56 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#081024] pl-8 pr-2.5 text-xs text-[#2C3746] dark:text-slate-100 placeholder-[#7790A9] focus:outline-none focus:border-[#002E5D] focus:ring-2 focus:ring-[#002E5D]/20 transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Table Container (Vertically Scrollable with Sticky Header) ── */}
      <div className="w-full flex-1 overflow-x-auto overflow-y-auto no-scrollbar min-h-0">
        <table className={`w-full text-left border-collapse min-w-[850px] ${isBordered ? "border border-[#EAEEF3] dark:border-[#162444]" : ""}`}>
          {/* Table Header */}
          <thead className="sticky top-0 z-10 bg-[#eef3f8] dark:bg-[#0d1830] shadow-2xs">
            <tr className="bg-[#eef3f8] dark:bg-[#0d1830] text-xs md:text-[13px] font-semibold text-[#576B81] dark:text-slate-400 border-b border-[#EAEEF3] dark:border-[#162444] whitespace-nowrap">
              {selectable && (
                <th className="py-2.5 px-3 w-10 text-center whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded-[3px] accent-[#002E5D] cursor-pointer"
                  />
                </th>
              )}
              <th className="py-2.5 px-2 w-8 text-center text-xs text-[#7790A9] whitespace-nowrap">
                #
              </th>
              {renderSortHeader("Name", "vendor")}
              {renderSortHeader("External Ticket", "externalTicket")}
              {renderSortHeader("Internal Ticket", "internalTicket")}
              {renderSortHeader("Subject", "subject")}
              {renderSortHeader("Date & Time", "dateTime")}
              {renderSortHeader("Duration", "duration")}
              {renderSortHeader("Status", "status", true)}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#EAEEF3] dark:divide-[#162444] text-[13px] md:text-sm">
            {paginatedRows.map((row, idx) => {
              const isSelected = selectedIds.has(row.id);
              const isHovered = hoveredRowId === row.id;

              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  onMouseEnter={() => setHoveredRowId(row.id)}
                  onMouseLeave={() => {
                    setHoveredRowId(null);
                    if (activeStatusMenuId === row.id) setActiveStatusMenuId(null);
                  }}
                  className={`transition-colors relative group whitespace-nowrap ${
                    isSelected
                      ? "bg-[#ECF3FF]/70 dark:bg-[#002E5D]/20"
                      : isStriped && idx % 2 === 1
                      ? "bg-[#F9FBFF] dark:bg-[#0c1527]"
                      : isHovered
                      ? "bg-[#F9FBFF] dark:bg-[#0c1527]"
                      : "hover:bg-[#F9FBFF] dark:hover:bg-[#0c1527]"
                  }`}
                >
                  {/* Checkbox */}
                  {selectable && (
                    <td className="py-2.5 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelectRow(row.id, e)}
                        className="w-3.5 h-3.5 rounded-[3px] accent-[#002E5D] cursor-pointer"
                      />
                    </td>
                  )}

                  {/* Index / # */}
                  <td className="py-2.5 px-2 text-center text-xs text-[#7790A9] dark:text-slate-500 font-medium whitespace-nowrap">
                    {startIndex + idx + 1}
                  </td>

                  {/* Name (Vendor Logo + Name) */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <VendorIcon vendor={row.vendor} size={20} />
                      <span className="font-semibold text-sm text-[#2C3746] dark:text-slate-200 whitespace-nowrap">
                        {row.vendor}
                      </span>
                    </div>
                  </td>

                  {/* External Ticket (Clickable Link) */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <a
                      href={`#${row.externalTicket}`}
                      onClick={(e) => e.preventDefault()}
                      className="text-[#2F6ADB] dark:text-[#5E94EE] hover:underline text-xs md:text-[13px] font-medium whitespace-nowrap"
                    >
                      {row.externalTicket}
                    </a>
                  </td>

                  {/* Internal Ticket */}
                  <td className="py-2.5 px-3 text-[#576B81] dark:text-slate-400 text-xs md:text-[13px] font-medium whitespace-nowrap">
                    {row.internalTicket}
                  </td>

                  {/* Subject */}
                  <td className="py-2.5 px-3 font-medium text-xs md:text-[13px] text-[#2C3746] dark:text-slate-200 max-w-xs truncate whitespace-nowrap">
                    {row.subject}
                  </td>

                  {/* Date & Time */}
                  <td className="py-2.5 px-3 text-xs md:text-[13px] text-[#576B81] dark:text-slate-400 font-medium whitespace-nowrap">
                    {row.dateTime}
                  </td>

                  {/* Duration */}
                  <td className="py-2.5 px-3 text-xs md:text-[13px] text-[#576B81] dark:text-slate-400 whitespace-nowrap">
                    {row.duration}
                  </td>

                  {/* Status & Floating Actions */}
                  <td className="py-2.5 px-3 text-right pr-4 relative whitespace-nowrap">
                    {/* Normal Status Badge when not hovered */}
                    <div className="flex items-center justify-end">
                      <Badge variant={getStatusBadgeVariant(row.status)}>
                        {row.status}
                      </Badge>
                    </div>

                    {/* Floating Hover Action Overlay */}
                    {isHovered && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-white dark:bg-[#081024] p-1 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] shadow-md z-20 animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap">
                        {/* Status button / dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveStatusMenuId(
                                activeStatusMenuId === row.id ? null : row.id
                              );
                            }}
                            className="flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                          >
                            <Badge
                              variant={getStatusBadgeVariant(row.status)}
                              className="hover:opacity-90 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                            >
                              <span>{row.status}</span>
                              <ChevronDown className="w-2.5 h-2.5 shrink-0" />
                            </Badge>
                          </button>

                          {activeStatusMenuId === row.id && (
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#081024] border border-[#EAEEF3] dark:border-[#1e3056] rounded-[4px] shadow-lg py-1 z-30 flex flex-col text-[10px] font-medium text-left">
                              {(["In Progress", "Resolved", "Pending", "Escalated"] as const).map(
                                (st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={(e) => handleStatusChange(row.id, st, e)}
                                    className={`px-2 py-1 flex items-center justify-between hover:bg-[#F2F4F6] dark:hover:bg-[#121c33] cursor-pointer ${
                                      row.status === st ? "font-semibold bg-[#ECF3FF]/40 dark:bg-[#002E5D]/20" : ""
                                    }`}
                                  >
                                    <Badge variant={getStatusBadgeVariant(st)}>
                                      {st}
                                    </Badge>
                                    {row.status === st && (
                                      <Check className="w-3 h-3 text-[#002E5D] dark:text-blue-300 ml-1 shrink-0" />
                                    )}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quick Download */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Exporting ticket ${row.externalTicket}`);
                          }}
                          className="p-1 rounded-[3px] text-[#7790A9] hover:text-[#002E5D] dark:hover:text-white hover:bg-[#F2F4F6] transition-colors cursor-pointer"
                          title="Download Case Details"
                        >
                          <Import size="14" color="currentColor" variant="Outline" />
                        </button>

                        {/* Quick Delete */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteRow(row.id, e)}
                          className="p-1 rounded-[3px] text-[#dc2626] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                          title="Delete Case"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {sortedRows.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="py-12 text-center text-xs text-[#7790A9] font-medium"
                >
                  No cases found matching &quot;{searchQuery}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Table Footer Pagination (Compact Height) ── */}
      {showPagination && sortedRows.length > 0 && (
        <div className="py-1.5 px-3 border-t border-[#EAEEF3] dark:border-[#162444] flex flex-wrap items-center justify-between gap-2 text-xs text-[#576B81] dark:text-slate-400 mt-auto shrink-0 bg-white dark:bg-[#091122]">
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-6 px-1.5 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#081024] text-[11px] text-[#2C3746] dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={16}>16</option>
              <option value={18}>18</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px]">
              Showing {sortedRows.length > 0 ? startIndex + 1 : 0} - {endIndex} of {sortedRows.length} cases
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPageSafe <= 1}
                className={`h-6 px-2 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] text-[11px] transition-colors flex items-center justify-center ${
                  currentPageSafe <= 1
                    ? "text-[#7790A9] opacity-50 cursor-not-allowed"
                    : "text-[#2C3746] dark:text-slate-200 hover:bg-[#F2F4F6] cursor-pointer"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setCurrentPage(pg)}
                  className={`h-6 px-2 rounded-[4px] border text-[11px] font-semibold cursor-pointer transition-colors flex items-center justify-center ${
                    currentPageSafe === pg
                      ? "bg-[#002E5D] text-white border-[#002E5D]"
                      : "border-[#EAEEF3] dark:border-[#1e3056] text-[#576B81] dark:text-slate-300 hover:bg-[#F2F4F6]"
                  }`}
                >
                  {pg}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPageSafe >= totalPages}
                className={`h-6 px-2 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] text-[11px] transition-colors flex items-center justify-center ${
                  currentPageSafe >= totalPages
                    ? "text-[#7790A9] opacity-50 cursor-not-allowed"
                    : "text-[#2C3746] dark:text-slate-200 hover:bg-[#F2F4F6] cursor-pointer"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
