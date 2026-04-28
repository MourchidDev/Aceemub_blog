import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, ChevronRight, ArrowRight, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { useArticles } from '../hooks/useArticles';

const CATEGORIES = ["Tous", "Spiritualité", "Réussite", "Actualités", "Société", "Formation"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: ALL_ARTICLES = [] } = useArticles();

  const filteredArticles = ALL_ARTICLES.filter(art => {
    const matchesCategory = activeCategory === "Tous" || art.category === activeCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-20">
      {/* Blog Hero */}
      <section className="bg-emerald-900 py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-aemb-gold/10 skew-x-12 transform translate-x-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Le Blog de l'ACEEMUB</h1>
            <p className="text-emerald-100 text-lg max-w-2xl leading-relaxed">
              Réflexions, conseils et actualités pour accompagner l'étudiant musulman béninois dans son cheminement intellectuel et spirituel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-12 bg-white border-b border-slate-100 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-aemb-green text-white shadow-lg shadow-emerald-900/20' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un article..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-aemb-green/20 focus:border-aemb-green transition-all"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredArticles.map((art, index) => (
              <motion.article 
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col h-full bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-aemb-green px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                    {art.category}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <Calendar size={14} />
                    <span>{art.date}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>Par {art.author}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-aemb-green transition-colors leading-snug">
                    {art.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {art.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <Link to={`/blog/${art.id}`} className="text-aemb-green font-bold text-sm flex items-center gap-2 group/btn">
                      Lire la suite <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Aucun article trouvé</h3>
            <p className="text-slate-500">Essayez de modifier vos filtres ou votre recherche.</p>
            <button 
              onClick={() => { setActiveCategory("Tous"); setSearchQuery(""); }}
              className="mt-6 text-aemb-green font-bold underline"
            >
              Réinitialiser tout
            </button>
          </div>
        )}

        {/* Pagination Placeholder */}
        {filteredArticles.length > 0 && (
          <div className="mt-20 flex justify-center gap-2">
            {[1, 2, 3].map(n => (
              <button key={n} className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all ${n === 1 ? 'bg-aemb-green text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {n}
              </button>
            ))}
            <button className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-aemb-gold/10 text-aemb-gold rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Mail size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ne manquez aucun article</h2>
          <p className="text-slate-600 mb-10">Inscrivez-vous à notre newsletter pour recevoir nos meilleures réflexions directement dans votre boîte mail.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="flex-grow px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aemb-green/20 focus:border-aemb-green"
            />
            <button className="bg-aemb-green text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-emerald-900/20">
              S'abonner
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
