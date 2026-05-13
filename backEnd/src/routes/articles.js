import { Router } from "express";
import authorize from "../middleware/authorize.js";
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

router.post("/", upload.single('coverImage'), createArticleController);
router.get("/all", getAllArticlesController);       
router.get("/", getArticlesController);
router.get("/category/:categoryId", getArticlesByCategoryController);
router.get("/author/:authorId", getArticlesByAuthorController);
router.get("/:id", getArticleByIdController);
router.put("/:id", upload.single('coverImage'), updateArticleController);
router.delete("/:id", deleteArticleController);
router.post("/:id/publish",  publishArticleController);
router.post("/:id/archive", authorize("ADMIN", "EDITOR"), archiveArticleController);

export default router;
