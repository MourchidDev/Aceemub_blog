import { ArticlePayload } from '../types';

interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ArticlePayload, string>>;
}

export const validateArticle = (values: ArticlePayload): ValidationResult => {
  const errors: Partial<Record<keyof ArticlePayload, string>> = {};

  if (!values.title || values.title.trim().length < 5) {
    errors.title = "Le titre doit contenir au moins 5 caractères.";
  }

  if (!values.content || values.content.trim().length === 0) {
    errors.content = "Le contenu de l'article ne peut pas être vide.";
  }

  if (!values.categoryId) {
    errors.categoryId = "Veuillez sélectionner une catégorie.";
  }

  if (!values.slug || values.slug.trim().length === 0) {
    errors.slug = "Le slug est requis. Sélectionnez une catégorie.";
  } else if (!/^[a-z0-9-]+$/.test(values.slug)) {
    errors.slug = "Le slug ne doit contenir que des minuscules, chiffres et tirets.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
