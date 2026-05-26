import prisma from "../../lib/prisma.js";
import commentSchema, {commentUpdateSchema} from "../../validators/commentValidator.js";
import DOMPurify from "isomorphic-dompurify";

// méthode pour ajouter un commentaire à un article
export const createComment = async (data) => {
    const validData = commentSchema.parse(data);
    const cleanContent = DOMPurify.sanitize(validData.content);
    
    const comment = await prisma.comment.create({
        data: {
            content: cleanContent,
            articleId: validData.articleId,
            userId: validData.userId || null,
            authorName: validData.authorName || null, // Correction: authordName -> authorName
            authorEmail: validData.authorEmail || null,
            parentId: validData.parentId || null,
            status: validData.status || 'PENDING'
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            
            article: {
                select: {
                    id: true,
                    title: true,
                    slug: true
                }
            },
            replies: true
        }
    });
    
    return comment;
}

// méthode pour récupérer les commentaires d'un article
export const getCommentsByArticleId = async (articleId) => {
    const comments = await prisma.comment.findMany({
        where: {
            articleId,
            status: "APPROVED",
            parentId: null
        },
        include: {
            user: true,
            replies: {
                include: {user: true},
                where: {status: "APPROVED"},
                orderBy: {createdAt: 'desc'}
            },
        }
    })
    return comments;
}


// méthode pour récupérer tous les commentaires (pour l'admin)
export const getAllComments = async () => {
    const comments = await prisma.comment.findMany({
        where: {
            parentId: null  // Seulement les commentaires parents (pas les réponses)
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            replies: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            },
            article: {
                select: {
                    id: true,
                    title: true,
                    slug: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    return comments;
}
// méthode pour mettre à jour le statut d'un commentaire (approuver ou rejeter)
export const updateCommentStatus = async (id, status)=> {
    const commentUpdated = await prisma.comment.update({
        where: {id},
        data: {status}
    })
    
    return commentUpdated;
}

// méthode pour modifier un commentaire
export const updateComment = async (id, data) => {
    const validData = commentUpdateSchema.parse(data);
    const commentUpd = await prisma.comment.update({
        where: {id},
        data: validData
    });
    return commentUpd
}

// méthode pour supprimer un commentaire
export const deleteComment = async (id) => {
    const commentDeleted = await prisma.comment.delete({
        where: {id}
    })
    return commentDeleted;
}
