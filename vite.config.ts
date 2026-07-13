// Loads `.env` into process.env so the API handlers mounted by `apiDevServer`
// can read DATABASE_URL / BETTER_AUTH_* during local development.
import 'dotenv/config'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { apiDevServer } from './vite/apiDevServer.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevServer()],
})
