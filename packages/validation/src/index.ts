import { z } from 'zod';

export const requestIdSchema = z.string().uuid();

export * from './contact';
export * from './staff-auth';
