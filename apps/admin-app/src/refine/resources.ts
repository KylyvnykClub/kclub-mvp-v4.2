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
];
