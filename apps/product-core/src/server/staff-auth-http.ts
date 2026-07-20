import 'server-only';

import type { ApiErrorCode, ApiResponse } from '@kclub/contracts';
import { NextResponse } from 'next/server';

import { getDatabase } from './database';
import { createStaffAuthService } from './staff-auth-service';
import { hashSecret } from './staff-auth-crypto';

const WINDOW_MS = 60_000;
const LIMIT = 10;

export const requestIdFor = (request: Request): string => {
  const candidate = request.headers.get('x-request-id');
  return candidate !== null && /^[0-9a-f-]{36}$/i.test(candidate) ? candidate : crypto.randomUUID();
};

export const enforceAuthRateLimit = async (request: Request): Promise<boolean> => {
  const address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const keyHash = hashSecret(`${address}:${new URL(request.url).pathname}`);
  const now = Date.now();
  return getDatabase().$transaction(async (tx) => {
    const bucket = await tx.staffAuthRateLimit.findUnique({ where: { keyHash } });
    if (bucket === null || bucket.resetAt.getTime() <= now) {
      await tx.staffAuthRateLimit.upsert({ where: { keyHash }, create: { keyHash, count: 1, resetAt: new Date(now + WINDOW_MS) }, update: { count: 1, resetAt: new Date(now + WINDOW_MS) } });
      return true;
    }
    const updated = await tx.staffAuthRateLimit.updateMany({
      where: { keyHash, count: { lt: LIMIT } },
      data: { count: { increment: 1 } },
    });
    return updated.count === 1;
  });
};

type SafeParser<T> = Readonly<{
  safeParse: (input: unknown) => { success: true; data: T } | { success: false };
}>;

export const readJson = async <T>(request: Request, schema: SafeParser<T>): Promise<T | null> => {
  try {
    const parsed = schema.safeParse(await request.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

export const bearerToken = (request: Request): string | null => {
  const value = request.headers.get('authorization');
  return value?.startsWith('Bearer ') === true ? value.slice(7) : null;
};

export const success = <T>(
  data: T,
  requestId: string,
  status = 200,
): NextResponse<ApiResponse<T>> => NextResponse.json({ data, requestId }, { status });

export const failure = (
  code: ApiErrorCode,
  requestId: string,
  status: number,
): NextResponse<ApiResponse<never>> =>
  NextResponse.json({ error: { code, message: code, requestId } }, { status });

export const staffAuthService = () => createStaffAuthService(getDatabase());
