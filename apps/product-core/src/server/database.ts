import 'server-only';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@kclub/database';

const globalDatabase = globalThis as unknown as { kclubDatabase?: PrismaClient };

export const getDatabase = (): PrismaClient => {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString === undefined) throw new Error('DATABASE_URL is required');
  globalDatabase.kclubDatabase ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
  return globalDatabase.kclubDatabase;
};
