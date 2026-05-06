import jwt from "jsonwebtoken";
import { requiredEnv, optionalEnv } from "./env.js";

const DEFAULT_ACCESS_TOKEN_TTL = "7d";

export function signAccessToken(user) {
  // Le token ne contient que l'identite minimale. Les donnees sensibles restent
  // en base et peuvent etre rechargees via /api/auth/me.
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    requiredEnv("JWT_SECRET"),
    {
      expiresIn: optionalEnv("JWT_EXPIRES_IN", DEFAULT_ACCESS_TOKEN_TTL),
      issuer: optionalEnv("JWT_ISSUER", "aceemub-blog-api"),
      audience: optionalEnv("JWT_AUDIENCE", "aceemub-blog-client"),
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, requiredEnv("JWT_SECRET"), {
    issuer: optionalEnv("JWT_ISSUER", "aceemub-blog-api"),
    audience: optionalEnv("JWT_AUDIENCE", "aceemub-blog-client"),
  });
}
