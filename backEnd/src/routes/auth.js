import { Router } from "express";
import {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
} from "../services/authService.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const result = await registerWithEmail(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await loginWithEmail(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/google", async (req, res, next) => {
  try {
    const result = await loginWithGoogle(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
