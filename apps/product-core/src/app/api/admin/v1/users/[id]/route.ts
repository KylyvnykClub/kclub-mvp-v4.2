import type { MemberDetailDto, MemberUpdateInputDto } from '@kclub/contracts';
import { getDatabase } from '../../../../../../server/database';
import {
  bearerToken,
  failure,
  readJson,
  requestIdFor,
  staffAuthService,
  success,
  withErrorHandling,
} from '../../../../../../server/staff-auth-http';

type RouteContext = Readonly<{ params: Promise<{ id: string }> }>;

const VALID_LOCALES = ['en', 'uk', 'ru'] as const;
type SupportedLocale = (typeof VALID_LOCALES)[number];

const isValidLocale = (v: unknown): v is SupportedLocale =>
  typeof v === 'string' && (VALID_LOCALES as readonly string[]).includes(v);

const toActiveCard = (
  card: {
    id: string;
    cardNumber: string;
    publicId: string;
    tier: string;
    status: string;
    issuedAt: Date;
    expiresAt: Date;
  } | null | undefined,
) => {
  if (!card) return null;
  return {
    id: card.id,
    cardNumber: card.cardNumber,
    publicId: card.publicId,
    tier: card.tier,
    status: card.status as 'ACTIVE' | 'REVOKED' | 'EXPIRED',
    issuedAt: card.issuedAt.toISOString(),
    expiresAt: card.expiresAt.toISOString(),
  };
};

export const GET = async (request: Request, context: RouteContext): Promise<Response> => {
  const requestId = requestIdFor(request);
  return withErrorHandling(requestId, async () => {
  const token = bearerToken(request);
  if (token === null) return failure('UNAUTHORIZED', requestId, 401);
  const session = await staffAuthService().getSession(token);
  if (session === null) return failure('UNAUTHORIZED', requestId, 401);

  const { id } = await context.params;
  const db = getDatabase();
  const member = await db.member.findUnique({
    where: { id },
    include: {
      membershipApplication: true,
      clubCards: {
        where: { status: 'ACTIVE' },
        orderBy: { issuedAt: 'desc' },
        take: 1,
      },
    },
  });

  if (member === null) return failure('NOT_FOUND', requestId, 404);

  const dto: MemberDetailDto = {
    id: member.id,
    supabaseUserId: member.supabaseUserId,
    phone: member.phone,
    firstName: member.firstName,
    lastName: member.lastName,
    displayName: member.displayName,
    company: member.company,
    position: member.position,
    bio: member.bio,
    city: member.city,
    country: member.country,
    preferredLocale: member.preferredLocale,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
    application: member.membershipApplication
      ? {
          id: member.membershipApplication.id,
          motivation: member.membershipApplication.motivation,
          referralSource: member.membershipApplication.referralSource,
          status: member.membershipApplication.status,
          createdAt: member.membershipApplication.createdAt.toISOString(),
          updatedAt: member.membershipApplication.updatedAt.toISOString(),
        }
      : null,
    activeCard: toActiveCard(member.clubCards[0]),
  };

  return success(dto, requestId);
  });
};

export const PATCH = async (request: Request, context: RouteContext): Promise<Response> => {
  const requestId = requestIdFor(request);
  return withErrorHandling(requestId, async () => {
  const token = bearerToken(request);
  if (token === null) return failure('UNAUTHORIZED', requestId, 401);
  const session = await staffAuthService().getSession(token);
  if (session === null) return failure('UNAUTHORIZED', requestId, 401);

  const { id } = await context.params;
  const db = getDatabase();

  const existing = await db.member.findUnique({ where: { id } });
  if (existing === null) return failure('NOT_FOUND', requestId, 404);

  const body = await readJson<MemberUpdateInputDto>(request, {
    safeParse: (input: unknown) => {
      if (typeof input !== 'object' || input === null) return { success: false } as const;
      const d = input as Record<string, unknown>;

      // Reject any attempt to set phone or supabaseUserId
      if ('phone' in d || 'supabaseUserId' in d) return { success: false } as const;

      if (d.firstName !== undefined && (typeof d.firstName !== 'string' || d.firstName.trim().length === 0))
        return { success: false } as const;
      if (d.lastName !== undefined && (typeof d.lastName !== 'string' || d.lastName.trim().length === 0))
        return { success: false } as const;
      if (d.displayName !== undefined && d.displayName !== null && typeof d.displayName !== 'string')
        return { success: false } as const;
      if (d.company !== undefined && d.company !== null && typeof d.company !== 'string')
        return { success: false } as const;
      if (d.position !== undefined && d.position !== null && typeof d.position !== 'string')
        return { success: false } as const;
      if (d.bio !== undefined && d.bio !== null && typeof d.bio !== 'string')
        return { success: false } as const;
      if (d.city !== undefined && d.city !== null && typeof d.city !== 'string')
        return { success: false } as const;
      if (d.country !== undefined && d.country !== null && typeof d.country !== 'string')
        return { success: false } as const;
      if (d.preferredLocale !== undefined && !isValidLocale(d.preferredLocale))
        return { success: false } as const;

      return { success: true, data: d as unknown as MemberUpdateInputDto } as const;
    },
  });

  if (body === null) return failure('INVALID_INPUT', requestId, 400);

  const updated = await db.member.update({
    where: { id },
    data: {
      ...(body.firstName !== undefined ? { firstName: body.firstName.trim() } : {}),
      ...(body.lastName !== undefined ? { lastName: body.lastName.trim() } : {}),
      ...(body.displayName !== undefined ? { displayName: body.displayName } : {}),
      ...(body.company !== undefined ? { company: body.company } : {}),
      ...(body.position !== undefined ? { position: body.position } : {}),
      ...(body.bio !== undefined ? { bio: body.bio } : {}),
      ...(body.city !== undefined ? { city: body.city } : {}),
      ...(body.country !== undefined ? { country: body.country } : {}),
      ...(body.preferredLocale !== undefined ? { preferredLocale: body.preferredLocale } : {}),
    },
    include: {
      membershipApplication: true,
      clubCards: {
        where: { status: 'ACTIVE' },
        orderBy: { issuedAt: 'desc' },
        take: 1,
      },
    },
  });

  const dto: MemberDetailDto = {
    id: updated.id,
    supabaseUserId: updated.supabaseUserId,
    phone: updated.phone,
    firstName: updated.firstName,
    lastName: updated.lastName,
    displayName: updated.displayName,
    company: updated.company,
    position: updated.position,
    bio: updated.bio,
    city: updated.city,
    country: updated.country,
    preferredLocale: updated.preferredLocale,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
    application: updated.membershipApplication
      ? {
          id: updated.membershipApplication.id,
          motivation: updated.membershipApplication.motivation,
          referralSource: updated.membershipApplication.referralSource,
          status: updated.membershipApplication.status,
          createdAt: updated.membershipApplication.createdAt.toISOString(),
          updatedAt: updated.membershipApplication.updatedAt.toISOString(),
        }
      : null,
    activeCard: toActiveCard(updated.clubCards[0]),
  };

  return success(dto, requestId);
  });
};
