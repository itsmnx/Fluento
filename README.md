# Fluento

A full-stack **language exchange** platform where learners find partners by native/learning language, send friend requests, chat via Stream, and start video calls. Chat and video are communication tools built around language learning — not a standalone chat app.(like messenger)

JWT cookie authentication, MongoDB, and Stream Chat/Video integration.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string
- [Stream](https://getstream.io/) API key and secret (for chat and video)

## Quick start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and set your values:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `5001`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET_KEY` | Secret for signing JWT tokens |
| `STREAM_API_KEY` | Stream Chat API key |
| `STREAM_API_SECRET` | Stream Chat API secret |
| `NODE_ENV` | `development` or `production` |

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5001`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_STREAM_API_KEY` in `frontend/.env` to the **same value** as `STREAM_API_KEY` in `backend/.env`.

The app runs at `http://localhost:5173`.

### 3. Use the app

1. Open `http://localhost:5173`
2. Sign up with email and password
3. Complete onboarding (profile, languages, location)
4. Use **Home** to discover learners and **Friends** to message connections
5. Click your **profile avatar** to view/edit your onboarding details
6. Accept friend requests under **Notifications**, then use **Message** to chat

## Project structure

```
Auth-System/
├── backend/          # Express API, JWT auth, MongoDB
│   ├── src/server.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── frontend/         # React + Vite UI
    └── src/
        ├── pages/
        ├── hooks/
        └── lib/
```

## Auth flow

- **Signup / Login** — issues a 7-day JWT in an httpOnly cookie
- **Protected routes** — backend validates the cookie via `protectRoute` middleware
- **Frontend** — calls `GET /api/auth/me` with credentials to check session state
- **Logout** — clears the JWT cookie

## Production

Build the frontend and serve it from the backend:

```bash
cd frontend && npm run build
cd ../backend && NODE_ENV=production npm start
```

Set `NODE_ENV=production` in `.env` so cookies use the `secure` flag over HTTPS.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| MongoDB connection failed | Ensure MongoDB is running and `MONGO_URI` is correct |
| Stream chat not working | Set `STREAM_API_KEY` + `STREAM_API_SECRET` in `backend/.env` and `VITE_STREAM_API_KEY` in `frontend/.env` |
| `/friends` page blank | Fixed — route now renders the friends list |
| Two accounts in two tabs | Cookie auth shares one session per browser — use separate browser profiles or incognito for testing two users |
| CORS errors | Frontend must run on `http://localhost:5173` in development |
| Login works but `/me` fails | Check that `JWT_SECRET_KEY` is set and consistent |
