import type { MemberDetailDto } from '@kclub/contracts';
import { getDatabase } from '../../../../../../server/database';
import {
  bearerToken,
  failure,
  requestIdFor,
  staffAuthService,
  success,
} from '../../../../../../server/staff-auth-http';

type RouteContext = Readonly<{ params: Promise<{ id: string }> }>;

export const GET = async (request: Request, context: RouteContext): Promise<Response> => {
  const requestId = requestIdFor(request);
  const token = bearerToken(request);
  if (token === null) return failure('UNAUTHORIZED', requestId, 401);
  const session = await staffAuthService().getSession(token);
  if (session === null) return failure('UNAUTHORIZED', requestId, 401);

  const { id } = await context.params;
  const db = getDatabase();
  const member = await db.member.findUnique({
    where: { id },
    include: { membershipApplication: true },
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
  };

  return success(dto, requestId);
};
