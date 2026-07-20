import { describe, expect, it } from 'vitest';
import { staffActivateSchema, staffMfaVerifySchema, staffSignInSchema } from '../src';

describe('staff auth validation', () => {
  it('accepts E.164 phone and a strong staff password', () => {
    expect(
      staffSignInSchema.safeParse({ phone: '+12025550123', password: 'Operations2026' }).success,
    ).toBe(true);
  });

  it('rejects weak passwords and local phone formats', () => {
    expect(staffSignInSchema.safeParse({ phone: '2025550123', password: 'password' }).success).toBe(
      false,
    );
    expect(
      staffActivateSchema.safeParse({ inviteToken: 'x'.repeat(32), password: 'short' }).success,
    ).toBe(false);
  });

  it('accepts TOTP and recovery code shapes only', () => {
    expect(
      staffMfaVerifySchema.safeParse({ challengeToken: 'x'.repeat(32), code: '123456' }).success,
    ).toBe(true);
    expect(
      staffMfaVerifySchema.safeParse({
        challengeToken: 'x'.repeat(32),
        code: 'AB12-CD34-EF56-GH78',
      }).success,
    ).toBe(true);
    expect(
      staffMfaVerifySchema.safeParse({ challengeToken: 'x'.repeat(32), code: '12345' }).success,
    ).toBe(false);
  });
});
