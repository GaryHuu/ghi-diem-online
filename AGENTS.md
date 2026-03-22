# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vite + React + TypeScript app. Main source lives in `src/`.

- `src/pages/`: route-level screens such as `HomePage`, `CreatingPage`, and `PlayingPage`
- `src/components/`: shared UI building blocks and dialogs
- `src/hooks/`: reusable React hooks
- `src/redux/`: store setup, hooks, and slices
- `src/services/` and `src/db/`: business logic and localStorage persistence
- `src/utils/` and `src/i18n/`: helpers, constants, validators, and translations
- `public/` and `src/assets/`: static assets

Use the `@/` alias for imports from `src` (example: `@/components/Layout`).

## Build, Test, and Development Commands

- `npm run dev`: start the Vite dev server at `http://localhost:5173`
- `npm run build`: create a production build in `dist/`
- `npm run preview`: serve the production build locally
- `npm run lint`: run ESLint and fail on warnings
- `npm run format`: run Prettier across JS, TS, JSON, CSS, and Markdown
- `npm run pre-commit`: run linting and formatting together; Husky executes this on commit

## Coding Style & Naming Conventions

Prettier is the formatting source of truth: tabs for indentation, single quotes, semicolons, trailing commas, and `printWidth: 100`. ESLint covers React, hooks, and TypeScript rules.

Prefer:

- PascalCase for React components and page folders (`PlayingHeader.tsx`)
- camelCase for hooks, helpers, and variables (`usePlaying`, `matchService`)
- `index.ts` barrel exports for component and module folders
- colocated `styles.ts` or `.module.scss` files beside the component they style

## Testing Guidelines

There is currently no automated test runner configured in `package.json`, and no dedicated `tests/` directory. For now, treat `npm run lint` and `npm run build` as the minimum verification gate.

For behavior changes, manually smoke-test the affected flow in the browser, especially:

- match creation
- zero-sum score validation
- leaderboard and transaction updates
- localStorage persistence after refresh

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit style such as `feat(player): ...`, `fix(player): ...`, and `style(ui): ...`. Keep scopes short and relevant to the changed area.

Pull requests should include:

- a concise summary of user-facing changes
- linked issue or task reference when available
- screenshots or short recordings for UI updates
- confirmation that `npm run lint` and `npm run build` passed
