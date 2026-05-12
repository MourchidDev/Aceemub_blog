import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, LayoutList, Search } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useArticles } from '../hooks/useArticles';
import ArticleTable from '../components/ArticleTable';
import apiClient from '../api/client';
import { Article } from '../types';

export default function AdminArticles() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: articles = [], isLoading } = useArticles();

  const handleEdit = (article: Article) =>
    navigate(`/admin/articles/${article.id}/edit`);

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet article ? Cette action est irréversible.')) return;
    try {
      await apiClient.delete(`/articles/${id}`);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec Titre et Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Articles</h1>
          <p className="text-slate-500 text-sm">Gérez, éditez et publiez vos contenus.</p>
        </div>
        <button
          onClick={() => navigate('/admin/articles/new')}
          className="flex items-center gap-2 bg-aemb-green text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-800 transition-all active:scale-95">
          <Plus size={20} /> Nouvel article
        </button>
      </div>

      {/* Barre de Filtres Rapides / Stats (Le petit plus pro) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><FileText size={20}/></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
            <p className="text-xl font-black">{articles.length}</p>
          </div>
        </div>
        {/* Tu peux ajouter d'autres stats ici (ex: Publiés, Brouillons) */}
      </div>

      {/* Zone de contenu principal */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-aemb-green"></div>
            <p className="text-slate-400 font-medium italic">Récupération des articles...</p>
          </div>
        ) : articles.length > 0 ? (
          <ArticleTable articles={articles} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <div className="p-20 text-center">
            <div className="inline-flex p-6 bg-slate-50 rounded-full text-slate-300 mb-4">
                <LayoutList size={48} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Aucun article trouvé</h3>
            <p className="text-slate-500 mb-6">Commencez par rédiger votre première histoire.</p>
            <button 
                onClick={() => navigate('/admin/articles/new')}
                className="text-aemb-green font-bold hover:underline"
            >
                Créer un article maintenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}