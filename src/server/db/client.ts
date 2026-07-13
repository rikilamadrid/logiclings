import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../../generated/client'
import { serverEnv } from '../env'

/**
 * Prisma client singleton.
 *
 * Serverless functions can be invoked on a warm container, so the client is
 * cached on `globalThis` to avoid exhausting the connection pool by creating a
 * new client (and a new pg pool) per invocation.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: serverEnv.DATABASE_URL })
  return new PrismaClient({ adapter })
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
