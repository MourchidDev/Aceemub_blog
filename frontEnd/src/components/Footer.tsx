import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import sharedImage from '../assets/ac.png';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-6">
            <img src={sharedImage} alt="Logo ACEEMUB" className="w-10 h-10 rounded-full flex items-center justify-center" />
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
  );
}
