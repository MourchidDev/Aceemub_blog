import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { LogOut, Shield, User as UserIcon, ChevronRight, BookOpen, Calendar, Megaphone } from "lucide-react";
import PageHeader from "@/components/PageHeader";



function AccountPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) nav("/connexion");
  }, [isLoading, isAuthenticated, nav]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader eyebrow="Mon espace" title={`Salam, ${user.name}`} description="Bienvenue dans ton espace ACEEMUB ." />

      <section className="px-5">
        <div className="rounded-3xl bg-gradient-warm p-6 text-primary-foreground shadow-elevated">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-background/20 font-serif text-2xl">
              {user.name[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-sm opacity-80">{user.email}</div>
              <div className="text-xs uppercase tracking-widest opacity-70">Rôle · {user.role.toLowerCase()}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {[
            { to: "/blog", icon: BookOpen, label: "Le blog" },
            { to: "/evenements", icon: Calendar, label: "Mes événements" },
            { to: "/annonces", icon: Megaphone, label: "Annonces" },
            { to: "/rejoindre", icon: UserIcon, label: "Adhésion / Carte" },
          ].map((r) => (
            <Link
              key={r.to} to={r.to}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/30"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                  <r.icon className="h-4 w-4" />
                </span>
                <span className="font-medium">{r.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}

          {(user.role === "ADMIN" || user.role === "EDITOR") && (
            <Link
              to="/admin/articles"
              className="flex items-center justify-between rounded-2xl bg-foreground p-4 text-background shadow-card"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-background/15">
                  <Shield className="h-4 w-4" />
                </span>
                <span className="font-medium">Espace administration</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-70" />
            </Link>
          )}

          <button
            onClick={() => { logout(); nav("/"); }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card p-3 text-sm font-medium text-destructive hover:bg-destructive/5"
          >
            <LogOut className="h-4 w-4" /> Se déconnecter
          </button>
        </div>
      </section>
    </div>
  );
}

export default AccountPage;
