"use client";

import React, { useState } from "react";
import { Info, ArrowUpDown } from "lucide-react";
import Tooltip from "@/components/Tooltip";
import Badge from "@/components/Badge";
import { useDashboard } from "@/context/DashboardContext";

interface AlertItem {
  id: string;
  dotColor: string;
  title: string;
  days: string;
  tacCode: string;
  priority: "High" | "Medium" | "Low";
  statusText: string;
  statusColor: string;
  timeInfo: string;
  isOverdue?: boolean;
}

export default function AlertsSidebar() {
  const { isDarkMode } = useDashboard();
  const [activeTab, setActiveTab] = useState<"Cases" | "Vendor">("Cases");

  const caseAlerts: AlertItem[] = [
    {
      id: "1",
      dotColor: "bg-[#38bdf8]",
      title: "RE: SR 624474 Arista Cloudvision WiFi SSO",
      days: "3 days",
      tacCode: "TAC137DINT",
      priority: "High",
      statusText: "Nearing Breach",
      statusColor: "text-slate-800 dark:text-slate-200 font-medium",
      timeInfo: "6 hrs left",
      isOverdue: false,
    },
    {
      id: "2",
      dotColor: "bg-[#ef4444]",
      title: "Cisco Prime Infrastructure 3.10 High CPU",
      days: "12 hrs",
      tacCode: "TAC9904INT",
      priority: "High",
      statusText: "Breached",
      statusColor: "text-[#ef4444] font-semibold",
      timeInfo: "2 hrs ago",
      isOverdue: true,
    },
    {
      id: "3",
      dotColor: "bg-[#f59e0b]",
      title: "F5 BIG-IP SSL Handshake Timeout Alert",
      days: "1 day",
      tacCode: "TAC8122INT",
      priority: "Medium",
      statusText: "Nearing Breach",
      statusColor: "text-slate-800 dark:text-slate-200 font-medium",
      timeInfo: "45 min left",
      isOverdue: false,
    },
    {
      id: "4",
      dotColor: "bg-[#10b981]",
      title: "Fortinet FortiGate BGP Flapping DC-2",
      days: "2 days",
      tacCode: "TAC4401INT",
      priority: "Low",
      statusText: "Nearing Breach",
      statusColor: "text-slate-800 dark:text-slate-200 font-medium",
      timeInfo: "3 hours left",
      isOverdue: false,
    },
    {
      id: "5",
      dotColor: "bg-[#f59e0b]",
      title: "Juniper MX960 Linecard Memory Leak",
      days: "3 days",
      tacCode: "TAC1357INT",
      priority: "Medium",
      statusText: "Nearing Breach",
      statusColor: "text-slate-800 dark:text-slate-200 font-medium",
      timeInfo: "1 hour left",
      isOverdue: false,
    },
    {
      id: "6",
      dotColor: "bg-[#ef4444]",
      title: "Palo Alto PA-5220 HA Sync Failure",
      days: "5 hrs",
      tacCode: "TAC7720INT",
      priority: "High",
      statusText: "Breached",
      statusColor: "text-[#ef4444] font-semibold",
      timeInfo: "45 mins ago",
      isOverdue: true,
    },
    {
      id: "7",
      dotColor: "bg-[#38bdf8]",
      title: "Arista 7280R3 OS OSPF Neighbor Drop",
      days: "4 hrs",
      tacCode: "TAC3311INT",
      priority: "Medium",
      statusText: "New Case",
      statusColor: "text-slate-800 dark:text-slate-200 font-medium",
      timeInfo: "5 hrs left",
      isOverdue: false,
    },
    {
      id: "8",
      dotColor: "bg-[#f59e0b]",
      title: "Cisco Nexus 9300 VxLAN Tunnel Flap",
      days: "1 day",
      tacCode: "TAC5092INT",
      priority: "High",
      statusText: "Nearing Breach",
      statusColor: "text-slate-800 dark:text-slate-200 font-medium",
      timeInfo: "1.5 hrs left",
      isOverdue: false,
    },
    {
      id: "9",
      dotColor: "bg-[#10b981]",
      title: "Infoblox BloxOne DNS Latency Spike",
      days: "2 days",
      tacCode: "TAC2104INT",
      priority: "Low",
      statusText: "Investigating",
      statusColor: "text-slate-800 dark:text-slate-200 font-medium",
      timeInfo: "8 hrs left",
      isOverdue: false,
    },
    {
      id: "10",
      dotColor: "bg-[#ef4444]",
      title: "CheckPoint Quantum Security Gateway Crash",
      days: "8 hrs",
      tacCode: "TAC8841INT",
      priority: "High",
      statusText: "Breached",
      statusColor: "text-[#ef4444] font-semibold",
      timeInfo: "3 hrs ago",
      isOverdue: true,
    },
  ];

  const vendorAlerts: AlertItem[] = [
    {
      id: "v1",
      dotColor: "bg-[#ef4444]",
      title: "Cisco TAC P1 Escalation SLA Exceeded",
      days: "6 hrs",
      tacCode: "VND-CS-091",
      priority: "High",
      statusText: "Breached",
      statusColor: "text-[#ef4444] font-semibold",
      timeInfo: "Vendor Delay",
      isOverdue: true,
    },
    {
      id: "v2",
      dotColor: "bg-[#f59e0b]",
      title: "Juniper RMA Hardware Dispatch Pending",
      days: "1 day",
      tacCode: "VND-JN-442",
      priority: "Medium",
      statusText: "Nearing Breach",
      statusColor: "text-slate-800 dark:text-slate-200 font-medium",
      timeInfo: "2 hrs left",
      isOverdue: false,
    },
    {
      id: "v3",
      dotColor: "bg-[#38bdf8]",
      title: "Arista CloudVision Patch 4.29 Verification",
      days: "2 days",
      tacCode: "VND-AR-881",
      priority: "Low",
      statusText: "Pending Review",
      statusColor: "text-slate-800 dark:text-slate-200 font-medium",
      timeInfo: "On Target",
      isOverdue: false,
    },
    {
      id: "v4",
      dotColor: "bg-[#ef4444]",
      title: "F5 Firmware Vulnerability Patch SLA",
      days: "4 hrs",
      tacCode: "VND-F5-110",
      priority: "High",
      statusText: "Breached",
      statusColor: "text-[#ef4444] font-semibold",
      timeInfo: "1 hr ago",
      isOverdue: true,
    },
  ];

  const displayAlerts = activeTab === "Cases" ? caseAlerts : vendorAlerts;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="danger">High</Badge>;
      case "Medium":
        return <Badge variant="warning">Medium</Badge>;
      case "Low":
        return <Badge variant="success">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] p-4 shadow-xs flex flex-col h-full justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          {/* Left: Alerts Title & Badge */}
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-slate-800 dark:text-white tracking-tight">Alerts</h3>
            <Badge variant="solid-danger">30</Badge>
            <Tooltip content="Live stream of priority incidents requiring operational attention">
              <button
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                aria-label="Alerts Information"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>

          {/* Right: Cases / Vendor Toggle */}
          <div className="flex items-center bg-[#F2F4F6]/90 dark:bg-[#060b17] p-0.5 rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] text-[11px] gap-1">
            <button
              onClick={() => setActiveTab("Cases")}
              className={`px-2.5 py-0.5 rounded-[8px] font-semibold transition-all cursor-pointer ${
                activeTab === "Cases"
                  ? "bg-white dark:bg-[#16274a] text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
              }`}
            >
              Cases
            </button>
            <button
              onClick={() => setActiveTab("Vendor")}
              className={`px-2.5 py-0.5 rounded-[8px] font-semibold transition-all cursor-pointer ${
                activeTab === "Vendor"
                  ? "bg-white dark:bg-[#16274a] text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
              }`}
            >
              Vendor
            </button>
          </div>
        </div>

        {/* Subheaders: Case Details & SLA Status */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider py-1.5 border-b border-slate-100 dark:border-[#14223d]">
          <span>Case Details</span>
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300">
            <span>SLA Status</span>
            <ArrowUpDown className="w-3 h-3" />
          </div>
        </div>

        {/* Legend Dots */}
        <div className="flex items-center gap-3 py-1.5 text-[10px] text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-[#14223d]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
            <span>Breached</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
            <span>Nearing Breach</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
            <span>New Case</span>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="flex-1 flex flex-col divide-y divide-slate-100 dark:divide-[#14223d] overlay-scroll pt-1 min-h-0">
        {displayAlerts.map((item) => (
          <div
            key={item.id}
            className="py-2 flex items-start justify-between gap-2 hover:bg-[#F9FBFF]/70 dark:hover:bg-[#0c162e] transition-colors rounded-[8px] px-1 cursor-pointer"
          >
            {/* Left Info */}
            <div className="flex items-start gap-2 min-w-0 flex-1">
              <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor} shrink-0 mt-1`} />
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-semibold text-slate-800 dark:text-white leading-tight mb-1 truncate">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  <span>{item.days}</span>
                  <span>•</span>
                  <span>{item.tacCode}</span>
                  <span>•</span>
                  {getPriorityBadge(item.priority)}
                </div>
              </div>
            </div>

            {/* Right Status */}
            <div className="text-right shrink-0 pl-2">
              <div className={`text-[11px] leading-tight ${item.statusColor}`}>
                {item.statusText}
              </div>
              {item.timeInfo && (
                <div
                  className={`text-[9px] mt-0.5 ${
                    item.isOverdue
                      ? "text-[#ef4444] font-semibold"
                      : "text-slate-400 dark:text-slate-500 font-medium"
                  }`}
                >
                  {item.timeInfo}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
