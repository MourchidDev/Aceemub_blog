import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Calendar, Megaphone, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Accueil", icon: Home, exact: true },
  { to: "/blog", label: "Blog", icon: BookOpen },
  { to: "/evenements", label: "Agenda", icon: Calendar },
  { to: "/annonces", label: "Annonces", icon: Megaphone },
  { to: "/compte", label: "Profil", icon: User },
];

export default function BottomTabBar() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin") || pathname.startsWith("/membre/")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden safe-bottom"
      aria-label="Navigation principale"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
          const Icon = t.icon;
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                    active && "bg-primary/10",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
