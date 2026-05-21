import {Router} from "express";
import authorize from "../middleware/authorize.js";
import {requireAuth} from "../middleware/authMiddleware.js";
import {
    addCommentController,
    getCommentsByArticleController,
    getAllCommentsController,
    approveCommentController,
    rejectCommentController,
    updateCommentController,
    deleteCommentController
} from "../modules/commentaires/commentController.js";

const router = Router();

router.post("/comment", requireAuth, addCommentController);
router.get("/article/:articleId", getCommentsByArticleController);
router.get("/", requireAuth, authorize('ADMIN', 'EDITOR'), getAllCommentsController)
router.put("/approve/:id", requireAuth ,authorize('ADMIN', 'EDITOR'),approveCommentController);
router.put("/reject/:id", requireAuth ,authorize('ADMIN', 'EDITOR'),rejectCommentController);
router.put("/:id", requireAuth, updateCommentController);
router.delete("/:id", deleteCommentController);

export default router;