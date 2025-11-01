# UI/UX Dev-Theme Refactoring - Implementation Plan

**Date**: November 1, 2025  
**Goal**: Refactor entire project to clean, comprehensive dev-themed UI/UX with light/dark theme support

---

## 🎯 Objectives

1. ✅ Consistent dev-themed design across all components
2. ✅ Light/dark theme system with footer switcher
3. ✅ Fix header navigation hover issues
4. ✅ Better background/component visual contrast
5. ✅ Optimized ISR/SSR rendering, minimal client-side
6. ✅ Fast loading, clean code, no duplicates

---

## 🎨 Design System

### Color Palette

**Dark Theme (Default)**:
- Background: `#060A1F` (terminal-darker)
- Components: `#0A0E27` (terminal-dark)
- Accents: `#00D9FF` (neon-cyan), `#A855F7` (neon-purple)
- Text: `#F1F5F9` (terminal-light), `#94A3B8` (terminal-muted)
- Code: `#10B981` (code-green)

**Light Theme**:
- Background: `#F8FAFC` (slate-50)
- Components: `#F1F5F9` (slate-100)
- Accents: `#0891B2` (cyan-600), `#7C3AED` (violet-600)
- Text: `#0F172A` (slate-900), `#475569` (slate-600)

### Typography
- Primary: JetBrains Mono (monospace)
- Fallback: 'Fira Code', 'Courier New', monospace

### Components
- **GlassCard**: Base container with glassmorphism effect
- **TerminalWindow**: Code/terminal window with chrome
- **Button**: Gradient, solid cyan, solid purple, secondary, ghost variants
- **GridBackground**: Animated grid pattern backdrop

---

## 📋 Implementation Tasks

### Phase 1: Core Theme System (Foundation)

#### 1.1 Enhance globals.css with light theme
**File**: `src/app/globals.css`
- Add `[data-theme="light"]` section with inverted colors
- Increase border opacity: 20% → 30-40%
- Strengthen box-shadows for better component separation
- Adjust glass-bg opacity: 0.7 → 0.85-0.95
- Ensure WCAG AAA compliance both themes

#### 1.2 Create ThemeSwitcher component
**File**: `src/components/common/ThemeSwitcher.tsx` (NEW)
```tsx
'use client';
- useState for theme ('dark' | 'light')
- useEffect: read localStorage on mount
- useEffect: apply to document.documentElement.dataset.theme
- Toggle function with localStorage persist
- Icons: Moon (dark) / Sun (light)
- Smooth rotate transition
```

#### 1.3 Add theme flash prevention
**File**: `src/app/[locale]/layout.tsx`
- Add inline <script> in <head>
- Read localStorage theme before React hydration
- Apply immediately to prevent flash

#### 1.4 Integrate ThemeSwitcher into Footer
**File**: `src/components/common/Footer.tsx`
- Import and place ThemeSwitcher
- Position: Bottom right or center
- Ensure dev-theme styling consistency

---

### Phase 2: Critical UX Fixes

#### 2.1 Fix Header hover issues
**File**: `src/components/common/Header.tsx`
- Increase nav link padding for larger hit zones
- Fix z-index layering (header > nav > links)
- Ensure proper pointer-events
- Add hover delay (200ms) if needed
- Prevent links from disappearing on mouse movement

#### 2.2 Enhance Button component
**File**: `src/components/common/Button.tsx`
- Add variant: `"gradient"` → bg-gradient-to-r from-neon-cyan to-neon-purple
- Add variant: `"neon-cyan"` → bg-neon-cyan text-terminal-dark
- Add variant: `"neon-purple"` → bg-neon-purple text-white
- Ensure all variants: hover glow, transform, focus states
- Verify loading state styling

---

### Phase 3: Homepage Consistency

#### 3.1 Enhance GlassCard component
**File**: `src/components/dev-ui/GlassCard.tsx`
- Increase border opacity: 20% → 30-40%
- Strengthen box-shadows
- Improve glass-bg opacity: 0.7 → 0.85-0.95
- Add optional `intensity` prop for stronger glow

#### 3.2 Refactor HeroSection
**File**: `src/components/homepage/HeroSection.tsx`
- Verify TerminalWindow styling
- Ensure button variants (gradient + secondary)
- Check contrast with GridBackground
- Apply monospace typography consistently

#### 3.3 Refactor ServicesSection
**File**: `src/components/homepage/ServicesSection.tsx`
- Convert cards → GlassCard (alternating cyan/purple glow)
- Add terminal-style code snippets per service
- Icons with neon glow effects
- Monospace typography throughout
- Grid layout with proper spacing

