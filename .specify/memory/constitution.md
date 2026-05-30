<!--
SYNC IMPACT REPORT
==================
Version change: (template) → 1.0.0
Bump rationale: Initial ratification. Template placeholders replaced with concrete
  project principles. MAJOR baseline established.

Modified principles: (none — first definition)
Added principles:
  - I. Pattern Conformity
  - II. No New Dependencies
  - III. Established Styling System
  - IV. Layered State & Data Flow
  - V. Spec/Plan Separation of Concerns
Added sections:
  - Technology Constraints
  - Development Workflow
Removed sections: (none)

Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check gate aligns; no edits needed
  ✅ .specify/templates/spec-template.md — already user-facing/tech-agnostic; aligns with Principle V
  ✅ .specify/templates/tasks-template.md — no principle-driven task type changes required

Follow-up TODOs:
  - RATIFICATION_DATE set to first-write date (2026-05-30); adjust if an earlier
    formal adoption date is known.
-->

# Ghi Điểm Online Constitution

## Core Principles

### I. Pattern Conformity

New code MUST match the patterns already established in the codebase. Specifically:

- Every component, hook, or feature unit lives in its own folder with a barrel `index.ts`
  that re-exports it. Imports MUST use the `@/` alias, never deep relative paths.
- File naming MUST follow existing conventions: component file is PascalCase matching its
  folder (`TopOne/TopOne.tsx`); `index.ts` is barrel-only; `styles.ts` holds styles; `use*.ts`
  holds hooks; `schema.ts`/`schemas.ts` holds Yup; `types.ts` holds local types; `constants.ts`
  holds local consts.
- The logic-in-hook split MUST be preserved: a `.tsx` view stays thin and presentational;
  behavior lives in a paired `use*.ts` hook.

**Rationale**: A single-developer, convention-heavy codebase stays navigable only if every
new unit looks like the existing ones. Deviation forces readers to re-learn structure per file.

### II. No New Dependencies

Features MUST be built with the libraries already present: MUI (`@mui/material` + `@emotion`),
Redux Toolkit + `react-redux`, `react-hook-form` + Yup, `react-router-dom`, `dayjs`,
`react-i18next`, `react-beautiful-dnd`, `@xyflow/react`, `classnames`.

- Adding a new runtime dependency is PROHIBITED unless no existing library can reasonably
  cover the need. Any proposed addition MUST be justified in `plan.md` under Complexity
  Tracking and explicitly approved before install.
- Reach for an existing utility/hook (`useBoolean`, `useFormatCurrency`, `useAddQueryParams`,
  helpers) before writing a new one.

**Rationale**: Bundle size, security surface, and cognitive load all grow with each library.
The current stack already covers state, forms, routing, i18n, drag-drop, and graphs.

### III. Established Styling System

Styling MUST use the existing approach; introducing a new styling system (Tailwind,
CSS-in-JS alternatives, global CSS frameworks) is PROHIBITED.

- Default to MUI: the `sx` prop and styled components. Style objects MUST be co-located in a
  `styles.ts` file, exported as `{ key: SxProps | (theme: Theme) => {...} }`, following the
  theme-aware function pattern (see `PlayingPage/components/TopOne/styles.ts`).
- SASS modules (`*.module.scss`) are permitted only where already used (small static
  components). Prefer MUI for anything theme- or state-driven.
- Theme and dark mode MUST flow through `ThemeAppProvider` (MUI CssVarsProvider) synced to
  Redux. Components MUST NOT hardcode colors that the theme already provides.

**Rationale**: One consistent styling surface keeps theming and dark mode coherent across the app.

### IV. Layered State & Data Flow

State management MUST use Redux Toolkit and the established data-flow layering.

- Global state lives in slices under `src/redux/slices/`; access via the typed
  `useAppDispatch` / `useAppSelector` hooks only.
- The data flow MUST be respected in order: component handler → page hook (e.g. `usePlaying`)
  → service layer (`services/`, where business rules are validated) → DB layer (`db/`,
  localStorage CRUD) → dispatch → re-render.
- Business-rule validation (e.g. the zero-sum score invariant) MUST live in the service
  layer, never in components or the DB layer.
- Transient UI state belongs in page/component hooks, not in Redux.

**Rationale**: The layered separation keeps persistence, validation, and presentation
independently testable and prevents business rules from leaking into the view.

### V. Spec/Plan Separation of Concerns

`spec.md` and `plan.md` MUST stay in their respective lanes.

- `spec.md` describes user-facing behavior and UI only: what the user sees and does,
  acceptance scenarios, and measurable outcomes. It MUST remain technology-agnostic — no
  component names, library names, file paths, or implementation detail.
- `plan.md` holds all technical detail: architecture decisions, component/hook structure,
  state shape, service/DB changes, and library usage.

**Rationale**: Keeping intent separate from implementation lets behavior be reviewed and
agreed before technical choices, and lets the plan evolve without rewriting the spec.

## Technology Constraints

- Stack is fixed: React 18 + TypeScript, built with Vite, client-only SPA. No backend; all
  data persists to browser `localStorage` via the `db/` layer.
- Routing is `react-router-dom` v6 (`createBrowserRouter` + `RouterProvider`).
- i18n via `react-i18next`; user-facing text MUST go through `t('key')` with keys in
  `src/i18n/locales/`. No hardcoded display strings.
- IDs are timestamp-based (`dayjs().valueOf()`), consistent with the existing data model.
- localStorage schema changes MUST be handled through the migration mechanism
  (`src/migration.js` and the setting-read migration), never with breaking in-place reads.

## Development Workflow

- Before implementation, a feature passes through spec → plan → tasks, honoring Principle V.
- The plan's Constitution Check gate MUST confirm: no new dependencies (II), styling/state
  approach unchanged (III, IV), and naming/folder conventions followed (I).
- `npm run lint` and `npm run format` MUST pass before commit (enforced via `pre-commit`).
- Any deviation from a principle MUST be recorded in `plan.md` Complexity Tracking with a
  justification and the rejected simpler alternative.

## Governance

This constitution supersedes ad-hoc conventions. All plans and code changes MUST verify
compliance with the principles above.

- Amendments require: a documented change, a version bump per the policy below, and
  propagation to dependent templates (`plan-template.md`, `spec-template.md`,
  `tasks-template.md`).
- Versioning policy (semantic):
  - MAJOR: backward-incompatible principle removal or redefinition.
  - MINOR: a new principle/section added or materially expanded guidance.
  - PATCH: clarifications, wording, non-semantic refinements.
- Compliance review: every feature plan MUST pass the Constitution Check gate before
  implementation begins; violations without justified Complexity Tracking entries block the plan.

**Version**: 1.0.0 | **Ratified**: 2026-05-30 | **Last Amended**: 2026-05-30
