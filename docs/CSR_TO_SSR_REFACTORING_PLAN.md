# CSR to SSR Refactoring Plan - Fredonbytes

**Datum vytvoření**: 2025-11-06
**Cíl**: Odstranit zbytečný CSR, eliminovat framer-motion z statických komponent, optimalizovat pro SEO a performance

---

## 📊 SOUČASNÝ STAV

- **Total "use client" files**: 49
- **Total framer-motion files**: 24
- **Bundle size**: ~200KB
- **TTI**: ~3.5s
- **SSR content**: 40%

---

## 🎯 CÍLOVÝ STAV

- **CSR components**: ~39 (-20%)
- **Bundle size**: ~140KB (-30%)
- **TTI**: ~2.2s (-37%)
- **FCP**: ~1.2s (-33%)
- **SSR content**: 80% (+100%)

---

## ❌ ZBYTEČNÉ CSR KOMPONENTY (7-10 souborů)

### Statický obsah bez interakce:
1. **Footer.tsx** - `new Date().getFullYear()` + `useTranslations`
2. **AboutSection.tsx** - Pouze zobrazení statických dat
3. **CompanyStory.tsx** - Framer-motion scroll animations na statickém obsahu
4. **TeamSection.tsx** - Framer-motion stagger na statickém seznamu
5. **TeamMemberCard.tsx** - Framer-motion card animations
6. **LinkCard.tsx** - Framer-motion hover effects
7. **ProfileHeader.tsx / LinkList.tsx** - Framer-motion na linktree

### Lze optimalizovat:
8. **ServicesSection.tsx** - useState pro tab filtering → CSS-only nebo URL-based
9. **ProjectFilter.tsx** - Client filtering → URL-based filtering

---

## ✅ OPRÁVNĚNÝ CSR (ponechat)

- **Header.tsx** - Mobile menu toggle, scroll detection
- **CookieConsentBanner.tsx** - User interaction, localStorage
- **LanguageSwitcher.tsx** - Dropdown state
- **ContactClient.tsx / FormClient.tsx / SurveyClient.tsx** - Form state
- **PricingCalculator.tsx / CurrencyToggle.tsx** - Interactive calculator
- **ProjectModal.tsx** - Modal state
- **WebVitals.tsx / ConditionalAnalytics.tsx** - Browser APIs
- **AnimatedBackground.tsx** - Canvas animations

---

## 🎨 FRAMER-MOTION PROBLÉM

### Důvody proti:
1. **Bundle size**: ~60KB gzipped
2. **CSR requirement**: Nelze v Server Components
3. **Runtime overhead**: JS animace pomalejší než CSS
4. **Hydration delay**: Animace nefungují do hydratace
5. **SEO impact**: Obsah není okamžitě dostupný

### CSS Alternativy:

