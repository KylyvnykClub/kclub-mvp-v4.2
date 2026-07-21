import type { StaffPermission, StaffRole } from '@kclub/contracts';

const all: readonly StaffPermission[] = [
  'DASHBOARD_VIEW',
  'MEMBER_VIEW',
  'MEMBER_MANAGE',
  'CARD_MANAGE',
  'BUSINESS_MODERATE',
  'INTRODUCTION_MANAGE',
  'TAXONOMY_MANAGE',
  'PARTNER_VIEW',
  'PARTNER_MANAGE',
  'SUBSCRIPTION_VIEW',
  'SUBSCRIPTION_MANAGE',
  'STAFF_MANAGE',
  'AUDIT_VIEW',
  'SYSTEM_CONFIGURE',
];

export const permissionsByRole: Readonly<Record<StaffRole, readonly StaffPermission[]>> = {
  OWNER: all,
  ADMIN: [
    'DASHBOARD_VIEW',
    'MEMBER_VIEW',
    'MEMBER_MANAGE',
    'CARD_MANAGE',
    'BUSINESS_MODERATE',
    'INTRODUCTION_MANAGE',
    'TAXONOMY_MANAGE',
    'PARTNER_VIEW',
    'PARTNER_MANAGE',
    'SUBSCRIPTION_VIEW',
    'SUBSCRIPTION_MANAGE',
    'AUDIT_VIEW',
  ],
  MODERATOR: [
    'DASHBOARD_VIEW',
    'BUSINESS_MODERATE',
    'INTRODUCTION_MANAGE',
    'TAXONOMY_MANAGE',
    'SUBSCRIPTION_VIEW',
  ],
  SUPPORT: ['DASHBOARD_VIEW', 'SUBSCRIPTION_VIEW', 'AUDIT_VIEW'],
  FINANCE: ['DASHBOARD_VIEW', 'SUBSCRIPTION_VIEW', 'SUBSCRIPTION_MANAGE', 'AUDIT_VIEW'],
  CONTENT_MANAGER: ['DASHBOARD_VIEW', 'BUSINESS_MODERATE', 'TAXONOMY_MANAGE'],
};

export const getEffectivePermissions = (role: StaffRole): readonly StaffPermission[] =>
  permissionsByRole[role];

export const canStaff = (role: StaffRole, permission: StaffPermission): boolean =>
  permissionsByRole[role].includes(permission);
