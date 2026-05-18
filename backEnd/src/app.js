import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import prisma from "./config/prisma.js";
import authRoutes from "./routes/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import categoriesRouter from "./routes/categories.js";
import eventsRouter from "./routes/events.js";
import articles from "./routes/articles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import membershipRouter from "./routes/membership.js";

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:5173,http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);

// CORS doit être avant helmet
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origine CORS non autorisee."));
    },
    credentials: true,
  })
);

// Helmet avec configuration pour permettre les images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Servir les fichiers uploadés AVANT les autres middlewares
app.use('/uploads', express.static(join(__dirname, '../uploads')));

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Trop de tentatives. Reessayez dans quelques minutes." },
  }),
  authRoutes
);

async function connectDb() {
  await prisma.$connect();
  console.log("✅ Connexion à la base de données réussie");
}
connectDb();

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/categories", categoriesRouter);
app.use("/api/events", eventsRouter);
app.use("/api/articles", articles);   
app.use("/api/membership", membershipRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
