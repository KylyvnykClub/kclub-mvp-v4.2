import type { PartnerDto, PartnerInputDto } from '@kclub/contracts';
import { isValidCountryCode } from '../../../../../../features/partners/countries';
import { getDatabase } from '../../../../../../server/database';
import {
  bearerToken,
  failure,
  readJson,
  requestIdFor,
  staffAuthService,
  success,
} from '../../../../../../server/staff-auth-http';

const VALID_CATEGORIES = ['ADVISORY', 'FINANCE', 'LEGAL', 'TECHNOLOGY'] as const;
const MAX_FEATURED_PER_FLAG = 3;

const isValidCategory = (v: string): v is (typeof VALID_CATEGORIES)[number] =>
  VALID_CATEGORIES.includes(v as (typeof VALID_CATEGORIES)[number]);

type PartnerWithOwner = {
  id: string;
  slug: string;
  category: string;
  country: string;
  city: string | null;
  phone: string | null;
  discountPercent: number;
  image: string;
  translations: unknown;
  isActive: boolean;
  sortOrder: number;
  ownerId: string | null;
  owner: { id: string; firstName: string; lastName: string; phone: string } | null;
  featuredTop: boolean;
  featuredRecommended: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  subscriptionStatus: string;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const toDto = (row: PartnerWithOwner): PartnerDto => ({
  id: row.id,
  slug: row.slug,
  category: row.category as PartnerDto['category'],
  country: row.country,
  city: row.city,
  phone: row.phone,
  discountPercent: row.discountPercent,
  image: row.image,
  translations: row.translations as PartnerDto['translations'],
  isActive: row.isActive,
  sortOrder: row.sortOrder,
  ownerId: row.ownerId,
  ownerName: row.owner ? `${row.owner.firstName} ${row.owner.lastName}` : null,
  featuredTop: row.featuredTop,
  featuredRecommended: row.featuredRecommended,
  stripeCustomerId: row.stripeCustomerId,
  stripeSubscriptionId: row.stripeSubscriptionId,
  stripePriceId: row.stripePriceId,
  subscriptionStatus: row.subscriptionStatus as PartnerDto['subscriptionStatus'],
  currentPeriodStart: row.currentPeriodStart?.toISOString() ?? null,
  currentPeriodEnd: row.currentPeriodEnd?.toISOString() ?? null,
  cancelAtPeriodEnd: row.cancelAtPeriodEnd,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});

const OWNER_INCLUDE = {
  owner: { select: { id: true, firstName: true, lastName: true, phone: true } },
} as const;

type RouteContext = Readonly<{ params: Promise<{ id: string }> }>;

export const GET = async (request: Request, context: RouteContext): Promise<Response> => {
  const requestId = requestIdFor(request);
  const token = bearerToken(request);
  if (token === null) return failure('UNAUTHORIZED', requestId, 401);
  const session = await staffAuthService().getSession(token);
  if (session === null) return failure('UNAUTHORIZED', requestId, 401);

  const { id } = await context.params;
  const db = getDatabase();
  const row = await db.partner.findUnique({ where: { id }, include: OWNER_INCLUDE });
  if (row === null) return failure('NOT_FOUND', requestId, 404);

  return success(toDto(row), requestId);
};

export const PATCH = async (request: Request, context: RouteContext): Promise<Response> => {
  const requestId = requestIdFor(request);
  const token = bearerToken(request);
  if (token === null) return failure('UNAUTHORIZED', requestId, 401);
  const session = await staffAuthService().getSession(token);
  if (session === null) return failure('UNAUTHORIZED', requestId, 401);

  const { id } = await context.params;
  const db = getDatabase();

  const existing = await db.partner.findUnique({ where: { id } });
  if (existing === null) return failure('NOT_FOUND', requestId, 404);

  const body = await readJson<Partial<PartnerInputDto>>(request, {
    safeParse: (input: unknown) => {
      if (typeof input !== 'object' || input === null) return { success: false } as const;
      const d = input as Record<string, unknown>;
      if (d.slug !== undefined && (typeof d.slug !== 'string' || d.slug.length === 0))
        return { success: false } as const;
      if (d.category !== undefined && (typeof d.category !== 'string' || !isValidCategory(d.category)))
        return { success: false } as const;
      if (d.country !== undefined && (typeof d.country !== 'string' || !isValidCountryCode(d.country)))
        return { success: false } as const;
      if (d.discountPercent !== undefined && typeof d.discountPercent !== 'number')
        return { success: false } as const;
      if (d.image !== undefined && typeof d.image !== 'string')
        return { success: false } as const;
      if (d.translations !== undefined && (typeof d.translations !== 'object' || d.translations === null))
        return { success: false } as const;
      if (d.isActive !== undefined && typeof d.isActive !== 'boolean')
        return { success: false } as const;
      if (d.sortOrder !== undefined && typeof d.sortOrder !== 'number')
        return { success: false } as const;
      if (d.city !== undefined && d.city !== null && typeof d.city !== 'string')
        return { success: false } as const;
      if (d.phone !== undefined && d.phone !== null && typeof d.phone !== 'string')
        return { success: false } as const;
      if (d.ownerId !== undefined && d.ownerId !== null && typeof d.ownerId !== 'string')
        return { success: false } as const;
      if (d.featuredTop !== undefined && typeof d.featuredTop !== 'boolean')
        return { success: false } as const;
      if (d.featuredRecommended !== undefined && typeof d.featuredRecommended !== 'boolean')
        return { success: false } as const;
      return { success: true, data: d as unknown as Partial<PartnerInputDto> } as const;
    },
  });

  if (body === null) return failure('INVALID_INPUT', requestId, 400);

  if (body.slug !== undefined && body.slug !== existing.slug) {
    const slugConflict = await db.partner.findUnique({ where: { slug: body.slug } });
    if (slugConflict) return failure('CONFLICT', requestId, 409);
  }

  if (body.ownerId !== undefined && body.ownerId !== null) {
    const owner = await db.member.findUnique({ where: { id: body.ownerId } });
    if (!owner) return failure('INVALID_INPUT', requestId, 400);
  }

  try {
    const updated = await db.$transaction(async (tx) => {
      // Validate featured limits
      if (body.featuredTop === true) {
        const topCount = await tx.partner.count({ where: { featuredTop: true, id: { not: id } } });
        if (topCount >= MAX_FEATURED_PER_FLAG) throw new Error('FEATURED_LIMIT_TOP');
      }
      if (body.featuredRecommended === true) {
        const recCount = await tx.partner.count({ where: { featuredRecommended: true, id: { not: id } } });
        if (recCount >= MAX_FEATURED_PER_FLAG) throw new Error('FEATURED_LIMIT_RECOMMENDED');
      }
      return tx.partner.update({
        where: { id },
        data: body,
        include: OWNER_INCLUDE,
      });
    });
    return success(toDto(updated), requestId);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('FEATURED_LIMIT')) {
      return failure('CONFLICT', requestId, 409);
    }
    return failure('INVALID_INPUT', requestId, 400);
  }
};

export const DELETE = async (request: Request, context: RouteContext): Promise<Response> => {
  const requestId = requestIdFor(request);
  const token = bearerToken(request);
  if (token === null) return failure('UNAUTHORIZED', requestId, 401);
  const session = await staffAuthService().getSession(token);
  if (session === null) return failure('UNAUTHORIZED', requestId, 401);

  const { id } = await context.params;
  const db = getDatabase();
  const existing = await db.partner.findUnique({ where: { id } });
  if (existing === null) return failure('NOT_FOUND', requestId, 404);

  try {
    await db.partner.delete({ where: { id } });
    return success(null, requestId);
  } catch {
    return failure('INTERNAL_ERROR', requestId, 500);
  }
};
