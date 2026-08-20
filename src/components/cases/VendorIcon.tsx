"use client";

import React from "react";

export type VendorType =
  | "Arista"
  | "Cisco"
  | "Paloalto"
  | "Palo Alto"
  | "Juniper"
  | "Aruba"
  | "AWS"
  | "Fortinet"
  | "F5"
  | "Others";

interface VendorIconProps {
  vendor: string;
  className?: string;
  size?: number;
}

export default function VendorIcon({
  vendor,
  className = "",
  size = 20,
}: VendorIconProps) {
  const norm = vendor.toLowerCase().trim();

  // ── Arista Networks Official Logo ──
  if (norm.includes("arista")) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center ${className}`}
        style={{ width: size * 1.3, height: size }}
      >
        <svg
          viewBox="0 0 48 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Arista Triple Lozenge Wing Chevron */}
          <path
            d="M4 19L14 5L24 19H19.5L14 11.2L8.5 19H4Z"
            fill="#E2231A"
          />
          <path
            d="M16 19L26 5L36 19H31.5L26 11.2L20.5 19H16Z"
            fill="#002E5D"
          />
          <path
            d="M28 19L38 5L48 19H43.5L38 11.2L32.5 19H28Z"
            fill="#E2231A"
          />
        </svg>
      </div>
    );
  }

  // ── Cisco Official Bridge Logo (With classic signal bars & cisco wordmark) ──
  if (norm.includes("cisco")) {
    return (
      <div
        className={`shrink-0 flex flex-col items-center justify-center rounded-[3px] bg-[#ECF7FC] dark:bg-[#049fd9]/20 border border-[#BCE1F5] dark:border-[#049fd9]/40 p-0.5 ${className}`}
        style={{ width: size * 1.1, height: size }}
      >
        <svg
          viewBox="0 0 24 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M2 9V13M5 6V13M8 3V13M11 1V13M13 1V13M16 3V13M19 6V13M22 9V13"
            stroke="#049FD9"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[5.5px] font-black tracking-tighter text-[#049FD9] uppercase leading-none mt-0.5">
          cisco
        </span>
      </div>
    );
  }

  // ── Palo Alto Networks Official Geometric Logo ──
  if (norm.includes("palo")) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-[3px] bg-[#FFF2EE] dark:bg-[#FA582D]/20 border border-[#FDCBBF] dark:border-[#FA582D]/40 p-0.5 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Interlocking geometric diagonals */}
          <path
            d="M5 5L19 19M19 5L5 19M12 2V22M2 12H22"
            stroke="#FA582D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="#FA582D" />
        </svg>
      </div>
    );
  }

  // ── Juniper Networks Official Interlocking Logo ──
  if (norm.includes("juniper")) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-[3px] bg-[#E8F6EF] dark:bg-[#008559]/20 border border-[#BDE7D4] dark:border-[#008559]/40 p-0.5 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M3 5H7.5V14C7.5 15.66 6.16 17 4.5 17H3V14.5H4.5C4.78 14.5 5 14.28 5 14V7.5H3V5Z"
            fill="#008559"
          />
          <path
            d="M21 5H16.5V14C16.5 15.66 17.84 17 19.5 17H21V14.5H19.5C19.22 14.5 19 14.28 19 14V7.5H21V5Z"
            fill="#008559"
          />
          <path
            d="M9.5 5H14.5V19H9.5V5Z"
            fill="#008559"
          />
        </svg>
      </div>
    );
  }

  // ── Aruba Networks Official Chevron / Wave Logo ──
  if (norm.includes("aruba")) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-[3px] bg-[#FFF4E6] dark:bg-[#FF8300]/20 border border-[#FDD9B0] dark:border-[#FF8300]/40 p-0.5 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M3 17C6.5 10 10.5 8 14.5 10C17 11.2 19 13.8 21 17"
            stroke="#FF8300"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="10.5" cy="7.5" r="2.8" fill="#FF8300" />
          <circle cx="17.5" cy="11.5" r="2.2" fill="#FF8300" />
        </svg>
      </div>
    );
  }

  // ── Amazon Web Services (AWS) Official Logo & Smile ──
  if (norm.includes("aws") || norm.includes("amazon")) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-[3px] bg-[#FFF8E6] dark:bg-[#FF9900]/20 border border-[#FFE4A3] dark:border-[#FF9900]/40 p-0.5 ${className}`}
        style={{ width: size * 1.25, height: size }}
      >
        <svg
          viewBox="0 0 32 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <text
            x="3"
            y="12"
            fill="#232F3E"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.5px"
          >
            aws
          </text>
          {/* AWS Orange Arrow Smile */}
          <path
            d="M4 15.5C10 19 18 19 25 15"
            stroke="#FF9900"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M23 13L26 15L23.5 17.5"
            fill="#FF9900"
            stroke="#FF9900"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  // ── Fortinet Official 8-Segment Red Block Logo ──
  if (norm.includes("fortinet")) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-[3px] bg-[#FDEAE8] dark:bg-[#EE3124]/20 border border-[#FABDB7] dark:border-[#EE3124]/40 p-0.5 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect x="3" y="4" width="4.5" height="4.5" rx="1" fill="#EE3124" />
          <rect x="9.75" y="4" width="4.5" height="4.5" rx="1" fill="#EE3124" />
          <rect x="16.5" y="4" width="4.5" height="4.5" rx="1" fill="#EE3124" />
          <rect x="6.35" y="9.75" width="4.5" height="4.5" rx="1" fill="#EE3124" />
          <rect x="13.15" y="9.75" width="4.5" height="4.5" rx="1" fill="#EE3124" />
          <rect x="3" y="15.5" width="4.5" height="4.5" rx="1" fill="#EE3124" />
          <rect x="9.75" y="15.5" width="4.5" height="4.5" rx="1" fill="#EE3124" />
          <rect x="16.5" y="15.5" width="4.5" height="4.5" rx="1" fill="#EE3124" />
        </svg>
      </div>
    );
  }

  // ── F5 Networks Official Red Circle Logo ──
  if (norm.includes("f5")) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="12" cy="12" r="11" fill="#E22525" />
          <text
            x="12"
            y="16"
            fill="white"
            fontSize="11"
            fontWeight="900"
            fontStyle="italic"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            f5
          </text>
        </svg>
      </div>
    );
  }

  // Fallback
  return (
    <div
      className={`shrink-0 rounded-[3px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold ${className}`}
      style={{ width: size, height: size }}
    >
      {vendor.charAt(0).toUpperCase()}
    </div>
  );
}
