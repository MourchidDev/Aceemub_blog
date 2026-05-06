import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, UserCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-aemb-green rounded-full flex items-center justify-center text-white font-bold text-xl">A</div>
            <span className="font-serif text-xl font-bold text-aemb-green">ACEEMUB Benin</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-aemb-gold transition-colors">Accueil</Link>
            <Link to="/association" className="text-sm font-medium hover:text-aemb-gold transition-colors">L'Association</Link>
            <Link to="/blog" className="text-sm font-medium hover:text-aemb-gold transition-colors">Blog</Link>
            <Link to="/evenements" className="text-sm font-medium hover:text-aemb-gold transition-colors">Evenements</Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-aemb-green">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="h-7 w-7 rounded-full" />
                  ) : (
                    <UserCircle size={24} />
                  )}
                  <span className="max-w-32 truncate">{user?.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-aemb-green"
                  aria-label="Se deconnecter"
                  title="Se deconnecter"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/connexion" className="text-sm font-medium hover:text-aemb-gold transition-colors">Connexion</Link>
            )}
            <Link to="/rejoindre" className="bg-aemb-green text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10">
              Nous Rejoindre
            </Link>
          </div>

          <button className="md:hidden text-aemb-green" onClick={() => setIsMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-white p-8 flex flex-col"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)} className="text-aemb-green">
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-8 mt-12 text-2xl font-serif font-bold text-aemb-green">
              <Link to="/">Accueil</Link>
              <Link to="/association">L'Association</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/evenements">Evenements</Link>
              {isAuthenticated ? (
                <button onClick={logout} className="text-left font-serif font-bold">
                  Se deconnecter
                </button>
              ) : (
                <Link to="/connexion">Connexion</Link>
              )}
              <Link to="/rejoindre" className="bg-aemb-green text-white py-4 rounded-2xl text-lg mt-4 text-center">Nous Rejoindre</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
