import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import prisma from "./config/prisma.js"
import errorHandler from "./middleware/errorHandler.js";
import articles from "./routes/articles.js";


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

async function test() {
    await prisma.$connect();
    console.log("✅ Connexion à la base de données réussie");
}

test();
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/articles", articles);

app.use(errorHandler);

export default app;