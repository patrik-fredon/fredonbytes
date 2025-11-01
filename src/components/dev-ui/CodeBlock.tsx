"use client";

import { useState } from "react";

interface CodeBlockProps {
  language?: string;
  children: string;
  showLineNumbers?: boolean;
  showCopy?: boolean;
  className?: string;
}

export default function CodeBlock({
  language = "text",
  children,
  showLineNumbers = false,
  showCopy = true,
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = children.split("\n");

  return (
    <div className={`relative group ${className}`}>
      {/* Language Badge */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <span className="px-2 py-1 text-xs font-mono bg-terminal-darker border border-neon-cyan/30 rounded text-neon-cyan">
          {language}
        </span>
        {showCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className="px-2 py-1 text-xs font-mono bg-terminal-darker border border-neon-cyan/30 rounded text-neon-cyan hover:bg-neon-cyan/10 transition-fast"
            aria-label="Copy code"
          >
            {copied ? "✓" : "Copy"}
          </button>
        )}
      </div>

      {/* Code Content */}
      <pre className="bg-code-bg border border-neon-cyan/20 rounded-lg p-4 overflow-x-auto shadow-glow-cyan font-mono text-sm leading-relaxed">
        <code className="text-terminal-light">
          {showLineNumbers ? (
            <div className="flex">
              {/* Line Numbers */}
              <div className="select-none pr-4 text-terminal-muted border-r border-neon-cyan/10 mr-4">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              {/* Code Lines */}
              <div className="flex-1">
                {lines.map((line, i) => (
                  <div key={i}>{line || " "}</div>
                ))}
              </div>
            </div>
          ) : (
            children
          )}
        </code>
      </pre>
    </div>
  );
}
