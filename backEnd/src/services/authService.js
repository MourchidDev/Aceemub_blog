import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import prisma  from "../lib/prisma.js";
import { requiredEnv } from "../utils/env.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { signAccessToken } from "../utils/authTokens.js";

const SALT_ROUNDS = 12;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caracteres.").max(80),
  email: z.string().trim().email("Email invalide.").toLowerCase(),
  password: z
    .string()
    .min(12, "Le mot de passe doit contenir au moins 12 caracteres.")
    .regex(/[a-z]/, "Ajoutez au moins une lettre minuscule.")
    .regex(/[A-Z]/, "Ajoutez au moins une lettre majuscule.")
    .regex(/[0-9]/, "Ajoutez au moins un chiffre.")
    .regex(/[^A-Za-z0-9]/, "Ajoutez au moins un caractere special."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Email invalide.").toLowerCase(),
  password: z.string().min(1, "Mot de passe requis."),
});

export const googleLoginSchema = z.object({
  idToken: z.string().min(20, "Token Google invalide."),
});

function buildAuthResponse(user) {
  return {
    user: sanitizeUser(user),
    token: signAccessToken(user),
  };
}

export async function registerWithEmail(input) {
  const data = registerSchema.parse(input);

  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    const error = new Error("Un compte existe deja avec cet email.");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: passwordHash,
      authProvider: "LOCAL",
      lastLoginAt: new Date(),
    },
  });

  return buildAuthResponse(user);
}

export async function loginWithEmail(input) {
  const data = loginSchema.parse(input);
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  // Message volontairement generique: il evite d'indiquer si l'email existe.
  if (!user || !user.password || user.deletedAt || !user.isActive) {
    const error = new Error("Email ou mot de passe incorrect.");
    error.statusCode = 401;
    throw error;
  }

  const passwordIsValid = await bcrypt.compare(data.password, user.password);
  if (!passwordIsValid) {
    const error = new Error("Email ou mot de passe incorrect.");
    error.statusCode = 401;
    throw error;
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return buildAuthResponse(updatedUser);
}

export async function loginWithGoogle(input) {
  const { idToken } = googleLoginSchema.parse(input);
  const googleClientId = requiredEnv("GOOGLE_CLIENT_ID");
  const googleClient = new OAuth2Client(googleClientId);

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: googleClientId,
  });
  const payload = ticket.getPayload();

  if (!payload?.email || !payload.sub || !payload.email_verified) {
    const error = new Error("Compte Google non verifie.");
    error.statusCode = 401;
    throw error;
  }

  const email = payload.email.toLowerCase();
  const now = new Date();

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      // L'association a un compte unique par email. Un email Google verifie peut
      // donc rattacher un ancien compte local sans exposer le mot de passe local.
      googleId: payload.sub,
      authProvider: "GOOGLE",
      name: payload.name ?? payload.given_name ?? email.split("@")[0],
      avatarUrl: payload.picture,
      emailVerifiedAt: now,
      lastLoginAt: now,
    },
    create: {
      email,
      googleId: payload.sub,
      authProvider: "GOOGLE",
      name: payload.name ?? payload.given_name ?? email.split("@")[0],
      avatarUrl: payload.picture,
      emailVerifiedAt: now,
      lastLoginAt: now,
    },
  });

  if (!user.isActive || user.deletedAt) {
    const error = new Error("Compte desactive.");
    error.statusCode = 403;
    throw error;
  }

  return buildAuthResponse(user);
}
