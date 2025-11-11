import type { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string | ReactNode;
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
      className={`bg-terminal-dark border border-slate-950/80 rounded-lg shadow-xl overflow-hidden inset-shadow-3xl  ${className}`}
    >
      {/* Window Chrome */}
      <div className="flex items-center justify-between px-4 py-3 bg-code-bg border-b border-slate-950/40 inset-shadow-sm inset-shadow-slate-950">
        {/* Chrome Controls */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-red-500 hover:w-5 hover:h-4" />
          <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-yellow-500 hover:w-5 hover:h-4" />
          <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-green-500 hover:w-5 hover:h-4" />
        </div>

        {/* Title */}
        <div className="relative left-1/2 -translate-x-1/2 font-mono text-xs text-terminal-muted">
          {title}
        </div>

        {/* Spacer for layout balance */}
        <div className="w-[52px]" />
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4">{children}</div>
    </div>
  );
}
