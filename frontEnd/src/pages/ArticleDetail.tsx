import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useArticle } from '../hooks/useArticles';

export default function ArticleDetail() {
  const { id } = useParams();
  const { data: article } = useArticle(Number(id));

  if (!article) return <div className="pt-40 text-center text-slate-400">Article introuvable.</div>;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-aemb-green font-bold mb-8 transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Retour au blog
        </Link>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <span className="inline-block py-1 px-4 rounded-full bg-emerald-100 text-aemb-green text-xs font-bold uppercase tracking-wider mb-6">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-8 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-500 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{article.author}</p>
                <p className="text-xs">Auteur invité</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={18} />
              <span>Publié le {article.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm ml-auto">
              <Share2 size={18} />
              <span>Partager</span>
              <div className="flex gap-2 ml-2">
                <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"><Facebook size={14} /></button>
                <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-sky-400 hover:text-white transition-all"><Twitter size={14} /></button>
                <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all"><MessageCircle size={14} /></button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-video rounded-[40px] overflow-hidden shadow-2xl mb-12"
        >
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none prose-slate prose-headings:font-serif prose-headings:font-bold prose-a:text-aemb-green prose-blockquote:border-l-aemb-gold prose-blockquote:bg-amber-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Tags & Footer */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <div className="flex flex-wrap gap-2 mb-12">
            {["Études", "Islam", "Bénin", "Conseils", "Jeunesse"].map(tag => (
              <span key={tag} className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">#{tag}</span>
            ))}
          </div>

          {/* Author Card */}
          <div className="bg-slate-50 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex-shrink-0" />
            <div>
              <h4 className="text-xl font-bold mb-2">À propos de {article.author}</h4>
              <p className="text-slate-600 leading-relaxed mb-4">
                Membre d'honneur de l'ACEEMUB et spécialiste de l'accompagnement des jeunes. Il partage régulièrement ses réflexions sur l'équilibre entre foi et vie moderne.
              </p>
              <button className="text-aemb-green font-bold text-sm flex items-center gap-2">
                Voir tous ses articles <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
