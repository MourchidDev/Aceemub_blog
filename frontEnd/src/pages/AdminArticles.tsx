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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Articles</h1>
          <p className="text-muted-foreground text-sm">Gérez, éditez et publiez vos contenus.</p>
        </div>
        <button
          onClick={() => navigate('/admin/articles/new')}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all">
          <Plus size={20} /> Nouvel article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg"><FileText size={20}/></div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">Total</p>
            <p className="text-xl font-bold text-foreground">{articles.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {!isLoading && articles.length > 0 ? (
          <ArticleTable
            articles={articles}
            onDelete={handleDelete}
            onPublish={handlePublish}
            onArchive={handleArchive}
          />
        ) : !isLoading && articles.length === 0 ? (
          <div className="p-20 text-center">
            <div className="inline-flex p-6 bg-muted rounded-full text-muted-foreground mb-4">
                <LayoutList size={48} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Aucun article trouvé</h3>
            <p className="text-muted-foreground mb-6">Commencez par rédiger votre première histoire.</p>
            <button
                onClick={() => navigate('/admin/articles/new')}
                className="text-primary font-medium hover:underline"
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