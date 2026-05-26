import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';
import { useNotification } from '../components/NotificationContainer';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from '../components/ConfirmDialog';
import { Category } from '../types';
import { Plus, Pencil, Trash2, Tag, Hash, FileText, X } from 'lucide-react';
import Loader from '../components/Loader';

interface CategoryModalProps {
  initial?: { name: string; slug: string };
  isEdit?: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; slug: string }) => void;
}

function CategoryModal({ initial, isEdit, isPending, onClose, onSubmit }: CategoryModalProps) {
  const [form, setForm] = useState(initial ?? { name: '', slug: '' });

  const slugify = (value: string) =>
    value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleNameChange = (value: string) => {
    setForm({ name: value, slug: isEdit ? form.slug : slugify(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Tag size={16} className="text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nom <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ex: Technologie"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Slug <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ex: technologie"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">Généré automatiquement depuis le nom</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || !form.name.trim() || !form.slug.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCategories() {
  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const { success, error } = useNotification();
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const openCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (data: { name: string; slug: string }) => {
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, ...data },
        {
          onSuccess: () => { success('Catégorie mise à jour'); closeModal(); },
          onError: () => error('Erreur lors de la mise à jour'),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => { success('Catégorie créée avec succès'); closeModal(); },
        onError: () => error('Erreur lors de la création'),
      });
    }
  };

  const handleDelete = async (cat: Category) => {
    const confirmed = await confirm({
      title: 'Supprimer la catégorie ?',
      message: `La catégorie <strong>${cat.name}</strong> sera supprimée définitivement.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      confirmColor: 'danger',
    });

    if (confirmed) {
      deleteMutation.mutate(cat.id, {
        onSuccess: () => success('Catégorie supprimée'),
        onError: () => error('Erreur lors de la suppression'),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <Loader isLoading={isLoading} />
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {categories?.length ?? 0} catégorie{(categories?.length ?? 0) !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Nouvelle catégorie
          </button>
        </div>

        {isLoading ? null : !categories?.length ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Tag size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Aucune catégorie pour l'instant</p>
            <button onClick={openCreate} className="mt-4 text-indigo-600 text-sm font-medium hover:underline">
              Créer la première
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Slug</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Articles</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-800">{cat.name}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-mono text-xs">
                        <Hash size={11} />
                        {cat.slug}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-500">
                        <FileText size={13} />
                        {cat._count?.articles ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                        >
                          <Pencil size={12} />
                          Éditer
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={deleteMutation.isPending}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={12} />
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <CategoryModal
          initial={editingCategory ? { name: editingCategory.name, slug: editingCategory.slug } : undefined}
          isEdit={!!editingCategory}
          isPending={isPending}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

      {isOpen && options && (
        <ConfirmDialog
          {...options}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
