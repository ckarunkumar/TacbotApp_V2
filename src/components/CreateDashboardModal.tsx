"use client";

import React, { useState } from "react";
import {
  PlusSquare,
  TrendingUp,
  Bot,
  Server,
  LayoutGrid,
  CheckCircle2,
  Bookmark,
  Trash2,
} from "lucide-react";
import {
  useDashboard,
  PREDEFINED_DASHBOARD_TEMPLATES,
} from "@/context/DashboardContext";
import SlidingDrawer from "@/components/SlidingDrawer";

export default function CreateDashboardModal() {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    createDashboardWithArchetype,
    userTemplates,
    deleteUserTemplate,
  } = useDashboard();

  const [dashboardName, setDashboardName] = useState("");
  const [category, setCategory] = useState("Operations & Frontline");
  const [sharingPrivacy, setSharingPrivacy] = useState("Shared with TAC Team");
  const [selectedTemplateId, setSelectedTemplateId] = useState("blank");
  const [activeArchetypeTab, setActiveArchetypeTab] = useState<"predefined" | "saved">("predefined");

  const handleCreate = () => {
    createDashboardWithArchetype({
      name: dashboardName,
      category,
      sharingPrivacy,
      templateId: selectedTemplateId,
    });
    setDashboardName("");
    setSelectedTemplateId("blank");
  };

  const getTemplateIcon = (iconName: string, id: string) => {
    if (id === "blank") {
      return (
        <div className="w-8 h-8 rounded-[2px] bg-slate-100 flex items-center justify-center text-slate-500">
          <LayoutGrid className="w-4 h-4" />
        </div>
      );
    }
    if (iconName === "TrendingUp") {
      return (
        <div className="w-8 h-8 rounded-[2px] bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <TrendingUp className="w-4 h-4" />
        </div>
      );
    }
    if (iconName === "Bot") {
      return (
        <div className="w-8 h-8 rounded-[2px] bg-purple-50 text-purple-600 flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>
      );
    }
    if (iconName === "Server") {
      return (
        <div className="w-8 h-8 rounded-[2px] bg-sky-50 text-sky-600 flex items-center justify-center">
          <Server className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-[2px] bg-blue-50 text-[#0047ba] flex items-center justify-center">
        <Bookmark className="w-4 h-4" />
      </div>
    );
  };

  return (
    <SlidingDrawer
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      title="Create New Dashboard"
      icon={<PlusSquare className="w-4 h-4" />}
      secondaryButtonText="Cancel"
      onSecondaryClick={() => setIsCreateModalOpen(false)}
      primaryButtonText="+ Create & Launch Dashboard"
      onPrimaryClick={handleCreate}
    >
      <div className="p-4 flex flex-col gap-4">
        {/* Dashboard Name Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800">
            Dashboard Name
          </label>
          <input
            type="text"
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            placeholder="e.g., APAC NOC Operations or Executive SLA Review"
            className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-[2px] px-3.5 py-2.5 focus:outline-none focus:border-[#0047ba] shadow-2xs font-normal"
          />
        </div>

        {/* Category & Privacy Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-[2px] px-3 py-2 focus:outline-none focus:border-[#0047ba] shadow-2xs cursor-pointer"
            >
              <option value="Operations & Frontline">Operations & Frontline</option>
              <option value="Executive & SLA">Executive & SLA</option>
              <option value="NOC & Infrastructure">NOC & Infrastructure</option>
              <option value="AI & Automation">AI & Automation</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800">Sharing & Privacy</label>
            <select
              value={sharingPrivacy}
              onChange={(e) => setSharingPrivacy(e.target.value)}
              className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-[2px] px-3 py-2 focus:outline-none focus:border-[#0047ba] shadow-2xs cursor-pointer"
            >
              <option value="Shared with TAC Team">Shared with TAC Team</option>
              <option value="Private to Me">Private to Me</option>
              <option value="Organization Wide">Organization Wide</option>
            </select>
          </div>
        </div>

        {/* Choose Starting Archetype Section */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800">
              Choose Starting Archetype
            </label>
            <span className="text-[11px] text-slate-400 font-normal">
              Select template or start blank
            </span>
          </div>

          {/* Sub-tabs if user has saved templates */}
          {userTemplates.length > 0 && (
            <div className="flex items-center gap-2 mb-1">
              <button
                type="button"
                onClick={() => setActiveArchetypeTab("predefined")}
                className={`text-[11px] px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer ${
                  activeArchetypeTab === "predefined"
                    ? "bg-blue-50 text-[#0047ba] font-semibold border border-blue-200"
                    : "text-slate-500 hover:text-slate-800 border border-transparent"
                }`}
              >
                Predefined Archetypes
              </button>
              <button
                type="button"
                onClick={() => setActiveArchetypeTab("saved")}
                className={`text-[11px] px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer ${
                  activeArchetypeTab === "saved"
                    ? "bg-blue-50 text-[#0047ba] font-semibold border border-blue-200"
                    : "text-slate-500 hover:text-slate-800 border border-transparent"
                }`}
              >
                My Saved Templates ({userTemplates.length})
              </button>
            </div>
          )}

          {/* Archetype Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(activeArchetypeTab === "predefined"
              ? PREDEFINED_DASHBOARD_TEMPLATES
              : userTemplates
            ).map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`relative rounded-[2px] p-3.5 border transition-all cursor-pointer flex flex-col justify-between text-left ${
                    isSelected
                      ? "border-[#0047ba] bg-blue-50/20 shadow-xs ring-1 ring-[#0047ba]"
                      : "border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs hover:bg-slate-50/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      {getTemplateIcon(tmpl.iconName, tmpl.id)}
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#0047ba]" />
                      )}
                      {tmpl.isUserSaved && !isSelected && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteUserTemplate(tmpl.id);
                          }}
                          className="p-1 text-slate-300 hover:text-red-500 rounded transition-colors"
                          title="Delete Template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
                      {tmpl.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-normal leading-relaxed mt-1 line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SlidingDrawer>
  );
}
