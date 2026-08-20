"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Add,
  Refresh,
  CloseSquare,
  Send2,
  ArrowDown2,
  Maximize4,
  Book,
  FilterSearch,
  ExportCurve,
  ShieldSecurity,
  Danger,
  Activity,
} from "iconsax-react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
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

export default function TaiChatPanel() {
  const router = useRouter();
  const {
    isDarkMode,
    isTaiChatOpen,
    setIsTaiChatOpen,
  } = useDashboard();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeContext, setActiveContext] = useState("Summarize Cisco Ticket");
  const [isContextDropdownOpen, setIsContextDropdownOpen] = useState(false);
  const [isExpandedWidth, setIsExpandedWidth] = useState(false);
  const [isMaximizing, setIsMaximizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleMaximizeToPage = () => {
    setIsMaximizing(true);
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/cases";
    if (typeof window !== "undefined") {
      sessionStorage.setItem("taiReturnUrl", currentPath);
      sessionStorage.setItem("tai_messages_session", JSON.stringify(messages));
    }
    setTimeout(() => {
      setIsTaiChatOpen(false);
      setIsMaximizing(false);
      router.push(`/ai?returnUrl=${encodeURIComponent(currentPath)}&expanded=true`);
    }, 150);
  };

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
      const next = updater(prev);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tai_messages_session", JSON.stringify(next));
        window.dispatchEvent(new Event("tai_messages_updated"));
      }
      return next;
    });
  };

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

    updateAndSaveMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsTyping(true);

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
                title: "Cisco Systems",
                desc: "142 active SRs, 12 P1 escalations.",
              },
            ],
            footerText: "Real-time TAC sync active.",
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
                desc: "100% operational across all clusters.",
              },
            ],
            footerText: "System ready.",
          },
        };
      }

      setIsTyping(false);
      updateAndSaveMessages((prev) => [...prev, response]);
    }, 550);
  };

  const handleResetChat = () => {
    setMessages([]);
    setIsTyping(false);
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

  const handleCloseChat = () => {
    setIsTaiChatOpen(false);
  };

  return (
    <>
      {/* Spacer div in flex flow to reserve width when TAI Chat is open */}
      <div
        className={`shrink-0 h-screen transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] pointer-events-none ${
          isTaiChatOpen ? (isExpandedWidth ? "w-[480px]" : "w-[390px]") : "w-0"
        }`}
      />

      {/* Expanded TAI Chat Panel */}
      <aside
        aria-label="TAI Chat Assistant"
        aria-hidden={!isTaiChatOpen}
        className={`h-screen fixed top-0 right-0 flex flex-col shrink-0 overflow-hidden overscroll-none select-none transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          isTaiChatOpen
            ? isExpandedWidth
              ? "w-[480px] z-30 border-l border-[#EAEEF3] dark:border-[#162444]"
              : "w-[390px] z-30 border-l border-[#EAEEF3] dark:border-[#162444]"
            : "w-0 z-30 border-l-0 pointer-events-none"
        } ${
          isDarkMode
            ? "bg-[#060b19] text-slate-100"
            : "bg-white text-slate-800"
        } ${isMaximizing ? "opacity-0 transition-opacity duration-150" : ""}`}
      >
      <div
        className={`h-full flex flex-col transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          isExpandedWidth ? "w-[480px] min-w-[480px]" : "w-[390px] min-w-[390px]"
        } ${
          isTaiChatOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-4 opacity-0 pointer-events-none"
        }`}
      >
        {/* ── Top Header (Exact 49px height matching PageHeader navbar) ── */}
        <div className="h-[49px] px-3 border-b border-[#EAEEF3] dark:border-[#14223d] shrink-0 bg-white dark:bg-[#081024] flex items-center justify-between box-border">
        {/* Title & Dropdown */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-[#002E5D] flex items-center justify-center text-white shrink-0 shadow-2xs">
            <AiIcon size={14} color="#ffffff" variant="Bold" />
          </div>
          <div className="flex flex-col min-w-0 relative">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                Tai Chat
              </span>
            </div>
            <button
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

        {/* Right Header Actions */}
        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          <button
            onClick={handleResetChat}
            className="w-7 h-7 rounded-[4px] hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="New Chat Session"
          >
            <Add size={16} color="currentColor" variant="Linear" />
          </button>

          {/* Maximize to full AI Page view with return URL */}
          <button
            type="button"
            onClick={handleMaximizeToPage}
            className="w-7 h-7 rounded-[4px] hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Maximize to Full AI Page"
          >
            <Maximize4 size={14} color="currentColor" variant="Linear" />
          </button>

          <button
            onClick={handleResetChat}
            className="w-7 h-7 rounded-[4px] hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Clear Messages"
          >
            <Refresh size={14} color="currentColor" variant="Linear" />
          </button>
          <button
            onClick={handleCloseChat}
            className="w-7 h-7 rounded-[4px] hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer ml-1"
            title="Close TAI Chat"
          >
            <CloseSquare size={16} color="currentColor" variant="Linear" />
          </button>
        </div>
      </div>

      {/* ── Main Chat / Greeting Area (overscroll-contain isolates wheel scroll) ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center my-auto py-6 animate-in fade-in duration-300">
            {/* Big Greeting */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Good Morning,{" "}
                <span className="text-[#002E5D] dark:text-[#38bdf8]">Murali</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-normal">
                How can I help you today ?
              </p>
            </div>

            {/* Suggested Actions Header & Pills */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-[#7790A9] dark:text-slate-400 uppercase tracking-wider">
                SUGGESTED ACTIONS
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => handleSendMessage(action)}
                    className="px-3.5 py-2 rounded-[6px] text-xs font-medium transition-all cursor-pointer border border-[#EAEEF3] dark:border-[#1e3056] bg-white dark:bg-[#0d172e] text-[#002E5D] dark:text-[#38bdf8] hover:border-[#002E5D] dark:hover:border-[#38bdf8] hover:bg-[#ECF3FF] shadow-2xs text-left"
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
                  /* User Message Bubble on Right with Signature Blue Gradient & 8px Corner Radius */
                  <div className="flex flex-col items-end">
                    <div className="bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)] text-white px-4 py-2.5 rounded-[8px] rounded-tr-none text-xs md:text-[13px] font-normal shadow-[0_4px_14px_rgba(0,88,153,0.22)] max-w-[88%] leading-relaxed">
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 mr-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ) : (
                  /* AI Response with Bot Avatar and Styled Telemetry Card */
                  <div className="flex items-start gap-2.5">
                    {/* Bot Avatar Icon with Signature Gradient */}
                    <div className="w-7 h-7 rounded-full bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)] flex items-center justify-center p-1 shrink-0 mt-0.5 shadow-xs">
                      <img
                        src="/tacbot-logo-white.svg"
                        alt="TAI"
                        className="w-4 h-4 object-contain"
                      />
                    </div>

                    {/* AI Response Card */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="bg-[#f8fafc] dark:bg-[#0c1630] border border-[#EAEEF3] dark:border-[#162444] rounded-[12px] rounded-tl-none p-3.5 text-xs text-slate-800 dark:text-slate-100 shadow-xs flex flex-col gap-2.5">
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
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal pt-1 border-t border-[#EAEEF3]/50 dark:border-[#162444]">
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
                                className="px-2.5 py-1.5 rounded-[8px] border border-[#002E5D]/30 dark:border-[#38bdf8]/40 bg-white dark:bg-[#07132a] text-[#002E5D] dark:text-[#38bdf8] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[11px] font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
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
                <div className="w-7 h-7 rounded-full bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)] flex items-center justify-center p-1 shrink-0 mt-0.5 shadow-xs">
                  <img
                    src="/tacbot-logo-white.svg"
                    alt="TAI"
                    className="w-4 h-4 object-contain animate-pulse"
                  />
                </div>
                <div className="p-3 bg-[#F2F4F6] dark:bg-[#0c1630] border border-[#EAEEF3] dark:border-[#162444] rounded-[12px] rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                  <AiIcon size={14} color="#9333ea" variant="Bold" className="animate-spin-slow" />
                  <span className="italic">TAI is analyzing telemetry...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Bottom Section: Context Pills & Input ── */}
      <div className="p-3 border-t border-[#EAEEF3] dark:border-[#14223d] bg-[#F9FBFF]/70 dark:bg-[#081024]/80 flex flex-col gap-2 shrink-0">
        {/* Quick Context Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {bottomContextPills.map((pill) => (
            <button
              key={pill}
              onClick={() => handleSendMessage(pill)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer bg-white dark:bg-[#0e1b38] border border-[#EAEEF3] dark:border-[#1e3056] text-slate-600 dark:text-slate-300 hover:border-[#002E5D] hover:text-[#002E5D] dark:hover:text-[#38bdf8] shadow-2xs"
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
          className="relative flex items-center bg-white dark:bg-[#081024] rounded-full border border-[#EAEEF3] dark:border-[#1e3056] pl-3.5 pr-1.5 py-1.5 shadow-sm focus-within:border-[#005899] focus-within:ring-2 focus-within:ring-[#005899]/20 transition-all"
        >
          {/* Sparkles icon in signature blue */}
          <div className="mr-2 text-[#005899] dark:text-[#38bdf8] shrink-0">
            <AiIcon size={14} color="currentColor" variant="Bold" />
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
                ? "bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)] hover:opacity-95 hover:scale-105"
                : "bg-slate-300 dark:bg-slate-700 opacity-50 cursor-not-allowed"
            }`}
            title="Send query"
          >
            <Send2 size={14} color="#ffffff" variant="Bold" className="transform rotate-12 -ml-0.5" />
          </button>
        </form>
      </div>
      </div>
    </aside>
    </>
  );
}
