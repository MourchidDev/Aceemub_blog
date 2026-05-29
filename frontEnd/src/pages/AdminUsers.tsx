import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Shield, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usersApi } from "@/api";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useConfirm } from "@/hooks/useConfirm";



function AdminUsersPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (user && user.role !== "ADMIN") nav("/admin/articles");
  }, [user, nav]);

  const qc = useQueryClient();
  const { data: list = [] } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => usersApi.getAll().catch(() => []),
    initialData: [],
  });
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();

  const inv = () => qc.invalidateQueries({ queryKey: ["admin", "users"] });
  const role = useMutation({
    mutationFn: ({ id, r }: { id: string; r: "ADMIN" | "EDITOR" | "MEMBER" }) => usersApi.updateRole(id, r),
    onSuccess: () => { toast.success("Rôle modifié"); inv(); },
  });
  const tog = useMutation({
    mutationFn: ({ id, v }: { id: string; v: boolean }) => usersApi.toggleActive(id, v),
    onSuccess: () => { toast.success("Mis à jour"); inv(); },
  });
  const del = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => { toast.success("Supprimé"); inv(); },
  });

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: "Supprimer l'utilisateur",
      message: `Êtes-vous sûr de vouloir supprimer <strong>${name}</strong> ?`,
      confirmText: "Supprimer",
      confirmColor: "danger",
    });
    if (confirmed) del.mutate(id);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-3xl flex items-center gap-2"><Shield className="h-6 w-6" /> Utilisateurs</h1>
      <p className="text-sm text-muted-foreground">Gestion des comptes et des rôles (Admin uniquement).</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => role.mutate({ id: u.id, r: e.target.value as any })}
                      className="h-8 rounded-full border border-border bg-background px-2 text-xs"
                    >
                      <option value="MEMBER">Membre</option>
                      <option value="EDITOR">Éditeur</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => tog.mutate({ id: u.id, v: !u.isActive })}
                      className={`rounded-full px-3 py-0.5 text-xs ${u.isActive ? "bg-secondary/30 text-accent" : "bg-muted text-muted-foreground"}`}
                    >
                      {u.isActive ? "Actif" : "Désactivé"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      className="grid h-8 w-8 place-items-center rounded-full text-destructive hover:bg-destructive/10 ml-auto"
                    ><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Aucun utilisateur.</td></tr>
              )}
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

export default AdminUsersPage;
