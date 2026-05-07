import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import prisma from "./config/prisma.js"
const app = express();



async function test() {
    await prisma.$connect();
    console.log("✅ Connexion à la base de données réussie");
}

test();
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

export default app;