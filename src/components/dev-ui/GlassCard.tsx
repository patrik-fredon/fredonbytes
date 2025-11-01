import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  variant?: "window" | "card";
  glowColor?: "cyan" | "purple";
  className?: string;
}

export default function GlassCard({
  children,
  variant = "card",
  glowColor = "cyan",
  className = "",
}: GlassCardProps) {
  const borderColor =
    glowColor === "cyan" ? "border-neon-cyan/20" : "border-neon-purple/20";
  const shadowClass =
    glowColor === "cyan" ? "shadow-glow-cyan-subtle" : "shadow-glow-purple-subtle";
  const hoverShadow =
    glowColor === "cyan" ? "hover:shadow-glow-cyan" : "hover:shadow-glow-purple";

  return (
    <div
      className={`
        bg-glass-bg backdrop-blur-glass 
        border ${borderColor} 
        rounded-lg 
        ${shadowClass} ${hoverShadow}
        hover:-translate-y-1
        transition-normal
        ${variant === "window" ? "overflow-hidden" : ""}
        ${className}
      `}
    >
      {variant === "window" && (
        <div className="flex items-center gap-2 px-4 py-3 bg-terminal-darker/50 border-b border-neon-cyan/10">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
      )}
      <div className={variant === "window" ? "p-4" : "p-6"}>{children}</div>
    </div>
  );
}
