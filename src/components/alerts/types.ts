export type AlertCategory =
  | "software_release"
  | "maintenance"
  | "bug"
  | "lifecycle"
  | "others";

export type CalendarViewType = "Yearly" | "Monthly" | "Weekly" | "Daily";

export interface AlertEvent {
  id: string;
  title: string;
  category: AlertCategory;
  categoryLabel: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  incidentId: string; // e.g. #INC-8921
  tag: string; // e.g. Security / Azure
  durationText: string; // e.g. 09:00 - 10:00 IST (1 hr)
  timeRangeText: string; // e.g. 10:00 - 13:00
  priority?: "Critical" | "High" | "Medium" | "Low";
  status?: "Active" | "Investigating" | "Resolved";
  vendor?: string;
}

export interface AlertCategoryConfig {
  id: AlertCategory;
  label: string;
  count: string;
  dotColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  darkBgColor: string;
  darkBorderColor: string;
  darkTextColor: string;
}
