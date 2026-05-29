import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, Archive } from "lucide-react";
import { articlesApi } from "@/api";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useConfirm } from "@/hooks/useConfirm";



const statusBadge = (s: string) =>
  s === "PUBLISHED" ? "bg-secondary/30 text-accent" :
  s === "DRAFT" ? "bg-muted text-muted-foreground" :
  "bg-foreground/10 text-foreground";

function AdminArticlesPage() {
  const qc = useQueryClient();
  const { data: list = [], isLoading } = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: () => articlesApi.getAll().catch(() => []),
    initialData: [],
  });

  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();

  const del = useMutation({
    mutationFn: (id: string) => articlesApi.delete(id),
    onSuccess: () => { toast.success("Article supprimé"); qc.invalidateQueries({ queryKey: ["admin", "articles"] }); },
    onError: () => toast.error("Échec suppression"),
  });
  const pub = useMutation({
    mutationFn: (id: string) => articlesApi.publish(id),
    onSuccess: () => { toast.success("Publié"); qc.invalidateQueries({ queryKey: ["admin", "articles"] }); },
  });
  const arc = useMutation({
    mutationFn: (id: string) => articlesApi.archive(id),
    onSuccess: () => { toast.success("Archivé"); qc.invalidateQueries({ queryKey: ["admin", "articles"] }); },
  });

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await confirm({
      title: "Supprimer l'article",
      message: `Êtes-vous sûr de vouloir supprimer <strong>${title}</strong> ? Cette action est irréversible.`,
      confirmText: "Supprimer",
      confirmColor: "danger",
    });
    if (confirmed) del.mutate(id);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Articles</h1>
          <p className="text-sm text-muted-foreground">Crée, modifie et publie le contenu du blog.</p>
        </div>
        <Link
          to="/admin/articles/nouveau"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Nouvel article
        </Link>
      </div>

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
              {isLoading && (
                <tr><td className="px-4 py-6 text-muted-foreground" colSpan={5}>Chargement…</td></tr>
              )}
              {!isLoading && list.length === 0 && (
                <tr><td className="px-4 py-10 text-center text-muted-foreground" colSpan={5}>Aucun article. Crée le premier !</td></tr>
              )}
              {list.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.category?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadge(a.status)}`}>{a.status.toLowerCase()}</span>
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
                      {a.status === "DRAFT" && (
                        <button onClick={() => pub.mutate(a.id)} className="grid h-8 w-8 place-items-center rounded-full text-accent hover:bg-accent/10" aria-label="Publier">
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {a.status === "PUBLISHED" && (
                        <button onClick={() => arc.mutate(a.id)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted" aria-label="Archiver">
                          <Archive className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(a.id, a.title)} className="grid h-8 w-8 place-items-center rounded-full text-destructive hover:bg-destructive/10" aria-label="Supprimer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isOpen && options && (
        <ConfirmDialog
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          confirmColor={options.confirmColor}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default AdminArticlesPage;
