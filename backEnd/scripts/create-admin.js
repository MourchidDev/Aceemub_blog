import "dotenv/config";
import bcrypt from "bcrypt";
import { z } from "zod";
import prisma from "../src/lib/prisma.js";

const SALT_ROUNDS = 12;

const adminSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email().toLowerCase(),
  password: z
    .string()
    .min(12)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

function readArg(name) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

async function main() {
  const data = adminSchema.parse({
    name: readArg("name") ?? process.env.ADMIN_NAME,
    email: readArg("email") ?? process.env.ADMIN_EMAIL,
    password: readArg("password") ?? process.env.ADMIN_PASSWORD,
  });

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const admin = await prisma.user.upsert({
    where: { email: data.email },
    update: {
      name: data.name,
      password: passwordHash,
      authProvider: "LOCAL",
      role: "ADMIN",
      isActive: true,
      deletedAt: null,
    },
    create: {
      name: data.name,
      email: data.email,
      password: passwordHash,
      authProvider: "LOCAL",
      role: "ADMIN",
      isActive: true,
      lastLoginAt: null,
    },
  });

  console.log(`Admin ready: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error("Unable to create admin.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
