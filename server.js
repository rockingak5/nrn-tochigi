import 'dotenv/config'
import express from 'express'
import path from 'path'
import bcrypt from 'bcrypt'
import { fileURLToPath } from 'url'

// Compiled backend (Express API app + Sequelize models). The backend's
// TypeScript is compiled by `tsc -p backend/tsconfig.json` as part of the
// root `npm run build`, and its runtime dependencies (bcrypt, sequelize,
// mysql2, cors, express-session, etc.) live in this project's root
// node_modules, since Node's module resolution walks up parent directories
// looking for node_modules.
// The compiled backend is CommonJS (built with esModuleInterop), which
// means `export default app` compiles to `exports.default = app`. Node's
// ESM loader treats a CJS module's whole `module.exports` as the default
// export when imported from ESM — it does NOT auto-unwrap `.default` the
// way TypeScript's own interop does — so we unwrap it ourselves here.
import appPkg from './backend/dist/app.js'
const backendApp = appPkg.default

import modelsPkg from './backend/dist/database/models/index.js'
const { sequelize, Admin } = modelsPkg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// TEMP DEBUG — remove after diagnosing the session-cookie issue on Preview.
app.use((req, _res, next) => {
  console.log('TEMP_DEBUG_COOKIE_HEADER_PRESENT', req.method, req.path, req.headers.cookie ? 'yes' : 'no')
  next()
})

// --- API (mounted first so it takes priority over the static file servers) ---
// backendApp already wires up CORS, sessions, /health, /uploads and all
// /api/* routes internally. Because everything now runs on one origin,
// the admin panel's session cookie (SameSite=Lax) works correctly — no
// more cross-site cookie problem.
app.use(backendApp)

// --- Admin panel (built from admin/, served at /admin) ---
const adminDist = path.join(__dirname, 'admin', 'dist')
app.use('/admin', express.static(adminDist))
app.get('/admin/*', (_req, res) => {
  res.sendFile(path.join(adminDist, 'index.html'))
})

// --- Public site (built from the repo root, served at /) ---
const publicDist = path.join(__dirname, 'dist')
app.use(express.static(publicDist))
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDist, 'index.html'))
})

const port = process.env.PORT || 3000

async function bootstrapAdmin() {
  // Make sure the `admins` table has at least one login. This substitutes
  // for running `sequelize-cli db:seed` by hand (there's no shell access on
  // the host). It's idempotent: it only creates a row if none exists yet,
  // and only if the ADMIN_USERNAME/ADMIN_PASSWORD secrets are set.
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.warn('ADMIN_USERNAME/ADMIN_PASSWORD not set — skipping admin bootstrap')
    return
  }

  const existing = await Admin.findOne({ where: { username: ADMIN_USERNAME } })
  if (existing) return

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  await Admin.create({ username: ADMIN_USERNAME, passwordHash })
  console.log(`Created initial admin user "${ADMIN_USERNAME}"`)
}

async function main() {
  await sequelize.authenticate()
  // Create any tables that don't exist yet (fresh database). This never
  // drops or alters existing tables/columns.
  await sequelize.sync()
  await bootstrapAdmin()

  app.listen(port, () => {
    console.log(`nrn-tochigi (public + admin + api) listening on port ${port}`)
  })
}

main().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})