#### 1. Scroll-driven animations (Chrome 115+, Firefox 114+)
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-on-scroll {
  animation: fade-in linear;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

#### 2. CSS Stagger (nth-child)
```css
.team-grid .card:nth-child(1) { animation-delay: 0ms; }
.team-grid .card:nth-child(2) { animation-delay: 100ms; }
.team-grid .card:nth-child(3) { animation-delay: 200ms; }
```

#### 3. @starting-style (Chrome 117+)
```css
.card {
  transition: opacity 0.3s, transform 0.3s;
}

@starting-style {
  .card {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

#### 4. Intersection Observer (fallback)
- Menší než framer-motion
- Přesnější control
- Lze lazy loadovat

---

## 📋 IMPLEMENTAČNÍ FÁZE

### **FÁZE 1: QUICK WINS** ⚡ (30 min)

**Cíl**: Odstranit CSR z jednoduchých komponent bez framer-motion

#### 1.1 Footer.tsx → SSR
- ❌ Remove: `"use client"`, `useTranslations`
- ✅ Add: `async` function, `getTranslations`, `locale` prop
- ✅ Fix: `new Date().getFullYear()` na server-side

#### 1.2 AboutSection.tsx → SSR
- ❌ Remove: `"use client"`, `useTranslations`
- ✅ Add: `async` function, `getTranslations`, `locale` prop
- ✅ Keep: Všechny statické elementy

#### 1.3 ServicesSection.tsx → SSR + CSS-only tabs
- ❌ Remove: `"use client"`, `useState(activeTab)`
- ✅ Add: CSS-only tab switching pomocí `:has()` nebo radio inputs
- ✅ Alternative: URL-based filtering (`?category=development`)

**Expected benefits**:
- -3 CSR komponenty
- Instant content pro crawlery
- Lepší FCP

---

### **FÁZE 2: ODSTRANIT FRAMER-MOTION** 🎨 (1-2 hod)

**Cíl**: Nahradit framer-motion CSS animacemi

#### 2.1 CompanyStory.tsx → CSS scroll animations
- ❌ Remove: `"use client"`, framer-motion imports
- ❌ Remove: motion components, variants, whileInView
- ✅ Add: CSS `animation-timeline: view()`
- ✅ Add: CSS `@keyframes` pro fade-in
- ✅ Convert to: async Server Component

#### 2.2 TeamSection.tsx → CSS stagger
- ❌ Remove: framer-motion stagger animations
- ✅ Add: CSS nth-child delays
- ✅ Add: CSS scroll animations
- ✅ Convert to: async Server Component

#### 2.3 TeamMemberCard.tsx → CSS hover
- ❌ Remove: framer-motion hover effects
- ✅ Add: CSS :hover, :focus states
- ✅ Add: CSS transitions
- ✅ Convert to: Server Component

#### 2.4 LinkCard.tsx → CSS hover
- ❌ Remove: framer-motion
- ✅ Add: CSS :hover pseudo-class
- ✅ Convert to: Server Component

**Expected benefits**:
- **-60KB bundle size**
- Rychlejší TTI
- -4 CSR komponenty

---

### **FÁZE 3: URL-BASED FILTERING** 🔗 (1 hod)

**Cíl**: SEO-friendly filtering místo client state

#### 3.1 ServicesSection tabs → URL params
- ❌ Remove: useState filtering
- ✅ Add: URL search params (`?category=development`)
- ✅ Add: Server-side filtering logic
- ✅ Keep: Smooth transitions s View Transitions API

#### 3.2 ProjectFilter → URL params
- ❌ Remove: Client-side filtering state
- ✅ Add: URL search params (`?type=web&tech=react`)
- ✅ Add: Server-side filtering
- ✅ Benefit: Shareable URLs, browser history

**Expected benefits**:
- SEO-friendly URLs
- Shareable filtered views
- Browser back/forward works

---

### **FÁZE 4: ISR OPTIMIZATION** 📅 (15 min)

**Cíl**: Optimální revalidation strategie

#### 4.1 Přidat ISR na About page
```tsx
export const revalidate = 604800; // 7 days
```

#### 4.2 Přidat ISR na Projects page
```tsx
export const revalidate = 3600; // 1 hour (pokud se často mění)
```

#### 4.3 Review existing ISR
- ✅ Homepage: 86400 (24h) - OK
- ✅ Pricing: 604800 (7d) - OK
- ✅ Legal pages: 604800 (7d) - OK

**Expected benefits**:
- Fresh content s static performance
- Optimal cache strategie

---

## 📈 OČEKÁVANÉ VÝSLEDKY

| Metrika | Před | Po | Zlepšení |
|---------|------|-----|----------|
| **Bundle size** | ~200KB | ~140KB | **-30%** |
| **TTI** | ~3.5s | ~2.2s | **-37%** |
| **FCP** | ~1.8s | ~1.2s | **-33%** |
| **SSR content** | 40% | 80% | **+100%** |
| **CSR components** | 49 | ~39 | **-20%** |
| **Framer-motion usage** | 24 files | ~14 files | **-42%** |

---

## 🛠️ TECHNICKÉ DETAILY

### Pattern pro konverzi CSR → SSR:

#### PŘED (CSR):
```tsx
"use client";

import { useTranslations } from "next-intl";

export default function Component() {
  const t = useTranslations();
  return <div>{t("key")}</div>;
}
```

#### PO (SSR):
```tsx
import { getTranslations } from "next-intl/server";

interface Props {
  locale: string;
}

export default async function Component({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "key" });
  return <div>{t("key")}</div>;
}
```

### Pattern pro odstranění framer-motion:

#### PŘED (framer-motion):
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

#### PO (CSS):
```tsx
<div className="animate-on-scroll">
  Content
</div>

/* CSS */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-on-scroll {
  animation: fade-in-up linear;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

---

## 🚀 EXECUTION CHECKLIST

### Fáze 1: Quick Wins
- [ ] Footer.tsx → SSR
- [ ] AboutSection.tsx → SSR
- [ ] ServicesSection.tsx → SSR + CSS tabs
- [ ] Test build
- [ ] Commit & Push

### Fáze 2: Remove framer-motion
- [ ] CompanyStory.tsx → CSS animations
- [ ] TeamSection.tsx → CSS stagger
- [ ] TeamMemberCard.tsx → CSS hover
- [ ] LinkCard.tsx → CSS hover
- [ ] Test animations cross-browser
- [ ] Test build
- [ ] Commit & Push

### Fáze 3: URL-based filtering
- [ ] ServicesSection → URL params
- [ ] ProjectFilter → URL params
- [ ] Test filtering
- [ ] Test URL sharing
- [ ] Test build
- [ ] Commit & Push

### Fáze 4: ISR optimization
- [ ] Add ISR to About page
- [ ] Add ISR to Projects page
- [ ] Test revalidation
- [ ] Commit & Push

---

## 📝 POZNÁMKY

### Browser Support pro CSS features:
- **Scroll-driven animations**: Chrome 115+, Firefox 114+, Safari 17.5+
- **@starting-style**: Chrome 117+, Safari 17.5+
- **:has()**: Chrome 105+, Firefox 121+, Safari 15.4+
- **View Transitions API**: Chrome 111+, Safari 18+

### Fallbacks:
- Pro starší browsery: Použít `@supports` nebo Intersection Observer
- Progressive enhancement: Stránka funguje i bez animací

### Testing:
- Lighthouse scores
- WebPageTest
- Real device testing
- Cross-browser testing

---

## 🎯 SUCCESS METRICS

### Performance:
- [ ] Lighthouse Performance > 90
- [ ] TTI < 2.5s
- [ ] FCP < 1.5s
- [ ] Bundle size < 150KB

### SEO:
- [ ] All content SSR
- [ ] Rich snippets working
- [ ] Meta tags optimized
- [ ] Structured data valid

### Development:
- [ ] CSR components < 40
- [ ] Framer-motion files < 15
- [ ] Build time < 2min
- [ ] No build errors

---

**Status**: 📋 Ready to implement
**Next Action**: Start Fáze 1 - Quick Wins
