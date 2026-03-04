import { defineConfig } from 'tsdown'

export default defineConfig({
  platform: 'browser',
  target: 'es2015',
  entry: ['./src/index.ts'],
  format: ['esm', 'iife'],
  dts: true,
  clean: true,
  sourcemap: true,
  inlineOnly: false,
  outputOptions: {
    name: 'VueEasyDi',
    globals: {
      vue: 'Vue',
    },
  },
})
