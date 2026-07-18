import { afterAll, afterEach, beforeAll } from 'vitest';

import { testServer } from './msw-server';

beforeAll(() => {
  testServer.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  testServer.resetHandlers();
});

afterAll(() => {
  testServer.close();
});
