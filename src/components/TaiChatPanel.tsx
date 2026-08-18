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
  Bot,
  User,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

interface ChatMessage {
  id: string;
  sender: "user" | "tai";
  text: string;
  timestamp: string;
  metadata?: {
    type?: "ticket-summary" | "sla-breach" | "vendors" | "escalations" | "diagnostics";
    title?: string;
    details?: Array<{ label: string; value: string; badge?: string; badgeColor?: string }>;
    bullets?: string[];
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

    // Simulate realistic intelligent TAC operational response
    setTimeout(() => {
      let response: ChatMessage;

      if (query.toLowerCase().includes("cisco") || query.toLowerCase().includes("summary")) {
        response = {
          id: `tai-${Date.now()}`,
          sender: "tai",
          text: "Here is the operational summary for active Cisco tickets across TAC queues:",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          metadata: {
            type: "ticket-summary",
            title: "Cisco Prime Infrastructure 3.10 High CPU (TAC-17884)",
            details: [
              { label: "Status", value: "In Progress", badge: "Critical", badgeColor: "bg-red-500/10 text-red-500 border-red-500/30" },
              { label: "Time to Breach", value: "2 hrs 14m", badge: "Warning", badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30" },
              { label: "Assigned Engineer", value: "Vikram Mehta (APAC TAC)" },
              { label: "Root Cause", value: "SNMP polling storm triggered memory leak on core supervisor module." },
            ],
            bullets: [
              "Applied temporary ACL rate-limiting on UDP port 161 across core switches.",
              "Vendor TAC patch v3.10.4 scheduled for maintenance window 22:00 UTC.",
              "No customer outage detected; control plane CPU stabilized at 42%.",
            ],
          },
        };
      } else if (query.toLowerCase().includes("sla") || query.toLowerCase().includes("breach")) {
        response = {
          id: `tai-${Date.now()}`,
          sender: "tai",
          text: "Found 4 cases within 60 minutes of contractual SLA thresholds:",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          metadata: {
            type: "sla-breach",
            title: "Near-Breach Watchlist",
            details: [
              { label: "RE: SR 624474 Arista Cloudvision", value: "45m left", badge: "Urgent", badgeColor: "bg-red-500/10 text-red-500 border-red-500/30" },
              { label: "F5 BIG-IP SSL Handshake Timeout", value: "1 hr left", badge: "Medium", badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30" },
              { label: "Fortinet FortiGate BGP Flapping DC-2", value: "1 hr 15m left", badge: "Low", badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
            ],
          },
        };
      } else {
        response = {
          id: `tai-${Date.now()}`,
          sender: "tai",
          text: `Analyzing operational telemetry for: "${query}". All primary vendor endpoints are healthy with 98.2% global SLA compliance index. Would you like me to trigger an automatic diagnostic script or draft an escalation handover report?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          metadata: {
            type: "diagnostics",
            bullets: [
              "Autonomous health probes verified across Arista, Cisco, Juniper, and Fortinet nodes.",
              "Mean Time to Resolution (MTTR) trending 12% faster than last month.",
              "Ready to auto-assign idle tickets to on-shift EMEA TAC engineers.",
            ],
          },
        };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, response]);
    }, 600);
  };

  const handleResetChat = () => {
    setMessages([]);
    setIsTyping(false);
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
                    {activeContext === opt && <CheckCircle2 className="w-3 h-3" />}
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
          /* Render Active Message History */
          <div className="flex flex-col gap-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1.5 ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                  {msg.sender === "tai" ? (
                    <>
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        TAI Assistant
                      </span>
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">You</span>
                    </>
                  )}
                  <span>• {msg.timestamp}</span>
                </div>

                {/* Bubble Container */}
                <div
                  className={`p-3 rounded-[4px] text-xs leading-relaxed max-w-[92%] shadow-xs ${
                    msg.sender === "user"
                      ? "bg-[#0047ba] text-white rounded-tr-none font-normal"
                      : "bg-slate-100/90 dark:bg-[#0c1630] border border-slate-200/80 dark:border-[#162444] text-slate-800 dark:text-slate-100 rounded-tl-none"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Optional Rich Metadata Card in Assistant Responses */}
                  {msg.metadata && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-[#1e3056] flex flex-col gap-2">
                      {msg.metadata.title && (
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{msg.metadata.title}</span>
                        </div>
                      )}

                      {msg.metadata.details && (
                        <div className="grid grid-cols-1 gap-1 bg-white/70 dark:bg-[#070e1f] p-2 rounded-[2px] border border-slate-200/50 dark:border-[#14223d]">
                          {msg.metadata.details.map((d, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px] py-0.5">
                              <span className="text-slate-500 dark:text-slate-400">{d.label}:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-slate-800 dark:text-slate-200">{d.value}</span>
                                {d.badge && (
                                  <span className={`px-1.5 py-0.2 rounded-[2px] text-[9px] font-bold border ${d.badgeColor}`}>
                                    {d.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.metadata.bullets && (
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                          {msg.metadata.bullets.map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-[#0c1630] rounded-[4px] w-fit text-xs text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-spin-slow" />
                <span className="italic">TAI is analyzing telemetry...</span>
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
