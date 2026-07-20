import 'server-only';

import { hash, verify } from '@node-rs/argon2';
import type { PrismaClient } from '@kclub/database';
import { getEffectivePermissions } from '@kclub/domain';
import type {
  StaffActivationDto,
  StaffMfaChallengeDto,
  StaffRole,
  StaffSessionDto,
  StaffSessionTokenDto,
} from '@kclub/contracts';
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';

import {
  createRecoveryCodes,
  decryptSecret,
  encryptSecret,
  hashPhone,
  hashSecret,
  maskPhone,
  randomToken,
} from './staff-auth-crypto';

const CHALLENGE_MS = 5 * 60 * 1000;
const SESSION_MS = 8 * 60 * 60 * 1000;
const invalidCredentials = new Error('INVALID_CREDENTIALS');

type RequestContext = Readonly<{ requestId: string }>;

const toSessionDto = (
  staff: {
    id: string;
    phoneCipher: string;
    role: StaffRole;
    mfaMethods: readonly { verifiedAt: Date | null }[];
  },
  expiresAt: Date,
): StaffSessionDto => ({
  authenticated: true,
  expiresAt: expiresAt.toISOString(),
  staff: {
    id: staff.id,
    maskedPhone: maskPhone(decryptSecret(staff.phoneCipher)),
    role: staff.role,
    permissions: getEffectivePermissions(staff.role),
    mfaEnabled: staff.mfaMethods.some((method) => method.verifiedAt !== null),
  },
});

