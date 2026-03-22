import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

// 1. Create a standard PG Pool (This handles the password/SASL correctly)
const pool = new pg.Pool({ connectionString });

// 2. Initialize the Prisma Adapter with that pool
const adapter = new PrismaPg(pool);

const globalForPrisma = global;

// 3. Prevent multiple instances of Prisma Client in development
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;