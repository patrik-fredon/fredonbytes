---
inclusion: always
---
# Direct Implementation Doctrine

## 🎯 Primary Objective

Produce **minimal, correct, production-usable code** that exactly follows requirements — no over-engineering.

## ⚙️ Absolute Constraints

- **NO** tests unless explicitly requested  
- **NO** defensive coding, fallback systems, or robustness patterns  
- **NO** unnecessary abstractions, wrappers, or complex providers  
- **MINIMAL** error handling — only what's essential for production  
- **CLEAR** failure modes — never suppress or hide errors  
- **ALWAYS** prefer direct, explicit code over indirection or assumptions  
- **ALWAYS** implement all TODOs and requirements exactly as specified  

## 🧭 Workflow & Tooling Principles

### Initialization

1. Run `activate_project` and `check_onboarding_performed` from `serena` before starting.  
2. Plan execution with `sequentialthinking`.

### Implementation

- **ALWAYS** Use `desktop-commander` for code search and shell commands.  
- Implement **directly** — no abstractions, minimal error handling.  
- Keep code deterministic, lean, and verifiable.

### Validation & Persistence

- **ALWAYS** Validate results with:
  - `think_about_task_adherence`
  - `think_about_whether_you_are_done`
  - `think_about_collected_information`
- **ALWAYS** Persist progress using:
  - `write_memory` (and `read_memory`, `list_memories` if needed)

### Documentation

- **ALWAYS** Use `Context7`, `microsoft.docs.mcp` for knowledge fetch for Techstack, development practices and best practices.  
- Maintain `GENERAL.md`, `CHANGELOG.md`, and `TODO.md`:
  - `GENERAL.md` → technical record  
  - `CHANGELOG.md` → concise rolling summary  
  - `TODO.md` → must be cleared at session end  

## 🏗️ Project Architecture

- **Framework**: Next.js 15 (App Router)
- **Languages**: Czech (default) + English via `next-intl`
- **Routing**: under `src/app/[locale]/` with `localePrefix: "always"`
- **Styling**: Tailwind 4 utility classes
- **Validation**: Biome for lint/format only
- **State**: Minimal React state, no unnecessary context/providers
- **Rendering**:
  - SSR/ISR preferred for SEO and performance  
  - CSR only for dynamic user-specific interactions  
- **Markdown**: Optimize MDX where user content is Markdown (blog, about, FAQ)
- **Focus**: performance, SEO, compatibility, responsiveness
- **Dependencies**: minimal, direct, lean
- **Signature**: add FredonBytes signature in `GENERAL.md` and main files after first session

## 📁 Code Organization

```typescript
// Cross-boundary imports via path aliases
import { Header } from "@/components";
import { calculatePricing } from "@/lib/pricing";

// Same-directory imports are relative
import { helperFunction } from "./utils";
```

## 🧩 Development Discipline

- **Files**

  - Permanent structure only — no temp/mock/sandbox files
  - One canonical implementation per module/function
  - Split files >200 lines
  - Delete report/temp/log files unless in GENERAL.md / CHANGELOG.md / TODO.md

- **Coding**

  - Fail clearly — never hide or suppress errors
  - Prefer direct access — avoid multi-layer indirection
  - No adjectives or commentary — pure logic
  - Dynamic, data-driven code only — no hardcoded values

- **Debugging**

  - Never debug without approval — if required, switch mode to `Debugger`

- **Verification**

  - Manual verification only — no automated tests
  - Reviewer assumes skepticism — justify every change through working code

## 💡 Core Philosophy

Directly implement and repair code as specified — minimal, correct, production-usable output only.
No tests, no fallback logic, no overengineering.
Each line must serve a concrete purpose — unnecessary code = technical debt.

- Prioritize clarity and maintainability
- Keep architecture lean and DRY
- Comment only critical logic and integration points
- Follow official Next.js, Tailwind, TypeScript, Supabase, and next-intl docs

## ✅ Summary

- Focus on *one-shot*, direct, deterministic implementation.
- No repetition, no abstraction, no fallback.
- The simplest working version that fulfills intent — nothing more, nothing less.