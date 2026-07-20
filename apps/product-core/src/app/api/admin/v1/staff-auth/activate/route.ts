import { staffActivateSchema } from '@kclub/validation';

import {
  enforceAuthRateLimit,
  failure,
  readJson,
  requestIdFor,
  staffAuthService,
  success,
} from '../../../../../../server/staff-auth-http';
import { isInvalidCredentials } from '../../../../../../server/staff-auth-service';

export const POST = async (request: Request): Promise<Response> => {
  const requestId = requestIdFor(request);
  if (!(await enforceAuthRateLimit(request))) return failure('RATE_LIMITED', requestId, 429);
  const input = await readJson(request, staffActivateSchema);
  if (input === null) return failure('INVALID_INPUT', requestId, 400);
  try {
    return success(await staffAuthService().activate(input, { requestId }), requestId, 201);
  } catch (error) {
    return isInvalidCredentials(error)
      ? failure('UNAUTHORIZED', requestId, 401)
      : failure('INTERNAL_ERROR', requestId, 500);
  }
};
