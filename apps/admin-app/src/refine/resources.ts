import type { StaffPermission } from '@kclub/contracts';
import type { ResourceProps } from '@refinedev/core';

export type AdminResourceMeta = Readonly<{
  label: string;
  permission: StaffPermission;
}>;

export const ADMIN_RESOURCES: (ResourceProps & { meta: AdminResourceMeta })[] = [
  {
    name: 'overview',
    list: '/',
    meta: { label: 'Overview', permission: 'DASHBOARD_VIEW' },
  },
  {
    name: 'members',
    list: '/members',
    show: '/members/:id',
    meta: { label: 'Members', permission: 'MEMBER_VIEW' },
  },
  {
    name: 'partners',
    list: '/partners',
    show: '/partners/:id',
    create: '/partners/create',
    edit: '/partners/:id/edit',
    meta: { label: 'Partners', permission: 'PARTNER_VIEW' },
  },
];
