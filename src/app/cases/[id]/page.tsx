"use client";

import React, { useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Filter,
  Calendar,
  Check,
  Bot,
  LayoutList,
  FileText,
  MessageSquare,
  Flag,
  Box,
  Maximize2,
  Undo2,
  RefreshCw,
  Send,
  Paperclip,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  Terminal,
  Copy,
  ExternalLink,
  ShieldAlert,
  Wrench,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Danger } from "iconsax-react";
import PageLayout from "@/components/PageLayout";
import Badge, { BadgeVariant } from "@/components/Badge";
import Tooltip from "@/components/Tooltip";
import Input from "@/components/ui/Input";
import Switch from "@/components/ui/Switch";
import VendorIcon from "@/components/cases/VendorIcon";
import { DashboardProvider } from "@/context/DashboardContext";

type CaseStatus = "In Progress" | "Resolved" | "Pending" | "Escalated";

const STATUS_VARIANT: Record<CaseStatus, BadgeVariant> = {
  "In Progress": "info",
  Resolved: "success",
  Pending: "warning",
  Escalated: "danger",
};

const STATUS_TRIGGER_STYLE: Record<CaseStatus, string> = {
  "In Progress": "bg-[#ECF3FF] border-[#D4E4FE] text-[#002E5D]",
  Resolved: "bg-emerald-50 border-emerald-200/60 text-emerald-700",
  Pending: "bg-amber-50 border-amber-200/60 text-amber-700",
  Escalated: "bg-red-50 border-red-200/60 text-red-700",
};

type MsgSender = "finx" | "tacbot";

interface ConversationMessage {
  kind: "message";
  id: string;
  sender: MsgSender;
  email: string;
  role: string;
  time: string;
  elapsedLabel?: string;
  elapsedTooltip?: string;
  body: React.ReactNode[];
  codeSnippet?: string;
}

interface SlaBreachEvent {
  kind: "breach";
  id: string;
  time: string;
  title: string;
  subtitle: string;
}

type ConversationItem = ConversationMessage | SlaBreachEvent;

interface ConversationDay {
  date: string;
  msgCount: number;
  alertCount: number;
  items: ConversationItem[];
}

// Hand-authored "featured" items per day — kept in full, then padded up to the
// claimed msgCount/alertCount by generateConversationDays() below, so the day
// header badges never claim a count the actual item list can't back up.
const RAW_CONVERSATION_DAYS: ConversationDay[] = [
  {
    date: "2025-11-06",
    msgCount: 30,
    alertCount: 1,
    items: [
      {
        kind: "breach",
        id: "tl-20251106-172011",
        time: "17:20:11",
        title: "SLA Breach – Tire 2 Escalation",
        subtitle: "Case Resolution Duration exceeded 4h threshold",
      },
      {
        kind: "message",
        id: "tl-20251106-163200",
        sender: "finx",
        email: "alton.perkins@arista.com",
        role: "TAC Escalation Engineer",
        time: "16:32:00",
        body: [
          "Hi Tacbot Operations Team,",
          "Regarding SR34677363674 for Arista 7050SX3-48YC8 (DC4-Rack-B12): Our engineering team reviewed your uploaded log dump. The CRC frame drops on interface Et1/1 correlate with lane 3 bit errors on the QSFP28 transceiver.",
          "We recommend reseating the optical module or replacing the patch cable on Et1/1. Diagnostic show commands below:",
        ],
        codeSnippet: "show interfaces Ethernet1/1 phy detail\nshow interfaces counters errors | grep -i Et1/1\nshow inventory transceiver",
      },
      {
        kind: "message",
        id: "tl-20251106-155800",
        sender: "tacbot",
        email: "sankamethra.s@finx.com",
        role: "Network Operations Lead",
        time: "15:58:00",
        elapsedLabel: "103 minutes",
        elapsedTooltip: "Vendor Response Duration",
        body: [
          "Hi Tacbot Support Team,",
          "We are observing severe CRC frame drops (>1.2M drops/30m) on uplink interface Et1/1 on router Arista-7050SX3-48YC8 (IP: 10.240.12.88). BGP neighbor 10.240.12.89 flapped twice in the past 45 minutes.",
          "Show tech and show log files have been exported and attached to the case repository.",
        ],
      },
      {
        kind: "message",
        id: "tl-20251106-143100",
        sender: "finx",
        email: "grep.sam@arista.com",
        role: "TAC Tier 2 Engineer",
        time: "14:31:00",
        body: [
          "Initial packet capture analysis completed. We see intermittent symbol errors during high burst traffic on 100G uplink.",
          "Please run transceiver diagnostic tests to check optical power on lane 3.",
        ],
      },
    ],
  },
  {
    date: "2025-11-05",
    msgCount: 41,
    alertCount: 8,
    items: [
      {
        kind: "message",
        id: "tl-20251105-184800",
        sender: "tacbot",
        email: "noreply@finx.com",
        role: "Automated Diagnostic Agent",
        time: "18:48:00",
        body: [
          "Automated health check triggered. Interface CRC counters reset for monitoring window.",
        ],
      },
      {
        kind: "message",
        id: "tl-20251105-183200",
        sender: "finx",
        email: "grep.sam@arista.com",
        role: "TAC Tier 2 Engineer",
        time: "18:32:00",
        body: [
          "Reviewed transceiver telemetry for serial JPE21480029. TX optical power is within normal range (+1.2 dBm).",
        ],
      },
      {
        kind: "message",
        id: "tl-20251105-175800",
        sender: "tacbot",
        email: "noreply@finx.com",
        role: "Automated Diagnostic Agent",
        time: "17:58:00",
        elapsedLabel: "103 minutes",
        body: [
          "Hi Perkins,",
          "Automated diagnostics identified a matching known issue for EOS 4.28.3M cosmetic counter bug 678460.",
          "http://www.finx.com/en/support/software-bug-portal/bugdetail?bug_id=678460",
        ],
      },
      {
        kind: "message",
        id: "tl-20251105-173100",
        sender: "finx",
        email: "grep.sam@arista.com",
        role: "TAC Tier 2 Engineer",
        time: "17:31:00",
        body: [
          "Confirmed matching bug signature 678460 on EOS 4.28.3M kernel patch.",
        ],
      },
      {
        kind: "breach",
        id: "tl-20251105-172011",
        time: "17:20:11",
        title: "SLA Breach – Tire 1 Escalation",
        subtitle: "Case Resolution Duration exceeded threshold",
      },
      {
        kind: "message",
        id: "tl-20251105-171200",
        sender: "tacbot",
        email: "grace.logan@finx.com",
        role: "L2 Escalation Specialist",
        time: "17:12:00",
        body: [
          "Status change: Case assigned to Grace Logan (L2 Escalations). Taking over investigation and coordinating with Arista TAC.",
        ],
      },
    ],
  },
  {
    date: "2025-11-04",
    msgCount: 14,
    alertCount: 0,
    items: [
      {
        kind: "message",
        id: "m5",
        sender: "finx",
        email: "case-intake@arista.com",
        role: "Automated Intake",
        time: "09:14",
        body: [
          "Case SR34677363674 has been created and assigned to Arista TAC Tier 1 Queue. Priority: P2 - Major Degradation. SLA Target: 2h initial response, 8h resolution.",
        ],
      },
      {
        kind: "message",
        id: "m6",
        sender: "tacbot",
        email: "operator.d@finx.com",
        role: "NOC Tier 1",
        time: "09:20",
        body: [
          "Initial triage: DC4 spine-to-leaf uplink packet drops detected during morning traffic ramp. Routing has been temporarily rerouted via secondary path Et1/2.",
        ],
      },
    ],
  },
];

// Fills each day's item list up to its own claimed msgCount/alertCount with
// plausible generated entries, so the day-header count badges and the actual
// filterable/expandable item list always agree.
const FINX_MESSAGE_TEMPLATES = [
  "Confirmed patch cable was reseated per the recommended diagnostic steps.",
  "Ran the requested show-tech bundle — attaching output for engineering review.",
  "No additional anomalies observed beyond the reported interface counters.",
  "Customer confirms traffic has stabilized on the rerouted path.",
  "Following up on transceiver RMA status with the hardware vendor.",
  "Escalation engineer has been looped in for a second opinion on the RCA.",
  "Requesting an updated ETA on the replacement optical module.",
  "Log bundle uploaded to the case repository for the affected time window.",
];

const TACBOT_MESSAGE_TEMPLATES = [
  "Monitoring interface counters post-remediation — error rate trending down.",
  "Automated diagnostic re-run complete; no new CRC drops detected in the last poll.",
  "Cross-referencing this signature against the known-issue bug database.",
  "Case telemetry synced to the SLA tracker — timer status updated.",
  "Draft RCA summary generated and queued for engineer review.",
  "Vendor response SLA clock paused pending customer confirmation.",
  "Flagging this case for shift handover with current diagnostic context.",
  "Configuration snapshot captured before applying the recommended change.",
];

const BREACH_TEMPLATES: Array<{ title: string; subtitle: string }> = [
  { title: "SLA Breach - Tier 1 Escalation", subtitle: "Initial Response Duration exceeded threshold" },
  { title: "SLA Breach - Tier 2 Escalation", subtitle: "Case Resolution Duration exceeded 4h threshold" },
  { title: "Vendor Response SLA Warning", subtitle: "Vendor acknowledgement pending beyond target window" },
  { title: "Resolution Target Missed", subtitle: "Contractual MTTR window exceeded" },
];

