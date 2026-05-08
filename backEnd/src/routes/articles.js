import { Router } from "express";
// import authenticate from "../../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import  createArticleController  from "../modules/articles/articleController.js";

const router = Router();

// router.post("/", authorize("ADMIN", "EDITOR"), createArticleController);
router.post("/",  createArticleController);

export default router;
