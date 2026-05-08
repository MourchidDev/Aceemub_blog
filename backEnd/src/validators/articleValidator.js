import z from "zod"

// zod valide et sanitize toutes les entrées
// articleSchema est un validator permettant la facilité de la validation des entrée du crud avec les Articles

const articleSchema = z.object({
    title: z.string().min(3).max(255).trim(),
    content: z.string().min(10),
    categoryId: z.string().uuid(),
    slug: z.string().min(3).max(255),
    coverImage: z.string().url().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});

export default articleSchema;