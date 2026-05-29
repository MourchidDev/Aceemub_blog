import { useState } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { Menu, X, Search, LogIn, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import logo from "@/assets/ac.png";

const navItems = [
  { to: "/", label: "Accueil", end: true },
  { to: "/blog", label: "Blog" },
  { to: "/evenements", label: "Événements" },
  { to: "/annonces", label: "Annonces" },
  { to: "/a-propos", label: "À propos" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
  { to: "/rejoindre", label: "Rejoindre" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="ACEEMUB" className="h-10 w-10 object-contain" />
            <span className="font-serif text-lg leading-none">
              ACEEMUB<span className="text-primary">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.slice(0, 6).map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              to="/blog"
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Rechercher"
            >
              <Search className="h-4 w-4" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/connexion"
                className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/90"
              >
                <LogIn className="h-3.5 w-3.5" /> Connexion
              </Link>
            )}
            <button
              type="button"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-background transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <span className="font-serif text-lg">Menu</span>
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-y-auto">
          <ul className="flex-1 px-4 py-6">
            {navItems.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between border-b border-border/60 py-4 font-serif text-2xl tracking-tight",
                      isActive && "text-primary",
                    )
                  }
                >
                  {n.label}
                  <span aria-hidden className="text-muted-foreground">→</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="border-t border-border bg-sand px-4 py-5">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="text-sm">
                  Connecté en tant que <span className="font-semibold">{user?.name}</span>
                </div>
                <div className="flex gap-2">
                  {(user?.role === "ADMIN" || user?.role === "EDITOR") && (
                    <Link
                      to="/admin/articles"
                      onClick={() => setOpen(false)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground"
                    >
                      <Shield className="h-3.5 w-3.5" /> Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/connexion"
                  onClick={() => setOpen(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  onClick={() => setOpen(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
