import 'server-only';

import type { ApiResponse, StaffSessionDto } from '@kclub/contracts';
import { logError } from '@kclub/observability';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'kclub_staff_session';
export const CHALLENGE_COOKIE = 'kclub_staff_challenge';
const coreUrl = (): string => process.env.PRODUCT_CORE_INTERNAL_URL ?? 'http://localhost:3000';

export const callProductCore = async <T>(
  path: string,
  init?: RequestInit,
): Promise<{ body: ApiResponse<T>; status: number }> => {
  const requestId = crypto.randomUUID();
  let response: Response;
  try {
    response = await fetch(`${coreUrl()}${path}`, {
      ...init,
      cache: 'no-store',
      headers: {
        'content-type': 'application/json',
        'x-request-id': requestId,
        ...init?.headers,
      },
    });
  } catch (error) {
    logError(error, { scope: 'admin-app.callProductCore.fetch', requestId, extra: { path } });
    return {
      body: { error: { code: 'INTERNAL_ERROR', message: 'INTERNAL_ERROR', requestId } },
      status: 502,
    };
  }

  try {
    return { body: (await response.json()) as ApiResponse<T>, status: response.status };
  } catch (error) {
    logError(error, { scope: 'admin-app.callProductCore.json', requestId, extra: { path, status: response.status } });
    return {
      body: { error: { code: 'INTERNAL_ERROR', message: 'INTERNAL_ERROR', requestId } },
      status: 502,
    };
  }
};

export const readStaffSession = async (): Promise<StaffSessionDto | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token === undefined) return null;
  const result = await callProductCore<StaffSessionDto>('/api/admin/v1/staff-auth/session', {
    headers: { authorization: `Bearer ${token}` },
  });
  return result.status === 200 && 'data' in result.body ? result.body.data : null;
};
