---
applyTo: "**"
---

# Workflow

Produce **minimal, correct, production-usable code** that exactly follows requirements — no over-engineering.

## ⚙️ Absolute Constraints

- **NO** tests unless explicitly requested  
- **NO** defensive coding, fallback systems, or robustness patterns  
- **NO** unnecessary abstractions, wrappers, or complex providers
- **ALWAYS** Run `activate_project` and `check_onboarding_performed` (`onboarding` if project not onboarded yet) from `serena` before starting.
- **MINIMAL** error handling — only what's essential for production  
- **CLEAR** failure modes — never suppress or hide errors  
- **ALWAYS** prefer direct, explicit code over indirection or assumptions  
- **ALWAYS** implement all TODOs and requirements exactly as specified in `TODOs.md`, `CHANGELOG.md`, and `GENERAL.md`
- **ALWAYS** Plan next execution with `sequentialthinking` before proceeding to implementation.
- **ALWAYS** Validate results with:
  - `think_about_task_adherence`
  - `think_about_whether_you_are_done`
  - `think_about_collected_information`
  - finally **ALWAYS** `write_memory` to persist progress and update `TODO.md`.
- **ALWAYS** Persist progress using:
  - `write_memory` (and `read_memory`, `list_memories` if needed)
- **ALWAYS** Use `Context7`, `fetch` (internet access) for knowledge fetch for Techstack, development practices, best practices and task solving approach.  
- **ALWAYS** Initialize (if not already) and maintain `GENERAL.md`, `CHANGELOG.md`, and `TODO.md`:
  - `GENERAL.md` → technical record, project standards and techstack  
  - `CHANGELOG.md` → concise rolling summary  
  - `TODO.md` → must be cleared at session end
  - `serena` memory tools to manage project memories - **ALWAYS** use them to track changes and progress  
- **Files**
  - **ALWAYS** check if new files are needed before creating them - **NEVER** create files which should have same behavior as existing ones
  - Permanent structure only — no temp/mock/sandbox files
  - One canonical implementation per module/function
  - Split files >200 lines
  - Delete report/temp/log files unless in `GENERAL.md` / `CHANGELOG.md` / `TODO.md`
- **Coding**
  - Fail clearly — never hide or suppress errors
  - Prefer direct access — avoid multi-layer indirection
  - No adjectives or commentary — pure logic
  - Dynamic, data-driven code only — no hardcoded values
- **Verification**
  - Manual verification only — no automated tests
  - Reviewer assumes skepticism — justify every change through working code
- **ALWAYS** Directly implement and repair code as specified — minimal, correct, production-usable output only.
- **NO** tests, no fallback logic, no overengineering.
- **FOCUS** Each line must serve a concrete purpose — unnecessary code = technical debt.
- **ALWAYS** Prioritize clarity and maintainability
- **ALWAYS** Keep architecture lean and DRY
- **ALWAYS** Comment only critical logic and integration points
- **ALWAYS** Follow official Next.js, Tailwind, TypeScript, Supabase, and next-intl docs
- **FOCUS** on *one-shot*, direct, deterministic implementation.
- **NO** repetition, no abstraction, no fallback.
- **ALWAYS** Focus to the simplest working version that fulfills intent — nothing more, nothing less.
- **ALWAYS** Implement **directly** — no abstractions, minimal error handling.  
- **ALWAYS** Keep code deterministic, lean, and verifiable.
- **Framework**: Next.js 15 (App Router)
- **Languages**: Czech (default) + English via `next-intl`
- **Routing**: under `src/app/[locale]/` with `localePrefix: "always"`
- **Styling**: Tailwind 4 utility classes
- **Validation**: Biome for lint/format only
- **State**: Minimal React state, no unnecessary context/providers - **ALWAYS** client side only where absolutely necessary
- **Rendering**:
  - SSR/ISR preferred for SEO and performance  
  - CSR only for dynamic user-specific interactions  
- **Markdown**: Optimize MDX where user content is Markdown (blog, about, FAQ)
- **Focus**: performance, SEO, wide compatibility (browsers, devices, screen readers), responsiveness
- **Dependencies**: minimal, direct, lean
- **NEVER** Summarize chat and task completion directly into chat
- **ALWAYS** use `/lib/icons.ts` for UI libraries (e.g., icons from `lucide_react`), which you will then call from this file in your project, always loading only the necessary UI assets, **NEVER** directly loading the entire library.
- **ALWAYS** prioritize frequent updates through `serena` memory tools, `TODO.md`, `CHANGELOG.md`
- **ALWAYS** make sure you don't waste tokens on unnecessary explanations in chat. Keep all summaries, documentation, and notes concise but accurate.