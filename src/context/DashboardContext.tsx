"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  DashboardWidget,
  CustomUserWidget,
  WidgetCatalogItem,
  DashboardInstance,
  DashboardTemplate,
} from "@/types/dashboard";

export const DEFAULT_WIDGETS: DashboardWidget[] = [
  {
    id: "case-summary",
    type: "case-summary",
    title: "Case Summary",
    colSpan: 1,
    rowSpan: 2,
    colStart: 1,
    rowStart: 1,
  },
  {
    id: "sla-summary",
    type: "sla-summary",
    title: "SLA Summary",
    colSpan: 1,
    rowSpan: 2,
    colStart: 2,
    rowStart: 1,
  },
  {
    id: "total-cases",
    type: "total-cases",
    title: "Total Cases",
    colSpan: 1,
    rowSpan: 2,
    colStart: 3,
    rowStart: 1,
  },
  {
    id: "treemap",
    type: "treemap",
    title: "Connectivity Overview",
    colSpan: 2,
    rowSpan: 2,
    colStart: 1,
    rowStart: 3,
  },
  {
    id: "sla-health",
    type: "sla-health",
    title: "SLA Health",
    colSpan: 1,
    rowSpan: 1,
    colStart: 3,
    rowStart: 3,
  },
  {
    id: "avg-resolution",
    type: "avg-resolution",
    title: "Avg. Resolution Time",
    colSpan: 1,
    rowSpan: 1,
    colStart: 3,
    rowStart: 4,
  },
  {
    id: "alerts",
    type: "alerts",
    title: "Alerts & Cases",
    colSpan: 1,
    rowSpan: 4,
    colStart: 4,
    rowStart: 1,
  },
];

export const PREDEFINED_DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: "blank",
    name: "Blank Bento Canvas",
    description: "Fresh interactive grid ready for your custom cards and sliding widgets.",
    iconName: "LayoutGrid",
    category: "Blank",
    widgets: [],
  },
  {
    id: "executive-sla",
    name: "Executive SLA Suite",
    description: "SLA Health scorecard, resolution times, and quarterly volume trends.",
    iconName: "TrendingUp",
    category: "Executive & SLA",
    widgets: [
      {
        id: "tmpl-sla-summary",
        type: "sla-summary",
        title: "SLA Summary",
        colSpan: 1,
        rowSpan: 2,
        colStart: 1,
        rowStart: 1,
      },
      {
        id: "tmpl-total-cases",
        type: "total-cases",
        title: "Total Cases",
        colSpan: 2,
        rowSpan: 2,
        colStart: 2,
        rowStart: 1,
      },
      {
        id: "tmpl-sla-health",
        type: "sla-health",
        title: "SLA Health",
        colSpan: 1,
        rowSpan: 1,
        colStart: 1,
        rowStart: 3,
      },
      {
        id: "tmpl-avg-res",
        type: "avg-resolution",
        title: "Avg. Resolution Time",
        colSpan: 1,
        rowSpan: 1,
        colStart: 2,
        rowStart: 3,
      },
      {
        id: "tmpl-alerts",
        type: "alerts",
        title: "Alerts & Cases",
        colSpan: 1,
        rowSpan: 4,
        colStart: 4,
        rowStart: 1,
      },
    ],
  },
  {
    id: "ai-remediation",
    name: "AI & Auto-Remediation",
    description: "AI risk predictor, TAI bot diagnostics, and real-time live alert queue.",
    iconName: "Bot",
    category: "AI & Automation",
    widgets: [
      {
        id: "tmpl-ai-sentiment",
        type: "custom-kpi",
        title: "AI Sentiment & Risk",
        colSpan: 2,
        rowSpan: 2,
        colStart: 1,
        rowStart: 1,
        customTitle: "AI Sentiment & Risk",
        customMetricValue: "94.2%",
        customSubtitle: "High confidence NLP sentiment scoring on active P1/P2 tickets",
        customBadge: "Optimal",
      },
      {
        id: "tmpl-case-summary",
        type: "case-summary",
        title: "Case Summary",
        colSpan: 1,
        rowSpan: 2,
        colStart: 3,
        rowStart: 1,
      },
      {
        id: "tmpl-crit-esc",
        type: "critical-escalations",
        title: "Critical Escalations",
        colSpan: 3,
        rowSpan: 2,
        colStart: 1,
        rowStart: 3,
      },
      {
        id: "tmpl-alerts",
        type: "alerts",
        title: "Alerts & Cases",
        colSpan: 1,
        rowSpan: 4,
        colStart: 4,
        rowStart: 1,
      },
    ],
  },
  {
    id: "noc-edge",
    name: "NOC & Edge Clusters",
    description: "Multi-region DC node matrix, vendor compliance, and MTTR velocity.",
    iconName: "Server",
    category: "NOC & Infrastructure",
    widgets: [
      {
        id: "tmpl-treemap",
        type: "treemap",
        title: "Connectivity Overview",
        colSpan: 2,
        rowSpan: 2,
        colStart: 1,
        rowStart: 1,
      },
      {
        id: "tmpl-vendor-resp",
        type: "vendor-response",
        title: "Vendor Response Times",
        colSpan: 1,
        rowSpan: 1,
        colStart: 3,
        rowStart: 1,
      },
      {
        id: "tmpl-sla-health",
        type: "sla-health",
        title: "SLA Health",
        colSpan: 1,
        rowSpan: 1,
        colStart: 3,
        rowStart: 2,
      },
      {
        id: "tmpl-sla-summary",
        type: "sla-summary",
        title: "SLA Summary",
        colSpan: 2,
        rowSpan: 2,
        colStart: 1,
        rowStart: 3,
      },
      {
        id: "tmpl-alerts",
        type: "alerts",
        title: "Alerts & Cases",
        colSpan: 1,
        rowSpan: 4,
        colStart: 4,
        rowStart: 1,
      },
    ],
  },
];

