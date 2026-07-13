import 'dotenv/config'
import { defineConfig } from 'prisma/config'

/**
 * `prisma generate` runs on postinstall — including on a fresh clone and in CI,
 * where there is no database and no `.env`. It only reads the schema, so it does
 * not need a reachable server; the placeholder keeps it from failing on a
 * missing variable.
 *
 * Commands that do talk to the database (`migrate`, `studio`) need a real
 * `DATABASE_URL` in `.env` — see `.env.example`.
 */
const PLACEHOLDER_URL = 'postgresql://set-DATABASE_URL-in-your-env'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? PLACEHOLDER_URL,
  },
})
