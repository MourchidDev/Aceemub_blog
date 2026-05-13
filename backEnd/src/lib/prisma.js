import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { requiredEnv } from "../utils/env.js";

const globalForPrisma = globalThis;
const adapter = new PrismaPg({ connectionString: requiredEnv("DATABASE_URL") });

// En developpement, nodemon recharge souvent les modules. Garder une seule
// instance Prisma evite d'ouvrir trop de connexions PostgreSQL pendant le debug.
 const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}


export default prisma;