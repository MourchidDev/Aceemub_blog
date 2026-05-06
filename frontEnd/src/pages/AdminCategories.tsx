import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';
import { Category } from '../types';

export default function AdminCategories() {
  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      createMutation.mutate(formData);
    }
    setFormData({ name: '', slug: '' });
  };

  const handleEdit = (category: Category) => {
    setFormData({ name: category.name, slug: category.slug });
    setEditingId(category.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Gestion des Catégories</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {editingId ? 'Mettre à jour' : 'Créer'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', slug: '' });
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        )}
      </form>

      {/* List */}
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Nom</th>
                <th className="p-4 text-left">Slug</th>
                <th className="p-4 text-left">Articles</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((cat) => (
                <tr key={cat.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{cat.name}</td>
                  <td className="p-4">{cat.slug}</td>
                  <td className="p-4">{cat._count?.articles || 0}</td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={deleteMutation.isPending}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
