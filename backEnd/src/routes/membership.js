import { Router } from "express";
import multer from "multer";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { verifyAccessToken } from "../utils/authTokens.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith("image/")) return callback(null, true);
    return callback(new Error("La photo doit etre une image."));
  },
});

const membershipSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase().max(160),
  phone: z.string().trim().min(6).max(40),
  school: z.string().trim().min(2).max(120),
  level: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(100),
});

async function findMembershipCardForUser(user) {
  const email = user.email.toLowerCase();

  return prisma.membershipCard.findFirst({
    where: {
      OR: [
        { userId: user.id },
        { email: { equals: email, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

function toPublicCard(card) {
  return {
    id: card.id,
    memberNumber: card.memberNumber,
    firstName: card.firstName,
    lastName: card.lastName,
    email: card.email,
    phone: card.phone,
    school: card.school,
    level: card.level,
    city: card.city,
    photoDataUrl: card.photoDataUrl,
    qrCode: card.qrCode,
    isActive: card.isActive,
    createdAt: card.createdAt,
  };
}

function createMemberNumber() {
  const year = new Date().getFullYear();
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  return `ACE-${year}-${suffix}`;
}

function dataUrlToBuffer(dataUrl) {
  const [, base64 = ""] = dataUrl.split(",");
  return Buffer.from(base64, "base64");
}

async function buildQrCode(cardId, memberNumber) {
  const frontendUrl = process.env.FRONTEND_URL?.split(",")[0]?.trim() ?? "http://localhost:5173";
  const verificationUrl = `${frontendUrl}/membre/${cardId}`;
  return QRCode.toDataURL(JSON.stringify({ memberNumber, verificationUrl }));
}

async function createMembershipCard(data, photo) {
  const memberNumber = createMemberNumber();
  const photoDataUrl = photo ? `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}` : null;
  const placeholderQrCode = await QRCode.toDataURL(memberNumber);

  const card = await prisma.membershipCard.create({
    data: {
      ...data,
      memberNumber,
      photoDataUrl,
      qrCode: placeholderQrCode,
    },
  });

  const qrCode = await buildQrCode(card.id, memberNumber);
  const updatedCard = await prisma.membershipCard.update({
    where: { id: card.id },
    data: { qrCode },
  });

  return updatedCard;
}

async function attachUserIfAuthenticated(req, _res, next) {
  try {
    const header = req.headers.authorization;
    const [scheme, token] = header?.split(" ") ?? [];
    if (scheme === "Bearer" && token) {
      const payload = verifyAccessToken(token);
      const user = await prisma.user.findFirst({ where: { id: payload.sub, deletedAt: null } });
      if (user?.isActive) req.authUser = user;
    }
  } catch {
    req.authUser = null;
  }
  next();
}

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const card = await findMembershipCardForUser(req.user);

    if (!card) return res.status(404).json({ message: "Aucune carte membre trouvee." });

    if (!card.userId) {
      const linkedCard = await prisma.membershipCard.update({
        where: { id: card.id },
        data: { userId: req.user.id },
      });
      return res.json({ card: toPublicCard(linkedCard) });
    }

    return res.json({ card: toPublicCard(card) });
  } catch (error) {
    next(error);
  }
});

router.post("/apply", attachUserIfAuthenticated, upload.single("photo"), async (req, res, next) => {
  try {
    const data = membershipSchema.parse(req.body);
    const existingCard = await prisma.membershipCard.findFirst({
      where: {
        OR: [
          ...(req.authUser ? [{ userId: req.authUser.id }] : []),
          { email: { equals: data.email, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingCard) {
      const linkedCard =
        req.authUser && !existingCard.userId
          ? await prisma.membershipCard.update({
              where: { id: existingCard.id },
              data: { userId: req.authUser.id },
            })
          : existingCard;

      return res.status(200).json({ card: toPublicCard(linkedCard), alreadyExists: true });
    }

    const card = await createMembershipCard(
      {
        ...data,
        ...(req.authUser ? { userId: req.authUser.id } : {}),
      },
      req.file,
    );
    res.status(201).json({ card: toPublicCard(card) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const card = await prisma.membershipCard.findUnique({ where: { id: req.params.id } });
    if (!card) return res.status(404).json({ message: "Carte membre introuvable." });
    return res.json({ card: toPublicCard(card) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/pdf", async (req, res, next) => {
  try {
    const card = await prisma.membershipCard.findUnique({ where: { id: req.params.id } });
    if (!card) return res.status(404).json({ message: "Carte membre introuvable." });

    const fullName = `${card.firstName} ${card.lastName}`.trim();
    const memberSince = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(card.createdAt);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="carte-membre-${card.memberNumber}.pdf"`,
    );

    const doc = new PDFDocument({ size: [640, 380], margin: 0 });
    doc.pipe(res);

    doc.rect(0, 0, 640, 380).fill("#FDFCFB");
    doc.rect(0, 0, 640, 92).fill("#065F46");
    doc.fillColor("#FFFFFF").fontSize(22).font("Helvetica-Bold").text("ACEEMUB Benin", 34, 26);
    doc.fontSize(10).font("Helvetica").text("Carte membre officielle", 35, 58);

    doc.roundedRect(28, 116, 584, 218, 10).fillAndStroke("#FFFFFF", "#D9E7DF");
    doc.fillColor("#065F46").fontSize(11).font("Helvetica-Bold").text(card.memberNumber, 44, 134);

    if (card.photoDataUrl) {
      doc.image(dataUrlToBuffer(card.photoDataUrl), 44, 160, { width: 98, height: 112, fit: [98, 112] });
    } else {
      doc.roundedRect(44, 160, 98, 112, 8).fill("#E5E7EB");
      doc.fillColor("#6B7280").fontSize(10).text("Photo", 78, 210);
    }

    doc.fillColor("#111827").fontSize(22).font("Helvetica-Bold").text(fullName, 164, 158, { width: 270 });
    doc.fillColor("#374151").fontSize(12).font("Helvetica").text(card.school, 164, 195, { width: 270 });
    doc.text(`${card.level} - ${card.city}`, 164, 218, { width: 270 });
    doc.fillColor("#065F46").fontSize(11).font("Helvetica-Bold").text(`Membre depuis le ${memberSince}`, 164, 254);

    doc.image(dataUrlToBuffer(card.qrCode), 484, 154, { width: 92, height: 92 });
    doc.fillColor("#6B7280").fontSize(8).font("Helvetica").text("Scanner pour verifier", 472, 254, { width: 120, align: "center" });

    doc.fillColor("#065F46").fontSize(9).text("Foi - Savoir - Fraternite", 44, 302);
    doc.end();
  } catch (error) {
    next(error);
  }
});

export default router;
