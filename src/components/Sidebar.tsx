"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Category,
  ClipboardText,
  Danger,
  Setting2,
  ProfileCircle,
} from "iconsax-react";
import { Sun, Moon } from "lucide-react";
import AiIcon from "@/components/icons/AiIcon";
import { useDashboard } from "@/context/DashboardContext";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
}

export interface SidebarProps {
  activeId?: string;
  onSelectNav?: (id: string) => void;
  className?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { icon: AiIcon, label: "AI Insights", id: "ai", href: "/ai" },
  { icon: Category, label: "Widgets", id: "widgets", href: "/" },
  { icon: ClipboardText, label: "Cases", id: "cases", href: "/cases" },
  { icon: Danger, label: "Alerts", id: "alerts", href: "/alerts" },
];

export default function Sidebar({
  activeId: propActiveId,
  onSelectNav,
  className = "",
}: SidebarProps) {
  const pathname = usePathname();
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const [internalActiveId, setInternalActiveId] = useState("widgets");
  const [localDarkMode, setLocalDarkMode] = useState(false);

  // Safely consume Dashboard Context if available
  let contextValue: ReturnType<typeof useDashboard> | null = null;
  try {
    contextValue = useDashboard();
  } catch (e) {
    contextValue = null;
  }

  const isCollapsed = contextValue ? contextValue.isSidebarCollapsed : localCollapsed;
  const isDark = contextValue ? contextValue.isDarkMode : localDarkMode;

  useEffect(() => {
    if (!contextValue && typeof window !== "undefined") {
      const savedDark = localStorage.getItem("tai_dark_mode_active") === "true";
      setLocalDarkMode(savedDark);
      if (savedDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, [contextValue]);

  const toggleDarkMode = () => {
    if (contextValue) {
      contextValue.toggleDarkMode();
    } else {
      setLocalDarkMode((prev) => {
        const next = !prev;
        if (typeof window !== "undefined") {
          localStorage.setItem("tai_dark_mode_active", String(next));
          if (next) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
        return next;
      });
    }
  };

  const toggleCollapse = () => {
    if (contextValue) {
      contextValue.toggleSidebarCollapse();
    } else {
      setLocalCollapsed((prev) => !prev);
    }
  };

  // Determine current active item
  const currentActiveId =
    propActiveId ||
    (pathname === "/ai"
      ? "ai"
      : pathname === "/alerts"
      ? "alerts"
      : pathname === "/cases" || pathname?.startsWith("/cases/")
      ? "cases"
      : pathname === "/design-system"
      ? "design-system"
      : internalActiveId);

  const handleNavClick = (id: string) => {
    setInternalActiveId(id);
    if (onSelectNav) onSelectNav(id);
  };

  // When COLLAPSED: Sidebar rail occupies 0px layout space in the main content body.
  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={toggleCollapse}
        className={`sidebar-relocated-logo fixed top-0 left-0 z-50 w-14 md:w-16 h-[49px] bg-[#031d3d] flex items-center justify-center cursor-pointer shadow-xs border-b border-r border-[#002E5D] hover:bg-[#002E5D] transition-all ${className}`}
        title="Expand Navigation Sidebar"
      >
        <img
          src="/tacbot-logo-white.svg"
          alt="Tacbot Logo"
          className="w-5 h-6 md:w-6 md:h-7 object-contain"
        />
      </button>
    );
  }

  return (
    <>
      {/* 68px Layout Spacer for OPEN sidebar state */}
      <div className="shrink-0 w-14 md:w-16 h-screen pointer-events-none" />

      {/* Vertical Navigation Sidebar Rail (OPEN State: 68px wide) */}
      <aside
        aria-label="Main Product Navigation"
        className={`fixed top-0 left-0 z-40 shrink-0 w-14 md:w-16 h-screen bg-[#031d3d] flex flex-col items-center justify-between py-4 px-2 select-none border-r border-[#002E5D]/50 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${className}`}
      >
        {/* Top Logo Button (Clicking it collapses/removes the sidebar) */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="flex items-center justify-center p-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-hidden"
          title="Collapse Navigation Sidebar"
        >
          <img
            src="/tacbot-logo-white.svg"
            alt="Tacbot Logo"
            className="w-6 h-7 md:w-7 md:h-8 object-contain"
          />
        </button>

        {/* Navigation Icons Column */}
        <div className="w-full flex-1 flex flex-col items-center justify-between mt-6">
          <nav className="w-full flex flex-col items-center gap-2.5">
            {NAV_ITEMS.map(({ icon: Icon, label, id, href }) => {
              const isActive = currentActiveId === id;

              const isAiItem = id === "ai";
              const buttonContent = (
                <button
                  type="button"
                  onClick={() => handleNavClick(id)}
                  title={label}
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-[4px] flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? isAiItem
                        ? "text-white bg-[linear-gradient(135deg,#7c3aed_0%,#4f46e5_50%,#2563eb_100%)] shadow-md"
                        : "text-white bg-[#002E5D] shadow-xs"
                      : "text-[#7097c2] hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} color="currentColor" variant={isActive ? "Bold" : "Linear"} />
                </button>
              );

              if (href && href !== pathname) {
                return (
                  <Link
                    key={id}
                    href={href}
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        sessionStorage.removeItem("taiReturnUrl");
                        sessionStorage.removeItem("taiChatAutoOpen");
                      }
                    }}
                    className="w-full flex justify-center"
                  >
                    {buttonContent}
                  </Link>
                );
              }

              return <React.Fragment key={id}>{buttonContent}</React.Fragment>;
            })}
          </nav>

          {/* Bottom Pinned Action Icons */}
          <div className="w-full flex flex-col items-center gap-2.5 pt-2 border-t border-[#002E5D]/60 mt-auto">
            {/* Settings Icon -> Links to Design System Specs & Settings */}
            <Link
              href="/design-system"
              title="Design System & Settings"
              className="w-full flex justify-center"
            >
              <button
                type="button"
                className={`w-9 h-9 md:w-10 md:h-10 rounded-[4px] flex items-center justify-center transition-all cursor-pointer ${
                  pathname === "/design-system"
                    ? "text-white bg-[#002E5D] shadow-xs"
                    : "text-[#7097c2] hover:text-white hover:bg-white/10"
                }`}
              >
                <Setting2 size={20} color="currentColor" variant={pathname === "/design-system" ? "Bold" : "Linear"} />
              </button>
            </Link>

            {/* Profile Icon */}
            <button
              type="button"
              title="Profile"
              className="w-9 h-9 md:w-10 md:h-10 rounded-[4px] flex items-center justify-center text-[#7097c2] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ProfileCircle size={22} color="currentColor" variant="Linear" />
            </button>

            {/* Dark Mode Toggle Button (Pinned directly below Profile icon) */}
            <button
              type="button"
              onClick={toggleDarkMode}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-[4px] flex items-center justify-center transition-all cursor-pointer ${
                isDark
                  ? "text-amber-400 hover:text-amber-300 hover:bg-white/10"
                  : "text-[#7097c2] hover:text-white hover:bg-white/10"
              }`}
            >
              {isDark ? (
                <Sun className="w-5 h-5 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 transition-transform hover:-rotate-12" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
