import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  variant?: "window" | "card";
  glowColor?: "cyan" | "purple";
  strongGlow?: boolean;
  className?: string;
}

export default function GlassCard({
  children,
  variant = "card",
  glowColor = "cyan",
  strongGlow = false,
  className = "",
}: GlassCardProps) {
  const borderColor =
    glowColor === "cyan" ? "border-neon-cyan/35" : "border-neon-purple/35";
  const shadowClass = strongGlow
    ? glowColor === "cyan" ? " inset-shadow-3xl inset-shadow-neon-cyan/80" : "inset-shadow-3xl inset-shadow-neon-purple/80"
    : glowColor === "cyan" ? "inset-shadow-3xl inset-shadow-neon-cyan/80 " : "inset-shadow-3xl inset-shadow-neon-purple/80";
  const hoverShadow = strongGlow
    ? glowColor === "cyan" ? "hover:shadow-glow-cyan-strong hover:border-neon-cyan/50" : "hover:shadow-glow-purple-strong hover:border-neon-purple/50"
    : glowColor === "cyan" ? "hover:shadow-glow-cyan-strong hover:border-neon-cyan/50" : "hover:shadow-glow-purple-strong hover:border-neon-purple/50";

  return (
    <div
      className={`
        relative
        bg-glass-bg backdrop-blur-glass 
        border ${borderColor} 
        shadow-lg
        rounded-xl 
        ${shadowClass} ${hoverShadow}
        hover:-translate-y-1
        transition-normal
        ${variant === "window" ? "overflow-hidden" : ""}
        ${className}
      `}
    >
      {variant === "window" && (
        <div className="flex items-center gap-2 px-4 py-3 ">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
      )}
      <div className={variant === "window" ? "p-4" : "p-6"}>{children}</div>
    </div>
  );
}
