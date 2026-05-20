import { get } from "node:http";
import {
    createComment,
    getCommentsByArticleId,
    getAllComments,
    updateCommentStatus,
    updateComment,
    deleteComment
} from "./commentService.js";


// endPoint pour ajouter un commentaire
export const addCommentController = async (req, res, next) => {
    try {
        const user = req.user; // Peut être undefined si pas de middleware authorize
        
        const commentData = {
            content: req.body.content,
            articleId: req.body.articleId,
            parentId: req.body.parentId || null,
            status: 'PENDING'
        };

        // Si l'utilisateur est authentifié, utiliser son ID
        if (user) {
            commentData.userId = user.id;
        } else {
            // Sinon, utiliser les données fournies dans le body
            commentData.authorName = req.body.authorName;
            commentData.authorEmail = req.body.authorEmail;
        }

        const comment = await createComment(commentData);
        res.status(201).json(comment);
    } catch(error) {
        next(error);
    }
}

// endPoint pour recuperer les commentaires par article
export const getCommentsByArticleController = async (req, res, next) => {
    try{
        const { articleId } = req.params;
        const comments = await getCommentsByArticleId(articleId);
        res.json(comments);
    } catch(error){
        next(error);
    }
}

// endPoint pour approuver un commentaire
export const approveCommentController = async (req, res, next) => {
    try{
        const {id} = req.params;
        const comment = await updateCommentStatus(id, 'APPROVED');
        res.json(comment);
    } catch(errro) {
        next(error);
    }
}

// endPoint pour rejeter un commentaire
export const rejectCommentController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await updateCommentStatus(id, "REJECTED");
        res.json(comment);
    } catch (error) {
        next(error);
    }
};

// endPoint pour modifier un commentaire
export const updateCommentController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const updateData = req.body;
        const comment = await updateComment(id, updateData);
        res.json(comment);
    } catch(error){
        next(error);
    }
};

// endPoint pour supprimer un commentaire
export const deleteCommentController  = async(req, res, next) => {
    try{
        const {id} = req.params;
        await deleteComment(id);
        res.status(204).send();
    } catch(error){
        next(error);
    }
}

// endPoint pour récupérer tous les commentaires
export const getAllCommentsController = async (req, res, next) => {
    try {
        const comments = await getAllComments();
        res.json(comments);
    } catch(error) {
        next(error);
    }
}
