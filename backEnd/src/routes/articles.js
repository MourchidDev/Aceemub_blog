import { Router } from "express";
import authorize from "../middleware/authorize.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  createArticleController,
  getArticlesController,
  getArticleByIdController,
  getArticlesByCategoryController,
  getArticlesByAuthorController,
  getAllArticlesController,
  updateArticleController,
  deleteArticleController,
  publishArticleController,
  archiveArticleController,
} from "../modules/articles/articleController.js";

const router = Router();
const canEditContent = [requireAuth, authorize("ADMIN", "EDITOR")];

router.post("/", ...canEditContent, upload.single("coverImage"), createArticleController);
router.get("/all", ...canEditContent, getAllArticlesController);
router.get("/", getArticlesController);
router.get("/category/:categoryId", getArticlesByCategoryController);
router.get("/author/:authorId", getArticlesByAuthorController);
router.get("/:id", getArticleByIdController);
router.put("/:id", ...canEditContent, upload.single("coverImage"), updateArticleController);
router.delete("/:id", ...canEditContent, deleteArticleController);
router.post("/:id/publish", ...canEditContent, publishArticleController);
router.post("/:id/archive", ...canEditContent, archiveArticleController);

export default router;
