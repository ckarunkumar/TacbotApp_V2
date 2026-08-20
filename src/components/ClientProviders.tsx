"use client";

import React, { useEffect } from "react";
import { DashboardProvider } from "@/context/DashboardContext";

function ThemeSync() {
  useEffect(() => {
    // Initial check on hydration
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("tai_dark_mode_active") === "true";
      if (isDark) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
  }, []);

  return null;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <ThemeSync />
      {children}
    </DashboardProvider>
  );
}
