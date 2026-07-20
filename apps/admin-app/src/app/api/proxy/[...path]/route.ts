import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { callProductCore, SESSION_COOKIE } from '../../../../server/admin-api';

const allowedResources = new Set([
  'audit',
  'businesses',
  'cards',
  'categories',
  'cities',
  'countries',
  'introductions',
  'staff',
  'stripe-prices',
  'subscriptions',
  'users',
]);
type RouteContext = Readonly<{ params: Promise<{ path: string[] }> }>;

const proxy = async (request: Request, context: RouteContext): Promise<Response> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token === undefined)
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'UNAUTHORIZED', requestId: crypto.randomUUID() } },
      { status: 401 },
    );
  const path = (await context.params).path;
  if (path[0] === undefined || !allowedResources.has(path[0]))
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'NOT_FOUND', requestId: crypto.randomUUID() } },
      { status: 404 },
    );
  const body =
    request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();
  const url = new URL(request.url);
  const init: RequestInit = {
    method: request.method,
    headers: { authorization: `Bearer ${token}` },
  };
  if (body !== undefined) init.body = body;
  const result = await callProductCore(
    `/api/admin/v1/${path.map(encodeURIComponent).join('/')}${url.search}`,
    init,
  );
  return NextResponse.json(result.body, { status: result.status });
};

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
