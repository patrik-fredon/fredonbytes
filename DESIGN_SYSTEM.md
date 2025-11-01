# FredonBytes Design System - Dev Theme

**Version**: 2.0  
**Date**: November 1, 2025  
**Theme**: Coding/Development Focused

---

## 🎨 Color Palette

### Dark Theme (Default)

#### Background Layers
```css
--color-terminal-darker: #060A1F  /* Base background */
--color-terminal-dark: #0A0E27    /* Component background */
--color-code-bg: #1E293B          /* Code blocks */
```

#### Text Colors
```css
--color-terminal-light: #F1F5F9   /* Primary text (slate-100) */
--color-terminal-muted: #94A3B8   /* Secondary text (slate-400) */
--color-slate-300: #CBD5E1        /* Tertiary text */
```

#### Accent Colors
```css
--color-neon-cyan: #00D9FF        /* Primary accent */
--color-neon-purple: #A855F7      /* Secondary accent */
--color-code-green: #10B981       /* Success/code highlight */
--color-warning-amber: #F59E0B    /* Warnings */
--color-error-red: #EF4444        /* Errors */
```

### Light Theme

#### Background Layers
```css
--background: #F8FAFC             /* slate-50 - Base background */
--color-terminal-dark: #F8FAFC    /* Component background */
--color-terminal-darker: #F1F5F9  /* slate-100 - Elevated */
--color-code-bg: #F1F5F9          /* Code blocks */
```

#### Text Colors
```css
--color-terminal-light: #0F172A   /* slate-900 - Primary text */
--color-terminal-muted: #475569   /* slate-600 - Secondary text */
```

#### Accent Colors
```css
--color-neon-cyan: #0891B2        /* cyan-600 - Primary accent */
--color-neon-purple: #7C3AED      /* violet-600 - Secondary accent */
--color-code-green: #059669       /* emerald-600 - Success */
```

---

## 🔤 Typography

### Font Families
```css
--font-mono: var(--font-jetbrains-mono), 'JetBrains Mono', 'Fira Code', 'Courier New', monospace
--font-sans: var(--font-inter), system-ui, -apple-system, arial, sans-serif
```

### Font Sizes
```css
--font-size-xs: 0.75rem      /* 12px */
--font-size-sm: 0.875rem     /* 14px */
--font-size-base: 1rem       /* 16px */
--font-size-lg: 1.125rem     /* 18px */
--font-size-xl: 1.25rem      /* 20px */
--font-size-2xl: 1.5rem      /* 24px */
--font-size-3xl: 1.875rem    /* 30px */
--font-size-4xl: 2.25rem     /* 36px */
--font-size-5xl: 3rem        /* 48px */
--font-size-6xl: 3.75rem     /* 60px */
--font-size-hero: 4.5rem     /* 72px */
```

### Usage Guidelines
- **Headings**: Monospace with terminal-style decorators (`<`, `/>`, `//`)
- **Body Text**: Monospace for dev theme consistency
- **Code**: JetBrains Mono with ligatures enabled
- **Line Height**: 1.5 (normal), 1.25 (tight for headings), 1.625 (relaxed for long text)

---

## 🧩 Components

### GlassCard

**Purpose**: Primary container component with glassmorphism effect

**Variants**:
- `window`: With terminal window chrome (traffic lights, title bar)
- `card`: Simple glass container

**Glow Colors**:
- `cyan`: Neon cyan border and shadow
- `purple`: Neon purple border and shadow

**Usage**:
```tsx
<GlassCard variant="window" glowColor="cyan">
  <div className="space-y-4">
    {/* Content */}
  </div>
</GlassCard>
```

**Styling**:
- Background: `bg-glass-bg` (rgba with 0.85-0.95 opacity)
- Backdrop: `backdrop-blur-glass` (12px)
- Border: `border-neon-cyan/30` or `border-neon-purple/30` (30-40% opacity)
- Shadow: `shadow-glow-cyan` or `shadow-glow-purple`
- Hover: `hover:shadow-glow-cyan-intense` + `hover:-translate-y-1`

---

### Button

**Variants**:

1. **Gradient** (Primary CTA)
```tsx
<Button variant="gradient">Start Project</Button>
```
- Background: Linear gradient from cyan to purple
- Text: White
- Hover: Stronger glow + lift

2. **Neon Cyan** (Primary Action)
```tsx
<Button variant="neon-cyan">Submit</Button>
```
- Background: Solid neon cyan
- Text: Terminal dark
- Hover: Cyan glow + lift

