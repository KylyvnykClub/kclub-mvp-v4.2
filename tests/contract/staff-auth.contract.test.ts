import type { StaffActivationDto, StaffSessionDto } from '@kclub/contracts';
import { describe, expect, it } from 'vitest';

describe('staff auth DTO boundary', () => {
  it('exposes only safe session profile fields', () => {
    const session: StaffSessionDto = {
      authenticated: true,
      expiresAt: new Date(0).toISOString(),
      staff: {
        id: crypto.randomUUID(),
        maskedPhone: '+12••••123',
        role: 'OWNER',
        permissions: ['DASHBOARD_VIEW'],
        mfaEnabled: true,
      },
    };
    expect(Object.keys(session.staff).sort()).toEqual([
      'id',
      'maskedPhone',
      'mfaEnabled',
      'permissions',
      'role',
    ]);
    expect(JSON.stringify(session)).not.toMatch(/password|secret|tokenHash|phoneCipher/);
  });

  it('keeps enrollment secrets explicit and one-time', () => {
    const activation: StaffActivationDto = {
      challengeToken: 'challenge',
      otpauthUri: 'otpauth://totp/example',
      qrCodeDataUrl: 'data:image/png;base64,AA==',
      recoveryCodes: ['ABCD-EFGH-IJKL-MNOP'],
    };
    expect(activation).not.toHaveProperty('passwordHash');
    expect(activation).not.toHaveProperty('totpSecret');
  });
});