export const createStaffAuthService = (database: PrismaClient) => ({
  activate: async (
    input: { inviteToken: string; password: string },
    context: RequestContext,
  ): Promise<StaffActivationDto> => {
    const now = new Date();
    const invite = await database.staffInvite.findUnique({
      where: { tokenHash: hashSecret(input.inviteToken) },
      include: { staff: true },
    });
    if (
      invite === null ||
      invite.consumedAt !== null ||
      invite.expiresAt <= now ||
      !invite.staff.isActive
    )
      throw invalidCredentials;

    const passwordHash = await hash(input.password, {
      algorithm: 2,
      memoryCost: 19456,
      timeCost: 3,
      parallelism: 1,
    });
    const totp = new OTPAuth.TOTP({
      issuer: 'KYLYVNYK CLUB',
      label: decryptSecret(invite.staff.phoneCipher),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });
    const recoveryCodes = createRecoveryCodes();
    const challengeToken = randomToken();
    const expiresAt = new Date(now.getTime() + CHALLENGE_MS);

    await database.$transaction(async (tx) => {
      await tx.staffCredential.upsert({
        where: { staffId: invite.staffId },
        create: { staffId: invite.staffId, passwordHash },
        update: { passwordHash },
      });
      await tx.staffMfaMethod.deleteMany({ where: { staffId: invite.staffId } });
      await tx.staffRecoveryCode.deleteMany({ where: { staffId: invite.staffId } });
      await tx.staffMfaMethod.create({
        data: { staffId: invite.staffId, secretCipher: encryptSecret(totp.secret.base32) },
      });
      await tx.staffRecoveryCode.createMany({
        data: recoveryCodes.map((code) => ({
          staffId: invite.staffId,
          codeHash: hashSecret(code),
        })),
      });
      await tx.staffAuthChallenge.create({
        data: {
          staffId: invite.staffId,
          tokenHash: hashSecret(challengeToken),
          purpose: 'ACTIVATE',
          expiresAt,
        },
      });
      await tx.staffInvite.update({ where: { id: invite.id }, data: { consumedAt: now } });
      await tx.auditEvent.create({
        data: {
          actorStaffId: invite.staffId,
          action: 'STAFF_ACTIVATION_STARTED',
          resourceType: 'STAFF_USER',
          resourceId: invite.staffId,
          requestId: context.requestId,
          metadata: {},
        },
      });
    });

    const otpauthUri = totp.toString();
    return {
      challengeToken,
      otpauthUri,
      qrCodeDataUrl: await QRCode.toDataURL(otpauthUri),
      recoveryCodes,
    };
  },

  signIn: async (
    input: { phone: string; password: string },
    context: RequestContext,
  ): Promise<StaffMfaChallengeDto> => {
    const staff = await database.staffUser.findUnique({
      where: { phoneHash: hashPhone(input.phone) },
      include: { credential: true, mfaMethods: true },
    });
    if (
      staff === null ||
      staff.credential === null ||
      !staff.isActive ||
      !staff.mfaMethods.some((method) => method.verifiedAt !== null)
    ) {
      await hash(input.password);
      throw invalidCredentials;
    }
    if (!(await verify(staff.credential.passwordHash, input.password))) throw invalidCredentials;
    const challengeToken = randomToken();
    const expiresAt = new Date(Date.now() + CHALLENGE_MS);
    await database.$transaction([
      database.staffAuthChallenge.create({
        data: {
          staffId: staff.id,
          tokenHash: hashSecret(challengeToken),
          purpose: 'SIGN_IN',
          expiresAt,
        },
      }),
      database.auditEvent.create({
        data: {
          actorStaffId: staff.id,
          action: 'STAFF_PASSWORD_VERIFIED',
          resourceType: 'STAFF_USER',
          resourceId: staff.id,
          requestId: context.requestId,
          metadata: {},
        },
      }),
    ]);
    return { challengeToken, expiresAt: expiresAt.toISOString() };
  },

  verifyMfa: async (
    input: { challengeToken: string; code: string },
    context: RequestContext,
  ): Promise<StaffSessionTokenDto> => {
    const now = new Date();
    const challenge = await database.staffAuthChallenge.findUnique({
      where: { tokenHash: hashSecret(input.challengeToken) },
      include: { staff: { include: { mfaMethods: true } } },
    });
    if (
      challenge === null ||
      challenge.consumedAt !== null ||
      challenge.expiresAt <= now ||
      !challenge.staff.isActive
    )
      throw invalidCredentials;
    const method = challenge.staff.mfaMethods[0];
    if (method === undefined) throw invalidCredentials;
    const isTotp =
      /^\d{6}$/.test(input.code) &&
      new OTPAuth.TOTP({
        secret: OTPAuth.Secret.fromBase32(decryptSecret(method.secretCipher)),
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
      }).validate({ token: input.code, window: 1 }) !== null;
    const recovery = isTotp
      ? null
      : await database.staffRecoveryCode.findUnique({
          where: { codeHash: hashSecret(input.code.toUpperCase()) },
        });
    if (
      !isTotp &&
      (recovery === null || recovery.staffId !== challenge.staffId || recovery.consumedAt !== null)
    )
      throw invalidCredentials;

    const sessionToken = randomToken();
    const expiresAt = new Date(now.getTime() + SESSION_MS);
    await database.$transaction(async (tx) => {
      await tx.staffAuthChallenge.update({
        where: { id: challenge.id },
        data: { consumedAt: now },
      });
      if (recovery !== null)
        await tx.staffRecoveryCode.update({
          where: { id: recovery.id },
          data: { consumedAt: now },
        });
      if (challenge.purpose === 'ACTIVATE')
        await tx.staffMfaMethod.update({ where: { id: method.id }, data: { verifiedAt: now } });
      await tx.staffSession.create({
        data: { staffId: challenge.staffId, tokenHash: hashSecret(sessionToken), expiresAt },
      });
      await tx.auditEvent.create({
        data: {
          actorStaffId: challenge.staffId,
          action: 'STAFF_SESSION_CREATED',
          resourceType: 'STAFF_SESSION',
          requestId: context.requestId,
          metadata: { mfa: recovery === null ? 'TOTP' : 'RECOVERY_CODE' },
        },
      });
    });
    return {
      sessionToken,
      session: toSessionDto(
        {
          ...challenge.staff,
          mfaMethods: challenge.staff.mfaMethods.map((item) => ({
            ...item,
            verifiedAt: item.id === method.id ? now : item.verifiedAt,
          })),
        },
        expiresAt,
      ),
    };
  },

  getSession: async (token: string): Promise<StaffSessionDto | null> => {
    const now = new Date();
    const session = await database.staffSession.findUnique({
      where: { tokenHash: hashSecret(token) },
      include: { staff: { include: { mfaMethods: true } } },
    });
    if (
      session === null ||
      session.revokedAt !== null ||
      session.expiresAt <= now ||
      !session.staff.isActive
    )
      return null;
    await database.staffSession.update({ where: { id: session.id }, data: { lastSeenAt: now } });
    return toSessionDto(session.staff, session.expiresAt);
  },

  logout: async (token: string, context: RequestContext): Promise<void> => {
    const session = await database.staffSession.findUnique({
      where: { tokenHash: hashSecret(token) },
    });
    if (session === null || session.revokedAt !== null) return;
    await database.$transaction([
      database.staffSession.update({ where: { id: session.id }, data: { revokedAt: new Date() } }),
      database.auditEvent.create({
        data: {
          actorStaffId: session.staffId,
          action: 'STAFF_SESSION_REVOKED',
          resourceType: 'STAFF_SESSION',
          resourceId: session.id,
          requestId: context.requestId,
          metadata: {},
        },
      }),
    ]);
  },
});

export const isInvalidCredentials = (error: unknown): boolean => error === invalidCredentials;
