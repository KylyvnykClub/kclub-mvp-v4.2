import type {
  AccessControlProvider,
  AuthActionResponse,
  AuthProvider,
  BaseRecord,
  DataProvider,
} from '@refinedev/core';
import { STAFF_PERMISSIONS } from '@kclub/contracts';
import type {
  StaffActivationDto,
  StaffPermission,
  StaffProfileDto,
  StaffSessionDto,
} from '@kclub/contracts';

export type StaffAuthLoginParams =
  | Readonly<{ mode: 'activate'; inviteToken: string; password: string }>
  | Readonly<{ mode: 'mfa'; code: string }>
  | Readonly<{ mode: 'sign-in'; phone: string; password: string }>;

export type StaffActivationAuthResponse = AuthActionResponse &
  Readonly<{ activation?: StaffActivationDto }>;

const isStaffPermission = (value: unknown): value is StaffPermission =>
  typeof value === 'string' &&
  (STAFF_PERMISSIONS as readonly string[]).some((permission) => permission === value);

const permissionFromCanParams = (params: unknown): StaffPermission | null => {
  if (typeof params !== 'object' || params === null) return null;
  const direct = (params as { permission?: unknown }).permission;
  if (isStaffPermission(direct)) return direct;
  const resource = (params as { resource?: unknown }).resource;
  if (typeof resource !== 'object' || resource === null) return null;
  const meta = (resource as { meta?: unknown }).meta;
  if (typeof meta !== 'object' || meta === null) return null;
  const fromResource = (meta as { permission?: unknown }).permission;
  return isStaffPermission(fromResource) ? fromResource : null;
};

const isStaffAuthLoginParams = (value: unknown): value is StaffAuthLoginParams => {
  if (typeof value !== 'object' || value === null || !('mode' in value)) return false;
  const mode = (value as { mode?: unknown }).mode;
  return mode === 'activate' || mode === 'mfa' || mode === 'sign-in';
};

const session = async (): Promise<StaffSessionDto | null> => {
  const response = await fetch('/api/auth/session', { cache: 'no-store' });
  if (!response.ok) return null;
  const body = (await response.json()) as { data: StaffSessionDto };
  return body.data;
};

export const authProvider: AuthProvider = {
  login: async (params: StaffAuthLoginParams): Promise<StaffActivationAuthResponse> => {
    if (!isStaffAuthLoginParams(params))
      return { success: false, error: new Error('Invalid staff auth request.') };
    const response = await fetch(`/api/auth/${params.mode}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(params),
    });
    const payload = (await response.json()) as unknown;
    if (!response.ok)
      return { success: false, error: new Error('We could not verify those credentials.') };

    if (
      params.mode === 'activate' &&
      typeof payload === 'object' &&
      payload !== null &&
      'data' in payload
    ) {
      return {
        success: true,
        activation: (payload as { data: StaffActivationDto }).data,
      };
    }

    return params.mode === 'mfa' ? { success: true, redirectTo: '/' } : { success: true };
  },
  logout: async (params?: Readonly<{ redirectPath?: string }>) => {
    await fetch('/api/auth/logout', { method: 'POST' });
    return { success: true, redirectTo: params?.redirectPath ?? '/sign-in' };
  },
  check: async () =>
    (await session()) === null
      ? { authenticated: false, redirectTo: '/sign-in', logout: true }
      : { authenticated: true },
  onError: async (error) => ({ error, logout: true, redirectTo: '/sign-in' }),
  getPermissions: async () => (await session())?.staff.permissions ?? [],
  getIdentity: async (): Promise<StaffProfileDto | null> => (await session())?.staff ?? null,
};

export const accessControlProvider: AccessControlProvider = {
  can: async ({ params }) => {
    const required = permissionFromCanParams(params);
    if (required === null) return { can: false, reason: 'A permission is required.' };
    const permissions = (await authProvider.getPermissions?.()) as readonly StaffPermission[];
    return { can: permissions.includes(required) };
  },
  options: { buttons: { enableAccessControl: true, hideIfUnauthorized: true } },
};

const RESOURCE_TO_PATH: Record<string, string> = {
  members: 'users',
  partners: 'partners',
};

const unavailable = async (): Promise<never> => {
  throw new Error('No CRUD resources are enabled for this resource.');
};

const proxyFetch = async <T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> => {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.headers = { 'content-type': 'application/json' };
    init.body = JSON.stringify(body);
  }
  const response = await fetch(`/api/proxy/${path}`, init);
  if (!response.ok) throw new Error(`Failed ${method} /api/proxy/${path}`);
  const json = (await response.json()) as { data: T };
  return json.data;
};

export const dataProvider: DataProvider = {
  getApiUrl: () => '/api/proxy',
  getList: async ({ resource, pagination, filters }) => {
    const path = RESOURCE_TO_PATH[resource];
    if (path === undefined) return unavailable();
    const params = new URLSearchParams();
    const pag = pagination as { current?: number; pageSize?: number } | undefined;
    if (pag?.current) params.set('page', String(pag.current));
    if (pag?.pageSize) params.set('pageSize', String(pag.pageSize));
    const searchFilter = filters?.find(
      (f) => 'field' in f && f.field === 'search',
    );
    if (searchFilter && 'value' in searchFilter && searchFilter.value)
      params.set('search', String(searchFilter.value));
    const response = await fetch(`/api/proxy/${path}?${params.toString()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to fetch ${resource}`);
    const body = (await response.json()) as { data: { items: BaseRecord[]; total: number } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { data: body.data.items, total: body.data.total } as any;
  },
  getOne: async ({ resource, id }) => {
    const path = RESOURCE_TO_PATH[resource];
    if (path === undefined) return unavailable();
    const response = await fetch(`/api/proxy/${path}/${encodeURIComponent(String(id))}`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Failed to fetch ${resource}/${id}`);
    const body = (await response.json()) as { data: BaseRecord };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { data: body.data } as any;
  },
  create: async ({ resource, variables }) => {
    const path = RESOURCE_TO_PATH[resource];
    if (path === undefined) return unavailable();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await proxyFetch<any>('POST', path, variables);
    return { data };
  },
  update: async ({ resource, id, variables }) => {
    const path = RESOURCE_TO_PATH[resource];
    if (path === undefined) return unavailable();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await proxyFetch<any>('PATCH', `${path}/${encodeURIComponent(String(id))}`, variables);
    return { data };
  },
  deleteOne: async ({ resource, id }) => {
    const path = RESOURCE_TO_PATH[resource];
    if (path === undefined) return unavailable();
    const data = await proxyFetch<BaseRecord>('DELETE', `${path}/${encodeURIComponent(String(id))}`);
    return { data } as any;
  },
  custom: unavailable,
};
