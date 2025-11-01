"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Read theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className="relative w-10 h-10 rounded-lg bg-terminal-dark/50 border border-neon-cyan/20"
        aria-label="Toggle theme"
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-10 h-10 rounded-lg
        bg-terminal-dark/50 
        border border-neon-cyan/30
        hover:border-neon-cyan/50
        hover:shadow-glow-cyan-subtle
        transition-all duration-300
        flex items-center justify-center
        group
        focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:ring-offset-2 focus:ring-offset-terminal-darker
      "
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {/* Theme icons with rotation animation */}
      <div className="relative w-5 h-5">
        <Sun
          className={`
            absolute inset-0 w-5 h-5 text-neon-cyan
            transition-all duration-300 transform
            ${theme === "light" ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}
          `}
        />
        <Moon
          className={`
            absolute inset-0 w-5 h-5 text-neon-purple
            transition-all duration-300 transform
            ${theme === "dark" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}
          `}
        />
      </div>

      {/* Subtle glow effect on hover */}
      <div 
        className="
          absolute inset-0 rounded-lg
          bg-gradient-to-r from-neon-cyan/0 to-neon-purple/0
          group-hover:from-neon-cyan/5 group-hover:to-neon-purple/5
          transition-all duration-300
        " 
      />
    </button>
  );
}
