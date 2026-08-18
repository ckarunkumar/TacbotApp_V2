export type WidgetType =
  | "case-summary"
  | "sla-summary"
  | "total-cases"
  | "treemap"
  | "sla-health"
  | "avg-resolution"
  | "alerts"
  | "vendor-response"
  | "critical-escalations"
  | "custom-kpi"
  | "custom-chart"
  | "custom-list";

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  colSpan: 1 | 2 | 3 | 4; // 1 to 4 columns wide
  rowSpan: 1 | 2 | 3 | 4; // 1 to 4 units high (1 unit = ~112px)
  colStart?: number;
  rowStart?: number;
  customTitle?: string;
  customMetricValue?: string;
  customSubtitle?: string;
  customBadge?: string;
  category?: string;
  settings?: Record<string, any>;
}

export interface CustomUserWidget {
  id: string;
  name: string;
  type: WidgetType;
  colSpan: 1 | 2 | 3 | 4;
  rowSpan: 1 | 2 | 3 | 4;
  metricValue: string;
  subtitle: string;
  badge: string;
  category: string;
  createdAt: string;
  vendor?: string;
  groupBy?: string;
  filters?: string[];
  timeRangeStart?: string;
  timeRangeEnd?: string;
}

export interface WidgetCatalogItem {
  type: WidgetType;
  name: string;
  category: string;
  description: string;
  defaultColSpan: 1 | 2 | 3 | 4;
  defaultRowSpan: 1 | 2 | 3 | 4;
  iconName: string;
}

export interface DashboardInstance {
  id: string;
  name: string;
  category?: string;
  sharingPrivacy?: string;
  widgets: DashboardWidget[];
  createdAt?: string;
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  isUserSaved?: boolean;
  widgets: DashboardWidget[];
}
