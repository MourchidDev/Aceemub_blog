import { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { FileText, FolderTree, MessageSquare, Users, Calendar, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-aceemub.png";

const NAV = [
  { to: "/admin/articles", label: "Articles", icon: FileText, roles: ["ADMIN", "EDITOR"] },
  { to: "/admin/categories", label: "Catégories", icon: FolderTree, roles: ["ADMIN", "EDITOR"] },
  { to: "/admin/commentaires", label: "Commentaires", icon: MessageSquare, roles: ["ADMIN", "EDITOR"] },
  { to: "/admin/evenements", label: "Événements", icon: Calendar, roles: ["ADMIN", "EDITOR"] },
  { to: "/admin/utilisateurs", label: "Utilisateurs", icon: Users, roles: ["ADMIN"] },
];

export default function AdminLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) navigate("/connexion");
    else if (user && !["ADMIN", "EDITOR"].includes(user.role)) navigate("/");
  }, [isAuthenticated, isLoading, user, navigate]);

  if (!user || !["ADMIN", "EDITOR"].includes(user.role)) {
    return <div className="px-5 pt-16 text-center text-sm text-muted-foreground">Vérification des accès…</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-dvh w-full bg-sand">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <div className="px-3 pt-4 pb-3">
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="ACEEMUB" className="h-9 w-9 object-contain" />
                <span className="font-serif text-lg">ACEEMUB · Admin</span>
              </Link>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Gestion</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV.filter((n) => n.roles.includes(user.role)).map((n) => (
                    <SidebarMenuItem key={n.to}>
                      <SidebarMenuButton asChild>
                        <NavLink to={n.to} className="flex items-center gap-2">
                          <n.icon className="h-4 w-4" />
                          <span>{n.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/" className="flex items-center gap-2 text-muted-foreground">
                        <ArrowLeft className="h-4 w-4" /> <span>Retour au site</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex min-h-dvh flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border bg-background px-4">
            <SidebarTrigger />
            <div className="font-serif text-lg">Administration</div>
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline">{user.name}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{user.role}</span>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
