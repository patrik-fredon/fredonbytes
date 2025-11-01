"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CommandButtonProps {
  variant?: "cyan" | "purple";
  prefix?: "$" | ">";
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function CommandButton({
  variant = "cyan",
  prefix = "$",
  children,
  onClick,
  className = "",
  disabled = false,
}: CommandButtonProps) {
  const colorClasses =
    variant === "cyan"
      ? "border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-glow-cyan"
      : "border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10 hover:shadow-glow-purple";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        flex items-center gap-2
        px-4 py-2
        font-mono text-sm
        border rounded
        transition-fast
        disabled:opacity-50 disabled:cursor-not-allowed
        ${colorClasses}
        ${className}
      `}
    >
      <span className="opacity-70">{prefix}</span>
      {children}
    </motion.button>
  );
}
