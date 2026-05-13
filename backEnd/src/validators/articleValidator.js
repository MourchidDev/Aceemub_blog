import z from "zod"

// zod valide et sanitize toutes les entrées
// articleSchema est un validator permettant la facilité de la validation des entrée du crud avec les Articles

const articleSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  content: z.string().min(1, "Le contenu est requis"),
  categoryId: z.string().min(1, "La catégorie est requise"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  coverImage: z.string().optional(),
});

export default articleSchema;