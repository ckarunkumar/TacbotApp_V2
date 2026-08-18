"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Plus,
  RotateCcw,
  X,
  Send,
  ChevronDown,
  Maximize2,
  Minimize2,
  BookOpen,
  Filter,
  ExternalLink,
  ShieldCheck,
  AlertOctagon,
  Activity,
  Layers,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

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

export default function TaiChatPanel() {
  const { isDarkMode, isTaiChatOpen, setIsTaiChatOpen } = useDashboard();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeContext, setActiveContext] = useState("Summarize Cisco Ticket");
  const [isContextDropdownOpen, setIsContextDropdownOpen] = useState(false);
  const [isExpandedWidth, setIsExpandedWidth] = useState(false);
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

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsTyping(true);

    // Simulate realistic intelligent TAC operational response matching the reference image
    setTimeout(() => {
      let response: ChatMessage;
      const lower = query.toLowerCase();

      if (lower.includes("cisco") || lower.includes("summarize") || lower.includes("summary")) {
        response = {
          id: `tai-${Date.now()}`,
          sender: "tai",
          text: "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          metadata: {
            headerTitle: "Vendor Volume Breakdown:",
            bullets: [
              {
                title: "Cisco: 820 cases (38.2%)",
                desc: "Dominating connectivity & BGP issues.",
              },
              {
                title: "Juniper: 510 cases (23.8%)",
                desc: "Optical transceivers & route flap alerts.",
              },
              {
                title: "Arista: 320 cases (14.9%)",
                desc: "CloudVision WiFi SSO authentications.",
              },
            ],
            footerText: "All automated diagnostic traces are synchronized with the Caseroom workspace.",
            actionButtons: [
              { label: "Open Caseroom", icon: "caseroom" },
              { label: "Filter Cisco Cases", icon: "filter", onClickPrompt: "Show active Cisco P1 tickets" },
            ],
          },
        };
      } else if (lower.includes("sla") || lower.includes("breach")) {
        response = {
          id: `tai-${Date.now()}`,
          sender: "tai",
          text: "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          metadata: {
            headerTitle: "Contractual SLA Risk Assessment:",
            bullets: [
              {
                title: "SR 624474 Arista Cloudvision (WiFi SSO)",
                desc: "Nearing breach in 45 minutes. Assigned to APAC TAC Tier 2.",
              },
              {
                title: "Cisco Prime Infrastructure 3.10 High CPU",
                desc: "Breached 2 hours ago. Workaround applied; vendor TAC escalation active.",
              },
              {
                title: "F5 BIG-IP Handshake Timeout",
                desc: "45 min buffer remaining. Traffic rerouted via standby load balancer.",
              },
            ],
            footerText: "Real-time SLA health index is 98.2% across global production links.",
            actionButtons: [
              { label: "View SLA Watchlist", icon: "sla" },
              { label: "Auto-Escalate Near Breaches", icon: "escalate", onClickPrompt: "Escalate near-breach tickets to on-shift lead" },
            ],
          },
        };
      } else if (lower.includes("vendor") || lower.includes("top vendors")) {
        response = {
          id: `tai-${Date.now()}`,
          sender: "tai",
          text: "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          metadata: {
            headerTitle: "Top Vendor Distribution & Performance:",
            bullets: [
              {
                title: "Cisco Systems (820 cases)",
                desc: "Mean resolution time: 4.8 hours. MTTR within SLA targets.",
              },
              {
                title: "Juniper Networks (510 cases)",
                desc: "Mean resolution time: 3.2 hours. Fast optic RMA turnaround.",
              },
              {
                title: "Arista Networks (320 cases)",
                desc: "Mean resolution time: 2.4 hours. Highest autonomous resolution rate (78%).",
              },
              {
                title: "Fortinet / F5 (292 combined cases)",
                desc: "Firmware CVE verification in progress on perimeter firewalls.",
              },
            ],
            footerText: "Vendor SLA compliance is currently leading in APAC and EMEA regions.",
            actionButtons: [
              { label: "Open Caseroom", icon: "caseroom" },
              { label: "Filter All Vendors", icon: "filter" },
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
            headerTitle: `Telemetry Diagnostics for "${query}":`,
            bullets: [
              {
                title: "Core Spine/Leaf Uptime",
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
      setMessages((prev) => [...prev, response]);
    }, 550);
  };

  const handleResetChat = () => {
    setMessages([]);
    setIsTyping(false);
  };

  const getActionIcon = (iconType?: string) => {
    switch (iconType) {
      case "caseroom":
        return <BookOpen className="w-3.5 h-3.5" />;
      case "filter":
        return <Filter className="w-3.5 h-3.5" />;
      case "sla":
        return <Activity className="w-3.5 h-3.5" />;
      case "escalate":
        return <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <ExternalLink className="w-3.5 h-3.5" />;
    }
  };

  if (!isTaiChatOpen) return null;

  return (
    <aside
      className={`h-[calc(100vh-16px)] my-2 mr-2 flex flex-col rounded-2xl transition-all duration-300 ease-in-out shrink-0 border z-30 overflow-hidden shadow-2xl ${
        isExpandedWidth ? "w-[480px]" : "w-[390px]"
      } ${
        isDarkMode
          ? "bg-[#070d1e] border-[#162444] text-slate-100"
          : "bg-white border-slate-200/90 text-slate-800"
      }`}
    >
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#14223d] shrink-0 bg-slate-50/50 dark:bg-[#091226]/60 backdrop-blur-xs">
        {/* Title & Dropdown */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#9333ea] to-[#ec4899] flex items-center justify-center text-white shrink-0 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col min-w-0 relative">
            <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              Tai Chat
            </span>
            <button
              onClick={() => setIsContextDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer text-left truncate"
            >
              <span className="truncate">{activeContext}</span>
              <ChevronDown className="w-3 h-3 shrink-0" />
            </button>

            {/* Context Dropdown Menu */}
            {isContextDropdownOpen && (
              <div className="absolute top-8 left-0 w-52 bg-white dark:bg-[#0d172e] border border-slate-200 dark:border-[#1e3056] rounded-[2px] shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {contextOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setActiveContext(opt);
                      setIsContextDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs transition-colors flex items-center justify-between ${
                      activeContext === opt
                        ? "bg-blue-50 dark:bg-blue-950/60 text-[#0047ba] dark:text-[#38bdf8] font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{opt}</span>
                    {activeContext === opt && <ShieldCheck className="w-3 h-3 text-[#0047ba]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          <button
            onClick={handleResetChat}
            className="w-7 h-7 rounded-[2px] hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="New Chat Session"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpandedWidth((prev) => !prev)}
            className="w-7 h-7 rounded-[2px] hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title={isExpandedWidth ? "Collapse Width" : "Expand Width"}
          >
            {isExpandedWidth ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleResetChat}
            className="w-7 h-7 rounded-[2px] hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Clear Messages"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsTaiChatOpen(false)}
            className="w-7 h-7 rounded-[2px] hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer ml-1"
            title="Close TAI Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main Chat / Greeting Area ── */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center my-auto py-6 animate-in fade-in duration-300">
            {/* Big Greeting */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Good Morning,{" "}
                <span className="text-[#0047ba] dark:text-[#38bdf8]">Murali</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-normal">
                How can I help you today ?
              </p>
            </div>

            {/* Suggested Actions Header & Pills */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Suggested actions
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleSendMessage(action)}
                    className="px-3 py-1.5 rounded-full text-xs font-normal transition-all cursor-pointer border shadow-2xs hover:scale-[1.02] active:scale-[0.98] text-left bg-white dark:bg-[#0d172e] border-slate-200/80 dark:border-[#1a2d52] text-[#0047ba] dark:text-[#38bdf8] hover:border-[#0047ba] dark:hover:border-[#38bdf8] hover:shadow-xs"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Render Active Message History matching the user's reference image */
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                {msg.sender === "user" ? (
                  /* User Message Bubble on Right */
                  <div className="flex flex-col items-end">
                    <div className="bg-[#0047ba] text-white px-4 py-2.5 rounded-[12px] rounded-tr-none text-xs font-normal shadow-xs max-w-[88%] leading-relaxed">
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 mr-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ) : (
                  /* AI Response with Bot Avatar and Styled Telemetry Card */
                  <div className="flex items-start gap-2.5">
                    {/* Bot Avatar Icon */}
                    <div className="w-7 h-7 rounded-full bg-[#0047ba] flex items-center justify-center p-1 shrink-0 mt-0.5 shadow-2xs">
                      <img
                        src="/tacbot-logo-white.svg"
                        alt="TAI"
                        className="w-4 h-4 object-contain"
                      />
                    </div>

                    {/* AI Response Card */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="bg-[#f8fafc] dark:bg-[#0c1630] border border-slate-200/90 dark:border-[#162444] rounded-[12px] rounded-tl-none p-3.5 text-xs text-slate-800 dark:text-slate-100 shadow-xs flex flex-col gap-2.5">
                        {/* Header Title */}
                        {msg.metadata?.headerTitle && (
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            {msg.metadata.headerTitle}
                          </div>
                        )}

                        {/* Bullet Items */}
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

                        {/* Plain text if no bullets */}
                        {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                        {/* Footer Status / Synchronization Note */}
                        {msg.metadata?.footerText && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal pt-1 border-t border-slate-200/50 dark:border-[#162444]">
                            {msg.metadata.footerText}
                          </p>
                        )}

                        {/* Action Buttons Row */}
                        {msg.metadata?.actionButtons && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {msg.metadata.actionButtons.map((btn, bIdx) => (
                              <button
                                key={bIdx}
                                onClick={() => btn.onClickPrompt && handleSendMessage(btn.onClickPrompt)}
                                className="px-2.5 py-1.5 rounded-[4px] border border-[#0047ba]/30 dark:border-[#38bdf8]/40 bg-white dark:bg-[#07132a] text-[#0047ba] dark:text-[#38bdf8] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[11px] font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                              >
                                {getActionIcon(btn.icon)}
                                <span>{btn.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Timestamp under card */}
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
                <div className="w-7 h-7 rounded-full bg-[#0047ba] flex items-center justify-center p-1 shrink-0 mt-0.5 shadow-2xs">
                  <img
                    src="/tacbot-logo-white.svg"
                    alt="TAI"
                    className="w-4 h-4 object-contain animate-pulse"
                  />
                </div>
                <div className="p-3 bg-slate-100 dark:bg-[#0c1630] border border-slate-200/80 dark:border-[#162444] rounded-[12px] rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-spin-slow" />
                  <span className="italic">TAI is analyzing telemetry...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Bottom Section: Context Pills & Input ── */}
      <div className="p-3 border-t border-slate-100 dark:border-[#14223d] bg-slate-50/70 dark:bg-[#091226]/80 flex flex-col gap-2 shrink-0">
        {/* Quick Context Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {bottomContextPills.map((pill) => (
            <button
              key={pill}
              onClick={() => handleSendMessage(pill)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer bg-white dark:bg-[#0e1b38] border border-slate-200/80 dark:border-[#1e3056] text-slate-600 dark:text-slate-300 hover:border-[#0047ba] hover:text-[#0047ba] dark:hover:text-[#38bdf8] shadow-2xs"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center bg-white dark:bg-[#081024] rounded-full border border-slate-200 dark:border-[#1e3056] pl-3.5 pr-1.5 py-1.5 shadow-sm focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/20 transition-all"
        >
          {/* Sparkles icon */}
          <div className="mr-2 text-purple-500 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask TAI about cases, SLAs, logs, etc.,"
            className="w-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none bg-transparent font-normal"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition-all shrink-0 cursor-pointer shadow-xs ${
              inputQuery.trim()
                ? "bg-gradient-to-r from-[#0047ba] to-[#9333ea] hover:scale-105"
                : "bg-slate-300 dark:bg-slate-700 opacity-50 cursor-not-allowed"
            }`}
            title="Send query"
          >
            <Send className="w-3 h-3 transform rotate-12 -ml-0.5" strokeWidth={2.2} />
          </button>
        </form>
      </div>
    </aside>
  );
}
