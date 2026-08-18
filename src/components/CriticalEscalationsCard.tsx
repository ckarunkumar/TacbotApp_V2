"use client";

import React from "react";
import { Info, AlertTriangle } from "lucide-react";

export default function CriticalEscalationsCard() {
  const escalations = [
    {
      id: "ESC-8921",
      title: "Core Switch BGP Flapping in DC-West",
      owner: "TAC Level 3",
      time: "12m ago",
      severity: "P1",
    },
    {
      id: "ESC-8918",
      title: "Edge Firewall Policy Sync Failure",
      owner: "Automated Bot",
      time: "45m ago",
      severity: "P2",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/85 p-4 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-slate-800 tracking-tight">
            Critical Escalations
          </h3>
          <button
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Escalations Info"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className="bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] text-[9px] font-semibold px-2 py-0.5 rounded leading-none flex items-center gap-2">
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>2 Active</span>
        </span>
      </div>

      {/* Feed Items */}
      <div className="flex flex-col gap-2 flex-1 justify-center divide-y divide-slate-100">
        {escalations.map((item) => (
          <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-800 leading-tight">
                {item.title}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-2">
                {item.id} • {item.owner} • {item.time}
              </span>
            </div>
            <span className="bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] text-[9px] font-semibold px-2 py-0.5 rounded shrink-0 leading-none">
              {item.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
