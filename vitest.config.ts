// Loads `.env` into process.env so the opt-in integration tests
// (INTEGRATION_DB=1) can reach a real database. Unit tests ignore it.
import 'dotenv/config'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    // `e2e/` holds Playwright specs — they must not be collected by Vitest.
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
})
