import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImagePlus, Type, Link, FileText, Settings, Save, XCircle } from 'lucide-react';
import useArticleSubmit from '../hooks/useArticleSubmit';
import { validateArticle } from '../utils/validator';
import { useCategories } from '../hooks/useCategories';
import { useArticle } from '../hooks/useArticles';
import Editor from '../components/Editor';
import { ArticlePayload } from '../types';

type FormState = ArticlePayload & { id?: string };

const slugify = (str: string) =>
  str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export default function ArticleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const { data: initialData } = useArticle(id ?? '');
  const { submitArticle, loading, error: apiError } = useArticleSubmit();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const [formData, setFormData] = useState<FormState>({
    title: '', slug: '', content: '', status: 'DRAFT', categoryId: '', coverImage: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ArticlePayload, string>>>({});
  const [preview, setPreview] = useState<string | null>(null);

  // GESTION DE L'HYDRATATION : On remplit le state quand les données arrivent
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
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'categoryId') {
        const catSlug = categories.find(c => c.id === value)?.slug ?? '';
        updated.slug = prev.title ? `${catSlug}-${slugify(prev.title)}` : catSlug;
      }
      if (name === 'title') {
        const catSlug = categories.find(c => c.id === prev.categoryId)?.slug ?? '';
        updated.slug = catSlug ? `${catSlug}-${slugify(value)}` : slugify(value);
      }
      return updated;
    });
    if (errors[name as keyof ArticlePayload]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateArticle(formData);
    if (!validation.isValid) { setErrors(validation.errors); return; }
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v) payload.append(k, v); });
      if (imageFile) payload.append('coverImage', imageFile);
      await submitArticle(payload as any, isEdit);
      navigate('/admin/articles');
    } catch { }
  };

  const labelClass = "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5";
  const inputBase = "block w-full transition-all duration-200 border rounded-xl p-3 focus:ring-4 focus:outline-none";
  const inputClass = (field: keyof ArticlePayload) =>
    `${inputBase} ${errors[field]
      ? 'border-red-400 focus:ring-red-100 bg-red-50'
      : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-50'}`;

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 px-4">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {isEdit ? "Modifier l'article" : 'Nouvel Article'}
            </h1>
            <p className="text-gray-500 mt-0.5 text-sm">Remplissez les détails pour publier votre contenu.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/articles')}
              className="px-5 py-2.5 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95"
            >
              <Save size={18} />
              {loading ? 'Envoi...' : 'Enregistrer'}
            </button>
          </div>
        </div>

        {apiError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl">
            <XCircle size={20} />
            <p className="font-medium text-sm">{apiError}</p>
          </div>
        )}

        {/* Body : 2 colonnes sur lg, 1 colonne sur mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Colonne principale */}
          <div className="lg:col-span-8 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
              <div>
                <label className={labelClass}><Type size={16} className="text-emerald-500" /> Titre de l'article</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Ex: Les tendances du Web en 2026..."
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClass('title')}
                />
                {errors.title && <p className="text-red-500 text-xs mt-2 ml-1 font-medium italic">{errors.title}</p>}
              </div>

              <div>
                <label className={labelClass}><Link size={16} className="text-emerald-500" /> URL de l'article (Slug)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm select-none">/blog/</span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className={`${inputClass('slug')} pl-14 font-mono text-sm text-gray-600`}
                  />
                </div>
                {errors.slug && <p className="text-red-500 text-xs mt-2 ml-1 font-medium italic">{errors.slug}</p>}
              </div>

              <div>
                <label className={labelClass}><FileText size={16} className="text-emerald-500" /> Contenu de l'article</label>
                <Editor
                  content={formData.content}
                  onChange={(newContent) => {
                    setFormData(prev => ({ ...prev, content: newContent }));
                    if (errors.content) setErrors(prev => ({ ...prev, content: undefined }));
                  }}
                />
                {errors.content && <p className="text-red-500 text-xs mt-2 ml-1 font-medium italic">{errors.content}</p>}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">

            {/* Image */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <label className={labelClass}><ImagePlus size={16} className="text-emerald-500" /> Image à la une</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`group relative mt-2 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300
                  ${preview ? 'border-emerald-200' : 'border-gray-200 hover:border-emerald-400 bg-gray-50 hover:bg-white'}`}
              >
                {preview ? (
                  <div className="relative h-40 w-full group">
                    <img src={preview} alt="Preview" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold uppercase tracking-wider">Changer l'image</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-emerald-50 rounded-full text-emerald-600 group-hover:scale-110 transition-transform">
                      <ImagePlus size={24} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500">Cliquez pour uploader</span>
                    <span className="text-[10px] text-gray-400">JPG, PNG ou WEBP (Max 2MB)</span>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
            </section>

            {/* Organisation */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <label className={labelClass}><Settings size={16} className="text-emerald-500" /> Organisation</label>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-1">Catégorie</span>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  disabled={loadingCategories}
                  className={`${inputClass('categoryId')} mt-1 bg-gray-50`}
                >
                  <option value="">{loadingCategories ? 'Chargement...' : 'Sélectionner'}</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1 ml-1 font-medium italic">{errors.categoryId}</p>}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-1">Statut</span>
                <div className="flex gap-2 mt-1">
                  {(['DRAFT', 'PUBLISHED'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, status: s }))}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all
                        ${formData.status === s
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-200'}`}
                    >
                      {s === 'DRAFT' ? 'Brouillon' : 'Publier'}
                    </button>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </div>
      </form>
    </div>
  );
}
