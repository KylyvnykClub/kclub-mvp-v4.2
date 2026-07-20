import {
  bearerToken,
  failure,
  requestIdFor,
  staffAuthService,
  success,
} from '../../../../../../server/staff-auth-http';

export const POST = async (request: Request): Promise<Response> => {
  const requestId = requestIdFor(request);
  const token = bearerToken(request);
  if (token === null) return failure('UNAUTHORIZED', requestId, 401);
  await staffAuthService().logout(token, { requestId });
  return success({ loggedOut: true }, requestId);
};
