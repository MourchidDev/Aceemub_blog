import React from 'react';
import { ShieldCheck, UserCog, Users, CircleSlash2 } from 'lucide-react';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/NotificationContainer';
import { useUpdateUser, useUsers } from '../hooks/useUsers';
import { UserAccount, UserRole } from '../types';

const roles: Array<{ value: UserRole; label: string; description: string }> = [
  { value: 'ADMIN', label: 'Admin', description: 'Gestion complete, utilisateurs inclus' },
  { value: 'EDITOR', label: 'Editeur', description: 'Contenu, evenements et moderation' },
  { value: 'MEMBER', label: 'Membre', description: 'Acces utilisateur standard' },
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

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading } = useUsers();
  const updateUser = useUpdateUser();
  const { success, error } = useNotification();

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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Derniere connexion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const isSelf = user.id === currentUser?.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                        {isSelf && <div className="text-xs font-semibold text-aemb-green mt-1">Votre compte</div>}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