3. **Neon Purple** (Secondary Action)
```tsx
<Button variant="neon-purple">Learn More</Button>
```
- Background: Solid neon purple
- Text: White
- Hover: Purple glow + lift

4. **Secondary** (Ghost with Border)
```tsx
<Button variant="secondary">Cancel</Button>
```
- Background: Transparent
- Border: Neon cyan
- Text: Neon cyan
- Hover: Subtle cyan glow

5. **Ghost** (Text Only)
```tsx
<Button variant="ghost">Skip</Button>
```
- Background: Transparent
- Text: Neon cyan
- Hover: Subtle background

**Sizes**:
- `sm`: Compact (py-2 px-4)
- `md`: Default (py-2.5 px-6)
- `lg`: Large (py-3 px-8)

**States**:
- Loading: Spinner icon, disabled
- Disabled: Opacity 50%, no hover
- Focus: Outline + glow

---

### TerminalWindow

**Purpose**: Code editor window with chrome

**Usage**:
```tsx
<TerminalWindow title="filename.ts">
  <code className="font-mono text-sm">
    {/* Code content */}
  </code>
</TerminalWindow>
```

**Features**:
- Window chrome with traffic light buttons (red, yellow, green)
- Title bar with filename
- Terminal-dark background
- Syntax highlighting support
- Line numbers optional

---

### GridBackground

**Purpose**: Animated grid pattern for page backgrounds

**Usage**:
```tsx
<div className="relative">
  <GridBackground />
  <div className="relative z-10">
    {/* Page content */}
  </div>
</div>
```

**Styling**:
- Grid lines: Neon cyan at 10% opacity
- Grid size: 20px
- Animation: Subtle pulse/fade
- Fixed position, full viewport

---

## 🎯 Common Patterns

### Terminal-Style Heading
```tsx
<h1 className="text-4xl font-mono font-bold">
  <span className="text-neon-cyan">{"< "}</span>
  Page Title
  <span className="text-neon-cyan">{" />"}</span>
</h1>
```

### Comment-Style Subtitle
```tsx
<p className="text-lg font-mono text-terminal-muted">
  <span className="text-neon-purple/70">{"// "}</span>
  Description or subtitle text
</p>
```

### Code-Style Decorator
```tsx
<div className="inline-block">
  <code className="text-sm font-mono text-code-green">
    {`{ status: "active" }`}
  </code>
</div>
```

### Terminal Prompt
```tsx
<span className="text-neon-cyan font-mono">$ </span>
<span className="text-terminal-light font-mono">command_name</span>
```

### Section Heading
```tsx
<h2 className="text-3xl font-mono font-bold mb-4">
  <span className="text-neon-cyan">{"< "}</span>
  Section
  <span className="text-neon-cyan">{" />"}</span>
</h2>
<p className="text-terminal-muted font-mono mb-8">
  <span className="text-neon-purple/70">{"// "}</span>
  Section description
</p>
```

---

## 🎨 Effects & Shadows

### Glow Effects
```css
/* Cyan Glow */
--glow-cyan-subtle: 0 0 10px rgba(0, 217, 255, 0.3)
--glow-cyan: 0 0 20px rgba(0, 217, 255, 0.5)
--glow-cyan-intense: 0 0 30px rgba(0, 217, 255, 0.7)

/* Purple Glow */
--glow-purple-subtle: 0 0 10px rgba(168, 85, 247, 0.3)
--glow-purple: 0 0 20px rgba(168, 85, 247, 0.5)
--glow-purple-intense: 0 0 30px rgba(168, 85, 247, 0.7)
```

### Box Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.5)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.6)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.7)

/* With Glow */
--shadow-glow-cyan: 0 0 20px rgba(0, 217, 255, 0.3), 0 4px 6px -1px rgb(0 0 0 / 0.5)
--shadow-glow-purple: 0 0 20px rgba(168, 85, 247, 0.3), 0 4px 6px -1px rgb(0 0 0 / 0.5)
```

### Usage
```tsx
/* Subtle hover effect */
className="shadow-glow-cyan-subtle hover:shadow-glow-cyan"

/* Strong emphasis */
className="shadow-glow-cyan-intense"

