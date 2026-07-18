export type ApiErrorCode = 'FORBIDDEN' | 'INVALID_INPUT' | 'NOT_FOUND' | 'UNAUTHORIZED';

export type ApiError = Readonly<{
  code: ApiErrorCode;
  message: string;
  requestId: string;
}>;
