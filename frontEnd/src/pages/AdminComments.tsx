import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Trash2 } from "lucide-react";
import { commentsApi } from "@/api";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useConfirm } from "@/hooks/useConfirm";



function AdminCommentsPage() {
  const qc = useQueryClient();
  const { data: list = [] } = useQuery({
    queryKey: ["admin", "comments"],
    queryFn: () => commentsApi.getAll().catch(() => []),
    initialData: [],
  });
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();

  const inv = () => qc.invalidateQueries({ queryKey: ["admin", "comments"] });
  const approve = useMutation({ mutationFn: commentsApi.approve, onSuccess: () => { toast.success("Approuvé"); inv(); } });
  const reject = useMutation({ mutationFn: commentsApi.reject, onSuccess: () => { toast.success("Rejeté"); inv(); } });
  const del = useMutation({ mutationFn: commentsApi.delete, onSuccess: () => { toast.success("Supprimé"); inv(); } });

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Supprimer le commentaire",
      message: "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
      confirmText: "Supprimer",
      confirmColor: "danger",
    });
    if (confirmed) del.mutate(id);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl">Commentaires</h1>
      <p className="text-sm text-muted-foreground">Modère les commentaires laissés sur les articles.</p>

      <ul className="mt-6 space-y-3">
        {list.map((c) => (
          <li key={c.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">{c.user?.name ?? c.authorName ?? "Anonyme"}</span> sur
                {" "}<span className="italic">{c.article?.title}</span>
              </span>
              <span className={`rounded-full px-2 py-0.5 ${
                c.status === "APPROVED" ? "bg-secondary/30 text-accent" :
                c.status === "PENDING" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}>{c.status.toLowerCase()}</span>
            </div>
            <p className="mt-2 text-sm">{c.content}</p>
            <div className="mt-3 flex gap-1">
              <button onClick={() => approve.mutate(c.id)} className="inline-flex h-8 items-center gap-1 rounded-full bg-accent px-3 text-xs font-medium text-accent-foreground">
                <Check className="h-3.5 w-3.5" /> Approuver
              </button>
              <button onClick={() => reject.mutate(c.id)} className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-card px-3 text-xs font-medium">
                <X className="h-3.5 w-3.5" /> Rejeter
              </button>
              <button onClick={() => handleDelete(c.id)} className="inline-flex h-8 items-center gap-1 rounded-full text-destructive hover:bg-destructive/10 px-3 text-xs font-medium">
                <Trash2 className="h-3.5 w-3.5" /> Supprimer
              </button>
            </div>
          </li>
        ))}
        {list.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Aucun commentaire pour l'instant.
          </li>
        )}
      </ul>
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

export default AdminCommentsPage;
