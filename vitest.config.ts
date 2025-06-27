import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/test.setup.ts'],
    globals: true,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', '**/test.ts'],
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
  },
})
