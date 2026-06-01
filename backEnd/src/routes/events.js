import express from "express";
import prisma from "../lib/prisma.js";
import { upload } from "../lib/upload.js";
import { uploadImage, deleteImage } from "../services/uploadService.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();
const canEditContent = [requireAuth, authorize("ADMIN", "EDITOR")];

// Les images sont optionnelles à la création (peuvent être ajoutées via albums par la suite)

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ─── GET /api/events ──────────────────────────────────────────────────────────
router.get("/", async (_req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: "desc" },
      include: {
        albums: {
          include: { media: { take: 1, orderBy: { createdAt: "asc" } } },
          take: 1,
        },
        _count: { select: { albums: true } },
      },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des événements", details: err.message });
  }
});

// ─── GET /api/events/:id ──────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        albums: {
          include: { media: { orderBy: { createdAt: "asc" } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!event) return res.status(404).json({ error: "Événement introuvable" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération", details: err.message });
  }
});

// ─── POST /api/events ─────────────────────────────────────────────────────────
// Champs form-data : title, description, location, eventDate, status?, albumTitle?
// Fichiers         : images[] (min 5)
router.post("/", ...canEditContent, upload.array("images", 20), async (req, res) => {
  try {
    const { title, description, location, eventDate, status, albumTitle } = req.body;
    const files = req.files ?? [];

    if (!title || !description || !location || !eventDate) {
      return res.status(400).json({ error: "title, description, location et eventDate sont requis." });
    }

    // Slug unique
    let slug = slugify(title);
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    // Transaction : event + album (optionnel) + media (optionnel)
    const event = await prisma.$transaction(async (tx) => {
      const newEvent = await tx.event.create({
        data: {
          title,
          slug,
          description,
          location,
          eventDate: new Date(eventDate),
          status: status ?? "DRAFT",
        },
      });

      // Créer un album et uploader les images seulement si des fichiers sont fournis
      if (files.length > 0) {
        const uploaded = await Promise.all(
          files.map((f) => uploadImage(f.buffer, "events"))
        );

        const album = await tx.album.create({
          data: {
            title: albumTitle?.trim() || title,
            eventId: newEvent.id,
          },
        });

        await tx.media.createMany({
          data: uploaded.map(({ url }) => ({
            url,
            type: "IMAGE",
            albumId: album.id,
          })),
        });
      }

      return tx.event.findUnique({
        where: { id: newEvent.id },
        include: {
          albums: { include: { media: true } },
        },
      });
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création", details: err.message });
  }
});

// ─── PUT /api/events/:id ──────────────────────────────────────────────────────
// Met à jour les champs texte de l'événement (pas les images)
router.put("/:id", ...canEditContent, async (req, res) => {
  try {
    const { title, description, location, eventDate, status } = req.body;

    const existing = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Événement introuvable" });

    const data = {};
    if (title !== undefined) {
      data.title = title;
      if (title !== existing.title) {
        let slug = slugify(title);
        const conflict = await prisma.event.findFirst({ where: { slug, NOT: { id: req.params.id } } });
        if (conflict) slug = `${slug}-${Date.now()}`;
        data.slug = slug;
      }
    }
    if (description !== undefined) data.description = description;
    if (location !== undefined) data.location = location;
    if (eventDate !== undefined) data.eventDate = new Date(eventDate);
    if (status !== undefined) data.status = status;

    const updated = await prisma.event.update({
      where: { id: req.params.id },
      data,
      include: { albums: { include: { media: true } } },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour", details: err.message });
  }
});

// ─── DELETE /api/events/:id ───────────────────────────────────────────────────
router.delete("/:id", ...canEditContent, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: { albums: { include: { media: true } } },
    });
    if (!event) return res.status(404).json({ error: "Événement introuvable" });

    // Supprimer les images Cloudinary
    const allMedia = event.albums.flatMap((a) => a.media);
    await Promise.allSettled(
      allMedia.map((m) => {
        // Extraire le public_id depuis l'URL Cloudinary
        const match = m.url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
        if (match) return deleteImage(match[1]);
      })
    );

    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ message: "Événement supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression", details: err.message });
  }
});

