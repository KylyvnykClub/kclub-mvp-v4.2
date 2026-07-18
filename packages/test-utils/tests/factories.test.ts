import { beforeEach, describe, expect, it } from 'vitest';

import { createTestId, resetFactorySequences } from '../src/index';

describe('deterministic test IDs', () => {
  beforeEach(() => {
    resetFactorySequences();
  });

  it('creates repeatable sequences for isolated tests', () => {
    expect(createTestId('member')).toBe('member-1');
    expect(createTestId('member')).toBe('member-2');
  });
});
