import React from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import BlogPage from '../pages/Blog';
import ArticleDetail from '../pages/ArticleDetail';
import AboutPage from '../pages/About';
import EventsPage from '../pages/Events';
import JoinPage from '../pages/Join';
import ContactPage from '../pages/Contact';
import WhoWeAre from '../pages/WhoWeAre';
import Vision from '../pages/Vision';
import Announcements from '../pages/Announcements';
import FAQ from '../pages/FAQ';
import AuthPage from '../pages/AuthPage';
import { useAuth } from '../context/AuthContext';

function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-aemb-cream pt-28 flex items-center justify-center text-sm font-medium text-aemb-green">
        Chargement...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
import AdminCategories from '../pages/AdminCategories';
import AdminEvents from '../pages/AdminEvents';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/association" element={<AboutPage />} />
        <Route path="/connexion" element={<AuthPage mode="login" />} />
        <Route path="/inscription" element={<AuthPage mode="register" />} />

        <Route element={<RequireAuth />}>
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<ArticleDetail />} />
          <Route path="/evenements" element={<EventsPage />} />
          <Route path="/rejoindre" element={<JoinPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/qui-sommes-nous" element={<WhoWeAre />} />
          <Route path="/notre-vision" element={<Vision />} />
          <Route path="/annonces" element={<Announcements />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/evenements" element={<AdminEvents />} />
      </Route>
    </Routes>
  );
}
