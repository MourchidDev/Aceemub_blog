import {
    createComment,
    getCommentsByArticleId,
    getAllComments,
    updateCommentStatus,
    updateComment,
    deleteComment
} from "./commentService.js";
import prisma from "../../lib/prisma.js";

// Liste des mots interdits
const BANNED_WORDS = [
    'connard', 'salaud', 'putain', 'merde', 'con', 'idiot', 'imbécile',
    'crétin', 'débile', 'enculé', 'pute', 'salope', 'connasse', 'batard'
];

// Fonction pour vérifier les gros mots
const containsBadWords = (text) => {
    const lowerText = text.toLowerCase();
    return BANNED_WORDS.some(word => lowerText.includes(word));
};

// endPoint pour ajouter un commentaire
export const addCommentController = async (req, res, next) => {
    try {
        const user = req.user;
        
        // Vérifier les gros mots
        if (containsBadWords(req.body.content)) {
            return res.status(400).json({ 
                message: "Votre commentaire contient des mots inappropriés et ne peut pas être publié." 
            });
        }

        const commentData = {
            content: req.body.content,
            articleId: req.body.articleId,
            parentId: req.body.parentId || null,
            status: 'APPROVED' // Approbation automatique
        };

        if (user) {
            commentData.userId = user.id;
        } else {
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
    } catch(error) {
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
        const existingComment = await prisma.comment.findUnique({ where: { id } });

        if (!existingComment) {
            return res.status(404).json({ message: "Commentaire introuvable." });
        }

        const canManageContent = ["ADMIN", "EDITOR"].includes(req.user?.role);
        if (!canManageContent && existingComment.userId !== req.user?.id) {
            return res.status(403).json({ message: "Acces refuse." });
        }

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
