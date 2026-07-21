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
  'PARTNER_VIEW',
  'PARTNER_MANAGE',
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

export type PartnerTranslations = Record<'en' | 'ru' | 'uk', { name: string; description: string }>;

export type SubscriptionStatus = 'NONE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';

export type PartnerDto = Readonly<{
  id: string;
  slug: string;
  category: 'ADVISORY' | 'FINANCE' | 'LEGAL' | 'TECHNOLOGY';
  country: string;
  city: string | null;
  phone: string | null;
  discountPercent: number;
  image: string;
  translations: PartnerTranslations;
  isActive: boolean;
  sortOrder: number;
  ownerId: string | null;
  ownerName: string | null;
  featuredTop: boolean;
  featuredRecommended: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  subscriptionStatus: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}>;

export type PartnerListResponseDto = Readonly<{ items: readonly PartnerDto[]; total: number }>;

/** Fields writable via admin create/edit. Stripe fields are webhook-only. */
export type PartnerInputDto = Pick<
  PartnerDto,
  | 'slug'
  | 'category'
  | 'country'
  | 'city'
  | 'phone'
  | 'discountPercent'
  | 'image'
  | 'translations'
  | 'isActive'
  | 'sortOrder'
  | 'ownerId'
  | 'featuredTop'
  | 'featuredRecommended'
>;

export type StaffSessionTokenDto = Readonly<{
  session: StaffSessionDto;
  sessionToken: string;
}>;
