import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil } from "lucide-react";
import { categoriesApi } from "@/api";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useConfirm } from "@/hooks/useConfirm";



function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AdminCategoriesPage() {
  const qc = useQueryClient();
  const { data: list = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll().catch(() => []),
    initialData: [],
  });
  const [name, setName] = useState("");
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();

  const create = useMutation({
    mutationFn: (n: string) => categoriesApi.create({ name: n, slug: slugify(n) }),
    onSuccess: () => { setName(""); toast.success("Catégorie ajoutée"); qc.invalidateQueries({ queryKey: ["categories"] }); },
    onError: () => toast.error("Erreur"),
  });
  const del = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => { toast.success("Supprimée"); qc.invalidateQueries({ queryKey: ["categories"] }); },
  });
  const ren = useMutation({
    mutationFn: ({ id, n }: { id: string; n: string }) => categoriesApi.update(id, { name: n, slug: slugify(n) }),
    onSuccess: () => { toast.success("Renommée"); qc.invalidateQueries({ queryKey: ["categories"] }); },
  });

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: "Supprimer la catégorie",
      message: `Êtes-vous sûr de vouloir supprimer <strong>${name}</strong> ?`,
      confirmText: "Supprimer",
      confirmColor: "danger",
    });
    if (confirmed) del.mutate(id);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl">Catégories</h1>
      <p className="text-sm text-muted-foreground">Organise les sujets du blog.</p>

      <form
        onSubmit={(e) => { e.preventDefault(); if (name.trim()) create.mutate(name.trim()); }}
        className="mt-6 flex gap-2"
      >
        <input
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la catégorie…"
          className="h-11 flex-1 rounded-full border border-border bg-card px-4 text-sm"
        />
        <button type="submit" className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {list.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-card">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">/{c.slug} · {c._count?.articles ?? 0} articles</div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => { const n = prompt("Nouveau nom", c.name); if (n) ren.mutate({ id: c.id, n }); }}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
              ><Pencil className="h-4 w-4" /></button>
              <button
                onClick={() => handleDelete(c.id, c.name)}
                className="grid h-8 w-8 place-items-center rounded-full text-destructive hover:bg-destructive/10"
              ><Trash2 className="h-4 w-4" /></button>
            </div>
          </li>
        ))}
        {list.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Aucune catégorie. Ajoute la première.
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

export default AdminCategoriesPage;
