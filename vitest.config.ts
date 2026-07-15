import { getViteConfig } from 'astro/config';
import { defineConfig } from 'vitest/config';

export default defineConfig(
  getViteConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'dist/',
          '.astro/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/mockData',
          '**/mocks',
        ],
      },
    },
  })
);
