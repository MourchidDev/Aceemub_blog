import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

const router = Router();
const MANAGEABLE_ROLES = ["ADMIN", "EDITOR", "MEMBER"];

const updateUserSchema = z
  .object({
    role: z.enum(MANAGEABLE_ROLES).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => data.role !== undefined || data.isActive !== undefined, {
    message: "Aucune modification fournie.",
  });

async function countActiveAdmins(excludedUserId) {
  return prisma.user.count({
    where: {
      role: "ADMIN",
      isActive: true,
      deletedAt: null,
      ...(excludedUserId ? { NOT: { id: excludedUserId } } : {}),
    },
  });
}

router.use(requireAuth, authorize("ADMIN"));

router.get("/", async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    });

    res.json(users.map(sanitizeUser));
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (id === req.user.id && (data.role || data.isActive === false)) {
      return res.status(400).json({
        message: "Vous ne pouvez pas retirer vos propres droits administrateur.",
      });
    }

    const removesAdminAccess =
      user.role === "ADMIN" && ((data.role && data.role !== "ADMIN") || data.isActive === false);

    if (removesAdminAccess && (await countActiveAdmins(id)) === 0) {
      return res.status(400).json({
        message: "Impossible de retirer le dernier administrateur actif.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    res.json(sanitizeUser(updatedUser));
  } catch (error) {
    next(error);
  }
});

export default router;
