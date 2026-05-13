import { ZodError } from "zod";

export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
 if (error instanceof ZodError) {
    console.log("Validation errors:", error.issues); 
    return res.status(400).json({
      message: "Donnees invalides.",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // En production on garde un message generique, mais le log conserve la cause
  // exacte pour le debuggage serveur.
  console.error(error);
  res.status(error.statusCode ?? 500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Erreur serveur."
        : error.message ?? "Erreur serveur.",
  });
}
