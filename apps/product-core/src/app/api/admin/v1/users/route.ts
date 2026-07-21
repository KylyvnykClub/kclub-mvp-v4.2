import type { MemberListResponseDto } from '@kclub/contracts';
import { getDatabase } from '../../../../../server/database';
import {
  bearerToken,
  failure,
  requestIdFor,
  staffAuthService,
  success,
  withErrorHandling,
} from '../../../../../server/staff-auth-http';

export const GET = async (request: Request): Promise<Response> => {
  const requestId = requestIdFor(request);
  return withErrorHandling(requestId, async () => {
  const token = bearerToken(request);
  if (token === null) return failure('UNAUTHORIZED', requestId, 401);
  const session = await staffAuthService().getSession(token);
  if (session === null) return failure('UNAUTHORIZED', requestId, 401);

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') ?? '20')));
  const search = url.searchParams.get('search')?.trim() ?? '';

  const db = getDatabase();
  const where = search.length > 0
    ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search } },
          { company: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [members, total] = await Promise.all([
    db.member.findMany({
      where,
      include: {
        membershipApplication: true,
        clubCards: {
          where: { status: 'ACTIVE' },
          orderBy: { issuedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.member.count({ where }),
  ]);

  const items = members.map((m) => {
    const card = m.clubCards[0] ?? null;
    return {
      id: m.id,
      phone: m.phone,
      firstName: m.firstName,
      lastName: m.lastName,
      displayName: m.displayName,
      company: m.company,
      position: m.position,
      city: m.city,
      country: m.country,
      preferredLocale: m.preferredLocale,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      application: m.membershipApplication
        ? {
            id: m.membershipApplication.id,
            motivation: m.membershipApplication.motivation,
            referralSource: m.membershipApplication.referralSource,
            status: m.membershipApplication.status,
            createdAt: m.membershipApplication.createdAt.toISOString(),
            updatedAt: m.membershipApplication.updatedAt.toISOString(),
          }
        : null,
      activeCard: card
        ? {
            id: card.id,
            cardNumber: card.cardNumber,
            publicId: card.publicId,
            tier: card.tier,
            status: card.status as 'ACTIVE' | 'REVOKED' | 'EXPIRED',
            issuedAt: card.issuedAt.toISOString(),
            expiresAt: card.expiresAt.toISOString(),
          }
        : null,
    };
  });

  return success<MemberListResponseDto>({ items, total }, requestId);
  });
};
