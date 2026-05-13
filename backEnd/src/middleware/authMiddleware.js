import  prisma  from "../lib/prisma.js";
import { verifyAccessToken } from "../utils/authTokens.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    const [scheme, token] = header?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authentification requise." });
    }

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findFirst({
      where: { id: payload.sub, deletedAt: null },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Session invalide." });
    }

    req.user = sanitizeUser(user);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expiree ou invalide." });
  }
}
