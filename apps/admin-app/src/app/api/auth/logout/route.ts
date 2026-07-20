import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { callProductCore, SESSION_COOKIE } from '../../../../server/admin-api';

export const POST = async (): Promise<Response> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token !== undefined)
    await callProductCore('/api/admin/v1/staff-auth/logout', {
      method: 'POST',
      body: '{}',
      headers: { authorization: `Bearer ${token}` },
    });
  const response = NextResponse.json({ data: { loggedOut: true }, requestId: crypto.randomUUID() });
  response.cookies.delete(SESSION_COOKIE);
  return response;
};
