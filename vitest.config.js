import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**']
    },
    globals: true,
    reporters: ['basic'],
    globalSetup: './setup.js',
    fileParallelism: false,
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname
    }
  }
});