// ─── POST /api/events/:id/albums ──────────────────────────────────────────────
// Ajouter un nouvel album à un événement existant
router.post("/:id/albums", ...canEditContent, upload.array("images", 20), async (req, res) => {
  try {
    const { albumTitle } = req.body;
    const files = req.files ?? [];

    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: "Événement introuvable" });

    if (files.length === 0) {
      return res.status(400).json({ error: "Au moins une image est requise." });
    }

    const uploaded = await Promise.all(
      files.map((f) => uploadImage(f.buffer, `events/${req.params.id}`))
    );

    const album = await prisma.$transaction(async (tx) => {
      const newAlbum = await tx.album.create({
        data: {
          title: albumTitle?.trim() || `Album ${new Date().toLocaleDateString("fr-FR")}`,
          eventId: req.params.id,
        },
      });

      await tx.media.createMany({
        data: uploaded.map(({ url }) => ({
          url,
          type: "IMAGE",
          albumId: newAlbum.id,
        })),
      });

      return tx.album.findUnique({
        where: { id: newAlbum.id },
        include: { media: true },
      });
    });

    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout de l'album", details: err.message });
  }
});

// ─── POST /api/events/:id/albums/:albumId/images ──────────────────────────────
// Ajouter des images à un album existant
router.post("/:id/albums/:albumId/images", ...canEditContent, upload.array("images", 20), async (req, res) => {
  try {
    const files = req.files ?? [];

    const album = await prisma.album.findFirst({
      where: { id: req.params.albumId, eventId: req.params.id },
    });
    if (!album) return res.status(404).json({ error: "Album introuvable" });

    if (files.length === 0) {
      return res.status(400).json({ error: "Au moins une image est requise." });
    }

    const uploaded = await Promise.all(
      files.map((f) => uploadImage(f.buffer, `events/${req.params.id}`))
    );

    await prisma.media.createMany({
      data: uploaded.map(({ url }) => ({
        url,
        type: "IMAGE",
        albumId: req.params.albumId,
      })),
    });

    const updatedAlbum = await prisma.album.findUnique({
      where: { id: req.params.albumId },
      include: { media: true },
    });

    res.status(201).json(updatedAlbum);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout des images", details: err.message });
  }
});

// ─── DELETE /api/events/:id/albums/:albumId ───────────────────────────────────
router.delete("/:id/albums/:albumId", ...canEditContent, async (req, res) => {
  try {
    const album = await prisma.album.findFirst({
      where: { id: req.params.albumId, eventId: req.params.id },
      include: { media: true },
    });
    if (!album) return res.status(404).json({ error: "Album introuvable" });

    await Promise.allSettled(
      album.media.map((m) => {
        const match = m.url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
        if (match) return deleteImage(match[1]);
      })
    );

    await prisma.album.delete({ where: { id: req.params.albumId } });
    res.json({ message: "Album supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'album", details: err.message });
  }
});

// ─── PATCH /api/events/:id/albums/:albumId ────────────────────────────────────
// Renommer un album
router.patch("/:id/albums/:albumId", ...canEditContent, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Le titre est requis." });

    const album = await prisma.album.findFirst({
      where: { id: req.params.albumId, eventId: req.params.id },
    });
    if (!album) return res.status(404).json({ error: "Album introuvable" });

    const updated = await prisma.album.update({
      where: { id: req.params.albumId },
      data: { title: title.trim() },
      include: { media: true },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du renommage", details: err.message });
  }
});

// ─── DELETE /api/events/:id/albums/:albumId/images/:mediaId ──────────────────
// Supprimer une photo individuelle
router.delete("/:id/albums/:albumId/images/:mediaId", ...canEditContent, async (req, res) => {
  try {
    const media = await prisma.media.findFirst({
      where: { id: req.params.mediaId, albumId: req.params.albumId },
    });
    if (!media) return res.status(404).json({ error: "Image introuvable" });

    const match = media.url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    if (match) await deleteImage(match[1]).catch(() => {});

    await prisma.media.delete({ where: { id: req.params.mediaId } });
    res.json({ message: "Image supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'image", details: err.message });
  }
});

export default router;
