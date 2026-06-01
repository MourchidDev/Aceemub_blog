import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ArrowRight, Mail } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import { motion } from 'motion/react';
import { useArticles } from '../hooks/useArticles';
import { useCategories } from '../hooks/useCategories';
import Loader from '../components/Loader';
import logoAceemub from '../assets/ac.png';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: ALL_ARTICLES = [], isLoading } = useArticles();
  const { data: categories = [] } = useCategories();

  const CATEGORIES = useMemo(() => {
    const cats = ["Tous", ...categories.map(c => c.name)];
    return cats;
  }, [categories]);

  const filteredArticles = useMemo(() => {
    return ALL_ARTICLES.filter(art => {
      const matchesCategory = activeCategory === "Tous" || art.category?.name === activeCategory;
      const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (art.excerpt && art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      const isPublished = art.status === 'PUBLISHED';
      return matchesCategory && matchesSearch && isPublished;
    });
  }, [ALL_ARTICLES, activeCategory, searchQuery]);

  return (
    <div className="pt-24 pb-20">
      <Loader isLoading={isLoading} />

      {/* Blog Hero */}
      <section className="bg-primary py-20 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/20 skew-x-12 transform translate-x-20" />
        <div className="max-w-6xl mx-auto px-5 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6">Le Blog de l'ACEEMUB</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl leading-relaxed">
              Réflexions, conseils et actualités pour accompagner l'étudiant musulman béninois dans son cheminement intellectuel et spirituel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-12 bg-card border-b border-border sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-muted text-muted-foreground hover:bg-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 max-w-6xl mx-auto px-5">
        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredArticles.map((art, index) => (
              <motion.article
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card hover:border-primary/30 transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden relative bg-muted">
                  <img
                    src={art.coverImage || logoAceemub}
                    alt={art.title}
                    className={`w-full h-full transition-transform duration-700 ${
                      art.coverImage 
                        ? 'object-cover group-hover:scale-110' 
                        : 'object-contain p-8'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-md text-primary px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                    {art.category?.name || 'Non catégorisé'}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-4">
                    <Calendar size={14} />
                    <span>{art.date}</span>
                    {art.author?.name && (
                      <>
                        <span className="w-1 h-1 bg-border rounded-full" />
                        <span>Par {art.author.name}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                    {art.excerpt}
                  </p>

                  <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                    <Link to={`/blog/${art.id}`} className="text-primary font-semibold text-sm flex items-center gap-2 group/btn hover:text-secondary transition-colors">
                      Lire la suite <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <ShareButton
                      title={art.title}
                      text={art.excerpt ?? art.title}
                      url={`${window.location.origin}/blog/${art.id}`}
                      compact
                    />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Aucun article trouvé</h3>
            <p className="text-muted-foreground">Essayez de modifier vos filtres ou votre recherche.</p>
            <button
              onClick={() => { setActiveCategory("Tous"); setSearchQuery(""); }}
              className="mt-6 text-primary font-semibold hover:text-secondary underline transition-colors"
            >
              Réinitialiser tout
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-muted">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Mail size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Ne manquez aucun article</h2>
          <p className="text-muted-foreground mb-10">Inscrivez-vous à notre newsletter pour recevoir nos meilleures réflexions directement dans votre boîte mail.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-grow px-6 py-4 bg-card border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-card">
              S'abonner
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
