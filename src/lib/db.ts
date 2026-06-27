import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../generated/prisma/client"
import { envConfig } from "./constants/env"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const pool = new Pool({
  connectionString: envConfig.DatabaseUrl!,
  max: process.env.NODE_ENV === "production" ? 4 : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

const adapter = new PrismaPg(pool)

export const db = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
