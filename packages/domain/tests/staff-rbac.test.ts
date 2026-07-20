import { describe, expect, it } from 'vitest';
import { canStaff, getEffectivePermissions } from '../src';

describe('staff RBAC', () => {
  it('grants every permission to owner', () => {
    expect(getEffectivePermissions('OWNER')).toHaveLength(12);
  });

  it('keeps support read-only', () => {
    expect(canStaff('SUPPORT', 'AUDIT_VIEW')).toBe(true);
    expect(canStaff('SUPPORT', 'MEMBER_MANAGE')).toBe(false);
    expect(canStaff('SUPPORT', 'SUBSCRIPTION_MANAGE')).toBe(false);
  });

  it('denies permissions outside a role preset', () => {
    expect(canStaff('MODERATOR', 'STAFF_MANAGE')).toBe(false);
  });
});
