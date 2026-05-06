const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const categoriesRouter = require("./routes/categories.js");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/categories", categoriesRouter);

module.exports = app;