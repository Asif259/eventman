"use client";

import { cn } from "@/lib/utils";

/**
 * Verified PRO badge — a glowing #CCFF00 badge shown next to Pro user names.
 * @param {"sm" | "md" | "lg"} size - Badge size variant
 * @param {string} className - Additional classes
 */
export default function ProBadge({ size = "sm", className }) {
  const sizes = {
    sm: "text-[9px] px-1.5 py-[1px] gap-0.5",
    md: "text-[10px] px-2 py-0.5 gap-1",
    lg: "text-xs px-2.5 py-1 gap-1",
  };

  const iconSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-bold uppercase tracking-wider rounded-full",
        "bg-[#CCFF00] text-black",
        "shadow-[0_0_8px_rgba(204,255,0,0.4)]",
        sizes[size],
        className
      )}
    >
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className={iconSizes[size]}
      >
        <path d="M8 0L10.2 5.4L16 6.3L11.9 10.2L12.9 16L8 13.4L3.1 16L4.1 10.2L0 6.3L5.8 5.4L8 0Z" />
      </svg>
      PRO
    </span>
  );
}
