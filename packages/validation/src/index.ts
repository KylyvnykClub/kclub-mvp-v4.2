import { z } from 'zod';

export const requestIdSchema = z.string().uuid();

export * from './auth';
export * from './contact';
