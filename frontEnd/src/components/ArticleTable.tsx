import React from 'react';
import { Article } from '../types';

interface Props {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}

const ArticleTable = ({ articles, onEdit, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Couverture</th>
            <th className="px-6 py-3">Titre</th>
            <th className="px-6 py-3">Statut</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">
                <img
                  src={article.coverImage ?? '/placeholder.png'}
                  alt={article.title}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">{article.title}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs ${
                  article.status === 'PUBLISHED'
                    ? 'bg-green-100 text-green-800'
                    : article.status === 'ARCHIVED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {article.status}
                </span>
              </td>
              <td className="px-6 py-4">{new Date(article.createdAt).toLocaleDateString('fr-FR')}</td>
              <td className="px-6 py-4 text-right space-x-2">
                <button onClick={() => onEdit(article)} className="text-blue-600 hover:underline">Éditer</button>
                <button onClick={() => onDelete(article.id)} className="text-red-600 hover:underline">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleTable;
