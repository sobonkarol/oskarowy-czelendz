import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../app/generated/prisma/client"

type PrismaClientType = InstanceType<typeof PrismaClient>
declare const globalThis: { prisma: PrismaClientType } & typeof global

function createClient(): PrismaClientType {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const prisma: PrismaClientType = globalThis.prisma ?? createClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma
