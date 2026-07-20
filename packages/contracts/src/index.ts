export type ApiErrorCode =
  | 'CONFLICT'
  | 'FORBIDDEN'
  | 'INTERNAL_ERROR'
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'UNAUTHORIZED';

export type ApiError = Readonly<{
  code: ApiErrorCode;
  message: string;
  requestId: string;
}>;

export type ApiSuccess<T> = Readonly<{ data: T; requestId: string }>;
export type ApiFailure = Readonly<{ error: ApiError }>;
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export const STAFF_ROLES = [
  'OWNER',
  'ADMIN',
  'MODERATOR',
  'SUPPORT',
  'FINANCE',
  'CONTENT_MANAGER',
] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const STAFF_PERMISSIONS = [
  'DASHBOARD_VIEW',
  'MEMBER_VIEW',
  'MEMBER_MANAGE',
  'CARD_MANAGE',
  'BUSINESS_MODERATE',
  'INTRODUCTION_MANAGE',
  'TAXONOMY_MANAGE',
  'SUBSCRIPTION_VIEW',
  'SUBSCRIPTION_MANAGE',
  'STAFF_MANAGE',
  'AUDIT_VIEW',
  'SYSTEM_CONFIGURE',
] as const;
export type StaffPermission = (typeof STAFF_PERMISSIONS)[number];

export type StaffProfileDto = Readonly<{
  id: string;
  maskedPhone: string;
  role: StaffRole;
  permissions: readonly StaffPermission[];
  mfaEnabled: boolean;
}>;

export type StaffSessionDto = Readonly<{
  authenticated: true;
  expiresAt: string;
  staff: StaffProfileDto;
}>;

export type StaffActivationDto = Readonly<{
  challengeToken: string;
  otpauthUri: string;
  qrCodeDataUrl: string;
  recoveryCodes: readonly string[];
}>;

export type StaffMfaChallengeDto = Readonly<{
  challengeToken: string;
  expiresAt: string;
}>;

export type StaffSessionTokenDto = Readonly<{
  session: StaffSessionDto;
  sessionToken: string;
}>;
