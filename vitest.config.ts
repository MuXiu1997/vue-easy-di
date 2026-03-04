import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '~': `${path.resolve(__dirname, 'src')}`,
      '#/': `${path.resolve(__dirname, 'test')}/`,
      '#': `${path.resolve(__dirname, 'test')}`,
    },
  },
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**'],
    },
  },
})
