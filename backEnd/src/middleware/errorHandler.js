import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

const errorHandler = (err, req, res, next) => {
    if (err instanceof ZodError) {
        return res.status(400).json({ errors: err.flatten().fieldErrors });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') return res.status(409).json({ message: "Valeur déjà existante (doublon)." });
        if (err.code === 'P2025') return res.status(404).json({ message: "Ressource introuvable." });
    }

    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur." });
};

export default errorHandler;
