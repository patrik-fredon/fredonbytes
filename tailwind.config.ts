import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Include CSS modules that might use Tailwind classes
    "./src/**/*.module.css",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Dev Theme Colors
        terminal: {
          dark: "var(--color-terminal-dark)",
          darker: "var(--color-terminal-darker)",
          light: "var(--color-terminal-light)",
          muted: "var(--color-terminal-muted)",
        },
        neon: {
          cyan: "var(--color-neon-cyan)",
          purple: "var(--color-electric-purple)",
        },
        code: {
          bg: "var(--color-code-bg)",
          highlight: "var(--color-code-highlight)",
        },
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
        "3xl": "var(--font-size-3xl)",
        "4xl": "var(--font-size-4xl)",
        "5xl": "var(--font-size-5xl)",
        "6xl": "var(--font-size-6xl)",
        hero: "var(--font-size-hero)",
      },
      lineHeight: {
        tight: "var(--line-height-tight)",
        normal: "var(--line-height-normal)",
        relaxed: "var(--line-height-relaxed)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-md)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "glow-cyan": "var(--shadow-glow-cyan)",
        "glow-cyan-subtle": "var(--glow-cyan-subtle)",
        "glow-cyan-intense": "var(--glow-cyan-intense)",
        "glow-purple": "var(--shadow-glow-purple)",
        "glow-purple-subtle": "var(--glow-purple-subtle)",
        "glow-purple-intense": "var(--glow-purple-intense)",
      },
      insetShadow: {
        "inset-shadow-sm": "var(--inset-shadow-sm)",
      },
      transitionDuration: {
        instant: "100ms",
        fast: "180ms",
        normal: "300ms",
        slow: "500ms",
        spring: "400ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      backdropBlur: {
        glass: "12px",
      },
      zIndex: {
        base: "0",
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
      },
    },
  },
  plugins: [],
};

export default config;
