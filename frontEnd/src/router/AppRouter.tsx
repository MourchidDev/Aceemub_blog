import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";

import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import ArticleDetail from "@/pages/ArticleDetail";
import Events from "@/pages/Events";
import Announcements from "@/pages/Announcements";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Join from "@/pages/Join";
import AuthPage from "@/pages/AuthPage";
import Register from "@/pages/Register";
import MemberCard from "@/pages/MemberCard";
import Account from "@/pages/Account";

import AdminArticles from "@/pages/AdminArticles";
import ArticleFormPage from "@/pages/ArticleFormPage";
import ArticleEditPage from "@/pages/ArticleEditPage";
import AdminCategories from "@/pages/AdminCategories";
import AdminComments from "@/pages/AdminComments";
import AdminEvents from "@/pages/AdminEvents";
import AdminEventDetail from "@/pages/AdminEventDetail";
import AdminUsers from "@/pages/AdminUsers";

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="font-serif text-7xl">404</h1>
        <p className="mt-3 text-muted-foreground">Page introuvable.</p>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<ArticleDetail />} />
        <Route path="/evenements" element={<Events />} />
        <Route path="/annonces" element={<Announcements />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/rejoindre" element={<Join />} />
        <Route path="/connexion" element={<AuthPage />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/membre/:id" element={<MemberCard />} />
        <Route path="/compte" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/articles" replace />} />
        <Route path="articles" element={<AdminArticles />} />
        <Route path="articles/nouveau" element={<ArticleFormPage />} />
        <Route path="articles/:id/edition" element={<ArticleEditPage />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="commentaires" element={<AdminComments />} />
        <Route path="evenements" element={<AdminEvents />} />
        <Route path="evenements/:id" element={<AdminEventDetail />} />
        <Route path="utilisateurs" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}