const INITIAL_USER_CUSTOM_WIDGETS: CustomUserWidget[] = [
  {
    id: "custom-1",
    name: "AI Sentiment & Risk",
    type: "custom-kpi",
    colSpan: 1,
    rowSpan: 1,
    metricValue: "94.2%",
    subtitle: "High confidence NLP sentiment scoring on active P1/P2 tickets",
    badge: "Optimal",
    category: "AI & Automations",
    createdAt: "2 hrs ago",
  },
  {
    id: "custom-2",
    name: "Engineer Capacity Load",
    type: "custom-kpi",
    colSpan: 1,
    rowSpan: 1,
    metricValue: "81.4%",
    subtitle: "Active TAC engineer workload capacity across APAC & EMEA",
    badge: "Balanced",
    category: "Operations",
    createdAt: "1 day ago",
  },
];

export const PREDEFINED_OPERATIONS_LIBRARY: WidgetCatalogItem[] = [
  {
    type: "case-summary",
    name: "Quarterly Case Summary",
    category: "Analytics",
    description: "Volume and trend of incoming support access across quarters.",
    defaultColSpan: 1,
    defaultRowSpan: 2,
    iconName: "BarChart3",
  },
  {
    type: "sla-summary",
    name: "SLA Compliance Donut",
    category: "SLA & Performance",
    description: "Breakdown of cases meeting SLA, near breach, and breached.",
    defaultColSpan: 1,
    defaultRowSpan: 2,
    iconName: "PieChart",
  },
  {
    type: "total-cases",
    name: "Total Cases Trajectory",
    category: "Analytics",
    description: "Spline projection of monthly incoming vs resolved support tickets.",
    defaultColSpan: 1,
    defaultRowSpan: 2,
    iconName: "TrendingUp",
  },
  {
    type: "treemap",
    name: "Vendor Treemap Matrix",
    category: "Analytics",
    description: "Case density distribution across Arista, Juniper, Cisco, Fortinet.",
    defaultColSpan: 2,
    defaultRowSpan: 2,
    iconName: "Grid",
  },
  {
    type: "sla-health",
    name: "SLA Health Gauge",
    category: "SLA & Performance",
    description: "Real-time SLA health index gauge with target threshold indicator.",
    defaultColSpan: 1,
    defaultRowSpan: 1,
    iconName: "Activity",
  },
  {
    type: "avg-resolution",
    name: "Avg. Resolution Tracker",
    category: "SLA & Performance",
    description: "Mean time to resolution (MTTR) with day-over-day delta.",
    defaultColSpan: 1,
    defaultRowSpan: 1,
    iconName: "Clock",
  },
  {
    type: "alerts",
    name: "Alerts & Incidents Stream",
    category: "Alerts & Cases",
    description: "Live feed of high-severity alerts, vendor sync, and case flags.",
    defaultColSpan: 1,
    defaultRowSpan: 4,
    iconName: "Bell",
  },
  {
    type: "vendor-response",
    name: "Vendor Response Times",
    category: "SLA & Performance",
    description: "Compare real-time resolution and response delays per vendor.",
    defaultColSpan: 1,
    defaultRowSpan: 1,
    iconName: "Timer",
  },
  {
    type: "critical-escalations",
    name: "Critical Escalations",
    category: "Alerts & Cases",
    description: "Priority 1 and Priority 2 incident stream with auto-assignment.",
    defaultColSpan: 1,
    defaultRowSpan: 1,
    iconName: "AlertTriangle",
  },
];

