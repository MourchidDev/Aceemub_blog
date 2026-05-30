import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, MapPin, Trash2, Eye, Plus, Pencil } from "lucide-react";
import { eventsApi } from "@/api";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useConfirm } from "@/hooks/useConfirm";



function AdminEventsPage() {
  const qc = useQueryClient();
  const { data: list = [] } = useQuery({
    queryKey: ["admin", "events"],
    queryFn: () => eventsApi.getAll().catch(() => []),
    initialData: [],
  });
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();

  const del = useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => { toast.success("Événement supprimé"); qc.invalidateQueries({ queryKey: ["admin", "events"] }); },
  });

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await confirm({
      title: "Supprimer l'événement",
      message: `Êtes-vous sûr de vouloir supprimer <strong>${title}</strong> ?`,
      confirmText: "Supprimer",
      confirmColor: "danger",
    });
    if (confirmed) del.mutate(id);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Événements</h1>
          <p className="text-sm text-muted-foreground">Gère les événements et leurs albums photos.</p>
        </div>
        <Link to="/admin/evenements/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Créer
        </Link>
      </div>

      <ul className="mt-6 space-y-3">
        {list.map((e) => (
          <li key={e.id} className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-lg">{e.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(e.eventDate).toLocaleString("fr-FR")}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</span>
                <span>{e._count?.albums ?? e.albums.length} album(s)</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Link to={`/admin/evenements/${e.id}/edit`} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" title="Modifier">
                <Pencil className="h-4 w-4" />
              </Link>
              <Link to={`/admin/evenements/${e.id}`} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" title="Détails">
                <Eye className="h-4 w-4" />
              </Link>
              <button onClick={() => handleDelete(e.id, e.title)} className="grid h-9 w-9 place-items-center rounded-full text-destructive hover:bg-destructive/10" title="Supprimer">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
        {list.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Aucun événement.
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

export default AdminEventsPage;
