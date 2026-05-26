import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, LayoutList } from 'lucide-react';
import { useAdminArticles, useDeleteArticle, usePublishArticle, useArchiveArticle } from '../hooks/useArticles';
import ArticleTable from '../components/ArticleTable';
import { Article } from '../types';
import Loader from '../components/Loader';
import { useNotification } from '../components/NotificationContainer';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AdminArticles() {
  const navigate = useNavigate();
  const { data: articles = [], isLoading } = useAdminArticles();
  const deleteMutation = useDeleteArticle();
  const publishMutation = usePublishArticle();
  const archiveMutation = useArchiveArticle();
  const { success, error } = useNotification();
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();

  const handleEdit = (article: Article) =>
    navigate(`/admin/articles/${article.id}/edit`);

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Supprimer cet article ?',
      message: 'Cette action est <strong>irréversible</strong>. L\'article sera définitivement supprimé.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      confirmColor: 'danger',
    });

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(id);
      success('Article supprimé avec succès');
    } catch (err) {
      error('Erreur lors de la suppression de l\'article');
      console.error("Erreur lors de la suppression", err);
    }
  };

  const handlePublish = async (id: string) => {
    const confirmed = await confirm({
      title: 'Publier cet article ?',
      message: 'L\'article sera visible par tous les visiteurs du site.',
      confirmText: 'Publier',
      cancelText: 'Annuler',
      confirmColor: 'primary',
    });

    if (!confirmed) return;

    try {
      await publishMutation.mutateAsync(id);
      success('Article publié avec succès');
    } catch (err) {
      error('Erreur lors de la publication');
      console.error("Erreur lors de la publication", err);
    }
  };

  const handleArchive = async (id: string) => {
    const confirmed = await confirm({
      title: 'Archiver cet article ?',
      message: 'L\'article ne sera plus visible publiquement mais restera accessible dans les archives.',
      confirmText: 'Archiver',
      cancelText: 'Annuler',
      confirmColor: 'primary',
    });

    if (!confirmed) return;

    try {
      await archiveMutation.mutateAsync(id);
      success('Article archivé avec succès');
    } catch (err) {
      error('Erreur lors de l\'archivage');
      console.error("Erreur lors de l'archivage", err);
    }
  };

  return (
    <div className="space-y-6">
      <Loader isLoading={isLoading} />
      
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><FileText size={20}/></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
            <p className="text-xl font-black">{articles.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {!isLoading && articles.length > 0 ? (
          <ArticleTable 
            articles={articles} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onPublish={handlePublish}
            onArchive={handleArchive}
          />
        ) : !isLoading && articles.length === 0 ? (
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
        ) : null}
      </div>

      {/* Dialog de confirmation */}
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