export const WIDGET_CATALOG = PREDEFINED_OPERATIONS_LIBRARY;

interface DashboardContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  dashboards: DashboardInstance[];
  activeDashboardId: string;
  setActiveDashboardId: (id: string) => void;
  createNewDashboard: (customName?: string) => void;
  createDashboardWithArchetype: (params: {
    name: string;
    category?: string;
    sharingPrivacy?: string;
    templateId: string;
  }) => void;
  userTemplates: DashboardTemplate[];
  saveCurrentAsTemplate: (name: string, description?: string) => void;
  deleteUserTemplate: (id: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  renameDashboard: (id: string, newName: string) => void;
  deleteDashboard: (id: string) => void;
  widgets: DashboardWidget[];
  userCustomWidgets: CustomUserWidget[];
  isCustomizing: boolean;
  setIsCustomizing: (val: boolean) => void;
  toggleCustomizing: () => void;
  resizeWidget: (id: string, colSpan: 1 | 2 | 3 | 4, rowSpan: 1 | 2 | 3 | 4) => void;
  moveWidget: (id: string, direction: "left" | "right" | "up" | "down") => void;
  reorderWidgetById: (sourceId: string, targetId: string) => void;
  placeWidgetAtPosition: (widgetId: string, colStart: number, rowStart: number) => void;
  draggedWidgetId: string | null;
  setDraggedWidgetId: (id: string | null) => void;
  removeWidget: (id: string) => void;
  addWidget: (item: WidgetCatalogItem, colStart?: number, rowStart?: number) => void;
  createCustomWidget: (custom: Omit<CustomUserWidget, "id" | "createdAt">) => void;
  addCustomWidgetToDashboard: (custom: CustomUserWidget) => void;
  deleteCustomWidget: (id: string) => void;
  editWidget: (id: string, updates: Partial<DashboardWidget>) => void;
  resetToDefault: () => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingWidget: DashboardWidget | null;
  setEditingWidget: (widget: DashboardWidget | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [dashboards, setDashboards] = useState<DashboardInstance[]>([
    {
      id: "dashboard-1",
      name: "Dashboard 1",
      widgets: DEFAULT_WIDGETS,
    },
  ]);
  const [activeDashboardId, setActiveDashboardId] = useState<string>("dashboard-1");
  const [userTemplates, setUserTemplates] = useState<DashboardTemplate[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedDark = localStorage.getItem("tai_dark_mode_active");
      if (savedDark !== null) {
        setIsDarkMode(savedDark === "true");
      }
    } catch (e) {
      console.warn("Failed to load dark mode", e);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("tai_dark_mode_active", String(next));
      } catch (e) {
        console.warn("Failed to save dark mode", e);
      }
      return next;
    });
  };
  const [userCustomWidgets, setUserCustomWidgets] = useState<CustomUserWidget[]>(
    INITIAL_USER_CUSTOM_WIDGETS
  );
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(null);
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);

  // Load persisted state
  useEffect(() => {
    try {
      const savedDashboards = localStorage.getItem("tai_multi_dashboards_v2");
      if (savedDashboards) {
        const parsed = JSON.parse(savedDashboards);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDashboards(parsed);
          setActiveDashboardId(parsed[0].id);
        }
      }

      const savedTemplates = localStorage.getItem("tai_saved_dashboard_templates");
      if (savedTemplates) {
        const parsed = JSON.parse(savedTemplates);
        if (Array.isArray(parsed)) {
          setUserTemplates(parsed);
        }
      }

      const savedCustom = localStorage.getItem("tai_user_custom_widgets");
      if (savedCustom) {
        const parsedCustom = JSON.parse(savedCustom);
        if (Array.isArray(parsedCustom)) {
          setUserCustomWidgets(parsedCustom);
        }
      }
    } catch (e) {
      console.warn("Failed to load saved state", e);
    }
  }, []);

  const saveDashboardsToStorage = (updatedDashboards: DashboardInstance[]) => {
    try {
      localStorage.setItem("tai_multi_dashboards_v2", JSON.stringify(updatedDashboards));
    } catch (e) {
      console.warn("Failed to save dashboards", e);
    }
  };

  const saveTemplatesToStorage = (list: DashboardTemplate[]) => {
    try {
      localStorage.setItem("tai_saved_dashboard_templates", JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to save templates", e);
    }
  };

  const saveCustomWidgetsToStorage = (list: CustomUserWidget[]) => {
    try {
      localStorage.setItem("tai_user_custom_widgets", JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to save custom widgets", e);
    }
  };

  const activeDashboard =
    dashboards.find((d) => d.id === activeDashboardId) || dashboards[0] || {
      id: "dashboard-1",
      name: "Dashboard 1",
      widgets: DEFAULT_WIDGETS,
    };

  const widgets = activeDashboard.widgets;

  const updateActiveWidgets = (updater: (prevWidgets: DashboardWidget[]) => DashboardWidget[]) => {
    setDashboards((prevDashboards) => {
      const nextDashboards = prevDashboards.map((dash) => {
        if (dash.id === activeDashboardId) {
          return {
            ...dash,
            widgets: updater(dash.widgets),
          };
        }
        return dash;
      });
      saveDashboardsToStorage(nextDashboards);
      return nextDashboards;
    });
  };

  const createDashboardWithArchetype = ({
    name,
    category = "Operations & Frontline",
    sharingPrivacy = "Shared with TAC Team",
    templateId,
  }: {
    name: string;
    category?: string;
    sharingPrivacy?: string;
    templateId: string;
  }) => {
    const newId = `dashboard-${Date.now()}`;
    const finalName = name.trim() || `Dashboard ${dashboards.length + 1}`;

    // Look up archetype in predefined or user templates
    let initialWidgets: DashboardWidget[] = [];
    if (templateId !== "blank") {
      const allTemplates = [...PREDEFINED_DASHBOARD_TEMPLATES, ...userTemplates];
      const match = allTemplates.find((t) => t.id === templateId);
      if (match) {
        initialWidgets = match.widgets.map((w) => ({
          ...w,
          id: `${w.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        }));
      }
    }

    const newDashboard: DashboardInstance = {
      id: newId,
      name: finalName,
      category,
      sharingPrivacy,
      widgets: initialWidgets,
      createdAt: new Date().toISOString(),
    };

    const nextDashboards = [...dashboards, newDashboard];
    setDashboards(nextDashboards);
    setActiveDashboardId(newId);
    saveDashboardsToStorage(nextDashboards);
    setIsCreateModalOpen(false);
  };

  const createNewDashboard = () => {
    setIsCreateModalOpen(true);
  };

  const saveCurrentAsTemplate = (templateName: string, description?: string) => {
    const newTemplate: DashboardTemplate = {
      id: `custom-template-${Date.now()}`,
      name: templateName.trim() || `${activeDashboard.name} Template`,
      description: description?.trim() || `Custom snapshot layout with ${widgets.length} operational telemetry widgets.`,
      iconName: "LayoutGrid",
      category: activeDashboard.category || "Custom",
      isUserSaved: true,
      widgets: widgets.map((w) => ({ ...w })),
    };

    const updated = [newTemplate, ...userTemplates];
    setUserTemplates(updated);
    saveTemplatesToStorage(updated);
  };

  const deleteUserTemplate = (id: string) => {
    const updated = userTemplates.filter((t) => t.id !== id);
    setUserTemplates(updated);
    saveTemplatesToStorage(updated);
  };

  const renameDashboard = (id: string, newName: string) => {
    setDashboards((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, name: newName } : d));
      saveDashboardsToStorage(next);
      return next;
    });
  };

  const deleteDashboard = (id: string) => {
    if (dashboards.length <= 1) return;
    const nextDashboards = dashboards.filter((d) => d.id !== id);
    setDashboards(nextDashboards);
    if (activeDashboardId === id) {
      setActiveDashboardId(nextDashboards[0].id);
    }
    saveDashboardsToStorage(nextDashboards);
  };

  const toggleCustomizing = () => {
    setIsCustomizing((prev) => !prev);
  };

  // Helper to resolve overlapping grid cells and push colliding widgets downward
  const resolveGridCollisions = (
    currentWidgets: DashboardWidget[],
    anchorId: string
  ): DashboardWidget[] => {
    const result = currentWidgets.map((w) => ({ ...w }));
    const anchor = result.find((w) => w.id === anchorId);
    if (!anchor || !anchor.colStart || !anchor.rowStart) return result;

    let hasCollisions = true;
    let iterations = 0;

    while (hasCollisions && iterations < 30) {
      hasCollisions = false;
      iterations++;

      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result.length; j++) {
          if (i === j) continue;
          const w1 = result[i];
          const w2 = result[j];

          if (!w1.colStart || !w1.rowStart || !w2.colStart || !w2.rowStart) continue;

          const w1ColEnd = w1.colStart + w1.colSpan - 1;
          const w1RowEnd = w1.rowStart + w1.rowSpan - 1;
          const w2ColEnd = w2.colStart + w2.colSpan - 1;
          const w2RowEnd = w2.rowStart + w2.rowSpan - 1;

          const colOverlap =
            Math.max(w1.colStart, w2.colStart) <= Math.min(w1ColEnd, w2ColEnd);
          const rowOverlap =
            Math.max(w1.rowStart, w2.rowStart) <= Math.min(w1RowEnd, w2RowEnd);

          if (colOverlap && rowOverlap) {
            hasCollisions = true;
            if (
              w1.id === anchorId ||
              w1.rowStart < w2.rowStart ||
              (w1.rowStart === w2.rowStart && w1.id === anchorId)
            ) {
              w2.rowStart = w1.rowStart + w1.rowSpan;
            } else {
              w1.rowStart = w2.rowStart + w2.rowSpan;
            }
          }
        }
      }
    }

    return result;
  };

  const resizeWidget = (
    id: string,
    colSpan: 1 | 2 | 3 | 4,
    rowSpan: 1 | 2 | 3 | 4
  ) => {
    updateActiveWidgets((prev) => {
      const updated = prev.map((w) =>
        w.id === id ? { ...w, colSpan, rowSpan } : w
      );
      return resolveGridCollisions(updated, id);
    });
  };

  const placeWidgetAtPosition = (
    widgetId: string,
    colStart: number,
    rowStart: number
  ) => {
    updateActiveWidgets((prev) => {
      const updated = prev.map((w) =>
        w.id === widgetId ? { ...w, colStart, rowStart } : w
      );
      return resolveGridCollisions(updated, widgetId);
    });
  };

  const moveWidget = (id: string, direction: "left" | "right" | "up" | "down") => {
    updateActiveWidgets((prev) => {
      const index = prev.findIndex((w) => w.id === id);
      if (index === -1) return prev;

      const targetIndex =
        direction === "left" || direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const updated = [...prev];
      const [removed] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, removed);
      return updated;
    });
  };

  const reorderWidgetById = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    updateActiveWidgets((prev) => {
      const sourceIndex = prev.findIndex((w) => w.id === sourceId);
      const targetIndex = prev.findIndex((w) => w.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const updated = [...prev];
      const [movedItem] = updated.splice(sourceIndex, 1);
      const targetItem = prev[targetIndex];
      if (targetItem.colStart && targetItem.rowStart && movedItem.colStart && movedItem.rowStart) {
        const tempCol = movedItem.colStart;
        const tempRow = movedItem.rowStart;
        movedItem.colStart = targetItem.colStart;
        movedItem.rowStart = targetItem.rowStart;
        targetItem.colStart = tempCol;
        targetItem.rowStart = tempRow;
      }
      updated.splice(targetIndex, 0, movedItem);
      return updated;
    });
  };

  const removeWidget = (id: string) => {
    updateActiveWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  const addWidget = (
    item: WidgetCatalogItem,
    colStart?: number,
    rowStart?: number
  ) => {
    const newWidget: DashboardWidget = {
      id: `widget-${item.type}-${Date.now()}`,
      type: item.type,
      title: item.name,
      colSpan: item.defaultColSpan,
      rowSpan: item.defaultRowSpan,
      colStart,
      rowStart,
      category: item.category,
    };

    updateActiveWidgets((prev) => [...prev, newWidget]);
    setIsAddModalOpen(false);
  };

  const createCustomWidget = (
    custom: Omit<CustomUserWidget, "id" | "createdAt">
  ) => {
    const newCustomItem: CustomUserWidget = {
      ...custom,
      id: `custom-${Date.now()}`,
      createdAt: "Just now",
    };

    // Save to user custom library
    const updatedLibrary = [newCustomItem, ...userCustomWidgets];
    setUserCustomWidgets(updatedLibrary);
    saveCustomWidgetsToStorage(updatedLibrary);

    // Also add to active dashboard
    const newDashboardWidget: DashboardWidget = {
      id: `widget-custom-${Date.now()}`,
      type: newCustomItem.type,
      title: newCustomItem.name,
      colSpan: newCustomItem.colSpan,
      rowSpan: newCustomItem.rowSpan,
      customTitle: newCustomItem.name,
      customMetricValue: newCustomItem.metricValue,
      customSubtitle: newCustomItem.subtitle,
      customBadge: newCustomItem.badge,
      category: newCustomItem.category,
      settings: {
        vendor: newCustomItem.vendor,
        groupBy: newCustomItem.groupBy,
        filters: newCustomItem.filters,
        timeRangeStart: newCustomItem.timeRangeStart,
        timeRangeEnd: newCustomItem.timeRangeEnd,
      },
    };

    updateActiveWidgets((prev) => [...prev, newDashboardWidget]);
    setIsAddModalOpen(false);
  };

  const addCustomWidgetToDashboard = (custom: CustomUserWidget) => {
    const newDashboardWidget: DashboardWidget = {
      id: `widget-custom-${custom.id}-${Date.now()}`,
      type: custom.type,
      title: custom.name,
      colSpan: custom.colSpan,
      rowSpan: custom.rowSpan,
      customTitle: custom.name,
      customMetricValue: custom.metricValue,
      customSubtitle: custom.subtitle,
      customBadge: custom.badge,
      category: custom.category,
      settings: {
        vendor: custom.vendor,
        groupBy: custom.groupBy,
        filters: custom.filters,
        timeRangeStart: custom.timeRangeStart,
        timeRangeEnd: custom.timeRangeEnd,
      },
    };

    updateActiveWidgets((prev) => [...prev, newDashboardWidget]);
    setIsAddModalOpen(false);
  };

  const deleteCustomWidget = (id: string) => {
    const updated = userCustomWidgets.filter((w) => w.id !== id);
    setUserCustomWidgets(updated);
    saveCustomWidgetsToStorage(updated);
  };

  const editWidget = (id: string, updates: Partial<DashboardWidget>) => {
    updateActiveWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
    setEditingWidget(null);
  };

  const resetToDefault = () => {
    updateActiveWidgets(() => DEFAULT_WIDGETS);
  };

  return (
    <DashboardContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        dashboards,
        activeDashboardId,
        setActiveDashboardId,
        createNewDashboard,
        createDashboardWithArchetype,
        userTemplates,
        saveCurrentAsTemplate,
        deleteUserTemplate,
        isCreateModalOpen,
        setIsCreateModalOpen,
        renameDashboard,
        deleteDashboard,
        widgets,
        userCustomWidgets,
        isCustomizing,
        setIsCustomizing,
        toggleCustomizing,
        resizeWidget,
        moveWidget,
        reorderWidgetById,
        placeWidgetAtPosition,
        draggedWidgetId,
        setDraggedWidgetId,
        removeWidget,
        addWidget,
        createCustomWidget,
        addCustomWidgetToDashboard,
        deleteCustomWidget,
        editWidget,
        resetToDefault,
        isAddModalOpen,
        setIsAddModalOpen,
        editingWidget,
        setEditingWidget,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
