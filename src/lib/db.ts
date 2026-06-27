import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../generated/prisma/client"
import { envConfig } from "./constants/env"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

if (!envConfig.DatabaseUrl) {
  console.warn("Database connection warning: DATABASE_URL is not defined in the environment variables.");
}

let db: PrismaClient

if (process.env.NODE_ENV === "production") {

  const adapter = new PrismaPg({
    connectionString: envConfig.DatabaseUrl,
    max: 4,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
  })
  db = new PrismaClient({ adapter })
} else {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({
      connectionString: envConfig.DatabaseUrl,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000, // 15 seconds to support Neon serverless database cold starts
    })
    globalForPrisma.prisma = new PrismaClient({ adapter })
  }
  db = globalForPrisma.prisma
}

export { db }
