# Ghi Điểm Online

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://www.ghidiem.online/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A Vietnamese score-tracking web application for multi-player card games. Create matches, add players, track scores across multiple games, and share a live scoreboard with anyone via a link. Backed by the [ghi-diem-api](https://github.com/GaryHuu/ghi-diem-api) REST + WebSocket backend.

🔗 **Live Demo**: [https://www.ghidiem.online/](https://www.ghidiem.online/)

## Features

- ✅ **Match Management** - Create and manage multiple game matches
- 👥 **Player Tracking** - Add unlimited players with unique names and avatars
- 🎯 **Zero-Sum Validation** - Enforces score balance (all scores must sum to zero), validated server-side
- 📡 **Live Share** - Permanent read-only share link; viewers see score updates in realtime over WebSocket and can browse past rounds
- 🕘 **Shared History** - Quick access to shared scoreboards you have viewed before
- ⚡ **Optimistic Scoring** - Score edits apply instantly in the UI and sync to the API in the background
- 🛡️ **Admin Dashboard** - `/dashboard` login for browsing all matches (read-only)
- 📊 **Real-time Leaderboard** - Live rankings and statistics
- 💸 **Transaction Visualization** - Interactive payment flow chart between players using React Flow
- 🔄 **Drag & Drop** - Reorder players easily during gameplay
- 📈 **Trend Indicators** - Shows score trends from previous games with color-coded arrows
- 🤖 **AutoFill Players** - Mark players for automatic score filling
- 🎛️ **Per-Player Gap Setting** - Override global gap setting for individual players
- 🖼️ **Player Avatars** - Upload and display player profile images
- 📐 **UI Modes** - Switch between compact and full interface layouts
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 🌐 **Internationalization (i18n)** - Vietnamese (English temporarily disabled)

## Tech Stack

### Core

- **React 18** - UI framework with TypeScript
- **Vite** - Lightning-fast build tool and dev server
- **TypeScript 5.5** - Type-safe development

### Backend Integration

- **[ghi-diem-api](https://github.com/GaryHuu/ghi-diem-api)** - Django Ninja REST API + Channels WebSocket
- **Native fetch** - No HTTP client dependency; device identity via `X-Device-Id` header
- **Native WebSocket** - Realtime share view with auto-reconnect

### State & Routing

- **Redux Toolkit** - Predictable state management
- **React Router v6** - Client-side routing

### UI & Styling

- **Material-UI (MUI) v5** - Component library
- **Emotion** - CSS-in-JS styling
- **SASS Modules** - Modular stylesheets
- **react-beautiful-dnd** - Drag and drop functionality
- **@xyflow/react** - Transaction flow visualization

### Forms & Validation

- **React Hook Form** - Performant form handling
- **Yup** - Schema validation

### Internationalization

- **i18next** - i18n framework
- **react-i18next** - React bindings for i18next
- **i18next-browser-languagedetector** - Automatic language detection

### DevOps & Quality

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Vercel Analytics** - Usage analytics

## Getting Started

### Prerequisites

- Node.js 20 (see `.nvmrc`)
- yarn
- A running [ghi-diem-api](https://github.com/GaryHuu/ghi-diem-api) backend (one `docker compose up` in that repo)

### Installation

1. Clone the repository

```bash
git clone https://github.com/GaryHuu/ghi-diem-online.git
cd ghi-diem-online
```

2. Install dependencies

```bash
yarn install
```

3. Configure the API endpoint (optional for local dev)

```bash
cp .env.example .env.development
# VITE_API_URL defaults to http://localhost:8000 when unset
```

4. Start the development server

```bash
yarn dev
```

The app will be available at `http://localhost:5173`

## Development Commands

```bash
yarn dev          # Start development server (Vite)
yarn build        # Build for production
yarn preview      # Preview production build
yarn lint         # Run ESLint
yarn format       # Format code with Prettier
yarn pre-commit   # Lint + format (used by Husky)
```

## Project Structure

```
src/
├── api/                # REST client (native fetch, X-Device-Id, admin endpoints)
├── components/         # Reusable UI components
│   ├── PlayerModifierDialog/  # Player create/edit dialog with avatar upload
│   ├── SettingDialog/         # Settings (unit, gap, UI mode)
│   └── ToastContainer/        # Toast notification wrapper
├── db/                 # Data layer — thin async wrappers over the REST API
├── hooks/              # Shared custom hooks
│   ├── useShareSocket.ts      # WebSocket subscription for the live share view
│   ├── useBoolean.ts
│   ├── useFormatCurrency.ts
│   ├── useScrollToTop.ts
│   └── useAddQueryParams.ts
├── i18n/               # Internationalization (locales: en.json, vi.json)
├── services/           # Business logic layer
├── redux/              # Redux state management (match, setting slices)
├── pages/              # Route-level page components
│   ├── HomePage/       # Landing page with match listing + shared history
│   ├── CreatingPage/   # New match setup form
│   ├── PlayingPage/    # Active match scoring interface
│   │   ├── components/ # Player, LeaderBoard, Transactions, TopOne, ShareLinkDialog...
│   │   └── hooks/      # usePlaying, usePlayingFetcher, useDraggablePlayer...
│   ├── SharedViewPage/ # Read-only live share view (/share/:token)
│   └── DashboardPage/  # Admin dashboard (/dashboard)
├── routes/             # React Router configuration
├── utils/              # Shared utilities, types, helpers (deviceId, shareHistory...)
└── migration.js        # Legacy localStorage migration for settings
```

## Architecture Overview

### Data Layer

The app talks to the [ghi-diem-api](https://github.com/GaryHuu/ghi-diem-api) backend:

- **API Client** (`src/api/`) - Native fetch wrapper; attaches the `X-Device-Id` header
- **Database Layer** (`src/db/`) - Async CRUD calls to the REST API
- **Service Layer** (`src/services/`) - Client-side validation and orchestration
- **Redux Store** (`src/redux/`) - Global state, hydrated from API responses

Ownership is anonymous: a UUID generated once per browser (`deviceId` in localStorage) identifies the device. Matches created on a device can only be modified by that device; share links are read-only for everyone else.

### Routing

1. **HomePage** (`/`) - Match listing, shared history, and creation
2. **CreatingPage** (`/match/create`) - New match setup
3. **PlayingPage** (`/match/:id?gN=<gameNumber>`) - Active gameplay
4. **SharedViewPage** (`/share/:token`) - Public read-only live scoreboard (WebSocket)
5. **DashboardPage** (`/dashboard`) - Admin login + read-only match browser

### Zero-Sum Score Validation

The core constraint of the app is that **all player scores for each game must sum to zero**. This enforces traditional Vietnamese card game rules where points are transferred between players. Validation runs server-side when advancing or ending a game.

### Live Share

The match owner generates a permanent share link. Viewers get the full match view (scores per round, leaderboard, transactions) in read-only mode, updated in realtime through a WebSocket. Viewers can browse earlier rounds; when the owner advances the game, viewers sitting on the latest round follow automatically.

### Player Data Model

- `id` - Server-generated identifier
- `name` - Display name
- `scores[]` - Array of scores indexed by game number
- `gap?` - Optional per-player gap override
- `autoFill?` - Flag for automatic score filling
- `avatar?` - Base64-encoded profile image

## Local Storage

Only lightweight client state lives in localStorage:

- `deviceId` - Anonymous device identity (UUID)
- `SETTING` - User settings (unit, gap, UI mode)
- `sharedHistory` - Recently viewed shared scoreboards
- `adminToken` - Admin dashboard session token
- `i18nextLng` - Cached language preference

Match data is stored by the backend.

### Internationalization

The app currently supports **Vietnamese** (English is temporarily disabled):

- **Translation Files**: Located in `src/i18n/locales/` (en.json, vi.json)
- **Dynamic Content**: All UI strings, validation messages, and error messages are translated

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Run `yarn format` before committing
- Ensure `yarn lint` passes
- Follow existing TypeScript patterns and component structure

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ for Vietnamese card game enthusiasts
- Inspired by traditional score-keeping methods
- Powered by modern web technologies
