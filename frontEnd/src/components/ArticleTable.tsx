import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2, Archive } from "lucide-react";
import type { Article } from "@/types";

const statusBadge = (s: string) =>
  s === "PUBLISHED" ? "bg-secondary/30 text-accent" :
  s === "DRAFT" ? "bg-muted text-muted-foreground" :
  "bg-foreground/10 text-foreground";

type Props = {
  articles: Article[];
  loading?: boolean;
  onPublish?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function ArticleTable({ articles, loading, onPublish, onArchive, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="px-4 py-6 text-muted-foreground" colSpan={5}>Chargement…</td></tr>
            )}
            {!loading && articles.length === 0 && (
              <tr><td className="px-4 py-10 text-center text-muted-foreground" colSpan={5}>Aucun article.</td></tr>
            )}
            {articles.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{a.category?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadge(a.status)}`}>
                    {a.status.toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{a.date}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link to={`/blog/${a.id}`} className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted" aria-label="Voir">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link to={`/admin/articles/${a.id}/edition`} className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted" aria-label="Éditer">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    {a.status === "DRAFT" && onPublish && (
                      <button onClick={() => onPublish(a.id)} className="grid h-8 w-8 place-items-center rounded-full text-accent hover:bg-accent/10" aria-label="Publier">
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {a.status === "PUBLISHED" && onArchive && (
                      <button onClick={() => onArchive(a.id)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted" aria-label="Archiver">
                        <Archive className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => confirm("Supprimer cet article ?") && onDelete(a.id)} className="grid h-8 w-8 place-items-center rounded-full text-destructive hover:bg-destructive/10" aria-label="Supprimer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
