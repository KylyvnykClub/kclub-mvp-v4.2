import type { StaffActivationDto } from '@kclub/contracts';
import { NextResponse } from 'next/server';
import { callProductCore, CHALLENGE_COOKIE } from '../../../../server/admin-api';
import { sessionCookieOptions } from '../../../../server/cookie-options';

export const POST = async (request: Request): Promise<Response> => {
  const result = await callProductCore<StaffActivationDto>('/api/admin/v1/staff-auth/activate', {
    method: 'POST',
    body: await request.text(),
  });
  if (!('data' in result.body)) return NextResponse.json(result.body, { status: result.status });
  const { challengeToken, ...safeData } = result.body.data;
  const response = NextResponse.json({ data: safeData, requestId: result.body.requestId });
  response.cookies.set(CHALLENGE_COOKIE, challengeToken, sessionCookieOptions(300));
  return response;
};
