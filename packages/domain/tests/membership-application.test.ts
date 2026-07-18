import { describe, expect, it } from 'vitest';

import { canTransitionMembershipApplication } from '../src/index';

describe('canTransitionMembershipApplication', () => {
  it('allows a submitted application to enter review', () => {
    expect(canTransitionMembershipApplication('SUBMITTED', 'UNDER_REVIEW')).toBe(true);
  });

  it('rejects approval before review', () => {
    expect(canTransitionMembershipApplication('SUBMITTED', 'APPROVED')).toBe(false);
  });
});
