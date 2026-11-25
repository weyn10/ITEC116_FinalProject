# Hotel Reservation and Guest Management System (HRGMS)

NestJS + TypeORM + MySQL REST backend with JWT authentication, built for the ITEC 116 Final Project
(Systems Integration Backend Prototype).

## Tech stack
| Layer | Technology |
|---|---|
| Framework | NestJS 10 (Node.js 20+) |
| ORM | TypeORM 0.3 |
| Database | MySQL 8 |
| Authentication | JWT (`@nestjs/jwt`, `passport-jwt`) + bcrypt password hashing |
| Validation | `class-validator` / `class-transformer` (global `ValidationPipe`) |
| API testing | Postman |

## Run it locally
1. **Create the database** — import `database/schema.sql` (phpMyAdmin → Import, or `mysql -u root -p < database/schema.sql`). It creates the `03_hrgms_db` database and all tables.
2. **Configure environment** — copy `.env.example` to `.env` and fill in your MySQL password and a long random `JWT_SECRET` (32+ characters).
   ```
   cp .env.example .env        # Windows: copy .env.example .env
   ```
3. **Install** — `npm install`
4. **Start** — `npm run start:dev`
   You should see `API running on http://localhost:3000/api` and no errors.

> If you change `.env`, stop the server (Ctrl+C) and start it again — environment values are read at startup.

## Test with Postman (JWT is saved for you)
1. Import `postman/collection.json`.
2. Open the collection and run **1. Authentication → Register**, then **Login**. Login stores the JWT in the `{{token}}` collection variable automatically — you do **not** copy/paste anything.
3. Run **Me (JWT)** to confirm the token works (200 + your user).
4. Run folders **2.x** in order (parents are created before children; the IDs are saved automatically), then **3. Security & Validation Tests**, then **4. Cleanup**.
   Or use *Run collection* to execute everything; every request has assertions.

## Authentication
- `POST /api/auth/register` — create account (password stored as a bcrypt hash)
- `POST /api/auth/login` — returns `{ "access_token": "...", "token_type": "Bearer" }`
- `GET /api/auth/me` — protected; requires `Authorization: Bearer <token>`

Every domain endpoint below is protected the same way.

## Domain modules (27 endpoints in total)
- **Guest** — `/api/guests`
- **Room** — `/api/rooms`
- **Reservation** — `/api/reservations`
- **Invoice** — `/api/invoices`

Each module exposes: `GET /` (list), `GET /count`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`.
Full details with request/response examples: `docs/API_ENDPOINTS.md`.

## Project structure
```
src/
  auth/        register, login, JWT strategy/guard, jwt.config.ts (single source of the secret)
  users/       User entity
  common/      TypeOrmExceptionFilter (MySQL errors -> 400/409 instead of 500)
  modules/     one folder per resource: entity, dto, service, controller, module
  app.module.ts, main.ts
database/schema.sql      MySQL schema (re-runnable)
postman/collection.json  Postman collection with tests
docs/                    technical documentation, ERD, API reference
```

## Troubleshooting
| Symptom | Fix |
|---|---|
| `401 Unauthorized` on `/auth/me` or any route | Run **Login** first (the token is saved automatically). In Postman the request must use the collection's *Bearer Token* auth with `{{token}}`. Tokens expire after `JWT_EXPIRES_IN` (default 1 day) — just log in again. |
| App stops with `JWT_SECRET is not set` | Create `.env` from `.env.example` and set `JWT_SECRET`. |
| `ER_BAD_DB_ERROR: Unknown database` | Import `database/schema.sql` first. |
| `ER_ACCESS_DENIED_ERROR` | Wrong `DB_USER` / `DB_PASSWORD` in `.env`. |
| `EADDRINUSE` | Another app uses port 3000 — change `PORT` in `.env` (and `baseUrl` in Postman). |

## Security notes
- `.env` is git-ignored; only `.env.example` (placeholders) is committed. Never commit real credentials.
- Passwords are hashed with bcrypt (cost 12) and never returned by the API.
- The JWT secret is read once, through `ConfigService`, by both the signer and the verifier.
- Global validation rejects unknown/invalid fields; MySQL constraint errors are mapped to clear 400/409 responses.
