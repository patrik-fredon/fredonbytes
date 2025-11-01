# Dev-Themed UI/UX Refactor Specification

## Color Palette (NEW - Dev Theme)

### Primary Colors (60-30-10 Rule)
1. **Primary (60%) - Deep Terminal Dark**
   - Hex: `#0A0E27`
   - Usage: Backgrounds, main UI foundation, large areas
   - Inspiration: VS Code dark theme, professional terminal

2. **Secondary (30%) - Neon Cyan**  
   - Hex: `#00D9FF`
   - Usage: CTAs, highlights, interactive elements, links
   - Inspiration: Terminal prompts, syntax highlighting

3. **Accent (10%) - Electric Purple**
   - Hex: `#A855F7`
   - Usage: Success states, special highlights, brand moments
   - Inspiration: Function names in code editors

### Supporting Colors
- **Code Green:** `#10B981` (success, positive states)
- **Warning Amber:** `#F59E0B` (warnings, attention)
- **Error Red:** `#EF4444` (errors, destructive)
- **Neutral Grays:** 
  - `#1E293B` (slate-800)
  - `#334155` (slate-700)
  - `#64748B` (slate-500)
  - `#94A3B8` (slate-400)
  - `#CBD5E1` (slate-300)
  - `#F1F5F9` (slate-100)

### Glow Effects
- Cyan Glow: `0 0 20px rgba(0, 217, 255, 0.5)`
- Purple Glow: `0 0 20px rgba(168, 85, 247, 0.5)`
- Hover intensification: `0 0 30px rgba(0, 217, 255, 0.7)`

## Typography System

### Fonts
1. **UI Text:** Inter (keep existing)
2. **Code/Dev Elements:** JetBrains Mono or Fira Code
   - Use for: headings, numbers, technical terms, code blocks
   - Enable ligatures: `font-feature-settings: 'liga' 1, 'calt' 1`

### Type Scale
- **Hero:** 4.5rem / 72px
- **H1:** 3rem / 48px
- **H2:** 2.25rem / 36px
- **H3:** 1.875rem / 30px
- **H4:** 1.5rem / 24px
- **Body:** 1rem / 16px
- **Small:** 0.875rem / 14px
- **Code:** 0.9375rem / 15px (monospace)

## Design Tokens

### Terminal Window Elements
- 3-dot window controls (red, yellow, green)
- Window chrome borders
- Title bar with file names
- Line numbers for code
- Syntax highlighting colors

### Glassmorphism
- `backdrop-filter: blur(10px)`
- `background: rgba(10, 14, 39, 0.7)`
- Border: `1px solid rgba(0, 217, 255, 0.2)`

### Grid Patterns
- Background grid overlay: `linear-gradient(90deg, rgba(0,217,255,0.1) 1px, transparent 1px)`
- Grid size: 20px squares
- Subtle animation on scroll

## Animation System (Performance-First)

### Timing Tokens
- `instant`: 100ms
- `fast`: 180ms
- `normal`: 300ms
- `slow`: 500ms

### Easing Functions
- `default`: cubic-bezier(0.2, 0.8, 0.2, 1)
- `enter`: cubic-bezier(0.05, 0.8, 0.2, 1)
- `exit`: cubic-bezier(0.4, 0, 0.2, 1)

### Animation Rules
- ONLY animate `transform` and `opacity`
- Use `will-change` sparingly (only during animation)
- Respect `prefers-reduced-motion`
- No layout shift animations
- Intersection Observer for scroll animations

### Pattern Library
1. **Hover (180ms):**
   - Buttons: `scale(1.02)` + glow increase
   - Cards: `translateY(-4px)` + shadow enhance
   - Links: underline slide-in

2. **Press (100ms):**
   - Buttons: `scale(0.98)`

3. **Page Transition (300ms):**
   - Fade + slide up (20px)
   - Stagger children (60ms)

4. **Scroll Into View (400ms):**
   - Fade from 0 to 1
   - Translate Y from 30px to 0

## UI Element Specifications

### Terminal Window Component
- Dark background (#0A0E27)
- Top bar with 3 colored dots
- File name in title bar
- Border with subtle cyan glow
- Optional line numbers
- Syntax highlighted content

### Code Card
- Window chrome style
- Glassmorphic background
- Hover: enhanced glow + lift
- Monospace content
- Optional language badge

### Command Prompt Button
- Terminal prompt prefix: `$` or `>`
- Monospace text
- Cyan hover state with glow
- Press animation
- Border: 1px solid cyan

### Split Pane Layout
- Left/right sections
- Divider line (1px cyan)
- Editor aesthetic on left
- Preview aesthetic on right

### Grid Background
- Animated grid lines (subtle)
- Cyan color at 10% opacity
- Parallax effect on scroll
- Performance optimized (CSS only)

## Accessibility Requirements
- All colors meet WCAG AAA contrast ratios
- Focus states: cyan ring + glow
- Keyboard navigation support
- Screen reader friendly HTML
- Reduced motion support
- Touch targets: min 44x44px
- Alt text for all images
- Form labels and ARIA attributes
