# Ghi Điểm Online

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://www.ghidiem.online/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A Vietnamese score-tracking web application for multi-player card games. Create matches, add players, track scores across multiple games, and view leaderboards - all persisted locally in your browser.

🔗 **Live Demo**: [https://www.ghidiem.online/](https://www.ghidiem.online/)

## Features

- ✅ **Match Management** - Create and manage multiple game matches
- 👥 **Player Tracking** - Add unlimited players with unique names and avatars
- 🎯 **Zero-Sum Validation** - Enforces score balance (all scores must sum to zero)
- 📊 **Real-time Leaderboard** - Live rankings and statistics
- 💸 **Transaction Visualization** - Interactive payment flow chart between players using React Flow
- 🔄 **Drag & Drop** - Reorder players easily during gameplay
- 📈 **Trend Indicators** - Shows score trends from previous games with color-coded arrows
- 🤖 **AutoFill Players** - Mark players for automatic score filling
- 🎛️ **Per-Player Gap Setting** - Override global gap setting for individual players
- 🖼️ **Player Avatars** - Upload and display player profile images
- 📐 **UI Modes** - Switch between compact and full interface layouts
- 💾 **Offline-First** - All data persisted in browser localStorage
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 🌐 **Internationalization (i18n)** - Vietnamese (English temporarily disabled)

## Tech Stack

### Core

- **React 18** - UI framework with TypeScript
- **Vite** - Lightning-fast build tool and dev server
- **TypeScript 5.5** - Type-safe development

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

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/ghi-diem-online.git
cd ghi-diem-online
```

2. Install dependencies

```bash
npm install
```

3. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Development Commands

```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run pre-commit   # Lint + format (used by Husky)
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── PlayerModifierDialog/  # Player create/edit dialog with avatar upload
│   ├── SettingDialog/         # Settings (unit, gap, UI mode)
│   └── ToastContainer/       # Toast notification wrapper
├── db/                 # localStorage database layer
│   ├── match/         # Match and player CRUD operations
│   └── setting/       # User settings persistence
├── hooks/             # Shared custom hooks
│   ├── useBoolean.ts
│   ├── useFormatCurrency.ts
│   ├── useScrollToTop.ts
│   └── useAddQueryParams.ts
├── i18n/              # Internationalization
│   ├── locales/       # Translation files (en.json, vi.json)
│   └── index.ts       # i18n configuration
├── services/          # Business logic layer
│   ├── match/        # Match validation and operations
│   └── setting/      # Settings service
├── redux/            # Redux state management
│   └── slices/       # Redux slices (match, setting)
├── pages/            # Route-level page components
│   ├── HomePage/     # Landing page with match listing
│   ├── CreatingPage/ # New match setup form
│   └── PlayingPage/  # Active match scoring interface
│       ├── components/
│       │   ├── Player/        # Player card with score input, trend, autofill
│       │   ├── Transactions/  # Payment flow visualization (React Flow)
│       │   ├── TopOne/        # Winner display with crown
│       │   └── LeaderBoard/   # Rankings table
│       └── hooks/
│           ├── usePlaying.ts          # Main match orchestration hook
│           ├── usePlayingFetcher.ts   # Data fetching logic
│           ├── useDraggablePlayer.ts  # Drag and drop logic
│           └── useTransactions.ts     # Payment flow calculation
├── routes/           # React Router configuration
├── utils/            # Shared utilities and types
└── migration.js      # Data migration for backward compatibility
```

## Architecture Overview

### Data Layer

The application uses a **localStorage-based database** instead of a traditional backend:

- **Database Layer** (`src/db/`) - Direct localStorage operations
- **Service Layer** (`src/services/`) - Business logic and validation
- **Redux Store** (`src/redux/`) - Global state management

### Key Routing

1. **HomePage** (`/`) - Match listing and creation
2. **CreatingPage** (`/creating`) - New match setup
3. **PlayingPage** (`/match?id=<matchId>&gN=<gameNumber>`) - Active gameplay

### Zero-Sum Score Validation

The core constraint of the app is that **all player scores for each game must sum to zero**. This enforces traditional Vietnamese card game rules where points are transferred between players.

### Player Data Model

Each player has the following structure:

- `id` - Timestamp-based unique identifier
- `name` - Display name
- `scores[]` - Array of scores indexed by game number
- `gap?` - Optional per-player gap override
- `autoFill?` - Flag for automatic score filling
- `avatar?` - Base64-encoded profile image

## Data Persistence

All data is stored in browser **localStorage** with the following keys:

- `GHIDIEM_ONLINE_KEY` - Match data
- `GHIDIEM_ONLINE_SETTING_KEY` - User settings (unit, gap, UI mode)
- `i18nextLng` - Cached language preference for i18next

The app includes automatic data migration (`src/migration.js`) to handle schema changes between versions, including migration for new fields like `uiMode`.

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

- Run `npm run format` before committing
- Ensure `npm run lint` passes
- Follow existing TypeScript patterns and component structure

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ for Vietnamese card game enthusiasts
- Inspired by traditional score-keeping methods
- Powered by modern web technologies

---

**Note**: This is a client-side only application with no backend server. All data is stored locally in your browser.