function generateConversationDays(rawDays: ConversationDay[]): ConversationDay[] {
  return rawDays.map((day) => {
    const existingMessageCount = day.items.filter((i) => i.kind === "message").length;
    const existingBreachCount = day.items.filter((i) => i.kind === "breach").length;

    const messagesNeeded = Math.max(0, day.msgCount - existingMessageCount);
    const breachesNeeded = Math.max(0, day.alertCount - existingBreachCount);

    const generated: ConversationItem[] = [];

    for (let i = 0; i < messagesNeeded; i++) {
      const sender: MsgSender = i % 2 === 0 ? "finx" : "tacbot";
      const templates = sender === "finx" ? FINX_MESSAGE_TEMPLATES : TACBOT_MESSAGE_TEMPLATES;
      const hour = 8 + Math.floor(i / 4);
      const minute = (i * 13) % 60;
      generated.push({
        kind: "message",
        id: `${day.date}-gen-msg-${i}`,
        sender,
        email: sender === "finx" ? "ops-team@arista.com" : "engineer.ops@finx.com",
        role: sender === "finx" ? "TAC Support Engineer" : "Network Operations",
        time: `${String(hour % 24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
        body: [templates[i % templates.length]],
      });
    }

    for (let i = 0; i < breachesNeeded; i++) {
      const tmpl = BREACH_TEMPLATES[i % BREACH_TEMPLATES.length];
      const hour = 9 + Math.floor(i / 3);
      const minute = (i * 17) % 60;
      generated.push({
        kind: "breach",
        id: `${day.date}-gen-breach-${i}`,
        time: `${String(hour % 24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
        title: tmpl.title,
        subtitle: tmpl.subtitle,
      });
    }

    return {
      ...day,
      items: [...day.items, ...generated],
    };
  });
}

const INITIAL_CONVERSATION_DAYS: ConversationDay[] = generateConversationDays(RAW_CONVERSATION_DAYS);

interface TimelineEntry {
  id: string;
  time: string;
  kind: "finx" | "tacbot" | "breach" | "status";
  title: string;
  subtitle: string;
}

interface TimelineDay {
  date: string;
  entries: TimelineEntry[];
}

const TIMELINE_DAYS: TimelineDay[] = [
  {
    date: "2025-11-06",
    entries: [
      {
        id: "tl-20251106-172011",
        time: "17:20:11",
        kind: "breach",
        title: "SLA Breach – Tire 2 Escalation",
        subtitle: "Case Resolution Duration",
      },
      {
        id: "tl-20251106-163200",
        time: "16:32:00",
        kind: "finx",
        title: "Finx Response",
        subtitle: "Grep.sam replied",
      },
      {
        id: "tl-20251106-155800",
        time: "15:58:00",
        kind: "tacbot",
        title: "Tacbot Response",
        subtitle: "Perkins replied",
      },
      {
        id: "tl-20251106-143100",
        time: "14:31:00",
        kind: "finx",
        title: "Finx Response",
        subtitle: "Grep.sam replied",
      },
    ],
  },
  {
    date: "2025-11-05",
    entries: [
      {
        id: "tl-20251105-184800",
        time: "18:48:00",
        kind: "tacbot",
        title: "Tacbot Response",
        subtitle: "Perkins replied",
      },
      {
        id: "tl-20251105-183200",
        time: "18:32:00",
        kind: "finx",
        title: "Finx Response",
        subtitle: "Grep.sam replied",
      },
      {
        id: "tl-20251105-175800",
        time: "17:58:00",
        kind: "tacbot",
        title: "Tacbot Response",
        subtitle: "Perkins replied",
      },
      {
        id: "tl-20251105-173100",
        time: "17:31:00",
        kind: "finx",
        title: "Finx Response",
        subtitle: "Grep.sam replied",
      },
      {
        id: "tl-20251105-172011",
        time: "17:20:11",
        kind: "breach",
        title: "SLA Breach – Tire 1 Escalation",
        subtitle: "Case Resolution Duration",
      },
      {
        id: "tl-20251105-171200",
        time: "17:12:00",
        kind: "status",
        title: "Status change: Assigned to",
        subtitle: "Grace Logan (L2 Escalations)",
      },
    ],
  },
];

const TIMELINE_TOTAL_COUNT = 59;

function FinxAvatar({ size = 24 }: { size?: number }) {
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center text-white font-semibold italic select-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: "linear-gradient(135deg,#FF8A5B 0%,#FF5E9A 55%,#8B5CF6 100%)",
      }}
      title="finx"
    >
      f
    </div>
  );
}

function TacbotAvatar({ size = 24 }: { size?: number }) {
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center text-white select-none"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#2563eb 100%)",
      }}
      title="Tacbot"
    >
      <Bot size={size * 0.6} color="#ffffff" />
    </div>
  );
}

function OwnerAvatar({ name, size = 24 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center text-white font-semibold select-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: "linear-gradient(135deg,#005899 0%,#0181c4 100%)",
      }}
      title={name}
    >
      {initials}
    </div>
  );
}

function TaskListRailIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="5.5" height="5.5" rx="1.2" strokeWidth="2" />
      <line x1="12" y1="5.5" x2="20.5" y2="5.5" strokeWidth="2.2" />
      <line x1="12" y1="8.5" x2="18.5" y2="8.5" strokeWidth="2.2" />
      <rect x="3" y="14" width="5.5" height="5.5" rx="1.2" strokeWidth="2" />
      <line x1="12" y1="15.5" x2="20.5" y2="15.5" strokeWidth="2.2" />
      <line x1="12" y1="18.5" x2="18.5" y2="18.5" strokeWidth="2.2" />
    </svg>
  );
}

function DocumentRailIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeWidth="2" />
      <path d="M14 2v6h6" strokeWidth="2" />
      <line x1="8" y1="13" x2="16" y2="13" strokeWidth="2" />
      <line x1="8" y1="17" x2="14" y2="17" strokeWidth="2" />
      <line x1="8" y1="9.5" x2="10.5" y2="9.5" strokeWidth="2" />
    </svg>
  );
}

function PaperclipRailIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function CubeRailIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function renderFormattedParagraph(text: React.ReactNode): React.ReactNode {
  if (typeof text !== "string") {
    return text;
  }
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2F6ADB] dark:text-sky-400 hover:underline inline-flex items-center gap-1 break-all"
        >
          <span>{part}</span>
          <ExternalLink className="w-2.5 h-2.5 inline shrink-0" />
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

interface ScrubberNode {
  id: string;
  time: string;
  displayTime: string;
  date: string;
  targetId: string;
  type: "pink" | "purple";
}

const SCRUBBER_NODES: ScrubberNode[] = [
  { id: "s1", time: "14:31:00", displayTime: "14:31", date: "2025-11-06", targetId: "tl-20251106-143100", type: "pink" },
  { id: "s2", time: "15:58:00", displayTime: "15:58", date: "2025-11-06", targetId: "tl-20251106-155800", type: "pink" },
  { id: "s3", time: "16:32:00", displayTime: "16:32", date: "2025-11-06", targetId: "tl-20251106-163200", type: "purple" },
  { id: "s4", time: "17:12:00", displayTime: "17:12", date: "2025-11-05", targetId: "tl-20251105-171200", type: "pink" },
  { id: "s5", time: "17:20:11", displayTime: "17:20", date: "2025-11-06", targetId: "tl-20251106-172011", type: "pink" },
  { id: "s6", time: "17:31:00", displayTime: "17:31", date: "2025-11-05", targetId: "tl-20251105-173100", type: "purple" },
  { id: "s7", time: "17:58:00", displayTime: "17:58", date: "2025-11-05", targetId: "tl-20251105-175800", type: "pink" },
  { id: "s8", time: "18:32:00", displayTime: "18:32", date: "2025-11-05", targetId: "tl-20251105-183200", type: "pink" },
  { id: "s9", time: "18:48:00", displayTime: "18:48", date: "2025-11-05", targetId: "tl-20251105-184800", type: "purple" },
  { id: "s10", time: "19:15:00", displayTime: "19:15", date: "2025-11-05", targetId: "tl-20251105-184800", type: "pink" },
  { id: "s11", time: "20:00:00", displayTime: "20:00", date: "2025-11-05", targetId: "tl-20251105-184800", type: "pink" },
];

