# FlashPulse

A lightweight, self-hosted flashcard app. Create decks, add cards, and quiz yourself. This repository contains a Vite + React frontend and a minimal Express backend for storing decks locally.

## Key points
- All generative AI code and dependencies have been removed.
- Decks are stored on a simple backend (file-based JSON store) in `backend/data/decks.json`.

## Quick start (local)

1) Start the backend (port 4000):

```bash
cd backend
npm install
npm start
```

2) Start the frontend (Vite dev server):

```bash
cd ..
npm install
npm run dev
```

Open the Vite dev server address (usually http://localhost:5173).

## Backend API
- GET `/api/decks` — returns all decks (array)
- POST `/api/decks` — replace all decks (body: array)
- PUT `/api/decks/:id` — upsert a single deck (body: deck object)
- DELETE `/api/decks/:id` — delete a deck by id

Example:

```bash
curl http://localhost:4000/api/decks
```

## Project structure
- `App.tsx` — main frontend app
- `components/DeckEditor.tsx` — deck creation/editing UI
- `components/QuizView.tsx` — quiz UI
- `services/storage.ts` — frontend persistence layer (talks to backend)
- `backend/index.js` — minimal Express backend storing data at `backend/data/decks.json`

## Notes
- If you deploy the backend publicly, secure it with authentication and HTTPS.
- If you want the README to replace the repository README, tell me and I will rename it to `README.md` directly.

## License
MIT
