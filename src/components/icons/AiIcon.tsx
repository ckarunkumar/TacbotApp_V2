"use client";

import React from "react";

export interface AiIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  variant?: "Linear" | "Bold";
  className?: string;
}

/**
 * Custom AI Spark Icon designed in the exact style of Iconsax.
 * Matches 24x24 viewBox grid, 1.5px stroke geometry, and smooth curve joins.
 */
export default function AiIcon({
  size = 24,
  color = "currentColor",
  variant = "Linear",
  className = "",
  ...props
}: AiIconProps) {
  const isBold = variant === "Bold";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {isBold ? (
        <>
          {/* Main AI Center Spark */}
          <path
            d="M12 2C12 6.97 7.03 12 2 12C7.03 12 12 17.03 12 22C12 17.03 16.97 12 22 12C16.97 12 12 6.97 12 2Z"
            fill={color}
          />
          {/* Small Top Right Secondary Spark */}
          <path
            d="M19 2C19 3.66 17.66 5 16 5C17.66 5 19 6.34 19 8C19 6.34 20.34 5 22 5C20.34 5 19 3.66 19 2Z"
            fill={color}
          />
        </>
      ) : (
        <>
          {/* Main AI Center Spark */}
          <path
            d="M12 2C12 6.97 7.03 12 2 12C7.03 12 12 17.03 12 22C12 17.03 16.97 12 22 12C16.97 12 12 6.97 12 2Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Small Top Right Secondary Spark */}
          <path
            d="M19 2C19 3.66 17.66 5 16 5C17.66 5 19 6.34 19 8C19 6.34 20.34 5 22 5C20.34 5 19 3.66 19 2Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
