import React, { useState } from 'react';
import { MessageCircle, Send, User, Clock, Edit2 } from 'lucide-react';
import { useCommentsByArticle, useCreateComment,useUpdateComment } from '../hooks/useComments';
import { useAuth } from '../context/AuthContext';
import { useNotification } from './NotificationContainer';

interface Props {
  articleId: string;
}

export default function CommentSection({ articleId }: Props) {
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { data: comments = [], isLoading } = useCommentsByArticle(articleId);
  const createMutation = useCreateComment();
  const updateMutation = useUpdateComment();
  const { isAuthenticated, user } = useAuth();
  const { success, error } = useNotification();

  const approvedComments = comments.filter(c => c.status === 'APPROVED');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await createMutation.mutateAsync({ content, articleId });
      setContent('');
      success('Commentaire envoyé ! Il sera visible après modération.');
    } catch {
      error('Erreur lors de l\'envoi du commentaire');
    }
  };

  const handleEdit = (commentId: string, currentContent: string) => {
    setEditingId(commentId);
    setEditContent(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleUpdateSubmit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await updateMutation.mutateAsync({ id: commentId, content: editContent, articleId });
      setEditingId(null);
      setEditContent('');
      success('Commentaire modifié avec succès');
    } catch {
      error('Erreur lors de la modification du commentaire');
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-slate-100">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <MessageCircle size={24} className="text-aemb-green" />
        Commentaires ({approvedComments.length})
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-12 bg-slate-50 p-6 rounded-2xl">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Partagez votre réflexion..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-aemb-green resize-none"
            rows={4}
            required
          />
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-2 bg-aemb-green text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-800 disabled:opacity-50 transition-colors"
            >
              <Send size={16} />
              {createMutation.isPending ? 'Envoi...' : 'Publier'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-12 p-6 bg-amber-50 border border-amber-100 rounded-2xl text-center">
          <p className="text-slate-600">Connectez-vous pour laisser un commentaire</p>
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <p className="text-slate-400 text-center py-8">Chargement...</p>
        ) : approvedComments.length === 0 ? (
          <p className="text-slate-400 text-center py-8">Aucun commentaire pour le moment</p>
        ) : (
          approvedComments.map((comment) => (
            <div key={comment.id} className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-slate-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-slate-900">
                      {comment.user?.name || 'Anonyme'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    {user?.id === comment.user?.id && (
                      <button
                        onClick={() => handleEdit(comment.id, comment.content)}
                        className="ml-auto text-slate-400 hover:text-aemb-green transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  {editingId === comment.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-aemb-green resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateSubmit(comment.id)}
                          disabled={updateMutation.isPending}
                          className="px-4 py-2 bg-aemb-green text-white rounded-lg text-sm font-bold hover:bg-emerald-800 disabled:opacity-50 transition-colors"
                        >
                          {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 leading-relaxed">{comment.content}</p>
                  )}
                </div>
              </div>
            </div> 
          ))
        )}
      </div>
    </div>
  );
}