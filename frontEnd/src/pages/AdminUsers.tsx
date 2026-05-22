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
  ADMIN: 'bg-emerald-100 text-emerald-700',
  EDITOR: 'bg-blue-100 text-blue-700',
  MEMBER: 'bg-slate-100 text-slate-600',
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
        className="h-11 w-11 rounded-full object-cover border border-slate-200"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="h-11 w-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
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
      <form onSubmit={handleSubmit} className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Supprimer l'utilisateur</h2>
              <p className="text-xs text-slate-500">
                {needsEmailConfirmation ? 'Confirmation par email requise' : 'Confirmation par mot de passe requise'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Vous allez supprimer <span className="font-bold text-slate-900">{user.name}</span>. Cette action retirera
            son acces et masquera son compte de la liste des utilisateurs.
          </p>

          <label className="block">
            <span className="block text-sm font-semibold text-slate-700 mb-2">
              {needsEmailConfirmation ? 'Votre email administrateur Google' : 'Votre mot de passe administrateur'}
            </span>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={needsEmailConfirmation ? 'email' : 'password'}
                value={confirmationValue}
                onChange={(event) => setConfirmationValue(event.target.value)}
                placeholder={needsEmailConfirmation ? currentUser.email : undefined}
                className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </label>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isPending || !confirmationValue.trim()}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Utilisateurs</h1>
        <p className="text-sm text-slate-500">
          Nommez les administrateurs et editeurs. Les editeurs gardent toute la gestion du contenu sans acces aux roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Admins actifs</p>
            <p className="text-xl font-black">{admins}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <UserCog size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Editeurs actifs</p>
            <p className="text-xl font-black">{editors}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-500 rounded-lg">
            <CircleSlash2 size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Comptes desactives</p>
            <p className="text-xl font-black">{disabled}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {users.length === 0 && !isLoading ? (
          <div className="p-16 text-center">
            <Users size={44} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Aucun utilisateur trouve</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Derniere connexion</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedUsers.map((user) => {
                    const isSelf = user.id === currentUser?.id;

                    return (
                      <tr key={user.id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={user} />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate">{user.name}</div>
                              <div className="text-sm text-slate-500 truncate">{user.email}</div>
                              {isSelf && <div className="text-xs font-semibold text-aemb-green mt-1">Votre compte</div>}
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
                              className="w-44 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:bg-slate-100 disabled:text-slate-400"
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
                          <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                            <input
                              type="checkbox"
                              checked={user.isActive}
                              disabled={isSelf || updateUser.isPending}
                              onChange={(event) => updateStatus(user, event.target.checked)}
                              className="h-4 w-4 rounded border-slate-300 text-aemb-green focus:ring-aemb-green"
                            />
                            {user.isActive ? 'Actif' : 'Desactive'}
                          </label>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(user.lastLoginAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              disabled={isSelf || deleteUser.isPending}
                              onClick={() => setUserToDelete(user)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
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

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
              <p className="text-sm text-slate-500">
                Page {currentPage} sur {totalPages} - {users.length} utilisateur{users.length > 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Precedent
                </button>
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
