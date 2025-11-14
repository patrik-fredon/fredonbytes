- 

- ---
  applyTo: "**"
  ---

  # Workflow

  Produce **minimal, correct, production-usable code** that exactly follows requirements — no over-engineering.

  ## ⚙️ Absolute Constraints

  - **NO** tests unless explicitly requested
  - **NO** defensive coding, fallback systems, or robustness patterns
  - **NO** unnecessary abstractions, wrappers, or complex providers
  - **MINIMAL** error handling — only what's essential for production
  - **NO** robust error handling — only critical error logging
  - **CLEAR** failure modes — never suppress or hide errors
  - **ALWAYS** prefer direct, explicit code over indirection or assumptions
  - **ALWAYS** implement all `todos` and requirements exactly as specified
  - Fast and easiest way to implement any user needs, without any robust implementation
  - **Files**
    - Permanent structure only — no temp/mock/sandbox files
    - One canonical implementation per module/function
    - Delete report/temp/log files unless in ./.github/GENERAL.md / ./.github/CHANGELOG.md /  ./.github/TODO.md
    - **ALWAYS** maximum number of lines per file =< 200
    - **ALWAYS** follow modern techstack practices.
  - Modern and lightweight implementation of development
  - No fallback solutions, robustness
  - Minimal, lightweight, modern, and compatible code base
  - Functional, strictly adhering to user tasks, implementation, and requirements
  - **NO** overengineering, abstractions, or defensive patterns
  - **NO** extraneous features, code, or files
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
  - **FOCUS** on _one-shot_, direct, deterministic implementation.
  - **NO** repetition, no abstraction, no fallback.
  - **ALWAYS** Focus to the simplest working version that fulfills intent — nothing more, nothing less.
  - **ALWAYS** Implement **directly** — no abstractions, minimal error handling.
  - **ALWAYS** Keep code deterministic, lean, and verifiable.
  - **Framework**: Next.js 15 (App Router)
  - **Languages**: Czech (default) + English via `next-intl`
  - **Routing**: under `src/app/[locale]/` with `localePrefix: "always"`
  - **Styling**: Tailwind 4 utility classes
  - **Validation**: Biome for lint/format only
  - **State**: Minimal React state, no unnecessary context/providers
  - **Rendering**:
    - SSR/ISR preferred for SEO and performance
    - SEO, metadata, GMB tracking, focus on performance for local search based on the project
    - CSR only for dynamic user-specific interactions
  - **Markdown**: Optimize MDX where user content is Markdown (blog, about, FAQ)
  - **Focus**: performance, SEO, compatibility, responsiveness
  - **Dependencies**: minimal, direct, lean
  - **NEVER** Summarize chat and task completion directly into chat
  - **NEVER** create any additional documents to explain or document implementation
  - **ALWAYS** follow modern techstack practices.
