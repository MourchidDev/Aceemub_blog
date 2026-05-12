import { Router } from "express";
// import authenticate from "../../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
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

// router.post("/", authorize("ADMIN", "EDITOR"), createArticleController);
router.post("/", createArticleController);
router.get("/all", getAllArticlesController);        // ← avant /:id
router.get("/", getArticlesController);
router.get("/category/:categoryId", getArticlesByCategoryController);
router.get("/author/:authorId", getArticlesByAuthorController);
router.get("/:id", getArticleByIdController);       // ← en dernier
router.put("/:id", authorize("ADMIN", "EDITOR"), updateArticleController);
router.delete("/:id", authorize("ADMIN"), deleteArticleController);
router.post("/:id/publish", authorize("ADMIN", "EDITOR"), publishArticleController);
router.post("/:id/archive", authorize("ADMIN", "EDITOR"), archiveArticleController);


export default router;
