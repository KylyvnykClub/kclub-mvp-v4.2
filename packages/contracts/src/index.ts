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

export type MemberApplicationDto = Readonly<{
  id: string;
  motivation: string | null;
  referralSource: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}>;

export type MemberListItemDto = Readonly<{
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  company: string | null;
  position: string | null;
  city: string | null;
  country: string | null;
  preferredLocale: string;
  createdAt: string;
  updatedAt: string;
  application: MemberApplicationDto | null;
}>;

export type MemberDetailDto = MemberListItemDto &
  Readonly<{
    supabaseUserId: string;
    bio: string | null;
  }>;

export type MemberListResponseDto = Readonly<{
  items: readonly MemberListItemDto[];
  total: number;
}>;

export type StaffMfaChallengeDto = Readonly<{
  challengeToken: string;
  expiresAt: string;
}>;

export type StaffSessionTokenDto = Readonly<{
  session: StaffSessionDto;
  sessionToken: string;
}>;
