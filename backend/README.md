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

## S3 setup (image uploads)

`POST /api/admin/uploads` (`src/utils/s3.ts`) uploads straight to S3 — there
is no local-disk fallback, so `AWS_REGION`/`AWS_S3_BUCKET`/credentials are
required in every environment (see `.env.example`).

1. **Create the bucket** — any region close to your users (e.g.
   `ap-northeast-1` for Japan). Leave "Block all public access" off only for
   this bucket (Free Tier: 5GB storage / 20k GET / 2k PUT per month for the
   first 12 months, which comfortably covers a site like this).
2. **Bucket policy** — public *read* only, no listing, scoped to the
   `uploads/` prefix these routes write to:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadUploads",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/uploads/*"
       }
     ]
   }
   ```
3. **IAM user for the backend** — create a dedicated IAM user (not your root
   account) with a policy scoped to just this bucket/prefix and just the
   actions the app needs (`PutObject` to upload; no `Delete*`/`List*`, since
   nothing in the app deletes or lists objects):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": "s3:PutObject",
         "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/uploads/*"
       }
     ]
   }
   ```
   Generate an access key for this user and put it in `AWS_ACCESS_KEY_ID` /
   `AWS_SECRET_ACCESS_KEY`. Never reuse a personal/root AWS key here.
4. Leave `AWS_S3_PUBLIC_BASE_URL` unset to serve files directly from the
   bucket's own URL. If you later add a CDN (e.g. CloudFront) in front of
   the bucket, point this at its domain instead — no code change needed,
   and already-uploaded files keep working since the object keys don't change.

## Notes

- App code (models, routes, controllers) is TypeScript, loaded directly by `tsx`/`node`.
- Sequelize CLI config, migrations, and seeders under `src/database/` are plain CommonJS `.js` files. This is intentional: `sequelize-cli` `require()`s these files directly, and Node's built-in TypeScript stripping conflicts with `ts-node` on newer Node versions when loading `.ts` files this way — plain `.js` avoids that entirely.
