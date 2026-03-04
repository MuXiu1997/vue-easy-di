import { defineConfig } from 'tsdown'

export default defineConfig({
  platform: 'browser',
  target: 'es2015',
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  clean: true,
  publint: 'ci-only',
  attw: 'ci-only',
  shims: true,
  cjsDefault: false,
  sourcemap: true,
  inlineOnly: false,
  outputOptions: {
    name: 'VueEasyDi',
    globals: {
      vue: 'Vue',
    },
  },
})
