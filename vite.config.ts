import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // unit tests live next to the code (*.test.ts); end-to-end tests are in e2e/ (Playwright)
  // css.include: let icons.css through as text (Vitest blanks CSS by default)
  // json: reports/unit.json, picked up by e2e/reporter.ts for Under the hood, Tests
  test: {
    include: ['src/**/*.test.ts'],
    css: { include: [/icons\.css/] },
    reporters: ['default', 'json'],
    outputFile: { json: 'reports/unit.json' },
  },
})
