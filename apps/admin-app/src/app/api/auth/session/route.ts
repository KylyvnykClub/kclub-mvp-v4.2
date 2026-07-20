import { NextResponse } from 'next/server';
import { readStaffSession, SESSION_COOKIE } from '../../../../server/admin-api';

export const GET = async (): Promise<Response> => {
  const session = await readStaffSession();
  if (session === null) {
    const response = NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED', requestId: crypto.randomUUID() } },
      { status: 401 },
    );
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
  return NextResponse.json({ data: session, requestId: crypto.randomUUID() });
};
