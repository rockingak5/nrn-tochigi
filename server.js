import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const distPath = path.join(__dirname, 'dist')

// Serve the production build produced by `npm run build`
app.use(express.static(distPath))

// SPA fallback: let react-router-dom handle client-side routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`nrn-tochigi public site listening on port ${port}`)
})
