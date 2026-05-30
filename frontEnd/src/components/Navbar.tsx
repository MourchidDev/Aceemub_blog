import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, UserCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import sharedImage from '../assets/ac.png';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, isAuthenticated, logout } = useAuth();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const canAccessAdmin = user?.role === 'ADMIN' || user?.role === 'EDITOR';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.avatarUrl]);

  const userAvatar = user?.avatarUrl && !avatarFailed ? (
    <img
      src={user.avatarUrl}
      alt=""
      className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
      referrerPolicy="no-referrer"
      onError={() => setAvatarFailed(true)}
    />
  ) : (
    <UserCircle size={24} className="flex-shrink-0" />
  );

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-background/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            {/* <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">A</div> */}
             <img src={sharedImage} alt="Logo ACEEMUB" className="w-15 h-15 rounded-full flex items-center justify-center" />
            <span className="font-serif text-xl font-bold text-primary">ACEEMUB Benin</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-secondary transition-colors">Accueil</Link>
            <Link to="/association" className="text-sm font-medium hover:text-secondary transition-colors">L'Association</Link>
            {isAuthenticated && (
              <>
                <Link to="/blog" className="text-sm font-medium hover:text-secondary transition-colors">Blog</Link>
                <Link to="/evenements" className="text-sm font-medium hover:text-secondary transition-colors">Evenements</Link>
                {canAccessAdmin && (
                  <Link to="/admin" className="text-sm font-medium hover:text-secondary transition-colors">Admin</Link>
                )}
              </>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-primary">
                  {userAvatar}
                  <span className="max-w-32 truncate">{user?.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Se deconnecter"
                  title="Se deconnecter"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/connexion" className="text-sm font-medium hover:text-secondary transition-colors">Connexion</Link>
            )}
            {isAuthenticated && (
              <Link to="/rejoindre" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all">
                Nous Rejoindre
              </Link>
            )}
          </div>

          <button className="md:hidden text-primary" onClick={() => setIsMenuOpen(true)}>
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
            className="fixed inset-0 z-[60] bg-card p-8 flex flex-col"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)} className="text-primary">
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-6 mt-12 text-2xl font-serif font-bold text-primary">
              <Link to="/">Accueil</Link>
              <Link to="/association">L'Association</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/blog">Blog</Link>
                  <Link to="/evenements">Evenements</Link>
                  {canAccessAdmin && <Link to="/admin">Admin</Link>}
                  <span className="flex items-center gap-3 text-left font-serif font-bold">
                    {userAvatar}
                    <span className="min-w-0 truncate">{user?.name}</span>
                  </span>
                  <button onClick={logout} className="text-left font-serif font-bold">
                    Se deconnecter
                  </button>
                </>
              ) : (
                <Link to="/connexion">Connexion</Link>
              )}
              {isAuthenticated && (
                <Link to="/rejoindre" className="bg-primary text-primary-foreground py-3 rounded-2xl text-lg mt-4 text-center font-medium">Nous Rejoindre</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}