import React, { useState, useEffect } from 'react';
import useArticleSubmit from '../hooks/useArticleSubmit';
import { validateArticle } from '../utils/validator';
// import { useCategories } from '../hooks/useCategories';
import { Article, ArticlePayload } from '../types';

interface Props {
  initialData?: Article | null;
  onSuccess?: () => void;
}

type FormState = ArticlePayload & { id?: string };

const slugify = (str: string) =>
  str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

const ArticleForm = ({ initialData = null, onSuccess }: Props) => {
  const { submitArticle, loading, error: apiError } = useArticleSubmit();
//   const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const [formData, setFormData] = useState<FormState>({
    title: '',
    slug: '',
    content: '',
    status: 'DRAFT',
    categoryId: '',
    coverImage: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ArticlePayload, string>>>({});
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        title: initialData.title,
        slug: initialData.slug,
        content: initialData.content,
        status: initialData.status,
        categoryId: initialData.categoryId ?? '',
        coverImage: '',
      });
      if (initialData.coverImage) setPreview(initialData.coverImage);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' ? { slug: slugify(value) } : {}),
    }));
    if (errors[name as keyof ArticlePayload]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateArticle(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await submitArticle(formData, !!initialData);
      onSuccess?.();
    } catch {
        
    }
  };

  const inputClass = (field: keyof ArticlePayload) =>
    `mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-aemb-green/20 ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Modifier' : 'Créer'} un article
      </h2>

      {apiError && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{apiError}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Colonne principale */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input type="text" name="title" value={formData.title}
              onChange={handleChange} className={inputClass('title')} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input type="text" name="slug" value={formData.slug}
              onChange={handleChange} className={inputClass('slug')} />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contenu</label>
            <textarea name="content" rows={10} value={formData.content}
              onChange={handleChange} className={inputClass('content')} />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
          </div>
        </div>

        {/* Barre latérale */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
            <select name="categoryId" value={formData.categoryId}
              onChange={handleChange} disabled={loadingCategories}
              className={inputClass('categoryId')}>
              <option value="">
                {loadingCategories ? 'Chargement...' : '-- Sélectionner --'}
              </option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image de couverture</label>
            <div className="mt-1 flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-md">
              {preview
                ? <img src={preview} alt="Preview" className="mb-2 w-full h-32 object-cover rounded" />
                : <span className="text-gray-400 text-xs mb-2">Aucune image sélectionnée</span>
              }
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select name="status" value={formData.status}
              onChange={handleChange} className={inputClass('status')}>
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publié</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-aemb-green text-white py-2 px-4 rounded-md hover:bg-emerald-800 disabled:opacity-50 transition">
            {loading ? 'Envoi en cours...' : "Enregistrer l'article"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ArticleForm;
