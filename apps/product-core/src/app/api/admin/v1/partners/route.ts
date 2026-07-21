import type { PartnerDto, PartnerInputDto, PartnerListResponseDto } from '@kclub/contracts';
import { isValidCountryCode } from '../../../../../features/partners/countries';
import { getDatabase } from '../../../../../server/database';
import {
  bearerToken,
  failure,
  readJson,
  requestIdFor,
  staffAuthService,
  success,
} from '../../../../../server/staff-auth-http';

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

export const GET = async (request: Request): Promise<Response> => {
  const requestId = requestIdFor(request);
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
          { slug: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [rows, total] = await Promise.all([
    db.partner.findMany({
      where,
      include: OWNER_INCLUDE,
      orderBy: { sortOrder: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.partner.count({ where }),
  ]);

  const items = rows.map(toDto);
  return success<PartnerListResponseDto>({ items, total }, requestId);
};

export const POST = async (request: Request): Promise<Response> => {
  const requestId = requestIdFor(request);
  const token = bearerToken(request);
  if (token === null) return failure('UNAUTHORIZED', requestId, 401);
  const session = await staffAuthService().getSession(token);
  if (session === null) return failure('UNAUTHORIZED', requestId, 401);

  const body = await readJson<PartnerInputDto>(request, {
    safeParse: (input: unknown) => {
      if (typeof input !== 'object' || input === null) return { success: false } as const;
      const d = input as Record<string, unknown>;
      if (typeof d.slug !== 'string' || d.slug.length === 0) return { success: false } as const;
      if (typeof d.category !== 'string' || !isValidCategory(d.category)) return { success: false } as const;
      if (typeof d.country !== 'string' || !isValidCountryCode(d.country)) return { success: false } as const;
      if (typeof d.discountPercent !== 'number') return { success: false } as const;
      if (typeof d.image !== 'string') return { success: false } as const;
      if (typeof d.translations !== 'object' || d.translations === null) return { success: false } as const;
      if (typeof d.isActive !== 'boolean') return { success: false } as const;
      if (typeof d.sortOrder !== 'number') return { success: false } as const;
      // Optional new fields
      if (d.city !== undefined && d.city !== null && typeof d.city !== 'string') return { success: false } as const;
      if (d.phone !== undefined && d.phone !== null && typeof d.phone !== 'string') return { success: false } as const;
      if (d.ownerId !== undefined && d.ownerId !== null && typeof d.ownerId !== 'string') return { success: false } as const;
      if (d.featuredTop !== undefined && typeof d.featuredTop !== 'boolean') return { success: false } as const;
      if (d.featuredRecommended !== undefined && typeof d.featuredRecommended !== 'boolean') return { success: false } as const;
      return { success: true, data: d as unknown as PartnerInputDto } as const;
    },
  });

  if (body === null) return failure('INVALID_INPUT', requestId, 400);

  const db = getDatabase();

  // Validate slug uniqueness
  const existing = await db.partner.findUnique({ where: { slug: body.slug } });
  if (existing) return failure('CONFLICT', requestId, 409);

  // Validate owner exists if provided
  if (body.ownerId) {
    const owner = await db.member.findUnique({ where: { id: body.ownerId } });
    if (!owner) return failure('INVALID_INPUT', requestId, 400);
  }

  // Featured limit enforcement under transaction (SPEC.md §11: max 3)
  try {
    const created = await db.$transaction(async (tx) => {
      if (body.featuredTop) {
        const topCount = await tx.partner.count({ where: { featuredTop: true } });
        if (topCount >= MAX_FEATURED_PER_FLAG) {
          throw new Error('FEATURED_LIMIT_TOP');
        }
      }
      if (body.featuredRecommended) {
        const recCount = await tx.partner.count({ where: { featuredRecommended: true } });
        if (recCount >= MAX_FEATURED_PER_FLAG) {
          throw new Error('FEATURED_LIMIT_RECOMMENDED');
        }
      }
      return tx.partner.create({
        data: {
          slug: body.slug,
          category: body.category,
          country: body.country,
          city: body.city ?? null,
          phone: body.phone ?? null,
          discountPercent: body.discountPercent,
          image: body.image,
          translations: body.translations,
          isActive: body.isActive,
          sortOrder: body.sortOrder,
          ownerId: body.ownerId ?? null,
          featuredTop: body.featuredTop ?? false,
          featuredRecommended: body.featuredRecommended ?? false,
        },
        include: OWNER_INCLUDE,
      });
    });
    return success(toDto(created), requestId, 201);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('FEATURED_LIMIT')) {
      return failure('CONFLICT', requestId, 409);
    }
    return failure('INVALID_INPUT', requestId, 400);
  }
};
