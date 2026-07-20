import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const sessionCookieOptions = (maxAge: number): Partial<ResponseCookie> => ({
  httpOnly: true,
  maxAge,
  path: '/',
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
});
