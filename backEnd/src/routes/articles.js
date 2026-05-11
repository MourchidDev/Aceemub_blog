import { Router } from "express";
// import authenticate from "../../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import  createArticleController  from "../modules/articles/articleController.js";
import  getArticlesController  from "../modules/articles/articleController.js";
import  getArticleByIdController  from "../modules/articles/articleController.js";
import  getArticlesByCategoryController  from "../modules/articles/articleController.js";
import  getArticlesByAuthorController from "../modules/articles/articleController.js";
import getAllArticlesController  from "../modules/articles/articleController.js";
import  updateArticleController from "../modules/articles/articleController.js";
import  deleteArticleController  from "../modules/articles/articleController.js";
import  publishArticleController from "../modules/articles/articleController.js";
import  archiveArticleController from "../modules/articles/articleController.js";


const router = Router();

// router.post("/", authorize("ADMIN", "EDITOR"), createArticleController);
router.post("/",  createArticleController);
router.get("/", getArticlesController);
router.get("/:id", getArticleByIdController);
router.get("/category/:categoryId", getArticlesByCategoryController);
router.get("/author/:authorId", getArticlesByAuthorController);
router.get("/all", getAllArticlesController);
router.put("/:id", authorize("ADMIN", "EDITOR"), updateArticleController);
router.delete("/:id", authorize("ADMIN"), deleteArticleController);
router.post("/:id/publish", authorize("ADMIN", "EDITOR"), publishArticleController);
router.post("/:id/archive", authorize("ADMIN", "EDITOR"), archiveArticleController);

export default router;