#### 3.4 Refactor PricingSection
**File**: `src/components/homepage/PricingSection.tsx`
- Convert cards → GlassCard window variant
- Featured plan: stronger glow + badge
- Terminal-style feature lists ($ for checked, // for notes)
- CTA buttons: gradient variant
- Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop

#### 3.5 Verify AboutSection consistency
**File**: `src/components/homepage/AboutSection.tsx`
- Ensure matches standalone about page
- Verify team cards use GlassCard
- Check animations and hover states
- Maintain viewport triggers with `once: true`

---

### Phase 4: Page-Level Refactoring

#### 4.1 Refactor Pricing page
**File**: `src/app/[locale]/pricing/page.tsx`
- Hero section: terminal-style heading
- Pricing cards: GlassCard window variant in 3-column grid
- Featured plan: stronger cyan glow
- Features: terminal-style with code symbols
- CTA buttons: gradient for primary

#### 4.2 Refactor Projects page
**File**: `src/app/[locale]/projects/page.tsx`
- Project cards: GlassCard with hover effects
- Tech stack: terminal-style tags/pills
- Filter buttons: secondary variant with active state
- Grid: 2-3 columns responsive
- "View More": gradient button

#### 4.3 Refactor Contact page
**File**: `src/app/[locale]/contact/page.tsx`
- Form container: GlassCard
- Labels: terminal-style ($ or // prefix)
- Inputs: monospace with neon borders, focus glow
- Submit button: gradient variant
- Success/error states: appropriate glow colors

---

### Phase 5: Form Components

#### 5.1 Refactor form inputs
**Files**: `src/components/form/inputs/*.tsx`
- ChecklistInput, LongTextInput, MultipleChoiceInput, ShortTextInput, SingleChoiceInput
- Background: bg-terminal-dark
- Borders: neon-cyan/purple at 30% opacity
- Focus: full neon border + glow
- Text: monospace font
- Placeholder: terminal-muted color

#### 5.2 Refactor form layout components
**Files**: `src/components/form/WelcomeScreen.tsx`, `ThankYouScreen.tsx`, `QuestionStep.tsx`
- Use GlassCard for containers
- Terminal styling throughout
- Proper spacing and hierarchy
- Viewport animations

#### 5.3 Refactor FormNavigation
**File**: `src/components/form/FormNavigation.tsx`
- Dev-styled buttons (gradient + secondary)
- Progress indicator: neon accents
- Proper spacing for touch targets

---

### Phase 6: Minor Components

#### 6.1 Refactor CookieConsentBanner
**File**: `src/components/common/CookieConsentBanner.tsx`
- GlassCard effect with backdrop blur
- Terminal-dark background (higher opacity)
- Neon-cyan borders (30-40%)
- Buttons: Accept (gradient), Customize (secondary), Reject (ghost)
- Monospace text

#### 6.2 Refactor CookieCustomizeModal
**File**: `src/components/common/CookieCustomizeModal.tsx`
- Full-screen overlay with dark backdrop
- Center modal: GlassCard window variant
- Toggle switches: neon-cyan active state
- Category descriptions: terminal style
- Save button: gradient variant

#### 6.3 Refactor LinkCard
**File**: `src/components/common/LinkCard.tsx`
- GlassCard base
- Hover: scale up + stronger glow
- Icon: neon accent
- Title: bold monospace
- Description: regular monospace, muted color

#### 6.4 Refactor LanguageSwitcher
**File**: `src/components/common/LanguageSwitcher.tsx`
- Dropdown: terminal styling
- Selected language: highlighted cyan
- Globe icon: hover glow
- Smooth transitions

#### 6.5 Refactor linktree components
**Files**: `src/components/linktree/ProfileHeader.tsx`, `LinkList.tsx`
- GlassCard usage
- Terminal styling
- Consistent spacing and typography

---

### Phase 7: Utilities & Documentation

#### 7.1 Update icons.ts
**File**: `src/lib/icons.ts`
- Add Moon, Sun icons for theme switcher
- Ensure all icons loaded from lucide-react
- No direct library imports in components

#### 7.2 Write memory and update docs
- Persist progress to serena memory
- Update TODO.md with completed tasks
- Document color palette
- Document component patterns
- Document theme system for future reference

---

## 🚀 Performance Considerations

### Rendering Strategy
- **SSR**: layout.tsx, static pages (about, pricing, projects)
- **ISR**: Homepage sections with revalidation
- **Client**: ThemeSwitcher, CookieConsentBanner, Analytics only

### Optimization
- Keep dynamic imports for heavy components
- Theme: CSS variables + localStorage (no JS flash)
- Animations: transform/opacity only (GPU accelerated)
- Images: Next/Image with quality/sizes optimization
- Fonts: Variable fonts with display: swap

---

## ✅ Acceptance Criteria

- [ ] All components styled with consistent dev theme
- [ ] Light/dark theme working with smooth transitions
- [ ] Header navigation hover issues resolved
- [ ] Strong visual contrast: background < sections < components < interactive
- [ ] All buttons support gradient, cyan, purple variants
- [ ] Form inputs with terminal aesthetic
- [ ] WCAG AAA compliance maintained
- [ ] No white flash on page load
- [ ] Fast loading (< 2s LCP)
- [ ] No duplicate files created
- [ ] All existing files refactored in place

---

## 📝 Testing Checklist

- [ ] Test theme switcher in all browsers
- [ ] Verify localStorage persistence
- [ ] Test header navigation on desktop/tablet/mobile
- [ ] Check all button variants across pages
- [ ] Verify form inputs focus states
- [ ] Test animations with `prefers-reduced-motion`
- [ ] Validate color contrast ratios
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Verify SSR/ISR rendering
- [ ] Check page load performance

---

## 🎨 Component Inventory

### ✅ Already Dev-Themed
- About page components (CompanyStory, TeamMemberCard, TeamSection)
- GlassCard, TerminalWindow, CodeBlock, GridBackground

### 🔄 Needs Refactoring
- Header, Footer (+ theme switcher)
- Button (add variants)
- Homepage sections (Hero, Services, Pricing, About)
- Pricing page
- Projects page
- Contact page
- All form components
- Cookie components
- LinkCard, LanguageSwitcher
- Linktree components

---

**Status**: Ready for implementation  
**Estimated Effort**: 24 focused implementation tasks
**Priority**: High (UI/UX consistency + critical UX fixes)
