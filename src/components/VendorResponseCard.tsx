"use client";

import React from "react";
import { Info, Clock } from "lucide-react";

export default function VendorResponseCard() {
  const vendors = [
    { name: "Cisco", time: "18m", status: "Fast", color: "bg-[#78c257]", width: "90%" },
    { name: "Juniper", time: "24m", status: "Optimal", color: "bg-[#8be06c]", width: "78%" },
    { name: "Arista", time: "42m", status: "Near SLA", color: "bg-[#f59e0b]", width: "55%" },
    { name: "Fortinet", time: "1h 15m", status: "Delayed", color: "bg-[#ef4444]", width: "35%" },
  ];

  return (
    <div className="bg-white rounded-[8px] border border-[#EAEEF3] p-4 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-slate-800 tracking-tight">
            Vendor Response Times
          </h3>
          <button
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Vendor Response Times Info"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className="text-[11px] font-semibold text-[#059669] flex items-center gap-2">
          <Clock className="w-3 h-3" />
          <span>Avg: 28m</span>
        </span>
      </div>

      {/* Vendor Bars */}
      <div className="flex flex-col gap-2 flex-1 justify-center">
        {vendors.map((v) => (
          <div key={v.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-800">{v.name}</span>
              <span className="text-slate-500 font-medium">{v.time} ({v.status})</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#F2F4F6] overflow-hidden">
              <div className={`h-full rounded-full ${v.color}`} style={{ width: v.width }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
