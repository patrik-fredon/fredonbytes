"use client";

import {
  ExternalLink,
  Github,
  Globe,
  Headphones,
  User,
  Library,
} from "lucide-react";
import React from "react";

interface LinkCardProps {
  title: string;
  description?: string;
  url: string;
  icon?: string;
  external?: boolean;
  className?: string;
  stats?: {
    repos?: number;
    commits?: number;
    stars?: number;
  };
}

export default function LinkCard({
  title,
  description,
  url,
  icon,
  external = true,
  className = "",
  stats,
}: LinkCardProps) {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "github":
        return <Github className="w-6 h-6" />;
      case "portfolio":
        return <User className="w-6 h-6" />;
      case "gallery":
        return <Library className="w-6 h-6" />;
      case "support":
        return <Headphones className="w-6 h-6" />;
      case "website":
        return <Globe className="w-6 h-6" />;
      default:
        return <ExternalLink className="w-6 h-6" />;
    }
  };

  return (
    <a
      href={url}
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : undefined}
      className={`block transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] ${className}`}
    >
      <div className="bg-terminal-dark rounded-2xl p-6 shadow-glow-cyan-subtle hover:shadow-glow-cyan-intense transition-all duration-300 border border-neon-cyan/20 group">
        <div className="flex items-center space-x-4">
          {/* Icon */}
          <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-neon-cyan to-electric-purple rounded-xl flex items-center justify-center text-white border border-neon-cyan/30 shadow-glow-cyan-subtle transition-all duration-200 group-hover:rotate-[5deg] group-hover:scale-110">
            {getIcon(icon)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white group-hover:text-neon-cyan transition-colors duration-[180ms] font-mono">
              {title}
            </h3>
            {description && (
              <p className="text-slate-400 text-sm mt-1 leading-relaxed font-mono">
                {description}
              </p>
            )}

            {/* Stats for GitHub repositories */}
            {stats && (
              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400 font-mono">
                {stats.repos && (
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-neon-cyan rounded-full shadow-glow-cyan-subtle"></span>
                    <span>{stats.repos} repos</span>
                  </span>
                )}
                {stats.commits && (
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-code-green rounded-full shadow-glow-green-subtle"></span>
                    <span>{stats.commits} commits</span>
                  </span>
                )}
                {stats.stars && (
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-warning-amber rounded-full"></span>
                    <span>{stats.stars} stars</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* External Link Indicator */}
          {external && (
            <div className="shrink-0 text-slate-400 group-hover:text-neon-cyan transition-all duration-200 group-hover:rotate-[5deg] group-hover:scale-110">
              <ExternalLink className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
