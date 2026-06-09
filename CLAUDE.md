# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React/TypeScript application that displays upcoming anime episodes with countdown timers and pagination, backed by a Node.js/Express API server.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, TanStack Query, React Icons
- **Backend**: Node.js, Express
- **Build**: TypeScript compiler + Vite

## Development Commands

```bash
# Start development server (frontend only)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview

# Start both frontend and backend via Docker
docker-compose up --build
```

## Architecture

### Frontend (`src/`)

- **App.tsx** - Root component with dark gradient background
- **components/UpcomingAnime.tsx** - Main feature component fetching and displaying anime data
- **components/AnimeCard.tsx** - Individual anime episode card with countdown timer
- **components/Pagination.tsx** - Page navigation controls
- **components/LoadingScreen.tsx** - Loading state UI
- **components/ErrorScreen.tsx** - Error state UI with retry

### Backend (`backend/`)

- **server.js** - Express server (port 5002) with `/api/anime/upcoming` endpoint
- **anime.js** - GraphQL queries to AniList API for upcoming episodes

## Data Flow

1. `UpcomingAnime` component uses TanStack Query to fetch from backend
2. Backend calls external anime API and returns formatted data
3. Data is grouped by date and rendered as anime cards
4. Each `AnimeCard` manages its own countdown timer with `useEffect` interval

## Environment

Set `VITE_API_URL` in `.env` (defaults to `http://localhost:5002`):

```env
VITE_API_URL=http://localhost:5002
```

## Key Patterns

- **API Mocking**: Uses `placeholderData: keepPreviousData` for smooth pagination transitions
- **Caching**: 30-second `staleTime` for API responses
- **Error Handling**: `ErrorScreen` handles offline detection, auto-retries on connectivity return, and provides retry button
- **Countdown**: Real-time updates via 1-second interval in `AnimeCard`