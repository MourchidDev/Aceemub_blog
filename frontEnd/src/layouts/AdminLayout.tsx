import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Tag,
  Plus,
  ArrowLeft,
  CalendarDays,
  MessageCircle,
  Users,
  Undo2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin/articles', label: 'Articles', icon: <FileText size={18} /> },
  { to: '/admin/articles/new', label: 'Nouvel article', icon: <Plus size={18} /> },
  { to: '/admin/categories', label: 'Categories', icon: <Tag size={18} /> },
  { to: '/admin/evenements', label: 'Evenements', icon: <CalendarDays size={18} /> },
  { to: '/admin/comments', label: 'Commentaires', icon: <MessageCircle size={18} /> },
  { to: '/admin/users', label: 'Utilisateurs', icon: <Users size={18} />, adminOnly: true },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || user?.role === 'ADMIN');

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col p-6 gap-1">
        <div className="flex items-center gap-2 mb-8">
          <LayoutDashboard size={22} className="text-aemb-green" />
          <span className="font-bold text-lg text-aemb-green">Admin</span>
        </div>

        {visibleNavItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.to || pathname.startsWith(`${item.to}/`)
                ? 'bg-aemb-green text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}

        <div className="mt-auto">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-aemb-green text-sm transition-colors">
            <ArrowLeft size={16} /> Retour au site
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:text-aemb-green hover:border-aemb-green transition-colors"
        >
          <Undo2 size={16} />
          Retour
        </button>
        <Outlet />
      </main>
    </div>
  );
}
