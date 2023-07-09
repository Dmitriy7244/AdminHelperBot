import env from "env"
import { PrismaClient } from "prisma/generated"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.str("DATABASE_URL"),
    },
  },
})

export { prisma }
