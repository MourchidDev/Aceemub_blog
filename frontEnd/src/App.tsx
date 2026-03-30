/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link,
  useLocation
} from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Calendar, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Heart, 
  GraduationCap,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BlogPage from './pages/Blog.tsx';
import ArticleDetail from './pages/ArticleDetail.tsx';
import AboutPage from './pages/About.tsx';
import EventsPage from './pages/Events.tsx';
import JoinPage from './pages/Join.tsx';
import ContactPage from './pages/Contact.tsx';
import WhoWeAre from './pages/WhoWeAre.tsx';
import Vision from './pages/Vision.tsx';
import Announcements from './pages/Announcements.tsx';
import FAQ from './pages/FAQ.tsx';

// --- Types ---
interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  type: string;
}

// --- Mock Data ---
const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Comment concilier excellence académique et pratique religieuse ?",
    category: "Réussite",
    date: "22 Fév 2026",
    image: "https://picsum.photos/seed/study/800/600",
    excerpt: "Découvrez nos conseils pratiques pour organiser votre temps entre vos révisions et vos moments de dévotion."
  },
  {
    id: 2,
    title: "L'importance de la fraternité dans le milieu estudiantin",
    category: "Spiritualité",
    date: "18 Fév 2026",
    image: "https://picsum.photos/seed/community/800/600",
    excerpt: "Pourquoi s'entourer de compagnons vertueux est la clé pour traverser les années d'université avec sérénité."
  },
  {
    id: 3,
    title: "Retour sur le Séminaire National de Formation 2025",
    category: "Actualités",
    date: "10 Fév 2026",
    image: "https://picsum.photos/seed/event/800/600",
    excerpt: "Plus de 500 étudiants réunis à Cotonou pour une semaine d'échanges intenses et de formation."
  }
];

const EVENTS: Event[] = [
  { id: 1, title: "Conférence : Islam et Modernité", date: "15 Mars 2026", location: "UAC, Abomey-Calavi", type: "Conférence" },
  { id: 2, title: "Journée de Solidarité Ramadan", date: "28 Mars 2026", location: "National", type: "Social" },
  { id: 3, title: "Atelier Soft Skills & Leadership", date: "05 Avril 2026", location: "Parakou", type: "Formation" }
];

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen font-sans selection:bg-aemb-gold selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-aemb-green rounded-full flex items-center justify-center text-white font-bold text-xl">A</div>
            <span className={`font-serif text-xl font-bold text-aemb-green`}>ACEEMUB Bénin</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-aemb-gold transition-colors">Accueil</Link>
            <Link to="/association" className="text-sm font-medium hover:text-aemb-gold transition-colors">L'Association</Link>
            <Link to="/blog" className="text-sm font-medium hover:text-aemb-gold transition-colors">Blog</Link>
            <Link to="/evenements" className="text-sm font-medium hover:text-aemb-gold transition-colors">Événements</Link>
            <Link to="/rejoindre" className="bg-aemb-green text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10">
              Nous Rejoindre
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-aemb-green" onClick={() => setIsMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-white p-8 flex flex-col"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)} className="text-aemb-green"><X size={32} /></button>
            </div>
            <div className="flex flex-col gap-8 mt-12 text-2xl font-serif font-bold text-aemb-green">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
              <Link to="/association" onClick={() => setIsMenuOpen(false)}>L'Association</Link>
              <Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <Link to="/evenements" onClick={() => setIsMenuOpen(false)}>Événements</Link>
              <Link to="/rejoindre" onClick={() => setIsMenuOpen(false)} className="bg-aemb-green text-white py-4 rounded-2xl text-lg mt-4 text-center">Nous Rejoindre</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<HomePage />} />
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
      </Routes>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-aemb-green rounded-full flex items-center justify-center text-white font-bold">A</div>
              <span className="font-serif text-xl font-bold">ACEEMUB Bénin</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Organisation nationale œuvrant pour l'épanouissement des élèves et étudiants musulmans du Bénin depuis 1989.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-aemb-green transition-colors"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-aemb-green transition-colors"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-aemb-green transition-colors"><Instagram size={18} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">L'Association</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li><Link to="/qui-sommes-nous" className="hover:text-white transition-colors">Qui sommes-nous ?</Link></li>
              <li><Link to="/notre-vision" className="hover:text-white transition-colors">Notre Vision</Link></li>
              <li><Link to="/association" className="hover:text-white transition-colors">Bureau National</Link></li>
              <li><Link to="/association" className="hover:text-white transition-colors">Nos Sections</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Ressources</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog & Articles</Link></li>
              <li><Link to="/annonces" className="hover:text-white transition-colors">Annonces</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li className="flex items-center gap-3"><Mail size={16} className="text-aemb-gold" /> contact@aceemub-benin.org</li>
              <li className="flex items-center gap-3"><MapPin size={16} className="text-aemb-gold" /> Cotonou, Bénin</li>
              <li><Link to="/contact" className="text-aemb-gold hover:underline">Formulaire de contact</Link></li>
            </ul>
            <div className="mt-8">
              <p className="text-xs font-bold uppercase text-slate-500 mb-3">Newsletter</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Votre email" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:border-aemb-green" />
                <button className="bg-aemb-green px-4 py-2 rounded-xl"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center text-slate-500 text-xs">
          <p>© 2026 ACEEMUB. Tous droits réservés. Conçu avec foi et excellence.</p>
        </div>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-emerald-50/50 rounded-l-[100px] hidden lg:block" />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-emerald-100 text-aemb-green text-xs font-bold uppercase tracking-wider mb-6">
              Association Culturelle des Élèves et Étudiants Musulmans du Bénin
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] text-slate-900 mb-6 text-balance">
              Éclairez votre parcours. <span className="text-aemb-green italic">Unissez votre foi.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
              L'ACEEMUB accompagne la jeunesse musulmane béninoise vers l'excellence académique et l'épanouissement spirituel depuis plus de 30 ans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-aemb-green text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-emerald-900/20">
                Devenir membre <ArrowRight size={20} />
              </button>
              <button className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
                Découvrir nos actions
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl rotate-2">
              <img 
                src="https://picsum.photos/seed/aemb-hero/800/1000" 
                alt="Étudiants AEMB" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-3xl shadow-xl flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 bg-aemb-gold rounded-2xl flex items-center justify-center text-white">
                <Users size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">15,000+</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Membres actifs</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Nos Valeurs Fondamentales</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Ce qui nous guide au quotidien dans chaque action et chaque projet.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <BookOpen className="text-emerald-600" />, title: "Le Savoir", desc: "La quête perpétuelle de la connaissance, tant religieuse que profane, pour servir au mieux la société." },
              { icon: <Heart className="text-rose-500" />, title: "La Fraternité", desc: "Créer un lien indéfectible entre tous les étudiants musulmans du Bénin, sans distinction." },
              { icon: <GraduationCap className="text-amber-500" />, title: "L'Excellence", desc: "Viser le sommet dans nos études et notre comportement pour être des modèles de réussite." }
            ].map((val, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[32px] bg-slate-50 border border-slate-100 transition-all"
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{val.title}</h3>
                <p className="text-slate-600 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-emerald-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 border-2 border-white rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border-4 border-white rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Dernières Réflexions</h2>
              <p className="text-emerald-200 max-w-xl">Articles, conseils et actualités pour nourrir votre esprit et votre foi.</p>
            </div>
            <button className="text-aemb-gold font-bold flex items-center gap-2 hover:gap-4 transition-all">
              Voir tout le blog <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {ARTICLES.map((art) => (
              <Link key={art.id} to={`/blog/${art.id}`} className="group cursor-pointer">
                <div className="aspect-video rounded-3xl overflow-hidden mb-6 relative">
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
                    {art.category}
                  </div>
                </div>
                <p className="text-emerald-300 text-xs font-bold mb-2 uppercase tracking-widest">{art.date}</p>
                <h3 className="text-xl font-bold mb-3 group-hover:text-aemb-gold transition-colors leading-snug">{art.title}</h3>
                <p className="text-emerald-100/70 text-sm line-clamp-2">{art.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 bg-aemb-cream">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Agenda de l'ACEEMUB</h2>
            <p className="text-slate-600 mb-8">Ne manquez aucun de nos rendez-vous nationaux et locaux. Des moments de partage et d'apprentissage.</p>
            <div className="p-8 bg-aemb-gold rounded-[32px] text-white shadow-xl shadow-amber-500/20">
              <h4 className="font-bold text-xl mb-2">Prochainement</h4>
              <p className="opacity-90 mb-6">Le Séminaire de Formation des Cadres arrive bientôt à Parakou.</p>
              <button className="w-full bg-white text-aemb-gold py-3 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
                En savoir plus
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-2 flex flex-col gap-4">
            {EVENTS.map((ev) => (
              <div key={ev.id} className="bg-white p-6 rounded-3xl flex items-center justify-between hover:shadow-md transition-shadow border border-slate-100">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex flex-col items-center justify-center text-aemb-green">
                    <span className="text-xs font-bold uppercase">{ev.date.split(' ')[1]}</span>
                    <span className="text-xl font-bold">{ev.date.split(' ')[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">{ev.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {ev.location}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {ev.type}</span>
                    </div>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-aemb-green hover:text-white hover:border-aemb-green transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-aemb-green rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-900/40">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
          
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 relative z-10">Prêt à rejoindre la famille ?</h2>
          <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Que vous soyez élève ou étudiant, l'ACEEMUB est votre maison. Rejoignez des milliers de jeunes engagés pour un avenir meilleur.
          </p>
          <button className="bg-white text-aemb-green px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform relative z-10">
            Remplir le formulaire d'adhésion
          </button>
        </div>
      </section>
    </>
  );
}
