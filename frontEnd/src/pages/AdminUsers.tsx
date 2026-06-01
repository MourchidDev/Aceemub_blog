import React, { useMemo, useState } from 'react';
import {
  ShieldCheck,
  UserCog,
  Users,
  CircleSlash2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  KeyRound,
  UserCircle,
} from 'lucide-react';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/NotificationContainer';
import { useDeleteUser, useUpdateUser, useUsers } from '../hooks/useUsers';
import { UserAccount, UserRole } from '../types';
import { DeleteUserPayload } from '../api/users';

const PAGE_SIZE = 8;

const roles: Array<{ value: UserRole; label: string }> = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'EDITOR', label: 'Editeur' },
  { value: 'MEMBER', label: 'Membre' },
];

const roleStyles: Record<UserRole, string> = {
  ADMIN: 'bg-primary/20 text-primary',
  EDITOR: 'bg-secondary/20 text-secondary',
  MEMBER: 'bg-muted text-muted-foreground',
};

function formatDate(value?: string | null) {
  if (!value) return 'Jamais';
  return new Date(value).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function UserAvatar({ user }: { user: UserAccount }) {
  const [failed, setFailed] = useState(false);

  if (user.avatarUrl && !failed) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className="h-11 w-11 rounded-full object-cover border border-border"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="h-11 w-11 rounded-full bg-muted text-muted-foreground flex items-center justify-center border border-border">
      <UserCircle size={25} />
    </div>
  );
}

function DeleteUserModal({
  user,
  currentUser,
  isPending,
  onClose,
  onConfirm,
}: {
  user: UserAccount;
  currentUser: UserAccount;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (payload: DeleteUserPayload) => void;
}) {
  const needsEmailConfirmation = currentUser.authProvider === 'GOOGLE';
  const [confirmationValue, setConfirmationValue] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!confirmationValue.trim()) return;
    onConfirm(
      needsEmailConfirmation
        ? { confirmationEmail: confirmationValue.trim() }
        : { password: confirmationValue },
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-md bg-card rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-destructive/20 text-destructive flex items-center justify-center">
              <Trash2 size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Supprimer l'utilisateur</h2>
              <p className="text-xs text-muted-foreground">
                {needsEmailConfirmation ? 'Confirmation par email requise' : 'Confirmation par mot de passe requise'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Vous allez supprimer <span className="font-bold text-foreground">{user.name}</span>. Cette action retirera
            son acces et masquera son compte de la liste des utilisateurs.
          </p>

          <label className="block">
            <span className="block text-sm font-semibold text-foreground mb-2">
              {needsEmailConfirmation ? 'Votre email administrateur Google' : 'Votre mot de passe administrateur'}
            </span>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={needsEmailConfirmation ? 'email' : 'password'}
                value={confirmationValue}
                onChange={(event) => setConfirmationValue(event.target.value)}
                placeholder={needsEmailConfirmation ? currentUser.email : undefined}
                className="w-full rounded-lg border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:border-destructive"
                autoFocus
              />
            </div>
          </label>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isPending || !confirmationValue.trim()}
            className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-white hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading } = useUsers();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const { success, error } = useNotification();
  const [page, setPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = useMemo(
    () => users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, users],
  );

  const admins = users.filter((user) => user.role === 'ADMIN' && user.isActive).length;
  const editors = users.filter((user) => user.role === 'EDITOR' && user.isActive).length;
  const disabled = users.filter((user) => !user.isActive).length;

  const updateRole = async (user: UserAccount, role: UserRole) => {
    if (user.role === role) return;

    try {
      await updateUser.mutateAsync({ id: user.id, payload: { role } });
      success('Role mis a jour');
    } catch {
      error('Impossible de modifier ce role');
    }
  };

  const updateStatus = async (user: UserAccount, isActive: boolean) => {
    if (user.isActive === isActive) return;

    try {
      await updateUser.mutateAsync({ id: user.id, payload: { isActive } });
      success(isActive ? 'Compte active' : 'Compte desactive');
    } catch {
      error('Impossible de modifier ce compte');
    }
  };

  const confirmDelete = async (payload: DeleteUserPayload) => {
    if (!userToDelete) return;

    try {
      await deleteUser.mutateAsync({ id: userToDelete.id, payload });
      success('Utilisateur supprime');
      setUserToDelete(null);
    } catch (caughtError) {
      const message =
        typeof caughtError === 'object' &&
        caughtError !== null &&
        'response' in caughtError &&
        typeof caughtError.response === 'object' &&
        caughtError.response !== null &&
        'data' in caughtError.response &&
        typeof caughtError.response.data === 'object' &&
        caughtError.response.data !== null &&
        'message' in caughtError.response.data &&
        typeof caughtError.response.data.message === 'string'
          ? caughtError.response.data.message
          : 'Suppression impossible. Verifiez la confirmation.';

      error(message);
    }
  };

  return (
    <div className="space-y-6">
      <Loader isLoading={isLoading} />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Utilisateurs</h1>
        <p className="text-sm text-muted-foreground">
          Nommez les administrateurs et editeurs. Les editeurs gardent toute la gestion du contenu sans acces aux roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">Admins actifs</p>
            <p className="text-xl font-black">{admins}</p>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-secondary/10 text-blue-600 rounded-lg">
            <UserCog size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">Editeurs actifs</p>
            <p className="text-xl font-black">{editors}</p>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-muted text-muted-foreground rounded-lg">
            <CircleSlash2 size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">Comptes desactives</p>
            <p className="text-xl font-black">{disabled}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {users.length === 0 && !isLoading ? (
          <div className="p-16 text-center">
            <Users size={44} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Aucun utilisateur trouve</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-muted-foreground">Utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-muted-foreground">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-muted-foreground">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-muted-foreground">Derniere connexion</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedUsers.map((user) => {
                    const isSelf = user.id === currentUser?.id;

                    return (
                      <tr key={user.id} className="hover:bg-muted/70">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={user} />
                            <div className="min-w-0">
                              <div className="font-bold text-foreground truncate">{user.name}</div>
                              <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                              {isSelf && <div className="text-xs font-semibold text-primary mt-1">Votre compte</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <span className={`w-fit px-2.5 py-1 rounded-full text-xs font-bold ${roleStyles[user.role]}`}>
                              {roles.find((role) => role.value === user.role)?.label}
                            </span>
                            <select
                              value={user.role}
                              disabled={isSelf || updateUser.isPending}
                              onChange={(event) => updateRole(user, event.target.value as UserRole)}
                              className="w-44 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground disabled:bg-muted disabled:text-muted-foreground"
                              aria-label={`Modifier le role de ${user.name}`}
                            >
                              {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <label className="inline-flex items-center gap-3 text-sm font-medium text-foreground">
                            <input
                              type="checkbox"
                              checked={user.isActive}
                              disabled={isSelf || updateUser.isPending}
                              onChange={(event) => updateStatus(user, event.target.checked)}
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
                            />
                            {user.isActive ? 'Actif' : 'Desactive'}
                          </label>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(user.lastLoginAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              disabled={isSelf || deleteUser.isPending}
                              onClick={() => setUserToDelete(user)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 disabled:text-muted-foreground disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                              title={isSelf ? 'Action indisponible sur votre propre compte' : 'Supprimer'}
                              aria-label={`Supprimer ${user.name}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages} - {users.length} utilisateur{users.length > 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Precedent
                </button>
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          currentUser={currentUser as UserAccount}
          isPending={deleteUser.isPending}
          onClose={() => setUserToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
