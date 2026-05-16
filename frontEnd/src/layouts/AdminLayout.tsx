import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Tag, Plus, ArrowLeft } from 'lucide-react';

const navItems = [
  { to: '/admin/articles', label: 'Articles', icon: <FileText size={18} /> },
  { to: '/admin/articles/new', label: 'Nouvel article', icon: <Plus size={18} /> },
  { to: '/admin/categories', label: 'Catégories', icon: <Tag size={18} /> },
];

export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col p-6 gap-1">
        <div className="flex items-center gap-2 mb-8">
          <LayoutDashboard size={22} className="text-aemb-green" />
          <span className="font-bold text-lg text-aemb-green">Admin</span>
        </div>

        {navItems.map(item => (
          <Link key={item.to} to={item.to}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              pathname === item.to
                ? 'bg-aemb-green text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}>
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
        <Outlet />
      </main>
    </div>
  );
}
