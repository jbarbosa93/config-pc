"use client";

import { motion } from "framer-motion";

export default function Logo({ size = "default" }: { size?: "small" | "default" }) {
  const scale = size === "small" ? 0.8 : 1;

  return (
    <motion.div
      className="flex items-center gap-2 select-none cursor-pointer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      style={{ transformOrigin: "center" }}
    >
      {/* Icon: CPU chip stylisé */}
      <motion.svg
        width={28 * scale}
        height={28 * scale}
        viewBox="0 0 28 28"
        fill="none"
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
      >
        {/* Chip body */}
        <rect x="6" y="6" width="16" height="16" rx="3" fill="#0A0A0A" />
        {/* Inner circuit */}
        <rect x="10" y="10" width="8" height="8" rx="1.5" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
        {/* Pins top */}
        <rect x="10" y="3" width="2" height="4" rx="1" fill="#0A0A0A" />
        <rect x="16" y="3" width="2" height="4" rx="1" fill="#0A0A0A" />
        {/* Pins bottom */}
        <rect x="10" y="21" width="2" height="4" rx="1" fill="#0A0A0A" />
        <rect x="16" y="21" width="2" height="4" rx="1" fill="#0A0A0A" />
        {/* Pins left */}
        <rect x="3" y="10" width="4" height="2" rx="1" fill="#0A0A0A" />
        <rect x="3" y="16" width="4" height="2" rx="1" fill="#0A0A0A" />
        {/* Pins right */}
        <rect x="21" y="10" width="4" height="2" rx="1" fill="#0A0A0A" />
        <rect x="21" y="16" width="4" height="2" rx="1" fill="#0A0A0A" />
        {/* Center dot */}
        <circle cx="14" cy="14" r="2" fill="#FFFFFF" />
      </motion.svg>

      {/* Text */}
      <span style={{ fontSize: 16 * scale }} className="font-bold tracking-tight">
        Config<span className="font-bold">PC</span>
        <span className="text-text-secondary">.ch</span>
      </span>
    </motion.div>
  );
}
