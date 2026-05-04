import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";


app.get("/api/health", (_req, res) => res.json({ status: "ok" }));