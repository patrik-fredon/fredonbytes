import type { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function TerminalWindow({
  title = "terminal",
  children,
  className = "",
}: TerminalWindowProps) {
  return (
    <div
      className={`bg-terminal-dark border border-neon-cyan/20 rounded-lg overflow-hidden shadow-glow-cyan-subtle ${className}`}
    >
      {/* Window Chrome */}
      <div className="flex items-center justify-between px-4 py-3 bg-terminal-darker border-b border-neon-cyan/10">
        {/* Chrome Controls */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        {/* Title */}
        <div className="relative left-1/2 -translate-x-1/2 font-mono text-sm text-terminal-muted">
          {title}
        </div>

        {/* Spacer for layout balance */}
        <div className="w-[52px]" />
      </div>

      {/* Content */}
      <div className="p-4">{children}</div>
    </div>
  );
}
