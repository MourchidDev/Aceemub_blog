import z from "zod"

const commentSchema = z.object({
    content: z.string().min(1, "Le contenu du commentaire est requis"),
    articleId: z.string().min(1, "L'article est requis"),
    userId: z.string().min(1, "L'utilisateur est requis").optional(),
    authorName: z.string().min(1, "Le nom de l'auteur est requis").optional(),
    authorEmail: z.string().email("Email invalide").optional(),
    parentId: z.string().nullable().optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING")
}).refine(
    (data) => data.userId || (data.authorName && data.authorEmail),
    {
        message: "Soit userId, soit authorName et authorEmail doivent être fournis",
        path: ["userId"]
    }
);


// Schéma pour la mise à jour (sans refine)
export const commentUpdateSchema = z.object({
    content: z.string().min(1, "Le contenu du commentaire est requis").optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional()
});

export default commentSchema;