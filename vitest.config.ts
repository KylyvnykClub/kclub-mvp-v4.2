import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: [
        'packages/domain/src/**/*.ts',
        'packages/test-utils/src/**/*.ts',
        'packages/validation/src/**/*.ts',
      ],
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          environment: 'node',
          exclude: ['**/*.contract.{test,spec}.ts', '**/*.integration.{test,spec}.ts'],
          include: ['packages/*/tests/**/*.{test,spec}.ts'],
          name: 'unit',
        },
      },
      {
        extends: true,
        test: {
          environment: 'node',
          include: ['tests/contract/**/*.contract.{test,spec}.ts'],
          name: 'contract',
        },
      },
      {
        extends: true,
        test: {
          environment: 'node',
          include: ['tests/integration/**/*.integration.{test,spec}.ts'],
          name: 'integration',
          setupFiles: ['tests/setup/integration.ts'],
        },
      },
    ],
  },
});