function MacDockScrubber({ onSelectNode }: { onSelectNode?: (node: ScrubberNode) => void }) {
  const [activeIndex, setActiveIndex] = useState<number>(4);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const fractionalIndex = (x / rect.width) * (SCRUBBER_NODES.length - 1);
    setHoverPosition(fractionalIndex);
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => {
      const next = Math.max(0, prev - 1);
      if (onSelectNode) onSelectNode(SCRUBBER_NODES[next]);
      return next;
    });
  };

  const handleNext = () => {
    setActiveIndex((prev) => {
      const next = Math.min(SCRUBBER_NODES.length - 1, prev + 1);
      if (onSelectNode) onSelectNode(SCRUBBER_NODES[next]);
      return next;
    });
  };

  return (
    <div className="relative w-full h-[36px] my-1.5 px-0.5 select-none flex items-center justify-between shrink-0">
      {/* Left Chevron Button */}
      <button
        type="button"
        onClick={handlePrev}
        className="w-4 h-4 shrink-0 rounded-[3px] bg-white dark:bg-[#0e1b38] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer shadow-2xs transition-colors z-20"
        title="Previous timestamp"
      >
        <ChevronLeft className="w-3 h-3" />
      </button>

      {/* Scrubber dots track — all dots uniform in default state */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex-1 h-full relative mx-2 flex items-center justify-between cursor-pointer"
      >
        {/* Connecting horizontal rail line passing through exact center */}
        <div className="absolute left-0 right-0 h-px bg-[#CBD5E1] dark:bg-slate-700 top-1/2 -translate-y-1/2 pointer-events-none" />

        {SCRUBBER_NODES.map((node, i) => {
          // In default state: scale is 1 for all dots (same size)
          // On hover: Apple Dock magnification wave
          let scale = 1;
          let isHoveredCenter = false;

          if (hoverPosition !== null) {
            const dist = Math.abs(i - hoverPosition);
            if (dist < 2.5) {
              const factor = Math.cos((dist / 2.5) * (Math.PI / 2));
              scale = 1 + 1.2 * factor; // Expands up to 2.2x on hover
            }
            if (dist < 0.6) {
              isHoveredCenter = true;
            }
          }

          return (
            <div
              key={node.id}
              onClick={() => {
                setActiveIndex(i);
                if (onSelectNode) onSelectNode(node);
              }}
              className="relative flex items-center justify-center h-full group"
              style={{
                width: "14px",
              }}
            >
              {/* Dot Node — identical baseline 6px size for all dots */}
              <div
                className="flex items-center justify-center pointer-events-none"
                style={{
                  transform: `scale(${scale})`,
                  transition: "transform 0.12s cubic-bezier(0.2, 0.9, 0.3, 1.2)",
                  willChange: "transform",
                }}
              >
                {node.type === "purple" ? (
                  <div
                    className={`w-1.5 h-1.5 rounded-full bg-[#4F46E5] transition-all duration-150 ${
                      isHoveredCenter
                        ? "bg-[#4338CA] ring-4 ring-[#EDE9FE] dark:ring-[#3B1D70] shadow-2xs"
                        : ""
                    }`}
                  />
                ) : (
                  <div
                    className={`w-1.5 h-1.5 rounded-full bg-[#FF477E] transition-all duration-150 ${
                      isHoveredCenter
                        ? "ring-4 ring-[#FFE4EC] dark:ring-[#4C1D2A] shadow-2xs"
                        : ""
                    }`}
                  />
                )}
              </div>

              {/* Timestamp Tooltip — only displayed on hover for the active/focused dot */}
              {isHoveredCenter && (
                <div className="absolute top-[22px] left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap text-center z-30 animate-in fade-in zoom-in-95 duration-100">
                  <span className="inline-block text-[8px] font-semibold text-slate-800 dark:text-slate-100 bg-white/95 dark:bg-[#0e1b38]/95 px-1.5 py-0.5 rounded-[3px] shadow-2xs border border-slate-200/80 dark:border-slate-700/80 font-mono leading-none">
                    {node.displayTime}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right Chevron Button */}
      <button
        type="button"
        onClick={handleNext}
        className="w-4 h-4 shrink-0 rounded-[3px] bg-white dark:bg-[#0e1b38] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer shadow-2xs transition-colors z-20"
        title="Next timestamp"
      >
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}

const CASE_META = {
  owner: "Donna Paulsen",
  vendor: "Arista",
  createdOnDate: "01/28/2024",
  createdOnTime: "12:18 PM",
  slaRemainingLabel: "34 mins remaining",
  slaRemainingPercent: 68,
  lastActivity: "5 mins ago",
  lastActivityBy: "Grace Logan",
  caseType: "Inquiry/Help",
  attachmentsCount: 2,
};

const CASE_ATTACHMENTS = [
  { id: "att1", name: "show-tech-Et1-1_11-06.log", size: "842 KB" },
  { id: "att2", name: "cli_diagnostic_bundle.zip", size: "2.1 MB" },
];

const TABS = ["Conversation", "SLA Insights", "RCA & Diagnostics", "ITSM Sync"] as const;
type TabId = (typeof TABS)[number];

type ActiveRightDrawer = "timeline" | "notes" | "flags" | "assets" | null;

export default function CaseDetailPage() {
  return (
    <DashboardProvider>
      <CaseDetailPageBody />
    </DashboardProvider>
  );
}

function CaseDetailPageBody() {
  const params = useParams();
  const ticketId = (params?.id as string) || "SR34677363674";

  const [activeTab, setActiveTab] = useState<TabId>("Conversation");
  const [status, setStatus] = useState<CaseStatus>("In Progress");
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isMetaExpanded, setIsMetaExpanded] = useState(false);
  const [rightDrawer, setRightDrawer] = useState<ActiveRightDrawer>(null);
  const [isRightRailCollapsed, setIsRightRailCollapsed] = useState(false);
  const [showSlaTimeline, setShowSlaTimeline] = useState(false);
  const [timelineSearch, setTimelineSearch] = useState("");
  const [collapsedDays, setCollapsedDays] = useState<Set<string>>(new Set());
  const [dayFilters, setDayFilters] = useState<Record<string, "all" | "messages" | "alerts">>({});
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  // Tabs-row date filter
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("All Dates");

  // Attachments popover
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);

  // Timeline date + event-kind filters
  const [timelineDateFilter, setTimelineDateFilter] = useState<string>("");
  const [isTimelineDateDropdownOpen, setIsTimelineDateDropdownOpen] = useState(false);
  const [isTimelineKindFilterOpen, setIsTimelineKindFilterOpen] = useState(false);
  const [timelineKindFilter, setTimelineKindFilter] = useState<
    "all" | "finx" | "tacbot" | "breach" | "status"
  >("all");
  const [collapsedTimelineDays, setCollapsedTimelineDays] = useState<Set<string>>(new Set());

  const toggleTimelineDayCollapse = (date: string) => {
    setCollapsedTimelineDays((prev) => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  // Real-time reply composer state
  const [conversationDays, setConversationDays] = useState<ConversationDay[]>(INITIAL_CONVERSATION_DAYS);
  const [replyText, setReplyText] = useState("");
  const [expandedModalItem, setExpandedModalItem] = useState<ConversationMessage | null>(null);
  const [expandedInlineItemId, setExpandedInlineItemId] = useState<string | null>(null);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState("");
  const [escalateTier, setEscalateTier] = useState<"Tier 1" | "Tier 2" | "Tier 3 Duty Manager">("Tier 2");

  // Notes drawer state
  const [caseNotes, setCaseNotes] = useState<Array<{ id: string; author: string; time: string; text: string }>>([
    {
      id: "n1",
      author: "Alex Holmes",
      time: "11/06 14:10",
      text: "Transceiver RMA requested with Arista support. Tracking #AR-98234-RMA.",
    },
    {
      id: "n2",
      author: "Donna Paulsen",
      time: "11/05 11:30",
      text: "Temporary traffic diverted to spine-02. Latency impact is under 0.4ms.",
    },
  ]);
  const [newNoteText, setNewNoteText] = useState("");

  // Flags state
  const [flags, setFlags] = useState<Array<{ id: string; label: string; active: boolean; color: string }>>([
    { id: "f1", label: "P1 Critical Outage", active: false, color: "bg-red-500" },
    { id: "f2", label: "Hardware RMA Required", active: true, color: "bg-amber-500" },
    { id: "f3", label: "Customer SLA Escalated", active: true, color: "bg-purple-500" },
    { id: "f4", label: "Executive Visibility", active: false, color: "bg-blue-500" },
  ]);

  // Highlighted item ID when jumped from timeline or scrubber
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  const navigateToConversationTime = (date: string, time: string, entryId?: string) => {
    // 1. Ensure Conversation tab is active
    setActiveTab("Conversation");

    // 2. Uncollapse target day if collapsed
    setCollapsedDays((prev) => {
      if (prev.has(date)) {
        const next = new Set(prev);
        next.delete(date);
        return next;
      }
      return prev;
    });

    // 3. Ensure day is expanded so the item is visible
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.add(date);
      return next;
    });

    // 4. Ensure day filter is reset to "all"
    setDayFilters((prev) => ({ ...prev, [date]: "all" }));
    if (selectedDateFilter !== "All Dates" && selectedDateFilter !== date) {
      setSelectedDateFilter("All Dates");
    }

    // 5. Scroll smoothly to target element and highlight with glowing pulse
    setTimeout(() => {
      const targetElement =
        (entryId && document.getElementById(`msg-${entryId}`)) ||
        document.querySelector(`[data-day="${date}"][data-time*="${time.slice(0, 5)}"]`) ||
        document.querySelector(`[data-time*="${time.slice(0, 5)}"]`);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        const itemId = targetElement.getAttribute("data-item-id") || entryId || time;
        setHighlightedItemId(itemId);
        setTimeout(() => {
          setHighlightedItemId((prev) => (prev === itemId ? null : prev));
        }, 2800);
      }
    }, 120);
  };

  const toggleDayCollapsed = (date: string) => {
    setCollapsedDays((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const DAY_PREVIEW_COUNT = 5;

  const toggleDayExpanded = (date: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const toggleDayFilter = (
    date: string,
    filterType: "messages" | "alerts",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setCollapsedDays((prev) => {
      const next = new Set(prev);
      next.delete(date);
      return next;
    });
    setDayFilters((prev) => {
      const current = prev[date] || "all";
      const next = current === filterType ? "all" : filterType;
      return { ...prev, [date]: next };
    });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMessage: ConversationMessage = {
      kind: "message",
      id: `msg-${Date.now()}`,
      sender: "tacbot",
      email: "engineer.ops@finx.com",
      role: "Network Operations",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      body: [replyText.trim()],
    };

    setConversationDays((prev) => {
      const [today, ...rest] = prev;
      return [
        {
          ...today,
          msgCount: today.msgCount + 1,
          items: [newMessage, ...today.items],
        },
        ...rest,
      ];
    });

    setReplyText("");
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setCaseNotes((prev) => [
      {
        id: `note-${Date.now()}`,
        author: "Donna Paulsen",
        time: "Just now",
        text: newNoteText.trim(),
      },
      ...prev,
    ]);
    setNewNoteText("");
  };

  const handleEscalateConfirm = () => {
    setStatus("Escalated");
    const newBreach: SlaBreachEvent = {
      kind: "breach",
      id: `breach-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      title: `Escalated to ${escalateTier}`,
      subtitle: escalateReason.trim() || "Manual escalation triggered by operator",
    };
    setConversationDays((prev) => {
      const [today, ...rest] = prev;
      return [
        {
          ...today,
          alertCount: today.alertCount + 1,
          items: [newBreach, ...today.items],
        },
        ...rest,
      ];
    });
    setIsEscalateModalOpen(false);
    setEscalateReason("");
  };

  const visibleConversationDays =
    selectedDateFilter === "All Dates"
      ? conversationDays
      : conversationDays.filter((d) => d.date === selectedDateFilter);

  return (
    <PageLayout
      activeNavId="cases"
      breadcrumbTitle={`Cases > ${(params.id as string) || "SR34677363674"}`}
      primaryActionLabel="+ Create Case"
      showDatePicker={true}
      dateRangeText="2020-11-08 → 2020-11-08"
      contentClassName="flex flex-col flex-1 min-h-0 w-full h-full overflow-hidden"
    >
      {/* ── Case Header Bar ── */}
      <div
        className={`shrink-0 flex items-center justify-between px-3 py-2 bg-white dark:bg-[#081024] ${
          !isMetaExpanded ? "border-b border-[#EAEEF3] dark:border-[#162444]" : ""
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Danger size={20} color="#DC2626" variant="Bold" />
          <h1 className="text-base font-semibold text-[#1A222D] dark:text-white tracking-tight truncate">
            {ticketId}
          </h1>
          <span className="text-sm font-semibold text-[#DC2626] truncate">
            Internet Not Working
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Status Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStatusMenuOpen((v) => !v)}
              className={`h-8 px-3 rounded-[4px] border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${STATUS_TRIGGER_STYLE[status]}`}
            >
              <span>{status}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${isStatusMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isStatusMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#0e1b38] border border-[#EAEEF3] dark:border-[#1e3056] rounded-[4px] shadow-lg py-1 z-30 flex flex-col text-[11px] font-medium">
                {(["In Progress", "Resolved", "Pending", "Escalated"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setStatus(st);
                      setIsStatusMenuOpen(false);
                    }}
                    className={`px-3 py-1.5 flex items-center justify-between hover:bg-[#F2F4F6] dark:hover:bg-[#16294d] cursor-pointer ${
                      status === st ? "bg-[#ECF3FF]/40 dark:bg-[#16294d]/60 font-semibold" : ""
                    }`}
                  >
                    <Badge variant={STATUS_VARIANT[st]}>{st}</Badge>
                    {status === st && <Check className="w-3 h-3 text-[#002E5D] dark:text-sky-400 ml-2 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsEscalateModalOpen(true)}
            className="h-8 px-3 rounded-[4px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Escalate</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMetaExpanded((v) => !v)}
            className="w-8 h-8 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#0e1b38] hover:bg-[#F9FBFF] dark:hover:bg-[#16294d] text-[#576B81] dark:text-slate-300 flex items-center justify-center cursor-pointer shadow-2xs transition-colors"
            title="Toggle case metadata details"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${isMetaExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* ── Case Metadata Bar (toggled via chevron - seamless expansion without separator) ── */}
      {isMetaExpanded && (
        <div className="shrink-0 flex flex-wrap items-start justify-start gap-x-8 gap-y-2 px-3 pt-1 pb-2 border-b border-[#EAEEF3] dark:border-[#162444] bg-white dark:bg-[#081024] select-none">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium text-[#7790A9] dark:text-slate-400">Owner</span>
            <div className="flex items-center gap-1.5">
              <OwnerAvatar name={CASE_META.owner} size={20} />
              <span className="text-xs font-semibold text-[#002E5D] dark:text-sky-300">{CASE_META.owner}</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium text-[#7790A9] dark:text-slate-400">Vendor</span>
            <div className="flex items-center gap-1.5">
              <VendorIcon vendor={CASE_META.vendor} size={16} />
              <span className="text-xs font-semibold text-[#002E5D] dark:text-sky-300">{CASE_META.vendor}</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium text-[#7790A9] dark:text-slate-400">Created on</span>
            <span className="text-xs font-semibold text-[#002E5D] dark:text-sky-300">{CASE_META.createdOnDate}</span>
            <span className="text-[10px] text-[#7790A9] dark:text-slate-400">{CASE_META.createdOnTime}</span>
          </div>

          <div className="flex flex-col gap-0.5 min-w-[130px]">
            <span className="text-[11px] font-medium text-[#7790A9] dark:text-slate-400">SLA</span>
            <span className="text-xs font-semibold text-[#002E5D] dark:text-sky-300">{CASE_META.slaRemainingLabel}</span>
            <div className="w-full h-1.5 rounded-full bg-[#F2F4F6] dark:bg-slate-800 overflow-hidden mt-0.5">
              <div
                className="h-full bg-[#10b981]"
                style={{ width: `${CASE_META.slaRemainingPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium text-[#7790A9] dark:text-slate-400">Last Activity</span>
            <span className="text-xs font-semibold text-[#002E5D] dark:text-sky-300">{CASE_META.lastActivity}</span>
            <span className="text-[10px] text-[#7790A9] dark:text-slate-400">By {CASE_META.lastActivityBy}</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium text-[#7790A9] dark:text-slate-400">Case Type</span>
            <span className="text-xs font-semibold text-[#002E5D] dark:text-sky-300">{CASE_META.caseType}</span>
          </div>

          <div className="relative flex flex-col gap-0.5">
            <span className="text-[11px] font-medium text-[#7790A9] dark:text-slate-400">Attachments</span>
            <button
              type="button"
              onClick={() => setIsAttachmentsOpen((v) => !v)}
              className="text-xs font-semibold text-[#2F6ADB] dark:text-sky-400 hover:underline cursor-pointer text-left"
            >
              {CASE_META.attachmentsCount} Files
            </button>

            {isAttachmentsOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-[#0e1b38] border border-[#EAEEF3] dark:border-[#1e3056] rounded-[6px] shadow-lg py-1 z-30 flex flex-col">
                {CASE_ATTACHMENTS.map((file) => (
                  <a
                    key={file.id}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="px-3 py-2 flex items-center justify-between gap-2 hover:bg-[#F2F4F6] dark:hover:bg-[#16294d] cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-2 min-w-0 text-xs text-[#2C3746] dark:text-slate-200 font-medium truncate">
                      <Paperclip className="w-3.5 h-3.5 text-[#7790A9] shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </span>
                    <span className="text-[10px] text-[#7790A9] dark:text-slate-400 shrink-0">{file.size}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tabs Row ── */}
      <div className="shrink-0 flex items-center justify-between px-3 border-b border-[#EAEEF3] dark:border-[#162444] bg-white dark:bg-[#081024]">
        <nav className="flex items-center gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative py-2 px-2 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive ? "text-[#002E5D] dark:text-sky-300" : "text-[#7790A9] dark:text-slate-400 hover:text-[#2C3746] dark:hover:text-slate-200"
                }`}
              >
                <span>{tab}</span>
                {tab === "Conversation" && (
                  <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-[#ECF3FF] dark:bg-[#16294d] text-[#002E5D] dark:text-sky-300 text-[10px] font-semibold">
                    {conversationDays.reduce((acc, d) => acc + d.items.length, 0)}
                  </span>
                )}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#002E5D] dark:bg-sky-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDateFilterOpen((v) => !v)}
            className="h-7 px-2.5 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#0e1b38] text-[#2C3746] dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 hover:bg-[#F9FBFF] dark:hover:bg-[#16294d] hover:border-[#D4E4FE] transition-all cursor-pointer"
          >
            <ChevronDown
              className={`w-3 h-3 text-[#7790A9] dark:text-slate-400 transition-transform ${isDateFilterOpen ? "rotate-180" : ""}`}
            />
            <span>{selectedDateFilter}</span>
          </button>

          {isDateFilterOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#0e1b38] border border-[#EAEEF3] dark:border-[#1e3056] rounded-[4px] shadow-lg py-1 z-30 flex flex-col text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setSelectedDateFilter("All Dates");
                  setIsDateFilterOpen(false);
                }}
                className={`px-3 py-1.5 text-left hover:bg-[#F2F4F6] dark:hover:bg-[#16294d] cursor-pointer ${
                  selectedDateFilter === "All Dates"
                    ? "text-[#002E5D] dark:text-sky-300 font-semibold bg-[#ECF3FF]/40 dark:bg-[#16294d]/60"
                    : "text-[#2C3746] dark:text-slate-200"
                }`}
              >
                All Dates
              </button>
              {conversationDays.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => {
                    setSelectedDateFilter(day.date);
                    setIsDateFilterOpen(false);
                  }}
                  className={`px-3 py-1.5 text-left hover:bg-[#F2F4F6] dark:hover:bg-[#16294d] cursor-pointer ${
                    selectedDateFilter === day.date
                      ? "text-[#002E5D] dark:text-sky-300 font-semibold bg-[#ECF3FF]/40 dark:bg-[#16294d]/60"
                      : "text-[#2C3746] dark:text-slate-200"
                  }`}
                >
                  {day.date}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Body Content View ── */}
      <div className="flex-1 flex min-h-0 bg-[#F2F4F6] dark:bg-[#070D18]">
        {/* ── TAB 1: Conversation View ── */}
        {activeTab === "Conversation" && (
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {/* Scrollable Conversation Feed */}
            <div className="flex-1 min-w-0 overlay-scroll">
              <div className="w-full p-2 flex flex-col gap-2">
                {visibleConversationDays.map((day, dayIdx) => {
                  const isCollapsed = collapsedDays.has(day.date);
                  const activeFilter = dayFilters[day.date] || "all";
                  const visibleItems = day.items.filter((item) => {
                    if (activeFilter === "messages") return item.kind === "message";
                    if (activeFilter === "alerts") return item.kind === "breach";
                    return true;
                  });
                  const isDayExpanded = expandedDays.has(day.date);
                  const itemsToShow = isDayExpanded
                    ? visibleItems
                    : visibleItems.slice(0, DAY_PREVIEW_COUNT);

                  return (
                    <div key={day.date} className="flex flex-col gap-2">
                      {/* Sticky Day Header */}
                      <div
                        onClick={() => toggleDayCollapsed(day.date)}
                        className="sticky top-0 z-20 flex items-center justify-between px-3 py-1.5 rounded-[4px] bg-[#E8EEF5] dark:bg-[#0e1a34] hover:bg-[#DEE7F0] dark:hover:bg-[#142448] shadow-2xs border border-[#D5DEE7] dark:border-[#1a2d54] transition-colors cursor-pointer w-full text-left select-none backdrop-blur-xs"
                      >
                        {/* Left: Date + Message count filter + Alert count filter */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-[#2C3746] dark:text-slate-200 font-mono">{day.date}</span>
                          <div className="flex items-center gap-1.5">
                            {/* Messages Filter Button */}
                            <button
                              type="button"
                              onClick={(e) => toggleDayFilter(day.date, "messages", e)}
                              title={
                                activeFilter === "messages"
                                  ? "Clear filter (showing only messages)"
                                  : `Filter to show only ${day.msgCount} messages`
                              }
                              className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-[3px] transition-all cursor-pointer ${activeFilter === "messages"
                                  ? "bg-white dark:bg-[#132850] text-[#002E5D] dark:text-sky-300 shadow-2xs ring-1 ring-[#2F6ADB] font-bold"
                                  : "text-[#576B81] dark:text-slate-400 hover:bg-white/70 dark:hover:bg-white/10 hover:text-[#002E5D] dark:hover:text-white"
                                }`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="font-mono">{day.msgCount}</span>
                            </button>

                            {/* Alerts Filter Button */}
                            <button
                              type="button"
                              onClick={(e) => toggleDayFilter(day.date, "alerts", e)}
                              title={
                                activeFilter === "alerts"
                                  ? "Clear filter (showing only alerts)"
                                  : `Filter to show only ${day.alertCount} alerts`
                              }
                              className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-[3px] transition-all cursor-pointer ${activeFilter === "alerts"
                                  ? "bg-white dark:bg-[#380e0e] text-[#DC2626] dark:text-red-400 shadow-2xs ring-1 ring-[#DC2626] font-bold"
                                  : "text-[#DC2626] dark:text-red-400 hover:bg-white/70 dark:hover:bg-white/10"
                                }`}
                            >
                              <Danger size={13} color="#DC2626" variant="Bold" />
                              <span className="font-mono font-bold text-[#DC2626] dark:text-red-400">{day.alertCount}</span>
                            </button>
                          </div>
                        </div>

                        {/* Right corner: Dropdown toggle chevron */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDayCollapsed(day.date);
                          }}
                          className="p-0.5 text-[#7790A9] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-white transition-colors cursor-pointer"
                          title={isCollapsed ? "Expand day" : "Collapse day"}
                        >
                          {isCollapsed ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronUp className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {!isCollapsed && (
                        <div className="relative">
                          {/* Embedded conversation timeline rail: perfectly centered on the dots */}
                          <div className="absolute left-[64px] -translate-x-1/2 top-0 bottom-0 w-px border-l border-dashed border-[#C7D2E0] dark:border-[#1e3056]" />

                          <div className="flex flex-col gap-2">
                            {visibleItems.length === 0 ? (
                              <div className="py-4 text-center text-xs text-[#7790A9] dark:text-slate-400 italic bg-white/60 dark:bg-[#0B132B]/60 rounded-[6px] border border-[#EAEEF3] dark:border-[#162444]">
                                No {activeFilter === "messages" ? "conversations" : "alerts"} recorded for {day.date}
                              </div>
                            ) : (
                              itemsToShow.map((item) => {
                                const isBreach = item.kind === "breach";
                                const dotColorClass = isBreach
                                  ? "bg-[#DC2626]"
                                  : item.sender === "finx"
                                    ? "bg-[#FF5E9A]"
                                    : "bg-[#8B5CF6]";

                                return (
                                  <div
                                    key={item.id}
                                    id={`msg-${item.id}`}
                                    data-day={day.date}
                                    data-time={item.time}
                                    data-item-id={item.id}
                                    className="relative flex items-stretch gap-2 transition-all duration-300"
                                  >
                                    {/* Time label */}
                                    <div className="w-12 shrink-0 pt-2 text-right">
                                      <span className="text-[11px] font-mono text-[#7790A9] dark:text-slate-400">
                                        {item.time}
                                      </span>
                                    </div>

                                    {/* Rail dot - perfectly centered with the line */}
                                    <div className="relative w-4 shrink-0 flex flex-col items-center pt-2.5">
                                      <span
                                        className={`w-2.5 h-2.5 rounded-full ${dotColorClass} z-10 shrink-0 ring-2 ring-[#F2F4F6] dark:ring-[#070D18] ${
                                          highlightedItemId === item.id ? "ring-4 ring-[#002E5D] dark:ring-sky-400 scale-125" : ""
                                        } transition-all duration-300`}
                                      />
                                    </div>

                                    {/* Event content */}
                                    <div className="flex-1 min-w-0">
                                      {isBreach ? (
                                        <div
                                          className={`flex items-center gap-2 p-3 rounded-[8px] bg-[#fef2f2] dark:bg-[#380e0e]/50 border border-[#fecaca] dark:border-[#7f1d1d]/60 border-l-[3px] border-l-[#DC2626] transition-all duration-300 ${
                                            highlightedItemId === item.id
                                              ? "ring-2 ring-red-500 scale-[1.01] shadow-md bg-red-100/90 dark:bg-[#4d1414]"
                                              : ""
                                          }`}
                                        >
                                          <Danger size={16} color="#DC2626" variant="Bold" className="shrink-0" />
                                          <div className="min-w-0 flex flex-col gap-0.5">
                                            <div className="text-xs font-semibold text-[#DC2626] dark:text-red-300 truncate">
                                              {item.title}
                                            </div>
                                            <div className="text-[11px] text-[#7790A9] dark:text-slate-400 flex items-center gap-1.5">
                                              <RefreshCw className="w-2.5 h-2.5" />
                                              <span>{item.subtitle}</span>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          className={`bg-white dark:bg-[#0B132B] border border-[#EAEEF3] dark:border-[#162444] rounded-[8px] shadow-2xs p-3 flex flex-col justify-between group transition-all duration-300 ${
                                            highlightedItemId === item.id
                                              ? "ring-2 ring-[#002E5D] dark:ring-sky-400 scale-[1.01] shadow-lg bg-[#ECF3FF]/70 dark:bg-[#12244a]"
                                              : ""
                                          }`}
                                        >
                                          <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                              {item.sender === "finx" ? (
                                                <FinxAvatar size={22} />
                                              ) : (
                                                <TacbotAvatar size={22} />
                                              )}
                                              <span className="text-xs font-semibold text-[#1A222D] dark:text-white truncate">
                                                {item.email}
                                              </span>
                                              <span className="text-[11px] text-[#7790A9] dark:text-slate-400 font-medium shrink-0">
                                                {item.role}
                                              </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 shrink-0">
                                              {item.elapsedLabel && (
                                                <Tooltip
                                                  content={item.elapsedTooltip || item.elapsedLabel}
                                                  position="top"
                                                >
                                                  <span className="text-[10px] font-medium text-[#7790A9] dark:text-slate-400 bg-[#F2F4F6] dark:bg-slate-800 rounded-full px-2 py-0.5 cursor-default">
                                                    {item.elapsedLabel}
                                                  </span>
                                                </Tooltip>
                                              )}

                                              {/* Action buttons visible only on hover */}
                                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                  type="button"
                                                  onClick={() => setReplyText(`@${item.email} `)}
                                                  className="w-6 h-6 rounded-[4px] flex items-center justify-center text-[#7790A9] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-white hover:bg-[#F2F4F6] dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                                  title="Reply to message"
                                                >
                                                  <Undo2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => setExpandedModalItem(item)}
                                                  className="w-6 h-6 rounded-[4px] flex items-center justify-center text-[#7790A9] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-white hover:bg-[#F2F4F6] dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                                  title="Expand message"
                                                >
                                                  <Maximize2 className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>

                                          {(() => {
                                             const isExpanded = expandedInlineItemId === item.id;
                                             const hasMoreContent =
                                               item.body.length > 1 || !!item.codeSnippet;
                                             const paragraphsToShow = isExpanded ? item.body : [item.body[0]];

                                             return (
                                               <div className="flex flex-col gap-1.5">
                                                 {paragraphsToShow.map((paragraph, i) => (
                                                   <div
                                                     key={i}
                                                     className="text-[12px] leading-relaxed text-[#2C3746] dark:text-slate-200"
                                                   >
                                                     {renderFormattedParagraph(paragraph)}
                                                   </div>
                                                 ))}

                                                 {/* Code Snippet Box — visible in expanded view */}
                                                 {item.codeSnippet && isExpanded && (
                                                   <div className="mt-2 bg-[#0F151D] text-slate-200 font-mono text-[11px] p-2.5 rounded-[6px] border border-slate-700/60 relative group/code">
                                                     <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-700/50 pb-1 mb-1.5">
                                                       <span>Diagnostic CLI Commands</span>
                                                       <button
                                                         type="button"
                                                         onClick={() =>
                                                           navigator.clipboard.writeText(item.codeSnippet || "")
                                                         }
                                                         className="hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                                                       >
                                                         <Copy className="w-2.5 h-2.5" />
                                                         <span>Copy</span>
                                                       </button>
                                                     </div>
                                                     <pre className="overflow-x-auto whitespace-pre-wrap leading-tight text-emerald-400">
                                                       {item.codeSnippet}
                                                     </pre>
                                                   </div>
                                                 )}

                                                 {/* Classic View more / View less button */}
                                                 {hasMoreContent && (
                                                   <button
                                                     type="button"
                                                     onClick={() =>
                                                       setExpandedInlineItemId(
                                                         isExpanded ? null : item.id
                                                       )
                                                     }
                                                     className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#2F6ADB] dark:text-sky-400 hover:underline cursor-pointer self-start"
                                                   >
                                                     <span>{isExpanded ? "View less" : "View more"}</span>
                                                     <ChevronDown
                                                       className={`w-3 h-3 transition-transform ${
                                                         isExpanded ? "rotate-180" : ""
                                                       }`}
                                                     />
                                                   </button>
                                                 )}
                                               </div>
                                             );
                                           })()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {visibleItems.length > DAY_PREVIEW_COUNT && (
                            <div className="flex justify-center mt-2">
                              <button
                                type="button"
                                onClick={() => toggleDayExpanded(day.date)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F6ADB] dark:text-sky-400 hover:underline cursor-pointer"
                              >
                                <span>
                                  {isDayExpanded ? "View less" : `View all ${visibleItems.length}`}
                                </span>
                                <ChevronDown
                                  className={`w-3 h-3 transition-transform ${isDayExpanded ? "rotate-180" : ""}`}
                                />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Reply / Composer Bar at bottom of feed */}
            <form
              onSubmit={handleSendReply}
              className="shrink-0 p-2 bg-white dark:bg-[#081024] border-t border-[#EAEEF3] dark:border-[#162444] flex items-center gap-2"
            >
              <div className="flex-1 flex items-center bg-[#F2F4F6] dark:bg-[#0d1830] rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056] px-3 py-1.5 focus-within:border-[#2F6ADB] focus-within:bg-white dark:focus-within:bg-[#0e1b38] transition-all">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a response or type / for diagnostic commands..."
                  className="flex-1 bg-transparent text-xs text-[#2C3746] dark:text-slate-100 placeholder:text-[#7790A9] dark:placeholder:text-slate-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  className="text-[#7790A9] dark:text-slate-400 hover:text-[#002E5D] dark:hover:text-white transition-colors p-1"
                  title="Attach file"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="h-8 px-4 rounded-[4px] bg-[#002E5D] dark:bg-[#2F6ADB] hover:bg-[#003D7A] dark:hover:bg-[#1B4EB8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        )}

        {/* ── TAB 2: SLA Insights View ── */}
        {activeTab === "SLA Insights" && (
          <div className="flex-1 min-w-0 overlay-scroll p-4 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-[#1A222D] dark:text-white">SLA Summary for the Case</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: "Case Resolution Duration", icon: Clock },
                { label: "Hardware RMA Duration", icon: Wrench },
                { label: "Outage Duration", icon: TrendingUp },
                { label: "Performance Impact Duration", icon: Zap },
                { label: "Vendor Response Time Duration", icon: MessageSquare },
                { label: "Escalation Time Duration", icon: AlertTriangle },
              ].map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-white dark:bg-[#0B132B] p-4 rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] flex flex-col gap-2.5"
                >
                  <div className="flex items-center gap-2 text-[#576B81] dark:text-slate-300">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-semibold">{label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#B45309] dark:text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    <span>SLA not determined for Vendor</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#E5E7EB] dark:bg-[#1e2d4a]" />
                </div>
              ))}
            </div>

            {/* SLA Milestone Tracker */}
            <div className="bg-white dark:bg-[#0B132B] p-4 rounded-[8px] border border-[#EAEEF3] dark:border-[#162444]">
              <h3 className="text-xs font-semibold text-[#002E5D] dark:text-sky-300 mb-3">SLA Milestone Progress</h3>
              <div className="flex flex-col gap-3">
                {[
                  { title: "Ticket Intake & Classification", time: "11/04 09:14 AM", status: "Completed", color: "bg-emerald-500" },
                  { title: "First Operator Response", time: "11/04 09:32 AM", status: "Completed", color: "bg-emerald-500" },
                  { title: "Diagnostic show-tech review", time: "11/05 16:32 PM", status: "Completed", color: "bg-emerald-500" },
                  { title: "Transceiver Replacement / Hardware RMA", time: "In Progress", status: "Pending", color: "bg-amber-500" },
                  { title: "Final RCA Confirmation & Closure", time: "Target: 11/07", status: "Scheduled", color: "bg-slate-300" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#EAEEF3] dark:border-[#162444] last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="font-medium text-[#2C3746] dark:text-slate-200">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#7790A9] dark:text-slate-400 font-mono">{item.time}</span>
                      <Badge variant={item.status === "Completed" ? "success" : item.status === "Pending" ? "warning" : "neutral"}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: RCA & Diagnostics View ── */}
        {activeTab === "RCA & Diagnostics" && (
          <div className="flex-1 min-w-0 overlay-scroll p-4 flex flex-col gap-4">
            <div className="bg-white dark:bg-[#0B132B] p-4 rounded-[8px] border border-[#EAEEF3] dark:border-[#162444]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#2F6ADB] dark:text-sky-400" />
                  <h3 className="text-xs font-semibold text-[#002E5D] dark:text-sky-300">Root Cause Analysis Summary</h3>
                </div>
                <Badge variant="danger">Critical Severity</Badge>
              </div>
              <p className="text-xs text-[#2C3746] dark:text-slate-200 leading-relaxed">
                Optical transceiver degradation on uplink port <strong>Ethernet1/1</strong> on core spine switch <strong>Arista-7050SX3-48YC8</strong>. Laser RX power dropped below -14.2 dBm threshold causing frame CRC checksum failures and intermittent BGP route flapping.
              </p>
            </div>

            {/* Interface Telemetry */}
            <div className="bg-white dark:bg-[#0B132B] p-4 rounded-[8px] border border-[#EAEEF3] dark:border-[#162444]">
              <h3 className="text-xs font-semibold text-[#002E5D] dark:text-sky-300 mb-2">Interface Optical Telemetry (Et1/1)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-[#F9FBFF] dark:bg-[#0e1b38] p-2 rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056]">
                  <span className="text-[10px] text-[#7790A9] dark:text-slate-400 block">RX Power (Lane 1)</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">-3.2 dBm (Normal)</span>
                </div>
                <div className="bg-[#F9FBFF] dark:bg-[#0e1b38] p-2 rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056]">
                  <span className="text-[10px] text-[#7790A9] dark:text-slate-400 block">RX Power (Lane 2)</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">-3.4 dBm (Normal)</span>
                </div>
                <div className="bg-[#F9FBFF] dark:bg-[#0e1b38] p-2 rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056]">
                  <span className="text-[10px] text-[#7790A9] dark:text-slate-400 block">RX Power (Lane 3)</span>
                  <span className="font-mono font-bold text-[#DC2626] dark:text-red-400">-16.8 dBm (Low Alert)</span>
                </div>
                <div className="bg-[#F9FBFF] dark:bg-[#0e1b38] p-2 rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056]">
                  <span className="text-[10px] text-[#7790A9] dark:text-slate-400 block">TX Power</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+1.2 dBm (Normal)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: ITSM Sync View ── */}
        {activeTab === "ITSM Sync" && (
          <div className="flex-1 min-w-0 overlay-scroll p-4 flex flex-col gap-4">
            <div className="bg-white dark:bg-[#0B132B] p-4 rounded-[8px] border border-[#EAEEF3] dark:border-[#162444]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xs font-semibold text-[#002E5D] dark:text-sky-300">ServiceNow / ITSM Bi-directional Sync</h3>
                </div>
                <Badge variant="success">Sync Active (Healthy)</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#F9FBFF] dark:bg-[#0e1b38] p-3 rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056]">
                  <span className="text-[10px] text-[#7790A9] dark:text-slate-400 block mb-0.5">ServiceNow Incident #</span>
                  <span className="font-mono font-bold text-[#002E5D] dark:text-sky-300 text-sm">INC0982341</span>
                </div>
                <div className="bg-[#F9FBFF] dark:bg-[#0e1b38] p-3 rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056]">
                  <span className="text-[10px] text-[#7790A9] dark:text-slate-400 block mb-0.5">Last Sync Timestamp</span>
                  <span className="font-mono text-[#2C3746] dark:text-slate-200">11/06/2025 16:35:12 UTC</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Right Drawers & Tools (Timeline, Notes, Flags, Assets) ── */}

        {/* 1. Timeline Drawer */}
        {!isRightRailCollapsed && rightDrawer === "timeline" && (
          <div className="w-[320px] shrink-0 border-l border-[#EAEEF3] dark:border-[#162444] bg-white dark:bg-[#081024] flex flex-col min-h-0 select-none">
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-[#EAEEF3] dark:border-[#162444]">
              <h2 className="text-xs font-semibold text-[#002E5D] dark:text-sky-300">Timeline</h2>
              <button
                type="button"
                onClick={() => setRightDrawer(null)}
                className="w-6 h-6 rounded-[4px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-[#F2F4F6] dark:hover:bg-slate-800 cursor-pointer transition-colors"
                title="Close Timeline"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overlay-scroll px-2.5 py-2 flex flex-col gap-2">
              {/* Top Sub-header */}
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[11px] font-semibold text-[#002E5D] dark:text-sky-300">
                  Timeline (59)
                </span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsTimelineDateDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-[4px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0e1b38] text-[11px] font-medium text-[#002E5D] dark:text-sky-300 hover:bg-slate-50 dark:hover:bg-[#152e54] cursor-pointer shadow-2xs transition-colors"
                  >
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 dark:text-slate-300 transition-transform ${
                        isTimelineDateDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                    <span>{timelineDateFilter || "All Dates"}</span>
                  </button>

                  {isTimelineDateDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#0e1b38] border border-[#EAEEF3] dark:border-[#1e3056] rounded-[6px] shadow-xl py-1 z-40 flex flex-col text-[11px] font-medium">
                      {[
                        { value: "", label: "All Dates" },
                        { value: "2025-11-06", label: "2025-11-06" },
                        { value: "2025-11-05", label: "2025-11-05" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setTimelineDateFilter(opt.value);
                            setIsTimelineDateDropdownOpen(false);
                          }}
                          className={`px-2.5 py-1.5 text-left hover:bg-[#F2F4F6] dark:hover:bg-[#16294d] cursor-pointer flex items-center justify-between ${
                            timelineDateFilter === opt.value
                              ? "text-[#002E5D] dark:text-sky-300 font-semibold bg-[#ECF3FF]/60 dark:bg-[#16294d]/60"
                              : "text-[#2C3746] dark:text-slate-200"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {timelineDateFilter === opt.value && (
                            <Check className="w-3 h-3 text-[#002E5D] dark:text-sky-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Horizontal Scrubber Track with macOS Dock Magnification */}
              <MacDockScrubber
                onSelectNode={(node) => navigateToConversationTime(node.date, node.time, node.targetId)}
              />

              {/* Search & Filter Row */}
              <div className="flex items-center gap-1.5">
                <div className="flex-1 flex items-center bg-[#F2F4F6] dark:bg-[#0e1b38] rounded-[6px] px-2.5 py-1 border border-transparent focus-within:border-slate-300 dark:focus-within:border-[#1e3056] transition-all">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                  <input
                    type="text"
                    value={timelineSearch}
                    onChange={(e) => setTimelineSearch(e.target.value)}
                    placeholder="Search"
                    className="w-full bg-transparent text-[11px] text-[#2C3746] dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsTimelineKindFilterOpen((v) => !v)}
                    className="w-7 h-7 shrink-0 rounded-[6px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0e1b38] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#16294d] flex items-center justify-center cursor-pointer transition-colors"
                    title="Filter events"
                  >
                    <Filter className="w-3 h-3" />
                  </button>

                  {isTimelineKindFilterOpen && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#0e1b38] border border-[#EAEEF3] dark:border-[#1e3056] rounded-[6px] shadow-xl py-1 z-30 flex flex-col text-[11px] font-medium">
                      {(
                        [
                          { value: "all", label: "All Events" },
                          { value: "finx", label: "Finx Responses" },
                          { value: "tacbot", label: "Tacbot Responses" },
                          { value: "breach", label: "SLA Breaches" },
                          { value: "status", label: "Status Changes" },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setTimelineKindFilter(opt.value);
                            setIsTimelineKindFilterOpen(false);
                          }}
                          className={`px-2.5 py-1.5 text-left hover:bg-[#F2F4F6] dark:hover:bg-[#16294d] cursor-pointer ${
                            timelineKindFilter === opt.value
                              ? "text-[#002E5D] dark:text-sky-300 font-semibold bg-[#ECF3FF]/40 dark:bg-[#16294d]/60"
                              : "text-[#2C3746] dark:text-slate-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Show SLA Case Timeline Toggle Row */}
              <div className="flex items-center justify-between py-0.5 px-0.5">
                <span className="text-xs font-medium text-[#2C3746] dark:text-slate-200">
                  Show SLA Case Timeline
                </span>
                <Switch
                  checked={showSlaTimeline}
                  onChange={setShowSlaTimeline}
                  size="sm"
                  aria-label="Toggle SLA Timeline"
                />
              </div>

              {/* Vertical Timeline List */}
              <div className="flex flex-col gap-2 mt-0.5">
                {(() => {
                  const dayGroups = TIMELINE_DAYS.filter(
                    (day) => !timelineDateFilter || day.date === timelineDateFilter
                  ).map((day) => ({
                    day,
                    filteredEntries: day.entries.filter((e) => {
                      if (showSlaTimeline && e.kind !== "breach") return false;
                      if (timelineKindFilter !== "all" && e.kind !== timelineKindFilter) return false;
                      if (timelineSearch && !e.title.toLowerCase().includes(timelineSearch.toLowerCase())) return false;
                      return true;
                    }),
                  }));

                  const hasResults = dayGroups.some((g) => g.filteredEntries.length > 0);

                  if (!hasResults) {
                    return (
                      <div className="py-4 text-center text-[11px] text-[#7790A9] dark:text-slate-400 italic bg-slate-50 dark:bg-[#0e1b38] rounded-[6px] border border-slate-100 dark:border-[#1e3056]">
                        No timeline events match your filters
                      </div>
                    );
                  }

                  return dayGroups.map(({ day, filteredEntries }) => {
                    if (filteredEntries.length === 0) return null;
                    const isCollapsed = collapsedTimelineDays.has(day.date);

                    return (
                      <div key={day.date} className="flex flex-col">
                        {/* Date header with toggle */}
                        <button
                          type="button"
                          onClick={() => toggleTimelineDayCollapse(day.date)}
                          className="flex items-center gap-1 text-left py-1 text-xs font-bold text-[#2C3746] dark:text-slate-200 cursor-pointer select-none"
                        >
                          <span>{day.date}</span>
                          {isCollapsed ? (
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          ) : (
                            <ChevronUp className="w-3 h-3 text-slate-400" />
                          )}
                        </button>

                        {!isCollapsed && (
                          <div className="relative flex flex-col gap-2 pt-1 pb-1">
                            {/* Dashed vertical rail connecting nodes */}
                            <div className="absolute left-[68px] top-2 bottom-2 w-px border-l border-dashed border-slate-300 dark:border-slate-700" />

                            {filteredEntries.map((entry) => {
                              const isBreach = entry.kind === "breach";

                              if (isBreach) {
                                return (
                                  <div
                                    key={entry.id}
                                    onClick={() => navigateToConversationTime(day.date, entry.time, entry.id)}
                                    className="relative z-10 w-full rounded-r-[6px] border-l-[3px] border-l-[#DC2626] bg-[#FEF2F2] dark:bg-[#380e0e]/50 p-2 flex flex-col gap-1 transition-all cursor-pointer hover:shadow-2xs hover:scale-[1.01]"
                                    title="Click to jump to this conversation event"
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] font-mono text-[#576B81] dark:text-slate-400 shrink-0">
                                        {entry.time}
                                      </span>
                                      <Danger size={13} color="#DC2626" variant="Bold" className="shrink-0" />
                                      <span className="text-[11px] font-semibold text-[#DC2626] dark:text-red-400 truncate">
                                        {entry.title}
                                      </span>
                                    </div>
                                    <div className="pl-[64px]">
                                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white dark:bg-[#1a080a] border border-red-200 dark:border-red-900/60 text-[9.5px] text-slate-700 dark:text-slate-300 font-medium">
                                        <MessageSquare className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400" />
                                        <span>{entry.subtitle}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={entry.id}
                                  onClick={() => navigateToConversationTime(day.date, entry.time, entry.id)}
                                  className="relative z-10 flex items-start gap-2.5 cursor-pointer group select-none hover:bg-slate-50/70 dark:hover:bg-slate-800/40 p-1 rounded-[6px] transition-all"
                                  title="Click to jump to this conversation message"
                                >
                                  {/* Left: Time */}
                                  <div className="w-[52px] shrink-0 text-right pt-0.5">
                                    <span className="text-[11px] font-mono text-[#7790A9] dark:text-slate-400">
                                      {entry.time}
                                    </span>
                                  </div>

                                  {/* Center: Rail Node Avatar */}
                                  <div className="relative shrink-0 flex items-center justify-center pt-0.5">
                                    {entry.kind === "finx" && (
                                      <div className="w-4 h-4 rounded-full bg-white dark:bg-[#081024] p-0.5 ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center">
                                        <span className="w-3.5 h-3.5 rounded-full bg-linear-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-[8px] font-bold italic select-none">
                                          finx
                                        </span>
                                      </div>
                                    )}
                                    {entry.kind === "tacbot" && (
                                      <div className="w-4 h-4 rounded-full bg-white dark:bg-[#081024] p-0.5 ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center">
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#5850EC] flex items-center justify-center text-white">
                                          <Bot size={9} color="#ffffff" />
                                        </div>
                                      </div>
                                    )}
                                    {entry.kind === "status" && (
                                      <div className="w-4 h-4 rounded-full bg-white dark:bg-[#081024] p-0.5 ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center">
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#06B6D4] flex items-center justify-center text-white">
                                          <RefreshCw className="w-2 h-2 text-white" />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Right: Title & Subtitle */}
                                  <div className="flex-1 min-w-0 flex flex-col">
                                    <div className="text-xs font-semibold text-[#1A222D] dark:text-white leading-tight group-hover:text-[#002E5D] dark:group-hover:text-sky-300 transition-colors">
                                      {entry.title}
                                    </div>
                                    <div className="text-[10px] text-[#7790A9] dark:text-slate-400 truncate">
                                      {entry.subtitle}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* 2. Notes Drawer */}
        {!isRightRailCollapsed && rightDrawer === "notes" && (
          <div className="w-[340px] shrink-0 border-l border-[#EAEEF3] dark:border-[#162444] bg-white dark:bg-[#081024] flex flex-col min-h-0">
            <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-[#EAEEF3] dark:border-[#162444]">
              <h2 className="text-xs font-semibold text-[#002E5D] dark:text-sky-300">Case Notes</h2>
              <button
                type="button"
                onClick={() => setRightDrawer(null)}
                className="w-6 h-6 rounded-[4px] flex items-center justify-center text-[#7790A9] dark:text-slate-400 hover:text-[#2C3746] dark:hover:text-white hover:bg-[#F2F4F6] dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overlay-scroll p-3 flex flex-col gap-2">
              <form onSubmit={handleAddNote} className="flex flex-col gap-2">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add internal note..."
                  rows={2}
                  className="w-full text-xs p-2 rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056] focus:border-[#2F6ADB] focus:outline-hidden resize-none bg-[#F9FBFF] dark:bg-[#0d1830] text-[#2C3746] dark:text-slate-100"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="self-end px-3 py-1 bg-[#002E5D] dark:bg-[#2F6ADB] text-white rounded-[4px] text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  Save Note
                </button>
              </form>

              <div className="flex flex-col gap-2 mt-2">
                {caseNotes.map((note) => (
                  <div key={note.id} className="p-2.5 rounded-[6px] bg-[#F2F4F6] dark:bg-[#0d1830] border border-[#EAEEF3] dark:border-[#1e3056] text-xs flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[10px] text-[#7790A9] dark:text-slate-400">
                      <span className="font-semibold text-[#002E5D] dark:text-sky-300">{note.author}</span>
                      <span>{note.time}</span>
                    </div>
                    <p className="text-[#2C3746] dark:text-slate-200 text-[11px] leading-snug">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Flags Drawer */}
        {!isRightRailCollapsed && rightDrawer === "flags" && (
          <div className="w-[340px] shrink-0 border-l border-[#EAEEF3] dark:border-[#162444] bg-white dark:bg-[#081024] flex flex-col min-h-0">
            <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-[#EAEEF3] dark:border-[#162444]">
              <h2 className="text-xs font-semibold text-[#002E5D] dark:text-sky-300">Case Flags</h2>
              <button
                type="button"
                onClick={() => setRightDrawer(null)}
                className="w-6 h-6 rounded-[4px] flex items-center justify-center text-[#7790A9] dark:text-slate-400 hover:text-[#2C3746] dark:hover:text-white hover:bg-[#F2F4F6] dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overlay-scroll p-3 flex flex-col gap-2">
              {flags.map((flag) => (
                <button
                  key={flag.id}
                  type="button"
                  onClick={() =>
                    setFlags((prev) =>
                      prev.map((f) => (f.id === flag.id ? { ...f, active: !f.active } : f))
                    )
                  }
                  className={`p-2.5 rounded-[6px] border flex items-center justify-between text-xs cursor-pointer transition-all ${
                    flag.active
                      ? "bg-white dark:bg-[#132850] border-[#2F6ADB] shadow-2xs"
                      : "bg-[#F9FBFF] dark:bg-[#0d1830] border-[#EAEEF3] dark:border-[#1e3056] opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${flag.color}`} />
                    <span className="font-medium text-[#2C3746] dark:text-slate-200">{flag.label}</span>
                  </div>
                  {flag.active && <Check className="w-3.5 h-3.5 text-[#2F6ADB] dark:text-sky-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Assets Drawer */}
        {!isRightRailCollapsed && rightDrawer === "assets" && (
          <div className="w-[340px] shrink-0 border-l border-[#EAEEF3] dark:border-[#162444] bg-white dark:bg-[#081024] flex flex-col min-h-0">
            <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-[#EAEEF3] dark:border-[#162444]">
              <h2 className="text-xs font-semibold text-[#002E5D] dark:text-sky-300">Affected Network Asset</h2>
              <button
                type="button"
                onClick={() => setRightDrawer(null)}
                className="w-6 h-6 rounded-[4px] flex items-center justify-center text-[#7790A9] dark:text-slate-400 hover:text-[#2C3746] dark:hover:text-white hover:bg-[#F2F4F6] dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overlay-scroll p-3 flex flex-col gap-3 text-xs">
              <div className="bg-[#F9FBFF] dark:bg-[#0d1830] p-3 rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056] flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#2F6ADB] dark:text-sky-400" />
                  <span className="font-semibold text-[#002E5D] dark:text-sky-300">Arista-7050SX3-48YC8</span>
                </div>
                <div className="text-[11px] text-[#576B81] dark:text-slate-400 flex flex-col gap-0.5 mt-1 font-mono">
                  <div>IP: 10.240.12.88</div>
                  <div>Serial: JPE21480029</div>
                  <div>EOS: 4.28.3M-64-bit</div>
                  <div>Rack: DC4-Rack-B12 (U24-U25)</div>
                </div>
              </div>

              <div className="bg-[#F9FBFF] dark:bg-[#0d1830] p-3 rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056] flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-[#7790A9] dark:text-slate-400 uppercase tracking-wider">Active Uplink Interfaces</span>
                <div className="flex items-center justify-between text-[11px] py-1 border-b border-[#EAEEF3] dark:border-[#1e3056]">
                  <span className="text-[#2C3746] dark:text-slate-200">Ethernet1/1</span>
                  <Badge variant="danger">CRC Errors</Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] py-1">
                  <span className="text-[#2C3746] dark:text-slate-200">Ethernet1/2 (Backup)</span>
                  <Badge variant="success">Active (100G)</Badge>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Far Right Icon Rail for Tool Switching */}
        <div
          className={`shrink-0 border-l border-[#C8D7E6] dark:border-[#162744] bg-[#E2EAF2] dark:bg-[#0c1829] flex flex-col items-center select-none transition-all duration-200 relative ${
            isRightRailCollapsed ? "w-0 overflow-visible" : "w-12 py-2.5"
          }`}
        >
          {/* Icon buttons — hidden when collapsed */}
          {!isRightRailCollapsed && (
            <div className="w-full flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setRightDrawer(rightDrawer === "timeline" ? null : "timeline")}
                className={`w-9 h-9 rounded-[7px] flex items-center justify-center transition-all cursor-pointer ${
                  rightDrawer === "timeline"
                    ? "bg-[#CBDFF2] dark:bg-[#152e54] text-[#002E5D] dark:text-sky-300 font-semibold shadow-2xs"
                    : "text-[#475569] dark:text-slate-300 hover:text-[#002E5D] dark:hover:text-white hover:bg-[#D4E3F2]/60 dark:hover:bg-[#142848]/60"
                }`}
                title="Timeline & Scrubber"
              >
                <TaskListRailIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setRightDrawer(rightDrawer === "notes" ? null : "notes")}
                className={`w-9 h-9 rounded-[7px] flex items-center justify-center transition-all cursor-pointer ${
                  rightDrawer === "notes"
                    ? "bg-[#CBDFF2] dark:bg-[#152e54] text-[#002E5D] dark:text-sky-300 font-semibold shadow-2xs"
                    : "text-[#475569] dark:text-slate-300 hover:text-[#002E5D] dark:hover:text-white hover:bg-[#D4E3F2]/60 dark:hover:bg-[#142848]/60"
                }`}
                title="Internal Notes"
              >
                <DocumentRailIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setRightDrawer(rightDrawer === "flags" ? null : "flags")}
                className={`w-9 h-9 rounded-[7px] flex items-center justify-center transition-all cursor-pointer ${
                  rightDrawer === "flags"
                    ? "bg-[#CBDFF2] dark:bg-[#152e54] text-[#002E5D] dark:text-sky-300 font-semibold shadow-2xs"
                    : "text-[#475569] dark:text-slate-300 hover:text-[#002E5D] dark:hover:text-white hover:bg-[#D4E3F2]/60 dark:hover:bg-[#142848]/60"
                }`}
                title="Attachments & Flags"
              >
                <PaperclipRailIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setRightDrawer(rightDrawer === "assets" ? null : "assets")}
                className={`w-9 h-9 rounded-[7px] flex items-center justify-center transition-all cursor-pointer ${
                  rightDrawer === "assets"
                    ? "bg-[#CBDFF2] dark:bg-[#152e54] text-[#002E5D] dark:text-sky-300 font-semibold shadow-2xs"
                    : "text-[#475569] dark:text-slate-300 hover:text-[#002E5D] dark:hover:text-white hover:bg-[#D4E3F2]/60 dark:hover:bg-[#142848]/60"
                }`}
                title="Connected Assets"
              >
                <CubeRailIcon className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Spacer when expanded */}
          {!isRightRailCollapsed && <div className="flex-1" />}

          {/* Collapse / Expand toggle */}
          {isRightRailCollapsed ? (
            /* When collapsed: small tab attached to the thin vertical line at the bottom */
            <button
              type="button"
              onClick={() => setIsRightRailCollapsed(false)}
              className="absolute right-0 bottom-3.5 z-30 w-5 h-9 -translate-x-full rounded-l-[6px] bg-white dark:bg-[#13243f] border border-r-0 border-[#CBD8E6] dark:border-[#1e3458] shadow-xs flex items-center justify-center text-[#2C3E50] dark:text-slate-200 hover:bg-[#F2F6FA] dark:hover:bg-[#1a3052] hover:text-[#002E5D] dark:hover:text-white cursor-pointer transition-all"
              title="Expand sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          ) : (
            /* When expanded: white rounded button at the bottom matching image */
            <div className="p-1 w-full flex justify-center pb-1">
              <button
                type="button"
                onClick={() => setIsRightRailCollapsed(true)}
                className="w-8 h-8 rounded-[7px] bg-white dark:bg-[#13243f] border border-[#CBD8E6] dark:border-[#1e3458] shadow-xs flex items-center justify-center text-[#2C3E50] dark:text-slate-200 hover:bg-[#F2F6FA] dark:hover:bg-[#1a3052] cursor-pointer transition-all"
                title="Collapse sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Message Detail Modal (When Expand icon is clicked) ── */}
      {expandedModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EAEEF3] dark:border-[#162444]">
              <div className="flex items-center gap-2">
                {expandedModalItem.sender === "finx" ? <FinxAvatar size={24} /> : <TacbotAvatar size={24} />}
                <div>
                  <div className="text-xs font-semibold text-[#1A222D] dark:text-white">{expandedModalItem.email}</div>
                  <div className="text-[10px] text-[#7790A9] dark:text-slate-400">{expandedModalItem.role} • {expandedModalItem.time}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExpandedModalItem(null)}
                className="w-7 h-7 rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer text-[#7790A9] dark:text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overlay-scroll flex flex-col gap-3 text-xs leading-relaxed">
              {expandedModalItem.body.map((p, idx) => (
                <div key={idx} className="text-[#2C3746] dark:text-slate-200">{p}</div>
              ))}
              {expandedModalItem.codeSnippet && (
                <div className="bg-[#0F151D] text-emerald-400 font-mono text-[11px] p-3 rounded-[6px] border border-slate-700/60 mt-2">
                  <pre className="whitespace-pre-wrap">{expandedModalItem.codeSnippet}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Escalate Confirmation Modal ── */}
      {isEscalateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#091122] rounded-[8px] border border-[#EAEEF3] dark:border-[#162444] w-full max-w-md shadow-xl overflow-hidden flex flex-col p-4 gap-3">
            <div className="flex items-center justify-between border-b border-[#EAEEF3] dark:border-[#162444] pb-2">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Escalate Case {ticketId}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEscalateModalOpen(false)}
                className="text-[#7790A9] dark:text-slate-400 hover:text-[#2C3746] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <label className="font-semibold text-[#2C3746] dark:text-slate-200">Escalation Target Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Tier 1", "Tier 2", "Tier 3 Duty Manager"] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setEscalateTier(tier)}
                    className={`py-1.5 px-2 rounded-[4px] border text-center text-xs font-semibold cursor-pointer ${
                      escalateTier === tier
                        ? "border-[#DC2626] bg-red-50 dark:bg-[#380e0e] text-[#DC2626] dark:text-red-400"
                        : "border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#0d1830] text-[#576B81] dark:text-slate-300"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              <label className="font-semibold text-[#2C3746] dark:text-slate-200 mt-2">Escalation Reason & Notes</label>
              <textarea
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                placeholder="Reason for escalation (e.g. Critical customer impact, SLA breach, Hardware RMA urgency)..."
                rows={3}
                className="w-full text-xs p-2 rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056] focus:border-[#DC2626] focus:outline-hidden resize-none bg-[#F9FBFF] dark:bg-[#0d1830] text-[#2C3746] dark:text-slate-100"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAEEF3] dark:border-[#162444]">
              <button
                type="button"
                onClick={() => setIsEscalateModalOpen(false)}
                className="px-3 py-1.5 text-xs text-[#576B81] dark:text-slate-400 hover:bg-[#F2F4F6] dark:hover:bg-slate-800 rounded-[4px] cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEscalateConfirm}
                className="px-4 py-1.5 text-xs bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-[4px] font-semibold cursor-pointer shadow-2xs"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
