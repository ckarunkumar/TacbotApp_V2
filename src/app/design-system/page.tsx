"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Share2,
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertCircle,
  Code2,
  Layers,
  Palette,
  Type,
  Box,
  Layout,
  FileText,
  Sliders,
  CheckSquare,
  XSquare,
  Search,
  BookOpen,
  MessageSquare,
  Sidebar as SidebarIcon,
  HelpCircle,
  Shield,
} from "lucide-react";
import {
  Setting2,
  Add,
  Refresh,
  TickCircle,
  Send2,
  ChartCircle,
  Flash,
  Chart2,
  TrendUp,
  Category,
  ClipboardText,
  Flag,
  People,
  Timer1,
  Notification,
} from "iconsax-react";
import AiIcon from "@/components/icons/AiIcon";
import Button, { ButtonSize, ButtonVariant } from "@/components/ui/Button";
import Input, { InputSize, InputState } from "@/components/ui/Input";
import Badge from "@/components/Badge";
import Tooltip from "@/components/Tooltip";

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Interactive Playground State
  const [pgVariant, setPgVariant] = useState<ButtonVariant>("ai");
  const [pgSize, setPgSize] = useState<ButtonSize>("md");
  const [pgShowLeftIcon, setPgShowLeftIcon] = useState<boolean>(true);
  const [pgShowRightIcon, setPgShowRightIcon] = useState<boolean>(false);
  const [pgLabel, setPgLabel] = useState<string>("TAI AI Action");

  // Code Tab Toggles
  const [activeCodeTab, setActiveCodeTab] = useState<Record<string, "preview" | "code">>({
    spatial: "preview",
    colors: "preview",
    buttons: "preview",
    inputs: "preview",
    badges: "preview",
    tooltips: "preview",
    cards: "preview",
    drawers: "preview",
    sidebar: "preview",
  });

  const toggleCodeTab = (sectionKey: string, tab: "preview" | "code") => {
    setActiveCodeTab((prev) => ({ ...prev, [sectionKey]: tab }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const blueSwatches = [
    { name: "Arista 50 (Surface)", hex: "#F9FBFF", text: "#2C3746", usage: "Lightest card hover & surface tint" },
    { name: "Arista 100 (Tint)", hex: "#ECF3FF", text: "#002E5D", usage: "Primary soft active tab highlight & badge bg" },
    { name: "Arista 200", hex: "#D4E4FE", text: "#002E5D", usage: "Soft hover border & active focus outline" },
    { name: "Arista 300", hex: "#A1C4FC", text: "#002E5D", usage: "Interactive focus rings & subtle highlights" },
    { name: "Arista 400", hex: "#5E94EE", text: "#ffffff", usage: "Secondary interactive accent indicators" },
    { name: "Arista 500 (Primary)", hex: "#2F6ADB", text: "#ffffff", usage: "Bright CTA link blue" },
    { name: "Arista 600", hex: "#1B4EB8", text: "#ffffff", usage: "Deep hover blue state" },
    { name: "Arista 700 (Indigo)", hex: "#293283", text: "#ffffff", usage: "Secondary brand navy & sidebar accent" },
    { name: "Arista 800 (Navy)", hex: "#002E5D", text: "#ffffff", usage: "Primary brand navy & header anchor" },
    { name: "Arista 900", hex: "#001F42", text: "#ffffff", usage: "Deep navy container surface & dark header" },
    { name: "Arista 950 (Deep)", hex: "#00122B", text: "#ffffff", usage: "Ultra deep navy canvas" },
  ];

  const neutralSwatches = [
    { name: "Neutral 50 (Canvas)", hex: "#F2F4F6", text: "#2C3746", usage: "Main application background canvas" },
    { name: "Neutral 100 (Border)", hex: "#EAEEF3", text: "#2C3746", usage: "Standard card, table & container border" },
    { name: "Neutral 200", hex: "#D5DEE7", text: "#2C3746", usage: "Divider lines & hover borders" },
    { name: "Neutral 300", hex: "#B3C1D0", text: "#1A222D", usage: "Disabled text & subtle borders" },
    { name: "Neutral 400 (Slate)", hex: "#7790A9", text: "#ffffff", usage: "Muted text, secondary icons, subtitle text" },
    { name: "Neutral 500", hex: "#576B81", text: "#ffffff", usage: "Form labels & secondary body text" },
    { name: "Neutral 600", hex: "#3F4E60", text: "#ffffff", usage: "Primary body copy text" },
    { name: "Neutral 700 (Heading)", hex: "#2C3746", text: "#ffffff", usage: "Main card titles & dark headers" },
    { name: "Neutral 800", hex: "#1A222D", text: "#ffffff", usage: "Dark surface background" },
    { name: "Neutral 900", hex: "#0F151D", text: "#ffffff", usage: "Dark mode background surface" },
  ];

  const statusBadges = [
    { label: "Breached / Critical", text: "#dc2626", bg: "#fef2f2", border: "#fecaca", description: "Breached SLA, High severity badge, Overdue countdowns" },
    { label: "Near Breach / Warning", text: "#d97706", bg: "#fffbeb", border: "#fde68a", description: "Medium severity badge, Near-breach warning dots" },
    { label: "Target / SLA Met", text: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", description: "Low severity badge, SLA OK segments, positive trends" },
    { label: "New Case / Info", text: "#002E5D", bg: "#ECF3FF", border: "#D4E4FE", description: "New case dot, active filters, info notices" },
  ];

  const navCategories = [
    {
      category: "FOUNDATIONS",
      items: [
        { id: "overview", label: "Spatial Standards", icon: Layers, count: "8px Grid" },
        { id: "colors", label: "Color Tokens & Gradient", icon: Palette, count: "21 Tokens" },
        { id: "typography", label: "Typography Rules", icon: Type, count: "Poppins" },
      ],
    },
    {
      category: "COMPONENTS",
      items: [
        { id: "buttons", label: "Buttons & Actions", icon: Box, count: "Button.tsx" },
        { id: "inputs", label: "Form Fields & Selects", icon: FileText, count: "Input.tsx" },
        { id: "badges", label: "Status Chips & Badges", icon: CheckCircle2, count: "Badge.tsx" },
        { id: "tooltips", label: "Tooltips & Notices", icon: HelpCircle, count: "Tooltip.tsx" },
        { id: "cards", label: "Cards & Widgets", icon: Code2, count: "Card Pattern" },
      ],
    },
    {
      category: "INTERACTIVE TOOLS",
      items: [
        { id: "playground", label: "Interactive Playground", icon: Sliders, count: "Live Test" },
      ],
    },
    {
      category: "UI & LAYOUT POLICIES",
      items: [
        { id: "drawers", label: "Modals vs Right Drawers", icon: Layout, count: "UI Policy" },
        { id: "sidebar", label: "Sidebar Scroll Isolation", icon: SidebarIcon, count: "Layout Spec" },
      ],
    },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#2C3746] font-sans antialiased flex flex-col">
      {/* ── Top Header Navigation Bar ── */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#EAEEF3] px-4 md:px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] hover:bg-[#D4E4FE] transition-all flex items-center justify-center cursor-pointer border border-[#D4E4FE]"
            title="Return to App Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <img src="/tacbot-logo-white.svg" alt="Tacbot Logo" className="w-5 h-6 object-contain bg-[#002E5D] p-1 rounded-[4px]" />
            <span className="font-semibold text-sm text-[#002E5D] tracking-tight">
              TAI Operations
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE]">
              Design System v2.1
            </span>
          </div>
        </div>

        {/* Center Search Filter */}
        <div className="hidden md:flex items-center relative w-80">
          <Search className="w-3.5 h-3.5 text-[#7790A9] absolute left-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specs, component rules, tokens..."
            className="w-full text-xs bg-[#F2F4F6] border border-[#EAEEF3] rounded-[4px] pl-8 pr-3 py-1.5 text-[#2C3746] placeholder-[#7790A9] focus:outline-none focus:border-[#002E5D] focus:bg-white transition-all font-normal"
          />
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => copyToClipboard("https://tacbot.arista.com/design-system")}
            className="px-2.5 py-1.5 rounded-[4px] bg-[#F2F4F6] hover:bg-[#EAEEF3] text-[#7790A9] hover:text-[#2C3746] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border border-[#EAEEF3]"
            title="Share Design System Link"
          >
            {copiedToken === "https://tacbot.arista.com/design-system" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied Link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share Spec</span>
              </>
            )}
          </button>

          <Link
            href="/"
            className="px-3.5 py-1.5 bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)] text-white text-xs font-semibold rounded-[4px] shadow-xs hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <AiIcon size={14} color="#ffffff" variant="Bold" />
            <span>Launch Dashboard</span>
          </Link>
        </div>
      </header>

      {/* ── Main Layout Body (Sidebar Flush Left + Content Area) ── */}
      <div className="flex-1 w-full flex min-h-[calc(100vh-49px)]">
        
        {/* ── Sticky Navigation Sidebar (Anchored Flush to Extreme Left Viewport Edge) ── */}
        <aside className="w-72 shrink-0 bg-white border-r border-[#EAEEF3] p-4 hidden md:flex flex-col gap-5 sticky top-[49px] left-0 h-[calc(100vh-49px)] overflow-y-auto">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EAEEF3]">
            <BookOpen className="w-4 h-4 text-[#002E5D]" />
            <span className="text-xs font-bold text-[#002E5D] uppercase tracking-wider">
              Component Specs Index
            </span>
          </div>

          <nav className="flex flex-col gap-4">
            {navCategories.map((catGroup) => {
              const matchingItems = catGroup.items.filter((item) =>
                item.label.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (matchingItems.length === 0) return null;

              return (
                <div key={catGroup.category} className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-[#7790A9] uppercase tracking-wider px-2">
                    {catGroup.category}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {matchingItems.map((sec) => {
                      const Icon = sec.icon;
                      const isActive = activeSection === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => scrollToSection(sec.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] text-xs transition-all cursor-pointer text-left ${
                            isActive
                              ? "bg-[#ECF3FF] text-[#002E5D] font-semibold border-l-3 border-[#002E5D] shadow-2xs"
                              : "text-[#576B81] hover:text-[#002E5D] hover:bg-[#F9FBFF]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-1">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#002E5D]" : "text-[#7790A9]"}`} />
                            <span className="truncate leading-tight">{sec.label}</span>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] bg-[#F2F4F6] text-[#7790A9] shrink-0">
                            {sec.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 border-t border-[#EAEEF3] flex flex-col gap-2">
            <div className="p-3 rounded-[8px] bg-[#F9FBFF] border border-[#D4E4FE] text-[11px] text-[#576B81] flex flex-col gap-1.5">
              <span className="font-semibold text-[#002E5D] flex items-center gap-1.5">
                <AiIcon size={13} color="#002E5D" variant="Bold" />
                <span>AI Gradient Policy</span>
              </span>
              <p className="leading-relaxed">
                Buttons containing <code className="bg-white px-1 py-0.5 rounded border border-[#D4E4FE] font-mono text-[10px]">AiIcon</code> MUST use the signature AI gradient. Non-AI buttons must use solid fills.
              </p>
            </div>
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <main className="flex-1 p-4 md:p-8 flex flex-col gap-8 max-w-5xl">
          
          {/* Hero Banner */}
          <div className="w-full bg-white rounded-[8px] border border-[#EAEEF3] p-6 shadow-xs flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-[#002E5D]">
              <AiIcon size={240} color="currentColor" variant="Bold" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE]">
                Enterprise Component Specification & Rules Portal
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#002E5D]">
              TAI Tacbot Design System Component Rules
            </h1>

            <p className="text-xs md:text-sm text-[#576B81] leading-relaxed max-w-3xl">
              Strict, non-negotiable guidelines, geometry specs, color constraints, and DO / DON'T enforcement rules for every component in the TAC Operations platform.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#7790A9] pt-2 border-t border-[#EAEEF3]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Status: Strict Enforcement
              </span>
              <span>•</span>
              <span>Grid Unit: 8px Strict</span>
              <span>•</span>
              <span>Buttons & Inputs: 4px Corner Radius</span>
              <span>•</span>
              <span>Containers: 8px Corner Radius</span>
            </div>
          </div>

          {/* ── SECTION 1: OVERVIEW & SPATIAL RULES ── */}
          <section id="overview" className="w-full bg-white rounded-[8px] border border-[#EAEEF3] p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#EAEEF3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#002E5D]">
                    1. Spatial Math & Geometry Rules
                  </h2>
                  <p className="text-xs text-[#7790A9] font-normal">
                    Strict spatial enforcement for margins, gaps, paddings, and corner radii.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-[8px] bg-[#F9FBFF] border border-[#D4E4FE] flex flex-col gap-2">
                <span className="font-semibold text-[#002E5D] text-sm flex items-center justify-between">
                  Strict 8px Margins & Gaps
                  <code className="text-[10px] bg-white px-1.5 py-0.5 rounded-[4px] border border-[#D4E4FE] font-mono">gap-2</code>
                </span>
                <p className="text-[#576B81] leading-relaxed">
                  All gaps and margins between adjacent cards, layout columns, and header items MUST be strictly <strong>8px</strong> (`gap-2`, `mb-2`, `mt-2`). No 4px, 10px, 12px, or custom margins permitted.
                </p>
              </div>

              <div className="p-4 rounded-[8px] bg-[#F9FBFF] border border-[#D4E4FE] flex flex-col gap-2">
                <span className="font-semibold text-[#002E5D] text-sm flex items-center justify-between">
                  Strict 8px / 16px Paddings
                  <code className="text-[10px] bg-white px-1.5 py-0.5 rounded-[4px] border border-[#D4E4FE] font-mono">p-2 / p-4</code>
                </span>
                <p className="text-[#576B81] leading-relaxed">
                  Paddings are strictly <strong>8px (`p-2`)</strong> for compact controls and <strong>16px (`p-4`)</strong> for containers. Standard components use `px-4 py-2` (16px horizontal, 8px vertical).
                </p>
              </div>

              <div className="p-4 rounded-[8px] bg-[#F9FBFF] border border-[#D4E4FE] flex flex-col gap-2">
                <span className="font-semibold text-[#002E5D] text-sm flex items-center justify-between">
                  Corner Radius Dual Standard
                  <code className="text-[10px] bg-white px-1.5 py-0.5 rounded-[4px] border border-[#D4E4FE] font-mono">8px / 4px</code>
                </span>
                <p className="text-[#576B81] leading-relaxed">
                  Cards, modals, and container wrappers use <strong>8px radius (`rounded-[8px]`)</strong>. Interactive buttons, inputs, selects, and controls use <strong>4px radius (`rounded-[4px]`)</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 2: COLOR SYSTEM & GRADIENT RULE ── */}
          <section id="colors" className="w-full bg-white rounded-[8px] border border-[#EAEEF3] p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#EAEEF3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE] flex items-center justify-center">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#002E5D]">
                    2. Color Tokens & Signature AI Gradient Rule
                  </h2>
                  <p className="text-xs text-[#7790A9] font-normal">
                    Official Arista Blue scale, neutral slate palette, and AI gradient policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Blue Gradient Hero Banner */}
            <div className="w-full rounded-[8px] p-5 bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)] text-white flex flex-wrap items-center justify-between gap-4 shadow-md">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AiIcon size={16} color="#ffffff" variant="Bold" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90">
                    Signature TAI Brand AI Gradient Rule
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-mono font-semibold tracking-tight">
                  linear-gradient(135deg, #005899 0%, #006eb0 50%, #0181c4 100%)
                </h3>
                <p className="text-xs opacity-90 mt-1 max-w-2xl leading-relaxed">
                  Applied <strong>EXCLUSIVELY</strong> to buttons containing an AI icon (<code className="bg-white/20 px-1 rounded font-mono text-[11px]">AiIcon</code>) or triggering AI workflows (TAI Chat, TAI Search, Create with TAI). All standard non-AI buttons use flat solid colors (`#002E5D` Navy with `#0A3492` hover).
                </p>
              </div>
              <button
                onClick={() => copyToClipboard("linear-gradient(135deg, #005899 0%, #006eb0 50%, #0181c4 100%)")}
                className="px-3 py-1.5 rounded-[4px] bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-all flex items-center gap-1.5 cursor-pointer border border-white/30 shrink-0"
              >
                {copiedToken === "linear-gradient(135deg, #005899 0%, #006eb0 50%, #0181c4 100%)" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy CSS Gradient</span>
                  </>
                )}
              </button>
            </div>

            {/* Arista Blue Scale */}
            <div className="flex flex-col gap-2 pt-2">
              <h3 className="text-xs font-semibold text-[#2C3746] uppercase tracking-wider">
                Arista Brand Blue Scale (`arista-*`)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {blueSwatches.map((s) => (
                  <div
                    key={s.hex}
                    onClick={() => copyToClipboard(s.hex)}
                    className="rounded-[4px] p-2.5 flex flex-col justify-between h-24 shadow-2xs border border-[#EAEEF3] cursor-pointer transition-transform hover:scale-105 group"
                    style={{ backgroundColor: s.hex, color: s.text }}
                  >
                    <div>
                      <span className="text-[11px] font-semibold block truncate">{s.name}</span>
                      <span className="text-[9px] opacity-80 block line-clamp-2 mt-0.5">{s.usage}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-90 group-hover:underline">{s.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Neutral Slate Scale */}
            <div className="flex flex-col gap-2 pt-2">
              <h3 className="text-xs font-semibold text-[#2C3746] uppercase tracking-wider">
                Neutral Slate Scale (`arista-neutral-*`)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {neutralSwatches.map((s) => (
                  <div
                    key={s.hex}
                    onClick={() => copyToClipboard(s.hex)}
                    className="rounded-[4px] p-2.5 flex flex-col justify-between h-24 shadow-2xs border border-[#EAEEF3] cursor-pointer transition-transform hover:scale-105 group"
                    style={{ backgroundColor: s.hex, color: s.text }}
                  >
                    <div>
                      <span className="text-[11px] font-semibold block truncate">{s.name}</span>
                      <span className="text-[9px] opacity-80 block line-clamp-2 mt-0.5">{s.usage}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-90 group-hover:underline">{s.hex}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SECTION 3: TYPOGRAPHY & HIERARCHY ── */}
          <section id="typography" className="w-full bg-white rounded-[8px] border border-[#EAEEF3] p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 border-b border-[#EAEEF3] pb-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE] flex items-center justify-center">
                <Type className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#002E5D]">
                  3. Typography & Font Weight Rules
                </h2>
                <p className="text-xs text-[#7790A9] font-normal">
                  Poppins typeface specifications and strict font weight constraints.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-[4px] bg-[#F9FBFF] border border-[#EAEEF3] flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#7790A9]">Font Family</span>
                <span className="text-lg font-semibold text-[#002E5D]">Poppins</span>
                <p className="text-[11px] text-[#576B81]">Primary clean sans-serif typeface across all web app interfaces.</p>
              </div>

              <div className="p-4 rounded-[4px] bg-[#F9FBFF] border border-[#EAEEF3] flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#7790A9]">Allowed Weights</span>
                <span className="text-lg font-semibold text-[#002E5D]">400, 500, 600</span>
                <p className="text-[11px] text-[#576B81]">Regular (400), Medium (500), and Semibold (600) weights only.</p>
              </div>

              <div className="p-4 rounded-[4px] bg-[#fef2f2] border border-[#fecaca] flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#dc2626]">Prohibited Weights</span>
                <span className="text-lg font-semibold text-[#dc2626]">Bold, Extra Bold, Black</span>
                <p className="text-[11px] text-[#dc2626]">NEVER use font weight 700, 800, or 900 in production copy.</p>
              </div>
            </div>
          </section>

          {/* ── SECTION 4: BUTTON RULES & MATRIX ── */}
          <section id="buttons" className="w-full bg-white rounded-[8px] border border-[#EAEEF3] p-6 shadow-xs flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#EAEEF3] pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE] flex items-center justify-center">
                  <Box className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#002E5D]">
                    4. Button Component Rules (`Button.tsx`)
                  </h2>
                  <p className="text-xs text-[#7790A9] font-normal">
                    Corner radius: 4px. Heights: 28px (sm), 32px (md), 40px (lg).
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE]">
                rounded-[4px] standard
              </span>
            </div>

            {/* Component Rules Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-[4px] bg-[#f0fdf4] border border-[#bbf7d0] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold uppercase tracking-wider">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>DO Rules for Buttons</span>
                </div>
                <ul className="list-disc list-inside text-emerald-950 flex flex-col gap-1 leading-relaxed">
                  <li>Use <strong>4px corner radius (`rounded-[4px]`)</strong> for all buttons.</li>
                  <li>Use <strong>Primary Solid Navy (`#002E5D`)</strong> with Arista Dark Blue hover (`#0A3492`) for standard action buttons.</li>
                  <li>Use <strong>`variant="ai"`</strong> with signature AI gradient ONLY on buttons containing `AiIcon` or triggering AI workflows.</li>
                  <li>Maintain 8px internal gap between icon and text label (`gap-2`).</li>
                </ul>
              </div>

              <div className="p-4 rounded-[4px] bg-[#fef2f2] border border-[#fecaca] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-red-800 font-semibold uppercase tracking-wider">
                  <XSquare className="w-4 h-4 text-red-600" />
                  <span>DON'T Rules for Buttons</span>
                </div>
                <ul className="list-disc list-inside text-red-950 flex flex-col gap-1 leading-relaxed">
                  <li><strong>NEVER</strong> apply gradients to standard non-AI action buttons (e.g. Save, Add Widget, Reset).</li>
                  <li><strong>NEVER</strong> use 8px corner radius (`rounded-[8px]`) or `rounded-full` on standard buttons.</li>
                  <li><strong>NEVER</strong> use purple or indigo hover backgrounds on primary blue buttons.</li>
                  <li><strong>NEVER</strong> use bold (`700`) font weights on button text labels.</li>
                </ul>
              </div>
            </div>

            {/* Button Showcase Grid */}
            {(["sm", "md", "lg"] as ButtonSize[]).map((sizeKey) => {
              const sizeLabels = {
                sm: "Small (sm - 28px height, 11px text)",
                md: "Medium (md - 32px standard height, 12px text)",
                lg: "Large (lg - 40px height, 14px text)",
              };

              const variantsList: { key: ButtonVariant; label: string }[] = [
                { key: "primary", label: "Primary (Solid Arista Navy #002E5D)" },
                { key: "ai", label: "AI Variant (Signature TAI AI Gradient)" },
                { key: "secondary", label: "Secondary (Arista Tint #ECF3FF)" },
                { key: "outline", label: "Outline (White Surface)" },
                { key: "disabled", label: "Disabled State" },
              ];

              return (
                <div key={sizeKey} className="flex flex-col gap-3 p-4 rounded-[8px] bg-[#F9FBFF] border border-[#EAEEF3]">
                  <div className="flex items-center justify-between border-b border-[#EAEEF3] pb-2">
                    <h3 className="text-xs font-semibold text-[#002E5D] uppercase tracking-wider">
                      {sizeLabels[sizeKey]}
                    </h3>
                    <code className="text-[10px] font-mono text-[#7790A9]">size="{sizeKey}"</code>
                  </div>

                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="text-[11px] font-semibold text-[#7790A9] border-b border-[#EAEEF3]">
                          <th className="py-2 px-2 w-44">Variant</th>
                          <th className="py-2 px-2">Without Icon</th>
                          <th className="py-2 px-2">Left Icon</th>
                          <th className="py-2 px-2">Right Icon</th>
                          <th className="py-2 px-2">Both Icons</th>
                          <th className="py-2 px-2 text-center w-24">Only Icon</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAEEF3]">
                        {variantsList.map((v) => {
                          const IconComp = v.key === "ai" ? AiIcon : Sparkles;
                          return (
                            <tr key={v.key} className="hover:bg-white/60 transition-colors">
                              <td className="py-2.5 px-2 text-xs font-medium text-[#2C3746]">
                                <span className="capitalize font-semibold block">{v.key}</span>
                                <span className="text-[10px] text-[#7790A9] font-normal block">{v.label}</span>
                              </td>

                              <td className="py-2.5 px-2">
                                <Button size={sizeKey} variant={v.key}>
                                  Button
                                </Button>
                              </td>

                              <td className="py-2.5 px-2">
                                <Button size={sizeKey} variant={v.key} leftIcon={IconComp}>
                                  Button
                                </Button>
                              </td>

                              <td className="py-2.5 px-2">
                                <Button size={sizeKey} variant={v.key} rightIcon={ArrowRight}>
                                  Button
                                </Button>
                              </td>

                              <td className="py-2.5 px-2">
                                <Button size={sizeKey} variant={v.key} leftIcon={IconComp} rightIcon={ArrowRight}>
                                  Button
                                </Button>
                              </td>

                              <td className="py-2.5 px-2 text-center">
                                <Button size={sizeKey} variant={v.key} leftIcon={IconComp} iconOnly title="Action Icon" />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </section>

          {/* ── SECTION 5: INTERACTIVE PLAYGROUND ── */}
          <section id="playground" className="w-full bg-white rounded-[8px] border border-[#EAEEF3] p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#EAEEF3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE] flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#002E5D]">
                    5. Interactive Component Playground
                  </h2>
                  <p className="text-xs text-[#7790A9] font-normal">
                    Test live button variants, icon positions, sizes, and copy ready-to-use TSX snippet.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controls Form */}
              <div className="p-4 rounded-[8px] bg-[#F9FBFF] border border-[#EAEEF3] flex flex-col gap-3">
                <h3 className="text-xs font-semibold text-[#002E5D] uppercase tracking-wider">
                  Configurator
                </h3>

                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-semibold text-[#576B81]">Button Variant</label>
                  <select
                    value={pgVariant}
                    onChange={(e) => setPgVariant(e.target.value as ButtonVariant)}
                    className="px-2.5 py-1.5 rounded-[4px] bg-white border border-[#EAEEF3] text-[#2C3746] text-xs focus:outline-none focus:border-[#002E5D]"
                  >
                    <option value="primary">Primary (Solid #002E5D)</option>
                    <option value="ai">AI (Signature AI Gradient)</option>
                    <option value="secondary">Secondary (Arista Tint #ECF3FF)</option>
                    <option value="outline">Outline (White Surface)</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-semibold text-[#576B81]">Button Size</label>
                  <div className="flex items-center gap-2">
                    {(["sm", "md", "lg"] as ButtonSize[]).map((sKey) => (
                      <button
                        key={sKey}
                        type="button"
                        onClick={() => setPgSize(sKey)}
                        className={`flex-1 py-1 text-xs rounded-[4px] border font-medium cursor-pointer transition-all ${
                          pgSize === sKey
                            ? "bg-[#002E5D] text-white border-[#002E5D] font-semibold"
                            : "bg-white text-[#2C3746] border-[#EAEEF3] hover:bg-[#F2F4F6]"
                        }`}
                      >
                        {sKey.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-semibold text-[#576B81]">Button Text</label>
                  <input
                    type="text"
                    value={pgLabel}
                    onChange={(e) => setPgLabel(e.target.value)}
                    className="px-2.5 py-1.5 rounded-[4px] bg-white border border-[#EAEEF3] text-[#2C3746] text-xs focus:outline-none focus:border-[#002E5D]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="font-semibold text-[#576B81]">Left Icon (AiIcon)</label>
                  <input
                    type="checkbox"
                    checked={pgShowLeftIcon}
                    onChange={(e) => setPgShowLeftIcon(e.target.checked)}
                    className="w-4 h-4 accent-[#002E5D] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-[#576B81]">Right Icon (ArrowRight)</label>
                  <input
                    type="checkbox"
                    checked={pgShowRightIcon}
                    onChange={(e) => setPgShowRightIcon(e.target.checked)}
                    className="w-4 h-4 accent-[#002E5D] cursor-pointer"
                  />
                </div>
              </div>

              {/* Live Result & Generated Code */}
              <div className="flex flex-col gap-4">
                <div className="p-6 rounded-[8px] bg-white border border-[#EAEEF3] shadow-xs flex flex-col items-center justify-center gap-3 min-h-[140px]">
                  <span className="text-[10px] font-semibold uppercase text-[#7790A9] tracking-wider">
                    Live Component Render
                  </span>
                  <Button
                    variant={pgVariant}
                    size={pgSize}
                    leftIcon={pgShowLeftIcon ? AiIcon : undefined}
                    rightIcon={pgShowRightIcon ? ArrowRight : undefined}
                  >
                    {pgLabel}
                  </Button>
                </div>

                <div className="bg-[#0f172a] text-slate-100 p-4 rounded-[4px] font-mono text-xs relative flex flex-col justify-between">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `<Button variant="${pgVariant}" size="${pgSize}"${pgShowLeftIcon ? ' leftIcon={AiIcon}' : ''}${pgShowRightIcon ? ' rightIcon={ArrowRight}' : ''}>${pgLabel}</Button>`
                      )
                    }
                    className="absolute top-3 right-3 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded cursor-pointer border border-slate-700"
                  >
                    Copy TSX Code
                  </button>
                  <pre className="overflow-x-auto pt-4">{`<Button
  variant="${pgVariant}"
  size="${pgSize}"${pgShowLeftIcon ? '\n  leftIcon={AiIcon}' : ''}${pgShowRightIcon ? '\n  rightIcon={ArrowRight}' : ''}
>
  ${pgLabel}
</Button>`}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 6: FORM CONTROLS & INPUTS ── */}
          <section id="inputs" className="w-full bg-white rounded-[8px] border border-[#EAEEF3] p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#EAEEF3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#002E5D]">
                    6. Form Controls & Input Field Rules (`Input.tsx`)
                  </h2>
                  <p className="text-xs text-[#7790A9] font-normal">
                    Corner radius: 4px. Focus ring: `#002E5D`. Placeholder text: `#7790A9`.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE]">
                rounded-[4px] standard
              </span>
            </div>

            {/* DO & DON'T Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-[4px] bg-[#f0fdf4] border border-[#bbf7d0] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold uppercase tracking-wider">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>DO Rules for Input Fields</span>
                </div>
                <ul className="list-disc list-inside text-emerald-950 flex flex-col gap-1 leading-relaxed">
                  <li>Use <strong>4px corner radius (`rounded-[4px]`)</strong> for all input text fields and selects.</li>
                  <li>Include clear focus indicator ring (`focus-within:border-[#002E5D] focus-within:ring-2 focus-within:ring-[#002E5D]/20`).</li>
                  <li>Use left search icons (<code className="bg-white px-1.5 py-0.5 rounded border border-[#bbf7d0] font-mono text-[10px]">leftIcon=&#123;Search&#125;</code>) for search filter bars.</li>
                </ul>
              </div>

              <div className="p-4 rounded-[4px] bg-[#fef2f2] border border-[#fecaca] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-red-800 font-semibold uppercase tracking-wider">
                  <XSquare className="w-4 h-4 text-red-600" />
                  <span>DON'T Rules for Input Fields</span>
                </div>
                <ul className="list-disc list-inside text-red-950 flex flex-col gap-1 leading-relaxed">
                  <li><strong>NEVER</strong> use 8px corner radius (`rounded-[8px]`) or `rounded-full` on text inputs.</li>
                  <li><strong>NEVER</strong> hide focus rings or outline feedback when user types.</li>
                  <li><strong>NEVER</strong> use custom paddings outside the `px-3 py-1.5` standard.</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 text-xs">
                <span className="font-semibold text-[#7790A9]">Standard Input</span>
                <Input placeholder="Enter ticket description..." />
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <span className="font-semibold text-[#7790A9]">Left Icon Input (Search)</span>
                <Input leftIcon={Search} placeholder="Search vendor SLA..." />
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <span className="font-semibold text-[#7790A9]">Disabled State</span>
                <Input disabled placeholder="Disabled system field..." />
              </div>
            </div>
          </section>

          {/* ── SECTION 7: STATUS CHIPS & BADGES ── */}
          <section id="badges" className="w-full bg-white rounded-[8px] border border-[#EAEEF3] p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 border-b border-[#EAEEF3] pb-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#002E5D]">
                  7. Status Indicators & 3-Layer Severity Chip Rules (`Badge.tsx`)
                </h2>
                <p className="text-xs text-[#7790A9] font-normal">
                  3-Layer System: Light Tinted Background + Soft Border + High-Contrast Saturated Text. Corner radius: 4px.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {statusBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="p-3.5 rounded-[8px] flex flex-col justify-between gap-2 border transition-all"
                  style={{ backgroundColor: badge.bg, borderColor: badge.border }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: badge.text }}>
                      {badge.label}
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: badge.text }} />
                  </div>
                  <p className="text-[11px] font-normal opacity-90 leading-relaxed" style={{ color: badge.text }}>
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 8: TOOLTIPS ── */}
          <section id="tooltips" className="w-full bg-white rounded-[8px] border border-[#EAEEF3] p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 border-b border-[#EAEEF3] pb-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE] flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#002E5D]">
                  8. Tooltip Component Standard (`Tooltip.tsx`)
                </h2>
                <p className="text-xs text-[#7790A9] font-normal">
                  Background: `#001F42`. Text: White `#ffffff`. Corner radius: 4px. Width: 240px (`w-60`).
                </p>
              </div>
            </div>

            <div className="p-6 rounded-[8px] bg-[#F9FBFF] border border-[#EAEEF3] flex flex-wrap items-center justify-around gap-4">
              <Tooltip content="SLA breach count indicates cases within 30 minutes of breach" position="top">
                <button className="px-3 py-1.5 bg-white border border-[#EAEEF3] rounded-[4px] text-xs font-medium text-[#002E5D] shadow-2xs hover:bg-[#ECF3FF]">
                  Hover Tooltip Top
                </button>
              </Tooltip>

              <Tooltip content="Auto-assignment routes tickets to on-call TAC engineer" position="bottom">
                <button className="px-3 py-1.5 bg-white border border-[#EAEEF3] rounded-[4px] text-xs font-medium text-[#002E5D] shadow-2xs hover:bg-[#ECF3FF]">
                  Hover Tooltip Bottom
                </button>
              </Tooltip>
            </div>
          </section>

          {/* ── SECTION 9: CARDS & WIDGETS ── */}
          <section id="cards" className="w-full bg-white rounded-[8px] border border-[#EAEEF3] p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#EAEEF3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE] flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#002E5D]">
                    9. Card & Widget Construction Code Standard
                  </h2>
                  <p className="text-xs text-[#7790A9] font-normal">
                    Corner radius: 8px. Outer padding: 16px (`p-4`). Internal gap: 8px (`gap-2`). Title margin: 8px (`mb-2`).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f172a] text-slate-100 p-4 rounded-[4px] font-mono text-xs relative overflow-x-auto">
              <button
                onClick={() =>
                  copyToClipboard(
                    `<div className="bg-white rounded-[8px] border border-[#EAEEF3] p-4 shadow-xs flex flex-col justify-between h-full hover:bg-[#F9FBFF] transition-colors">\n  {/* Card Header (8px margin bottom) */}\n  <div className="flex items-center justify-between mb-2">\n    <h3 className="text-xs font-semibold text-[#2C3746] tracking-tight">Widget Title</h3>\n  </div>\n  {/* Card Body (8px gap) */}\n  <div className="flex-1 flex flex-col gap-2">\n    {/* Content or Visualizations */}\n  </div>\n</div>`
                  )
                }
                className="absolute top-3 right-3 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded cursor-pointer border border-slate-700"
              >
                Copy Code Pattern
              </button>
              <pre>{`<div className="bg-white rounded-[8px] border border-[#EAEEF3] p-4 shadow-xs flex flex-col justify-between h-full hover:bg-[#F9FBFF] transition-colors">
  {/* Card Header (8px margin bottom) */}
  <div className="flex items-center justify-between mb-2">
    <h3 className="text-xs font-semibold text-[#2C3746] tracking-tight">Widget Title</h3>
    <button className="text-[#7790A9] hover:text-[#2C3746] transition-colors cursor-pointer" title="Info">
      <Info className="w-3.5 h-3.5" />
    </button>
  </div>

  {/* Card Body (8px gap) */}
  <div className="flex-1 flex flex-col gap-2">
    {/* Content or Visualizations */}
  </div>
</div>`}</pre>
            </div>
          </section>

          {/* ── SECTION 10: MODALS VS DRAWERS ── */}
          <section id="drawers" className="w-full bg-white rounded-[8px] border border-[#EAEEF3] p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 border-b border-[#EAEEF3] pb-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE] flex items-center justify-center">
                <Layout className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#002E5D]">
                  10. Modal Popups vs Right Sliding Windows Policy
                </h2>
                <p className="text-xs text-[#7790A9] font-normal">
                  Strict UI guidelines for interactive forms vs simple read-only alerts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-[8px] bg-[#f0fdf4] border border-[#bbf7d0] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>DO: Sliding Windows (Right Drawers)</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  Use right-aligned sliding windows for <strong>ALL interactive user workflows</strong> (Create Dashboard, Add Widget Catalog, Edit Widget Settings, Form Entries). Include top header with icon box, scrollable body, and action footer.
                </p>
              </div>

              <div className="p-4 rounded-[8px] bg-[#fef2f2] border border-[#fecaca] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-red-800 font-semibold text-xs uppercase tracking-wider">
                  <XSquare className="w-4 h-4 text-red-600" />
                  <span>DON'T: Multi-Field Centered Modals</span>
                </div>
                <p className="text-xs text-red-950 leading-relaxed">
                  NEVER put complex forms, builders, catalog selectors, or editing fields inside centered popups. Centered popups are strictly reserved for simple read-only system notices, tooltips, and 1-click confirmation prompts.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 11: SIDEBAR & SCROLL ISOLATION ── */}
          <section id="sidebar" className="w-full bg-white rounded-[8px] border border-[#EAEEF3] p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 border-b border-[#EAEEF3] pb-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#ECF3FF] text-[#002E5D] border border-[#D4E4FE] flex items-center justify-center">
                <SidebarIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#002E5D]">
                  11. Sidebar & Panel Viewport Scroll Isolation Policy
                </h2>
                <p className="text-xs text-[#7790A9] font-normal">
                  Zero page scrolling chaining, fixed viewport positions, and `overscroll-contain`.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#F9FBFF] border border-[#D4E4FE] flex flex-col gap-2 text-xs text-[#576B81] leading-relaxed">
              <span className="font-semibold text-[#002E5D]">Fixed Screen Viewport Standard</span>
              <p>
                Both the Navigation Sidebar (`Sidebar.tsx`) and the TAI Chat Panel (`TaiChatPanel.tsx`) MUST be locked to the screen viewport (`fixed top-0 left-0 h-screen overflow-hidden`).
              </p>
              <p>
                To eliminate scroll chaining up to the main page body, panels enforce <code className="bg-white px-1.5 py-0.5 rounded border border-[#D4E4FE] font-mono text-[10px]">overscroll-none</code> on outer containers and <code className="bg-white px-1.5 py-0.5 rounded border border-[#D4E4FE] font-mono text-[10px]">overscroll-contain</code> on scrollable message containers.
              </p>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
