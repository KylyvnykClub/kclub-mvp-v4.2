import type { StaffMfaChallengeDto } from '@kclub/contracts';
import { NextResponse } from 'next/server';
import { callProductCore, CHALLENGE_COOKIE } from '../../../../server/admin-api';
import { sessionCookieOptions } from '../../../../server/cookie-options';

export const POST = async (request: Request): Promise<Response> => {
  const result = await callProductCore<StaffMfaChallengeDto>('/api/admin/v1/staff-auth/sign-in', {
    method: 'POST',
    body: await request.text(),
  });
  if (!('data' in result.body)) return NextResponse.json(result.body, { status: result.status });
  const response = NextResponse.json({
    data: { next: '/auth/mfa' },
    requestId: result.body.requestId,
  });
  response.cookies.set(
    CHALLENGE_COOKIE,
    result.body.data.challengeToken,
    sessionCookieOptions(300),
  );
  return response;
};
