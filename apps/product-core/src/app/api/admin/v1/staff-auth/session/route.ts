import {
  bearerToken,
  failure,
  requestIdFor,
  staffAuthService,
  success,
} from '../../../../../../server/staff-auth-http';

export const GET = async (request: Request): Promise<Response> => {
  const requestId = requestIdFor(request);
  const token = bearerToken(request);
  if (token === null) return failure('UNAUTHORIZED', requestId, 401);
  const session = await staffAuthService().getSession(token);
  return session === null ? failure('UNAUTHORIZED', requestId, 401) : success(session, requestId);
};
