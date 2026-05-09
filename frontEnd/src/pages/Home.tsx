import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, BookOpen, Users, ArrowRight, Heart, GraduationCap, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useArticles } from '../hooks/useArticles';
import { useEvents } from '../hooks/useEvents';

export default function Home() {
  const { data: articles = [] } = useArticles();
  const { data: events = [] } = useEvents();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-emerald-50/50 rounded-l-[100px] hidden lg:block" />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
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
              <Link to="/rejoindre" className="bg-aemb-green text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-emerald-900/20">
                Devenir membre <ArrowRight size={20} />
              </Link>
              <Link to="/association" className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-center">
                Découvrir nos actions
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl rotate-2">
              <img src="https://picsum.photos/seed/aemb-hero/800/1000" alt="Étudiants AEMB" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
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

      {/* Values */}
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
              <motion.div key={i} whileHover={{ y: -10 }} className="p-10 rounded-[32px] bg-slate-50 border border-slate-100 transition-all">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">{val.icon}</div>
                <h3 className="text-xl font-bold mb-4">{val.title}</h3>
                <p className="text-slate-600 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
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
            <Link to="/blog" className="text-aemb-gold font-bold flex items-center gap-2 hover:gap-4 transition-all">
              Voir tout le blog <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((art) => (
              <Link key={art.id} to={`/blog/${art.id}`} className="group cursor-pointer">
                <div className="aspect-video rounded-3xl overflow-hidden mb-6 relative">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">{art.category}</div>
                </div>
                <p className="text-emerald-300 text-xs font-bold mb-2 uppercase tracking-widest">{art.date}</p>
                <h3 className="text-xl font-bold mb-3 group-hover:text-aemb-gold transition-colors leading-snug">{art.title}</h3>
                <p className="text-emerald-100/70 text-sm line-clamp-2">{art.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-24 bg-aemb-cream">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Agenda de l'ACEEMUB</h2>
            <p className="text-slate-600 mb-8">Ne manquez aucun de nos rendez-vous nationaux et locaux.</p>
            <div className="p-8 bg-aemb-gold rounded-[32px] text-white shadow-xl shadow-amber-500/20">
              <h4 className="font-bold text-xl mb-2">Prochainement</h4>
              <p className="opacity-90 mb-6">Le Séminaire de Formation des Cadres arrive bientôt à Parakou.</p>
              <Link to="/evenements" className="block w-full bg-white text-aemb-gold py-3 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-center">
                En savoir plus
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4">
            {events.slice(0, 3).map((ev) => (
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
                <Link to="/evenements" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-aemb-green hover:text-white hover:border-aemb-green transition-all">
                  <ChevronRight size={20} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-aemb-green rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-900/40">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 relative z-10">Prêt à rejoindre la famille ?</h2>
          <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Que vous soyez élève ou étudiant, l'ACEEMUB est votre maison. Rejoignez des milliers de jeunes engagés pour un avenir meilleur.
          </p>
          <Link to="/rejoindre" className="inline-block bg-white text-aemb-green px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform relative z-10">
            Remplir le formulaire d'adhésion
          </Link>
        </div>
      </section>
    </>
  );
}
