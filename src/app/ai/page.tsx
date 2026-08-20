"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Minimize2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import {
  Add,
  Refresh,
  Send2,
  ArrowDown2,
  Maximize4,
  Book,
  FilterSearch,
  ExportCurve,
  ShieldSecurity,
  Danger,
  Activity,
  MessageText,
  Clock,
  SearchNormal1,
  Trash,
  DirectInbox,
} from "iconsax-react";
import AiIcon from "@/components/icons/AiIcon";

interface ChatActionBtn {
  label: string;
  icon?: "caseroom" | "filter" | "sla" | "escalate";
  onClickPrompt?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "tai";
  text: string;
  timestamp: string;
  metadata?: {
    headerTitle?: string;
    bullets?: Array<{ title: string; desc: string }>;
    footerText?: string;
    actionButtons?: ChatActionBtn[];
  };
}

interface ChatHistoryItem {
  id: string;
  title: string;
  timeAgo: string;
  category: "Today" | "Yesterday" | "Previous 7 Days";
  preview: string;
}

const INITIAL_HISTORY: ChatHistoryItem[] = [
  {
    id: "hist-1",
    title: "Cisco Nexus 9k Diagnostics",
    timeAgo: "10 mins ago",
    category: "Today",
    preview: "Eth1/12 SFP physical CRC errors & drop counters",
  },
  {
    id: "hist-2",
    title: "Palo Alto GlobalProtect Auth Delay",
    timeAgo: "2 hours ago",
    category: "Today",
    preview: "Gateway auth timeout & radius server latency",
  },
  {
    id: "hist-3",
    title: "SLA Breach Risk Scorecard",
    timeAgo: "Yesterday",
    category: "Yesterday",
    preview: "Predictive P1 breach warning for Arista SR772910",
  },
  {
    id: "hist-4",
    title: "BGP Flapping Telemetry Analysis",
    timeAgo: "Yesterday",
    category: "Yesterday",
    preview: "AS65000 route flapping on core border router",
  },
  {
    id: "hist-5",
    title: "Arista EOS Firmware Upgrade Audit",
    timeAgo: "3 days ago",
    category: "Previous 7 Days",
    preview: "Pre-check validation for EOS 4.28.2F image",
  },
  {
    id: "hist-6",
    title: "Fortinet Policy Rule Audit",
    timeAgo: "5 days ago",
    category: "Previous 7 Days",
    preview: "Unused security policies & port group cleanup",
  },
];

function AiPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsTaiChatOpen } = useDashboard();
  const [activeSessionId, setActiveSessionId] = useState<string>("hist-1");
  const [historyList, setHistoryList] = useState<ChatHistoryItem[]>(INITIAL_HISTORY);
  const [historySearch, setHistorySearch] = useState<string>("");
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleShareHistorySession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const session = historyList.find((h) => h.id === id);
    if (session && typeof navigator !== "undefined") {
      navigator.clipboard.writeText(`https://tacbot.arista.com/ai?session=${encodeURIComponent(session.id)}`);
      setToastMessage(`Share link copied for "${session.title}"`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handlePromptDeleteHistorySession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingSessionId(id);
  };

  const handleConfirmDeleteSession = () => {
    if (!deletingSessionId) return;
    const targetId = deletingSessionId;
    const nextList = historyList.filter((h) => h.id !== targetId);
    setHistoryList(nextList);
    if (activeSessionId === targetId) {
      if (nextList.length > 0) {
        handleSelectHistorySession(nextList[0]);
      } else {
        handleCreateNewChat();
      }
    }
    setDeletingSessionId(null);
    setToastMessage("Chat history deleted");
    setTimeout(() => setToastMessage(null), 2000);
  };

  const [isMinimizing, setIsMinimizing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const syncFromStorage = () => {
      if (typeof window !== "undefined") {
        const saved = sessionStorage.getItem("tai_messages_session");
        if (saved) {
          try {
            setMessages(JSON.parse(saved));
          } catch (e) {}
        }
      }
    };
    syncFromStorage();
    window.addEventListener("tai_messages_updated", syncFromStorage);
    return () => window.removeEventListener("tai_messages_updated", syncFromStorage);
  }, []);

  const updateAndSaveMessages = (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    setMessages((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tai_messages_session", JSON.stringify(next));
        window.dispatchEvent(new Event("tai_messages_updated"));
      }
      return next;
    });
  };

  const returnUrl = searchParams.get("returnUrl") || "/cases";

  const isExpandedFromPanel =
    searchParams.get("expanded") === "true" &&
    Boolean(searchParams.get("returnUrl"));

  const handleMinimizeBack = () => {
    setIsMinimizing(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("taiChatAutoOpen", "true");
      sessionStorage.setItem("tai_messages_session", JSON.stringify(messages));
    }
    setIsTaiChatOpen(true);
    setTimeout(() => {
      router.push(returnUrl);
    }, 220);
  };

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeContext, setActiveContext] = useState("Summarize Cisco Ticket");
  const [isContextDropdownOpen, setIsContextDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedActions = [
    "Cisco case summary",
    "SLA breaches",
    "Top Vendors",
    "Recent escalations",
    "Network diagnostics",
  ];

  const bottomContextPills = [
    "SLA Breaches",
    "Case Diagnostics",
    "Handover Report",
  ];

  const contextOptions = [
    "Summarize Cisco Ticket",
    "TAC Incident Handover",
    "Vendor Response Benchmark",
    "General Operations Assistant",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleCreateNewChat = () => {
    const newId = `hist-${Date.now()}`;
    const newSession: ChatHistoryItem = {
      id: newId,
      title: "New Operations Diagnostic",
      timeAgo: "Just now",
      category: "Today",
      preview: "Empty chat session",
    };
    setHistoryList((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setMessages([]);
  };

  const handleSelectHistorySession = (session: ChatHistoryItem) => {
    setActiveSessionId(session.id);
    if (session.id === "hist-1") {
      setMessages([
        {
          id: "welcome-1",
          sender: "tai",
          text: "",
          timestamp: session.timeAgo,
          metadata: {
            headerTitle: "Cisco Nexus 9k Case Diagnostics Summary (SR55192039485):",
            bullets: [
              {
                title: "Root Cause Identified",
                desc: "Interface Eth1/12 experiencing SFP physical layer CRC errors and high rx-drop rate.",
              },
              {
                title: "SLA Impact & SLA Timer",
                desc: "Target Resolution in 3 hours 15 mins. Risk score: Low (Engineers actively assigned).",
              },
            ],
            footerText: "TAC Automation Script ready to push diagnostic command to Nexus switch via SSH.",
            actionButtons: [
              { label: "Open Caseroom", icon: "caseroom" },
              { label: "Filter All Cisco Cases", icon: "filter" },
            ],
          },
        },
      ]);
    } else {
      setMessages([
        {
          id: `hist-msg-${session.id}`,
          sender: "tai",
          text: "",
          timestamp: session.timeAgo,
          metadata: {
            headerTitle: `Incident Summary for "${session.title}":`,
            bullets: [
              {
                title: "Session Topic",
                desc: session.preview,
              },
              {
                title: "Telemetry Status",
                desc: "Logs loaded & operational metrics verified for active TAC queue.",
              },
            ],
            footerText: "Type any follow-up question or run a diagnostic command.",
            actionButtons: [
              { label: "Run Network Diagnostics", icon: "caseroom" },
              { label: "Generate Handover Report", icon: "filter" },
            ],
          },
        },
      ]);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    updateAndSaveMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsTyping(true);

    setTimeout(() => {
      let response: ChatMessage;
      const lower = query.toLowerCase();

      if (lower.includes("cisco") || lower.includes("summarize")) {
        response = {
          id: `tai-${Date.now()}`,
          sender: "tai",
          text: "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          metadata: {
            headerTitle: "Cisco Nexus 9k Case Diagnostics Summary (SR55192039485):",
            bullets: [
              {
                title: "Root Cause Identified",
                desc: "Interface Eth1/12 experiencing SFP physical layer CRC errors and high rx-drop rate.",
              },
              {
                title: "SLA Impact & SLA Timer",
                desc: "Target Resolution in 3 hours 15 mins. Risk score: Low (Engineers actively assigned).",
              },
              {
                title: "Recommended Action Plan",
                desc: "Clean fiber patch cable end-face; swap SFP module with spare; clear interface counters.",
              },
            ],
            footerText: "TAC Automation Script ready to push diagnostic command to Nexus switch via SSH.",
            actionButtons: [
              { label: "Open Caseroom", icon: "caseroom" },
              { label: "Filter All Cisco Cases", icon: "filter" },
            ],
          },
        };
      } else {
        response = {
          id: `tai-${Date.now()}`,
          sender: "tai",
          text: "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          metadata: {
            headerTitle: `AI Telemetry Analysis for "${query}":`,
            bullets: [
              {
                title: "Infrastructure Uptime",
                desc: "100% operational across all 14 active datacenter clusters.",
              },
              {
                title: "Autonomous Level-1 Remediation",
                desc: "42 Level-1 incidents resolved automatically in past 24 hours.",
              },
              {
                title: "Engineer Capacity Load",
                desc: "Staffing utilization balanced at 81.4% capacity.",
              },
            ],
            footerText: "System ready to run diagnostic script or draft an escalation handover report.",
            actionButtons: [
              { label: "Run Network Diagnostics", icon: "caseroom" },
              { label: "Generate Handover", icon: "filter", onClickPrompt: "Generate TAC shift handover summary" },
            ],
          },
        };
      }

      setIsTyping(false);
      updateAndSaveMessages((prev) => [...prev, response]);
    }, 550);
  };

  const getActionIcon = (iconType?: string) => {
    switch (iconType) {
      case "caseroom":
        return <Book size={14} color="currentColor" variant="Linear" />;
      case "filter":
        return <FilterSearch size={14} color="currentColor" variant="Linear" />;
      case "sla":
        return <Activity size={14} color="currentColor" variant="Linear" />;
      case "escalate":
        return <Danger size={14} color="#f59e0b" variant="Bold" />;
      default:
        return <ExportCurve size={14} color="currentColor" variant="Linear" />;
    }
  };

  const filteredHistory = historyList.filter(
    (h) =>
      h.title.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.preview.toLowerCase().includes(historySearch.toLowerCase())
  );

  const categories: Array<"Today" | "Yesterday" | "Previous 7 Days"> = [
    "Today",
    "Yesterday",
    "Previous 7 Days",
  ];

  return (
    <PageLayout
      activeNavId="ai"
      breadcrumbTitle="AI Insights / TAI Assistant"
      showDatePicker={false}
      showTaiChatPanel={false}
      contentClassName="p-0 flex flex-row min-w-0 flex-1 h-[calc(100vh-49px)] overflow-hidden animate-in fade-in duration-200"
    >
      {/* ── Main Dual-Column Container: Chat History Sidebar (Left) + AI Chat View (Right) ── */}
      <div className={`flex-1 w-full flex flex-row h-[calc(100vh-49px)] overflow-hidden transition-opacity duration-180 ease-in-out ${
        isMinimizing ? "opacity-0" : "opacity-100"
      }`}>
        
        {/* ── Frozen Chat History Secondary Sidebar ── */}
        <aside className="w-72 shrink-0 bg-white dark:bg-[#091122] border-r border-[#EAEEF3] dark:border-[#162444] p-3 flex flex-col gap-3 h-full overflow-y-auto no-scrollbar z-20 select-none">
          {/* New Chat Primary Action Button */}
          <button
            type="button"
            onClick={handleCreateNewChat}
            className="w-full h-8.5 rounded-[6px] bg-[#002E5D] hover:bg-[#002147] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <Add size={16} color="#ffffff" variant="Linear" />
            <span>+ New Chat Session</span>
          </button>

          {/* Search History Filter */}
          <div className="relative w-full">
            <SearchNormal1 size={14} color="currentColor" className="text-[#7790A9] absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Search chat history..."
              className="h-8 w-full rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] bg-[#F9FBFF] dark:bg-[#081024] pl-8 pr-2 text-xs text-[#2C3746] dark:text-slate-100 placeholder-[#7790A9] focus:outline-none focus:border-[#002E5D] transition-all"
            />
          </div>

          {/* History Grouped List */}
          <nav className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar pt-1">
            {categories.map((catGroup) => {
              const matchingItems = filteredHistory.filter((item) => item.category === catGroup);
              if (matchingItems.length === 0) return null;

              return (
                <div key={catGroup} className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#7790A9] dark:text-slate-400 uppercase tracking-wider px-2">
                    {catGroup}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {matchingItems.map((item) => {
                      const isActive = activeSessionId === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectHistorySession(item)}
                          className={`w-full flex flex-col px-2.5 py-2 rounded-[6px] text-xs transition-all cursor-pointer text-left relative group ${
                            isActive
                              ? "bg-[#ECF3FF] dark:bg-[#002E5D]/60 text-[#002E5D] dark:text-blue-200 font-semibold border-l-2 border-[#002E5D] dark:border-[#38bdf8]"
                              : "text-[#2C3746] dark:text-slate-300 hover:bg-[#F2F4F6] dark:hover:bg-[#121c33]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 w-full">
                            <div className="flex items-center gap-1.5 min-w-0 truncate">
                              <MessageText size={13} className={isActive ? "text-[#002E5D] dark:text-[#38bdf8] shrink-0" : "text-[#7790A9] shrink-0"} />
                              <span className="truncate font-medium">{item.title}</span>
                            </div>

                            {/* Hover Share & Delete Action Buttons */}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => handleShareHistorySession(item.id, e)}
                                className="p-1 rounded-[3px] text-[#7790A9] hover:text-[#002E5D] dark:hover:text-blue-300 hover:bg-[#D4E4FE]/50 dark:hover:bg-slate-700 transition-colors"
                                title="Share chat session link"
                              >
                                <ExportCurve size={12} color="currentColor" />
                              </span>
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => handlePromptDeleteHistorySession(item.id, e)}
                                className="p-1 rounded-[3px] text-[#7790A9] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                title="Delete chat session"
                              >
                                <Trash size={12} color="currentColor" />
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#7790A9] dark:text-slate-400 truncate mt-0.5 pl-5">
                            {item.preview}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Footer Info */}
          <div className="pt-2 border-t border-[#EAEEF3] dark:border-[#162444] text-[10px] text-[#7790A9] text-center shrink-0">
            TAI Operations Assistant • History Synced
          </div>
        </aside>

        {/* ── Main AI Chat Conversation Workspace (Right Side) ── */}
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#091122] overflow-hidden">
          {/* Top Workspace Header Bar (Exact 49px height matching PageHeader navbar) */}
          <div className="h-[49px] px-3 border-b border-[#EAEEF3] dark:border-[#14223d] shrink-0 bg-white dark:bg-[#081024] flex items-center justify-between box-border">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-[#002E5D] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <AiIcon size={14} color="#ffffff" variant="Bold" />
              </div>
              <div className="flex flex-col min-w-0 relative">
                <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                  Tai Chat
                </span>
                <button
                  type="button"
                  onClick={() => setIsContextDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer text-left truncate"
                >
                  <span className="truncate">{activeContext}</span>
                  <ArrowDown2 size={12} color="currentColor" variant="Linear" className="shrink-0" />
                </button>

                {/* Context Dropdown Menu */}
                {isContextDropdownOpen && (
                  <div className="absolute top-8 left-0 w-52 bg-white dark:bg-[#0d172e] border border-[#EAEEF3] dark:border-[#1e3056] rounded-[8px] shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {contextOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setActiveContext(opt);
                          setIsContextDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-xs transition-colors flex items-center justify-between ${
                          activeContext === opt
                            ? "bg-blue-50 dark:bg-blue-950/60 text-[#002E5D] dark:text-[#38bdf8] font-semibold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-[#F9FBFF] dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>{opt}</span>
                        {activeContext === opt && <ShieldSecurity size={12} color="#002E5D" variant="Bold" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isExpandedFromPanel && (
                <button
                  type="button"
                  onClick={handleMinimizeBack}
                  className="w-7 h-7 rounded-[4px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#07132a] text-[#002E5D] dark:text-[#38bdf8] hover:bg-[#ECF3FF] dark:hover:bg-[#0c1836] transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                  title={`Minimize to panel & return to ${returnUrl}`}
                >
                  <Minimize2 className="w-3.5 h-3.5 text-current" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setMessages([])}
                className="w-7 h-7 rounded-[4px] hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer text-slate-400"
                title="Reset Chat Session"
              >
                <Refresh size={14} color="currentColor" variant="Linear" />
              </button>
            </div>
          </div>

          {/* Chat Body: Render Empty State or Active Messages Feed */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-3 min-h-0 bg-[#F9FBFF]/30 dark:bg-[#070e1e]/40">
            {messages.length === 0 ? (
              /* ── Premium Centered AI Workspace Hero & Feature Cards Grid ── */
              <div className="h-full flex flex-col justify-center max-w-3xl mx-auto py-8 px-4 animate-in fade-in zoom-in-95 duration-300">
                {/* Tacbot Logo Avatar & Hero Greeting */}
                <div className="flex flex-col items-center text-center gap-2 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[linear-gradient(135deg,#7c3aed_0%,#4f46e5_50%,#2563eb_100%)] flex items-center justify-center p-2.5 shadow-md">
                    <img
                      src="/tacbot-logo-white.svg"
                      alt="TAI"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#2C3746] dark:text-white tracking-tight mt-1">
                    Good Morning, <span className="text-[#002E5D] dark:text-[#38bdf8]">Murali</span>
                  </h1>
                  <p className="text-sm md:text-base text-[#576B81] dark:text-slate-400 font-normal">
                    How can I help you today ?
                  </p>
                </div>

                {/* Suggested Actions 2x2 Grid Cards */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-[#7790A9] dark:text-slate-400 uppercase tracking-wider text-center">
                    SUGGESTED ACTIONS
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSendMessage("Cisco case summary")}
                      className="p-3.5 rounded-[8px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#07132a] text-left transition-all hover:border-[#002E5D] dark:hover:border-[#38bdf8] hover:bg-[#ECF3FF]/70 dark:hover:bg-[#0c1a38] shadow-2xs hover:shadow-xs group cursor-pointer flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-[6px] bg-[#ECF3FF] dark:bg-[#002E5D]/50 text-[#002E5D] dark:text-blue-200 flex items-center justify-center shrink-0">
                        <Book size={16} color="currentColor" variant="Linear" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#002E5D] dark:text-[#38bdf8] group-hover:text-[#002147]">
                          Cisco Case Summary
                        </span>
                        <span className="text-[11px] text-[#576B81] dark:text-slate-400 mt-0.5 truncate">
                          Summarize active Nexus 9k CRC error ticket & SLA timer
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendMessage("SLA breaches")}
                      className="p-3.5 rounded-[8px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#07132a] text-left transition-all hover:border-[#002E5D] dark:hover:border-[#38bdf8] hover:bg-[#ECF3FF]/70 dark:hover:bg-[#0c1a38] shadow-2xs hover:shadow-xs group cursor-pointer flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-[6px] bg-[#ECF3FF] dark:bg-[#002E5D]/50 text-[#002E5D] dark:text-blue-200 flex items-center justify-center shrink-0">
                        <Activity size={16} color="currentColor" variant="Linear" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#002E5D] dark:text-[#38bdf8] group-hover:text-[#002147]">
                          SLA Risk Diagnostics
                        </span>
                        <span className="text-[11px] text-[#576B81] dark:text-slate-400 mt-0.5 truncate">
                          Predictive P1/P2 breach warnings for today&apos;s active queue
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendMessage("Top Vendors")}
                      className="p-3.5 rounded-[8px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#07132a] text-left transition-all hover:border-[#002E5D] dark:hover:border-[#38bdf8] hover:bg-[#ECF3FF]/70 dark:hover:bg-[#0c1a38] shadow-2xs hover:shadow-xs group cursor-pointer flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-[6px] bg-[#ECF3FF] dark:bg-[#002E5D]/50 text-[#002E5D] dark:text-blue-200 flex items-center justify-center shrink-0">
                        <FilterSearch size={16} color="currentColor" variant="Linear" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#002E5D] dark:text-[#38bdf8] group-hover:text-[#002147]">
                          Top Vendors Benchmark
                        </span>
                        <span className="text-[11px] text-[#576B81] dark:text-slate-400 mt-0.5 truncate">
                          Compare Palo Alto, Juniper & Fortinet response metrics
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendMessage("Recent escalations")}
                      className="p-3.5 rounded-[8px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#07132a] text-left transition-all hover:border-[#002E5D] dark:hover:border-[#38bdf8] hover:bg-[#ECF3FF]/70 dark:hover:bg-[#0c1a38] shadow-2xs hover:shadow-xs group cursor-pointer flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-[6px] bg-[#ECF3FF] dark:bg-[#002E5D]/50 text-[#002E5D] dark:text-blue-200 flex items-center justify-center shrink-0">
                        <ExportCurve size={16} color="currentColor" variant="Linear" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#002E5D] dark:text-[#38bdf8] group-hover:text-[#002147]">
                          Shift Handover Report
                        </span>
                        <span className="text-[11px] text-[#576B81] dark:text-slate-400 mt-0.5 truncate">
                          Auto-generate incident escalation summary for next shift
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Active Message Feed with Signature Blue User Bubbles & Bot Cards ── */
              <div className="flex flex-col gap-4 w-full">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col">
                    {msg.sender === "user" ? (
                      /* User Message Bubble on Right with Signature Blue Gradient */
                      <div className="flex flex-col items-end">
                        <div className="bg-[linear-gradient(135deg,#7c3aed_0%,#4f46e5_50%,#2563eb_100%)] text-white px-4 py-2.5 rounded-[8px] rounded-tr-none text-xs md:text-[13px] font-normal shadow-[0_4px_14px_rgba(124,58,237,0.22)] max-w-[88%] leading-relaxed">
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 mr-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    ) : (
                      /* AI Response with Bot Avatar and Styled Telemetry Card */
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[linear-gradient(135deg,#7c3aed_0%,#4f46e5_50%,#2563eb_100%)] flex items-center justify-center p-1 shrink-0 mt-0.5 shadow-xs">
                          <img
                            src="/tacbot-logo-white.svg"
                            alt="TAI"
                            className="w-4 h-4 object-contain"
                          />
                        </div>

                        {/* AI Response Card */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="bg-[#f8fafc] dark:bg-[#0c1630] border border-[#EAEEF3] dark:border-[#162444] rounded-[12px] rounded-tl-none p-3.5 text-xs text-slate-800 dark:text-slate-100 shadow-xs flex flex-col gap-2.5">
                            {msg.metadata?.headerTitle && (
                              <div className="font-bold text-slate-900 dark:text-white text-xs">
                                {msg.metadata.headerTitle}
                              </div>
                            )}

                            {msg.metadata?.bullets && (
                              <div className="flex flex-col gap-2">
                                {msg.metadata.bullets.map((b, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                                    <span className="text-slate-400 font-bold select-none">•</span>
                                    <div className="flex-1">
                                      <span className="font-semibold text-slate-900 dark:text-white">
                                        {b.title}
                                      </span>{" "}
                                      <span className="text-slate-600 dark:text-slate-300">
                                        — {b.desc}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                            {msg.metadata?.footerText && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal pt-1 border-t border-[#EAEEF3]/50 dark:border-[#162444]">
                                {msg.metadata.footerText}
                              </p>
                            )}

                            {msg.metadata?.actionButtons && (
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                {msg.metadata.actionButtons.map((btn, bIdx) => (
                                  <button
                                    key={bIdx}
                                    type="button"
                                    onClick={() => btn.onClickPrompt && handleSendMessage(btn.onClickPrompt)}
                                    className="px-2.5 py-1.5 rounded-[8px] border border-[#002E5D]/30 dark:border-[#38bdf8]/40 bg-white dark:bg-[#07132a] text-[#002E5D] dark:text-[#38bdf8] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[11px] font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    {getActionIcon(btn.icon)}
                                    <span>{btn.label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <span className="text-[10px] text-slate-400 mt-1 ml-1">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[linear-gradient(135deg,#7c3aed_0%,#4f46e5_50%,#2563eb_100%)] flex items-center justify-center p-1 shrink-0 mt-0.5 shadow-xs">
                      <img
                        src="/tacbot-logo-white.svg"
                        alt="TAI"
                        className="w-4 h-4 object-contain animate-pulse"
                      />
                    </div>
                    <div className="p-3 bg-[#F2F4F6] dark:bg-[#0c1630] border border-[#EAEEF3] dark:border-[#162444] rounded-[12px] rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                      <AiIcon size={14} color="#002E5D" variant="Bold" className="animate-spin" />
                      <span className="italic">TAI is analyzing telemetry...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ── Bottom Section: Context Pills & Input ── */}
          <div className="p-2 border-t border-[#EAEEF3] dark:border-[#14223d] bg-[#F9FBFF]/70 dark:bg-[#081024]/80 flex flex-col gap-2 shrink-0">
            {/* Quick Context Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Context:
              </span>
              {bottomContextPills.map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => handleSendMessage(pill)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all bg-white dark:bg-[#07132a] border border-[#EAEEF3] dark:border-[#1e3056] text-[#002E5D] dark:text-[#38bdf8] hover:border-[#002E5D] dark:hover:border-[#38bdf8] hover:shadow-2xs shrink-0 cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input Form with Blue Send Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask TAI Assistant for incident summaries, SLA risks..."
                  className="w-full h-10 rounded-[8px] border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#071024] pl-3.5 pr-10 text-xs md:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#002E5D] dark:focus:border-[#38bdf8] focus:ring-2 focus:ring-[#002E5D]/15 transition-all shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className={`h-10 px-4 rounded-[8px] text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer ${
                  inputQuery.trim()
                    ? "bg-[linear-gradient(135deg,#7c3aed_0%,#4f46e5_50%,#2563eb_100%)] hover:opacity-95 active:scale-[0.98]"
                    : "bg-slate-300 dark:bg-slate-700 opacity-60 cursor-not-allowed"
                }`}
              >
                <span>Send</span>
                <Send2 size={14} color="#ffffff" variant="Bold" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal Popup */}
      {deletingSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-[#0c1630] border border-[#EAEEF3] dark:border-[#1e3056] rounded-[10px] p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
                <Trash size={18} color="currentColor" variant="Bold" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-[#2C3746] dark:text-white">
                  Delete Chat Session?
                </h3>
                <p className="text-xs text-[#576B81] dark:text-slate-300 leading-relaxed">
                  Are you sure you want to delete &ldquo;
                  <span className="font-semibold text-[#2C3746] dark:text-slate-100">
                    {historyList.find((h) => h.id === deletingSessionId)?.title}
                  </span>
                  &rdquo;? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAEEF3] dark:border-[#162444]">
              <button
                type="button"
                onClick={() => setDeletingSessionId(null)}
                className="px-3.5 py-1.5 rounded-[6px] border border-[#EAEEF3] dark:border-[#1e3056] text-xs font-semibold text-[#576B81] dark:text-slate-300 hover:bg-[#F2F4F6] dark:hover:bg-[#121c33] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSession}
                className="px-3.5 py-1.5 rounded-[6px] bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Delete Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-3.5 py-2 rounded-[6px] bg-[#002E5D] text-white text-xs font-semibold shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2 border border-[#005899]">
          <ShieldSecurity size={14} color="#ffffff" variant="Bold" />
          <span>{toastMessage}</span>
        </div>
      )}
    </PageLayout>
  );
}

export default function AiPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs text-slate-500">Loading AI Assistant...</div>}>
      <AiPageContent />
    </Suspense>
  );
}
