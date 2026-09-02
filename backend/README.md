# nrn-tochigi backend

Node.js + Express + TypeScript API, using Sequelize (MySQL) with migrations via `sequelize-cli`.

## Setup

```bash
cd backend
pnpm install
cp .env.example .env   # fill in your MySQL credentials
```

Create the database, then run migrations:

```bash
pnpm db:migrate
```

## Development

```bash
pnpm dev        # starts the API with hot reload (http://localhost:4000)
```

## Scripts

- `pnpm dev` — run the dev server (tsx watch)
- `pnpm build` / `pnpm start` — compile to `dist/` and run the compiled server
- `pnpm db:migrate` — run pending migrations
- `pnpm db:migrate:undo` — revert the last migration
- `pnpm db:migration:generate -- <name>` — scaffold a new migration
- `pnpm db:seed` — run seeders
- `pnpm db:seed:generate -- <name>` — scaffold a new seeder

## Notes

- App code (models, routes, controllers) is TypeScript, loaded directly by `tsx`/`node`.
- Sequelize CLI config, migrations, and seeders under `src/database/` are plain CommonJS `.js` files. This is intentional: `sequelize-cli` `require()`s these files directly, and Node's built-in TypeScript stripping conflicts with `ts-node` on newer Node versions when loading `.ts` files this way — plain `.js` avoids that entirely.