/* Interactive element */
className="shadow-md hover:shadow-glow-cyan transition-normal"
```

---

## 🎭 Animations

### Transition Durations
```css
--transition-instant: 100ms   /* Immediate feedback */
--transition-fast: 180ms      /* Quick interactions */
--transition-normal: 300ms    /* Standard transitions */
--transition-slow: 500ms      /* Dramatic effects */
--transition-spring: 400ms    /* Bouncy feel */
```

### Timing Functions
```css
--transition-timing-function-default: cubic-bezier(0.4, 0, 0.2, 1)  /* Ease-out */
--transition-timing-function-spring: cubic-bezier(0.34, 1.56, 0.64, 1)  /* Spring */
```

### Animation Guidelines
1. **GPU Accelerated Only**: Use `transform` and `opacity` only
2. **Viewport Triggers**: Use `once: true` for Framer Motion
3. **Reduced Motion**: Respect `prefers-reduced-motion`
4. **Performance**: Avoid animating width, height, top, left
5. **Stagger**: 0.15s between child elements

### Common Animations

**Card Entrance**:
```tsx
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};
```

**Hover Lift**:
```tsx
className="transition-normal hover:-translate-y-1"
```

**Glow Pulse**:
```tsx
className="transition-normal hover:shadow-glow-cyan-intense"
```

---

## 📐 Spacing & Layout

### Container Widths
```css
/* Responsive containers */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Spacing Scale
```css
/* Tailwind default scale */
0: 0
1: 0.25rem  /* 4px */
2: 0.5rem   /* 8px */
3: 0.75rem  /* 12px */
4: 1rem     /* 16px */
5: 1.25rem  /* 20px */
6: 1.5rem   /* 24px */
8: 2rem     /* 32px */
10: 2.5rem  /* 40px */
12: 3rem    /* 48px */
16: 4rem    /* 64px */
20: 5rem    /* 80px */
24: 6rem    /* 96px */
```

### Border Radius
```css
--radius: 0.375rem           /* 6px - Default */
--radius-terminal: 0.5rem    /* 8px - Terminal windows */
```

---

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Tablet portrait */
md: 768px   /* Tablet landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Grid Patterns

**2-Column with 2:1 Ratio**:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">{/* Main content */}</div>
  <div className="lg:col-span-1">{/* Sidebar */}</div>
</div>
```

**Responsive Card Grid**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

### Mobile-First Approach
```tsx
/* Mobile: default */
className="text-base"

/* Tablet and up */
className="text-base sm:text-lg"

/* Desktop */
className="text-base sm:text-lg lg:text-xl"
```

---

## ♿ Accessibility

### Color Contrast
- **Dark Theme**: All combinations meet WCAG AAA (7:1)
- **Light Theme**: Adjusted accent colors for AAA compliance
- **Focus States**: Always visible with 2px cyan outline + glow

### Interactive Elements
- **Minimum Size**: 44x44px touch targets
- **Focus Indicators**: Outline + glow on all interactive elements
- **Keyboard Navigation**: Tab order logical, skip links provided
- **Screen Readers**: Semantic HTML + ARIA labels

### Code Contrast Examples
```tsx
/* Good: High contrast */
className="bg-terminal-dark text-terminal-light"

/* Good: With accent */
className="bg-terminal-dark text-neon-cyan"

/* Check: May need adjustment in light mode */
className="bg-slate-100 text-cyan-600"
```

---

## 🎯 Implementation Checklist

### For New Components
- [ ] Use GlassCard for containers
- [ ] Apply monospace typography
- [ ] Add terminal-style decorators
- [ ] Include proper hover states
- [ ] Ensure WCAG AAA contrast
- [ ] Add focus indicators
- [ ] Support reduced motion
- [ ] Test responsive layouts
- [ ] Verify touch targets (≥44px)
- [ ] Add appropriate animations

### For Forms
- [ ] Terminal-dark background
- [ ] Neon borders (30% opacity default)
- [ ] Focus: full color + glow
- [ ] Monospace font
- [ ] Placeholder: terminal-muted
- [ ] Error state: red glow
- [ ] Success state: green glow
- [ ] 16px font size (prevent mobile zoom)

### For Pages
- [ ] GridBackground for backdrop
- [ ] Terminal-style headings
- [ ] Comment-style subtitles
- [ ] GlassCard for major sections
- [ ] Gradient button for primary CTA
- [ ] Secondary buttons for alternatives
- [ ] Viewport animations with `once: true`
- [ ] Proper spacing hierarchy

---

## 📚 References

- **Tailwind CSS v4**: [tailwindcss.com](https://tailwindcss.com)
- **Framer Motion**: [framer.com/motion](https://www.framer.com/motion/)
- **WCAG Guidelines**: [w3.org/WAI/WCAG22/quickref](https://www.w3.org/WAI/WCAG22/quickref/)
- **JetBrains Mono**: [jetbrains.com/mono](https://www.jetbrains.com/lp/mono/)

---

**Last Updated**: November 1, 2025  
**Maintained By**: FredonBytes Development Team
