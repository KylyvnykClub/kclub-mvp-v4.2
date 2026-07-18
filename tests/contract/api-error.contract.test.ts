import type { ApiError } from '@kclub/contracts';
import { requestIdSchema } from '@kclub/validation';
import { describe, expect, it } from 'vitest';

describe('API error contract', () => {
  it('accepts the request ID shape used by API errors', () => {
    const error = {
      code: 'INVALID_INPUT',
      message: 'The request is invalid.',
      requestId: '22e9f35e-4a65-4fed-bb9d-9f32fd2dbb52',
    } satisfies ApiError;

    expect(requestIdSchema.parse(error.requestId)).toBe(error.requestId);
  });

  it('rejects a non-UUID request ID', () => {
    expect(requestIdSchema.safeParse('request-123').success).toBe(false);
  });
});
