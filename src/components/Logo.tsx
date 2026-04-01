"use client";

import { motion } from "framer-motion";

export default function Logo({ size = "default" }: { size?: "small" | "default" }) {
  const scale = size === "small" ? 0.82 : 1;
  const iconSize = 40 * scale;
  const fontSize = 20 * scale;

  return (
    <motion.div
      className="flex items-center gap-3 select-none cursor-pointer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      style={{ transformOrigin: "left center" }}
    >
      {/* Chip icon */}
      <svg width={iconSize} height={iconSize} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chipGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7B9EE8" />
            <stop offset="100%" stopColor="#6B7AE8" />
          </linearGradient>
          <linearGradient id="innerGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8EAAEF" />
            <stop offset="100%" stopColor="#7B8FE8" />
          </linearGradient>
        </defs>

        {/* Chip body — dark navy rounded square */}
        <rect x="7" y="7" width="26" height="26" rx="5" fill="#131929" />

        {/* Pins — top */}
        <rect x="13" y="3" width="3" height="5" rx="1.5" fill="#6B9EE8" />
        <rect x="20" y="3" width="3" height="5" rx="1.5" fill="#6B9EE8" />
        <rect x="27" y="3" width="3" height="5" rx="1.5" fill="#6B9EE8" />
        {/* Pins — bottom */}
        <rect x="13" y="32" width="3" height="5" rx="1.5" fill="#6B9EE8" />
        <rect x="20" y="32" width="3" height="5" rx="1.5" fill="#6B9EE8" />
        <rect x="27" y="32" width="3" height="5" rx="1.5" fill="#6B9EE8" />
        {/* Pins — left */}
        <rect x="3" y="13" width="5" height="3" rx="1.5" fill="#6B9EE8" />
        <rect x="3" y="20" width="5" height="3" rx="1.5" fill="#6B9EE8" />
        <rect x="3" y="27" width="5" height="3" rx="1.5" fill="#6B9EE8" />
        {/* Pins — right */}
        <rect x="32" y="13" width="5" height="3" rx="1.5" fill="#6B9EE8" />
        <rect x="32" y="20" width="5" height="3" rx="1.5" fill="#6B9EE8" />
        <rect x="32" y="27" width="5" height="3" rx="1.5" fill="#6B9EE8" />

        {/* Inner gradient card */}
        <rect x="11" y="11" width="18" height="18" rx="4" fill="url(#chipGrad)" />

        {/* Inner white square */}
        <rect x="15" y="15" width="10" height="10" rx="2.5" fill="white" />

        {/* Center dot */}
        <rect x="18" y="18" width="4" height="4" rx="1" fill="#131929" />
      </svg>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span style={{ fontSize, lineHeight: 1 }} className="font-bold tracking-tight text-[#131929]">
          config-pc<span style={{ color: "#5B8FE8" }}>.ch</span>
        </span>
      </div>
    </motion.div>
  );
}
