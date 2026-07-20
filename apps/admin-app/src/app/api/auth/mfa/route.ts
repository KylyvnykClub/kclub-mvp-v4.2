import type { StaffSessionTokenDto } from '@kclub/contracts';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { callProductCore, CHALLENGE_COOKIE, SESSION_COOKIE } from '../../../../server/admin-api';
import { sessionCookieOptions } from '../../../../server/cookie-options';

export const POST = async (request: Request): Promise<Response> => {
  const challengeToken = (await cookies()).get(CHALLENGE_COOKIE)?.value;
  if (challengeToken === undefined)
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED', requestId: crypto.randomUUID() } },
      { status: 401 },
    );
  const raw = (await request.json()) as unknown;
  const code =
    typeof raw === 'object' && raw !== null && 'code' in raw && typeof raw.code === 'string'
      ? raw.code
      : '';
  const result = await callProductCore<StaffSessionTokenDto>(
    '/api/admin/v1/staff-auth/mfa/verify',
    { method: 'POST', body: JSON.stringify({ challengeToken, code }) },
  );
  if (!('data' in result.body)) return NextResponse.json(result.body, { status: result.status });
  const response = NextResponse.json({
    data: { session: result.body.data.session },
    requestId: result.body.requestId,
  });
  response.cookies.set(SESSION_COOKIE, result.body.data.sessionToken, sessionCookieOptions(28_800));
  response.cookies.delete(CHALLENGE_COOKIE);
  return response;
};
