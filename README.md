# LaunchPath — Smart Placement Portal

LaunchPath is a campus placement portal with a React/Vite frontend and an Express/MongoDB backend.

## Requirements

- Node.js (the project has been verified with Node 25)
- npm
- The local MongoDB Community Server installed at `~/Library/Application Support/LaunchPath/mongodb-server-8.0.34`

## Local database

MongoDB stores LaunchPath data in `~/Library/Application Support/LaunchPath/data` and writes logs to `~/Library/Application Support/LaunchPath/logs/mongod.log`. It binds only to `127.0.0.1:27017` for local development.

If MongoDB is not running (for example, after restarting your Mac), start it with:

```sh
BASE="$HOME/Library/Application Support/LaunchPath"
mkdir -p "$BASE/data" "$BASE/logs"
"$BASE/mongodb-server-8.0.34/bin/mongod" \
  --dbpath "$BASE/data" \
  --logpath "$BASE/logs/mongod.log" \
  --pidfilepath "$BASE/mongod.pid" \
  --bind_ip 127.0.0.1 \
  --port 27017 \
  --fork
```

To stop the local database cleanly:

```sh
BASE="$HOME/Library/Application Support/LaunchPath"
kill -TERM "$(cat "$BASE/mongod.pid")"
```

## Configure the backend

The local `backend/.env` is already configured and ignored by Git. It uses:

- `MONGO_URI=mongodb://127.0.0.1:27017/launchpath`
- `PORT=5000`
- A randomly generated local `JWT_SECRET`

Do not commit or share `backend/.env` or its secret. If you need to recreate it, copy `backend/.env.example` and set the values above with a new strong random secret.

Start the backend:

```sh
cd backend
npm ci
npm run dev
```

The backend health endpoint is `http://localhost:5000/health`.

### Admin setup

A newly configured local database may have no admin account or placement drives. Register a trusted account through the app first, then promote that account using the interactive helper:

```sh
cd backend
node makeAdmin.js
```

Enter the registered account email when prompted, then log out and back in so the frontend refreshes the account role. Only promote an account you trust; admin users can create and manage placement drives.

## Configure and run the frontend

The local `frontend/.env` points to `http://localhost:5000` and is ignored by Git.

```sh
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Start MongoDB first, then the backend, then the frontend.

## Verification

```sh
cd backend
npm test
# Requires the local backend and MongoDB to be running; creates and removes temporary E2E fixtures.
node scripts/skillGapE2ESmoke.js

cd ../frontend
npm run build
npm run lint
```

Backend JavaScript syntax can also be checked with:

```sh
find backend -name '*.js' -not -path '*/node_modules/*' -exec node --check {} \;
```

## Notes

- `.env` files are excluded from Git.
- The frontend and backend have separate lockfiles; install dependencies in each folder.
- The local MongoDB instance is for development. Do not expose it to your network or use it as a production database without adding appropriate authentication and operational security.
