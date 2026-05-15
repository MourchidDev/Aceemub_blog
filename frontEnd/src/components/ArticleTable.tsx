import React from 'react';
import { Edit3, Trash2, Calendar, Eye, CheckCircle, Archive } from 'lucide-react';
import { Article } from '../types';

interface Props {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
}

const ArticleTable = ({ articles, onEdit, onDelete, onPublish, onArchive }: Props) => {
  return (
    <div className="w-full">
      <table className="w-full text-sm text-left">
        <thead className="text-[11px] text-slate-400 uppercase tracking-wider bg-slate-50/50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 font-bold">Article</th>
            <th className="px-6 py-4 font-bold">Statut</th>
            <th className="px-6 py-4 font-bold hidden md:table-cell">Date</th>
            <th className="px-6 py-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {articles.map((article) => (
            <tr key={article.id} className="group hover:bg-slate-50/50 transition-all duration-200">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 shadow-sm">
                    <img
                      src={article.coverImage ?? article.image ?? '/placeholder.png'}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.png';
                      }}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-800 truncate max-w-[200px] md:max-w-xs group-hover:text-emerald-700 transition-colors">
                      {typeof article.title === 'string' ? article.title : 'Titre non disponible'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium truncate italic">
                      {article.category?.name ? `Catégorie: ${article.category.name}` : `ID: ${article.id.split('-')[0]}...`}
                    </span>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  article.status === 'PUBLISHED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : article.status === 'ARCHIVED'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    article.status === 'PUBLISHED' ? 'bg-emerald-500' : article.status === 'ARCHIVED' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                  {article.status === 'PUBLISHED' ? 'Publié' : article.status === 'ARCHIVED' ? 'Archivé' : 'Brouillon'}
                </span>
              </td>

              <td className="px-6 py-4 hidden md:table-cell text-slate-500 italic">
                <div className="flex items-center gap-2 text-xs">
                    <Calendar size={14} className="text-slate-300" />
                    {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}
                </div>
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex justify-end items-center gap-1 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  {article.status === 'DRAFT' && (
                    <button 
                      onClick={() => onPublish(article.id)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Publier"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  {article.status === 'PUBLISHED' && (
                    <button 
                      onClick={() => onArchive(article.id)}
                      className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Archiver"
                    >
                      <Archive size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => onEdit(article)}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(article.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleTable;
