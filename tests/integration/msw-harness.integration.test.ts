import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { testServer } from '../setup/msw-server';

describe('integration test network boundary', () => {
  it('intercepts an explicitly declared provider request', async () => {
    testServer.use(
      http.get('https://provider.test/health', () => HttpResponse.json({ status: 'available' })),
    );

    const response = await fetch('https://provider.test/health');
    const payload: unknown = await response.json();

    expect(response.ok).toBe(true);
    expect(payload).toEqual({ status: 'available' });
  });
});
