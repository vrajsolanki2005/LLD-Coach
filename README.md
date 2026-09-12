# LLD Coach

LLD Coach is a practice platform for low-level design interviews. Users can browse design problems, create class and relationship diagrams, save drafts, submit solutions, and receive rule-based feedback.

## Project Structure

```text
client/  React, TypeScript, and Vite frontend
server/  Express, TypeScript, MongoDB, and Mongoose API
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB connection string

## Configuration

Create `server/.env` using `server/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lld-coach
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
EVALUATOR_TYPE=rule
```

Do not commit `server/.env` or real secrets.

## Install

```bash
cd server
npm install

cd ../client
npm install
```

## Seed Problems

With MongoDB running:

```bash
cd server
npm run seed
```

The seed script resets the problems collection and inserts the practice problem set.

## Run Locally

Start the API:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open `http://localhost:5173` in a browser. The API runs at `http://localhost:5000`.

## Available Scripts

### Client

- `npm run dev` starts the Vite development server.
- `npm run build` type-checks and creates a production build.
- `npm run lint` runs ESLint.
- `npm run preview` serves the production build locally.

### Server

- `npm run dev` starts the API with automatic reloads.
- `npm run build` compiles TypeScript into `dist`.
- `npm start` starts the compiled API.
- `npm run seed` resets and seeds the problem collection.

## Main API Routes

All API routes are prefixed with `/api`.

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Authenticate a user |
| GET | `/problems` | List practice problems |
| GET | `/problems/:id` | Get a problem |
| POST | `/problems/:problemId/attempts` | Start an attempt |
| GET | `/attempts` | List the current user's attempts |
| PUT | `/attempts/:id/draft` | Save a draft solution |
| POST | `/attempts/:id/submit` | Submit a solution for evaluation |
| GET | `/evaluations/attempt/:id` | Get the latest evaluation for an attempt |

Protected routes require an `Authorization: Bearer <token>` header.

## Evaluation Flow

1. A user submits a solution.
2. The attempt moves to `EVALUATING`.
3. A pending evaluation is created.
4. The rule-based evaluator checks entities, responsibilities, methods, relationships, and explanation quality.
5. The evaluation becomes `COMPLETED` or `FAILED`.
6. The attempt status is updated accordingly.

## Verification

Run the following before opening a pull request:

```bash
cd client
npm run build
npm run lint

cd ../server
npm run build
```