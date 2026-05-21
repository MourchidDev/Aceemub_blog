import React, { useState } from 'react';
import { CheckCircle, XCircle, Trash2, MessageCircle, Filter } from 'lucide-react';
import { useAllComments, useApproveComment, useRejectComment, useDeleteComment } from '../hooks/useComments';
import { useNotification } from '../components/NotificationContainer';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';

export default function AdminComments() {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const { data: comments = [], isLoading } = useAllComments();
  const approveMutation = useApproveComment();
  const rejectMutation = useRejectComment();
  const deleteMutation = useDeleteComment();
  const { success, error } = useNotification();
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();

  const filteredComments = filter === 'ALL' 
    ? comments 
    : comments.filter(c => c.status === filter);

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync(id);
      success('Commentaire approuvé');
    } catch {
      error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectMutation.mutateAsync(id);
      success('Commentaire rejeté');
    } catch {
      error('Erreur lors du rejet');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Supprimer ce commentaire ?',
      message: 'Cette action est irréversible.',
      confirmText: 'Supprimer',
      confirmColor: 'danger',
    });

    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(id);
        success('Commentaire supprimé');
      } catch {
        error('Erreur lors de la suppression');
      }
    }
  };

  const statusColors = {
    PENDING: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="space-y-6">
      <Loader isLoading={isLoading} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Commentaires</h1>
          <p className="text-slate-500 text-sm">Modérez les commentaires des lecteurs</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-4 rounded-xl border border-slate-100">
        <Filter size={18} className="text-slate-400" />
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              filter === status
                ? 'bg-aemb-green text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {status === 'ALL' ? 'Tous' : status === 'PENDING' ? 'En attente' : status === 'APPROVED' ? 'Approuvés' : 'Rejetés'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {filteredComments.length === 0 ? (
          <div className="p-20 text-center">
            <MessageCircle size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Aucun commentaire</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-slate-900">
                        {comment.user?.name || 'Anonyme'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[comment.status]}`}>
                        {comment.status === 'PENDING' ? 'En attente' : comment.status === 'APPROVED' ? 'Approuvé' : 'Rejeté'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-2">{comment.content}</p>
                    <p className="text-xs text-slate-400">Article: {comment.article?.title}</p>
                  </div>
                  <div className="flex gap-2">
                    {comment.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApprove(comment.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Approuver"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(comment.id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Rejeter"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpen && options && (
        <ConfirmDialog {...options} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </div>
  );
}
