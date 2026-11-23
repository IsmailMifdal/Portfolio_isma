import { defineConfig } from 'vitest/config';

// Tests de la fonction serveur /api/chat (Node), séparés des tests Angular (`ng test`).
export default defineConfig({
  test: {
    root: new URL('..', import.meta.url).pathname,
    include: ['tests/api/**/*.test.ts'],
    environment: 'node',
  },
});
