import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2, Archive, CheckCircle } from "lucide-react";
import type { Article } from "@/types";

const statusConfig = {
  PUBLISHED: { bg: "bg-green-500/10", text: "text-green-700", icon: CheckCircle, label: "Publié" },
  DRAFT: { bg: "bg-yellow-500/10", text: "text-yellow-700", icon: Archive, label: "Brouillon" },
  ARCHIVED: { bg: "bg-gray-500/10", text: "text-gray-700", icon: Archive, label: "Archivé" },
};

type Props = {
  articles: Article[];
  loading?: boolean;
  onPublish?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function ArticleTable({ articles, loading, onPublish, onArchive, onDelete }: Props) {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Article</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Catégorie</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Statut</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr><td className="px-6 py-8 text-center text-muted-foreground" colSpan={5}>Chargement…</td></tr>
            )}
            {!loading && articles.length === 0 && (
              <tr><td className="px-6 py-12 text-center text-muted-foreground" colSpan={5}>Aucun article.</td></tr>
            )}
            {articles.map((a) => {
              const config = statusConfig[a.status] || statusConfig.DRAFT;
              const StatusIcon = config.icon;
              
              return (
                <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {a.coverImage && (
                        <img src={a.coverImage} alt="" className="h-12 w-16 rounded-lg object-cover bg-muted" />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground line-clamp-1">{a.title}</div>
                        <div className="text-xs text-muted-foreground">Par {a.author?.name || "Anonyme"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {a.category?.name ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}>
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{a.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <Link to={`/blog/${a.id}`} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-muted transition-colors" aria-label="Voir">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link to={`/admin/articles/${a.id}/edit`} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-primary/10 text-primary transition-colors" aria-label="Éditer">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      {a.status === "DRAFT" && onPublish && (
                        <button onClick={() => onPublish(a.id)} className="grid h-9 w-9 place-items-center rounded-lg text-green-600 hover:bg-green-600/10 transition-colors" aria-label="Publier">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {a.status === "PUBLISHED" && onArchive && (
                        <button onClick={() => onArchive(a.id)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-muted transition-colors" aria-label="Archiver">
                          <Archive className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => confirm("Supprimer cet article ?") && onDelete(a.id)} className="grid h-9 w-9 place-items-center rounded-lg text-destructive hover:bg-destructive/10 transition-colors" aria-label="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
