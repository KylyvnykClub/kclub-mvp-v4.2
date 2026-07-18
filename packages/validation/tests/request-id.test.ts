import { describe, expect, it } from 'vitest';

import { requestIdSchema } from '../src/index';

describe('requestIdSchema', () => {
  it('accepts UUID request IDs', () => {
    const requestId = 'f9369fc6-3fc9-4204-a678-c59c2d7abf52';

    expect(requestIdSchema.parse(requestId)).toBe(requestId);
  });

  it('rejects arbitrary strings', () => {
    expect(requestIdSchema.safeParse('not-a-request-id').success).toBe(false);
  });
});
