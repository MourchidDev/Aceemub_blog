import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<ArticleDetail />} />
        <Route path="/association" element={<AboutPage />} />
        <Route path="/evenements" element={<EventsPage />} />
        <Route path="/rejoindre" element={<JoinPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/qui-sommes-nous" element={<WhoWeAre />} />
        <Route path="/notre-vision" element={<Vision />} />
        <Route path="/annonces" element={<Announcements />} />
        <Route path="/faq" element={<FAQ />} />
      </Route>
    </Routes>
  );
}
