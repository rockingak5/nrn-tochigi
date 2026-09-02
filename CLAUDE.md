# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo holds three independent apps that together make up the NRNA Tochigi site. They are **not** a workspace/monorepo (no shared `package.json`, no workspace config) — each has its own `package.json`, lockfile, and dev server, and must be `cd`'d into separately.

| App | Path | Stack | Dev port |
|---|---|---|---|
| Public site | `/` (root) | React 19 + Vite + Tailwind v4 + react-router-dom | 3000 |
| Admin panel | `admin/` | Same stack as public site | 4000 |
| Backend API | `backend/` | Express + TypeScript + Sequelize (MySQL) | 5000 |

Package managers differ per app: the public site uses `npm` (`package-lock.json` at the repo root), while `admin/` and `backend/` each use `pnpm` (their own `pnpm-lock.yaml`) — use the matching one when installing or running scripts in each directory.

## Commands

Run these from the relevant app directory (`.`, `admin/`, or `backend/`).

**Public site**:
```bash
npm run dev       # vite dev server
npm run build     # tsc -b && vite build
npm run lint      # oxlint
npm run preview   # preview a production build
```

**Admin panel** (same scripts, via pnpm):
```bash
cd admin
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

**Backend**:
```bash
cd backend
pnpm dev                          # tsx watch src/index.ts (hot reload)
pnpm build && pnpm start          # compile to dist/ and run it
pnpm db:migrate                   # run pending migrations
pnpm db:migrate:undo               # revert the last migration
pnpm db:migration:generate -- <name>   # scaffold a new migration
pnpm db:seed                      # run all seeders (see gotcha below)
pnpm db:seed:generate -- <name>   # scaffold a new seeder
```

There is no test suite in any of the three apps. Linting is via `oxlint` (`.oxlintrc.json` in root and `admin/`) — **not** ESLint/Prettier/Biome.

To run the full stack locally you need all three dev servers plus a MySQL instance running on the port in `backend/.env` (`DB_PORT`). Each app reads its backend URL / CORS origins from its own `.env` (see "Environment" below) — copy the matching `.env.example` first.

## Architecture

### Backend (`backend/src`)

Layered Express app: `routes/*.routes.ts` → `controllers/*.controller.ts` → Sequelize models in `database/models/`. `app.ts` wires up CORS, `express-session`, static `/uploads` serving, and mounts everything under `routes/index.ts` at `/api`.

**Auth** is server-side sessions, not JWT: `express-session` + `connect-session-sequelize` (session store lives in the same MySQL DB, table auto-created on boot). `middlewares/requireAdminAuth.ts` checks `req.session.adminId`; admin login/logout/me live in `adminAuth.controller.ts` / `adminAuth.routes.ts`. The admin app's `fetch` calls use `credentials: 'include'`, so `CORS_ORIGINS` in `backend/.env` must list every origin (public site, admin, and any tunnel like ngrok) that needs to send the session cookie — an origin missing from that list fails silently with a browser CORS error even though the server itself returns 200.

**Content resources** (news, events, services, team members) all follow the same shape: one `<name>.routes.ts` per resource with a public `GET /` and admin-gated `POST/PUT/DELETE` (via `requireAdminAuth`), backed by a matching `<name>.controller.ts` and Sequelize model. `pages.routes.ts` is the one exception — `Page` rows are a **fixed, pre-seeded set** keyed by `slug` (one per entry in `src/navLinks.ts`'s `othersLinks`/`aboutLinks`), so it only supports read + update, never create/delete from the admin UI.

**Image uploads** go through `POST /api/admin/uploads` (multer, disk storage into `backend/uploads/`, returned as a `/uploads/<file>` URL) and are served back via `express.static`.

**Migrations/seeders are plain CommonJS `.js`**, not TypeScript, even though the rest of the backend is TS — this is intentional (see `backend/README.md`): `sequelize-cli` `require()`s them directly, and TS loading conflicts with that in this Node setup. Follow the existing files in `database/migrations/` and `database/seeders/` as the template for new ones.

**Seeders are not tracked between runs** — `pnpm db:seed` re-executes every seeder file every time (sequelize-cli only tracks migrations by default, not seeders here). Any new seeder must be idempotent (check for existing rows before inserting), the way `seed-admin.js` and `seed-pages.js` already do.

**`.env` changes require a manual backend restart** — `tsx watch` only watches source files, not `.env`, so editing `backend/.env` won't hot-reload; kill and re-run `pnpm dev`.

### Admin panel (`admin/src`)

- `context/AuthContext.tsx` calls `GET /api/admin/me` on load and exposes `login`/`logout`; `components/Layout.tsx` is the route guard (redirects to `/login` if unauthenticated) and renders the sidebar nav.
- `lib/api.ts` is a thin fetch wrapper (`credentials: 'include'`, JSON by default, `upload()` for multipart) pointed at `VITE_API_URL`.
- `components/ResourceEditor.tsx` is a **generic list+form CRUD component** driven by a `fields` config (`text`/`textarea`/`number`/`image`) — this is what every growable resource page (`pages/News.tsx`, `Events.tsx`, `Services.tsx`, `Team.tsx`) is built on. Adding a new growable resource to the admin UI should mean adding one small page file that configures `ResourceEditor`, not writing new CRUD UI from scratch.
- `pages/Pages.tsx` is separate from `ResourceEditor` (list-only, no add/delete, edits via `RichTextEditor.tsx`) because the underlying `Page` resource is a fixed set, not growable — see the backend note above.
- `components/RichTextEditor.tsx` is a small `contentEditable` + `document.execCommand` toolbar (bold/italic/underline/headings/lists/links) — deliberately not a third-party editor library, since formatting needs are basic.

### Public site (`src/`)

- `lib/api.ts` mirrors the admin app's fetch helper (no credentials needed — all public endpoints are unauthenticated reads) plus `resolveAssetUrl()` for turning a `/uploads/...` path into a full URL against `VITE_API_URL`.
- Content pages (`pages/News.tsx`, `Events.tsx`, `Services.tsx`, `OurTeam.tsx`) fetch their data in a `useEffect` on mount; each falls back to a bundled placeholder SVG (`assets/placeholder-image.svg`) when a record has no image.
- `pages/ContentPage.tsx` is the generic renderer for the `Page` resource — `App.tsx` maps every entry in `navLinks.ts`'s `othersLinks`/`aboutLinks` to a route rendering `<ContentPage slug={link.to} fallbackTitle={link.label} />`, so adding a new nav link there requires also adding a matching `Page` seed row (slug must match `link.to`) or the page will render its own "coming soon" fallback instead of 404ing.
- `navLinks.ts` is the single source of truth for primary nav, the "Others" dropdown, and the "About us" dropdown (`components/Navigation.tsx` reads from it directly).

## Environment

Each app needs its own `.env` (copy from the matching `.env.example`):

- **Backend** (`backend/.env`): `PORT`, `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASSWORD`, `CORS_ORIGINS` (comma-separated allowlist), `SESSION_SECRET`, and `ADMIN_USERNAME`/`ADMIN_PASSWORD` (only read by `pnpm db:seed`, to create/update the one seeded admin login).
- **Public site / admin panel** (`.env` at root and in `admin/`): `VITE_API_URL`, pointing at the backend.

Current local dev ports: public site `3000`, admin `4000`, backend `5000` — keep `CORS_ORIGINS` and both `VITE_API_URL` values in sync if any of these change.
