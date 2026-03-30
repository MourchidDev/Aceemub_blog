import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Filter, ChevronRight, ArrowRight, Bell } from 'lucide-react';

const EVENTS = [
  {
    id: 1,
    title: "Conférence : Islam et Modernité",
    date: "15 Mars 2026",
    time: "10:00 - 13:00",
    location: "Amphi Idriss Déby, UAC",
    category: "Conférence",
    image: "https://picsum.photos/seed/ev1/800/500",
    desc: "Une réflexion profonde sur les défis de la pratique religieuse dans le monde contemporain."
  },
  {
    id: 2,
    title: "Journée de Solidarité Ramadan",
    date: "28 Mars 2026",
    time: "09:00 - 17:00",
    location: "Siège National ACEEMUB",
    category: "Social",
    image: "https://picsum.photos/seed/ev2/800/500",
    desc: "Distribution de kits alimentaires et moments de partage avec les plus démunis."
  },
  {
    id: 3,
    title: "Atelier Soft Skills & Leadership",
    date: "05 Avril 2026",
    time: "14:00 - 18:00",
    location: "Parakou, Centre Culturel",
    category: "Formation",
    image: "https://picsum.photos/seed/ev3/800/500",
    desc: "Développez vos compétences en communication et gestion de projet pour votre carrière."
  },
  {
    id: 4,
    title: "Tournoi de Foot Inter-Sections",
    date: "12 Avril 2026",
    time: "08:00 - 18:00",
    location: "Stade de l'Amitié, Cotonou",
    category: "Sport",
    image: "https://picsum.photos/seed/ev4/800/500",
    desc: "Renforcez la fraternité à travers le sport. Toutes les sections sont invitées."
  }
];

const CATEGORIES = ["Tous", "Conférence", "Formation", "Social", "Sport"];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filteredEvents = activeCategory === "Tous" 
    ? EVENTS 
    : EVENTS.filter(ev => ev.category === activeCategory);

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-emerald-900 py-20 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Événements</h1>
            <p className="text-emerald-100 text-lg max-w-2xl leading-relaxed">
              Participez à nos activités nationales et locales pour apprendre, partager et grandir ensemble.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-white border-b border-slate-100 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4 overflow-x-auto no-scrollbar">
          <Filter size={20} className="text-slate-400 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-aemb-green text-white shadow-lg shadow-emerald-900/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid gap-12">
          {filteredEvents.map((ev, index) => (
            <motion.div 
              key={ev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 flex flex-col lg:flex-row hover:shadow-2xl hover:shadow-emerald-900/5 transition-all"
            >
              <div className="lg:w-2/5 aspect-video lg:aspect-auto overflow-hidden">
                <img 
                  src={ev.image} 
                  alt={ev.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="lg:w-3/5 p-8 md:p-12 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-emerald-50 text-aemb-green rounded-full text-xs font-bold uppercase tracking-wider">
                    {ev.category}
                  </span>
                  <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
                    <Calendar size={14} /> {ev.date}
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-4 group-hover:text-aemb-green transition-colors">
                  {ev.title}
                </h3>
                
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {ev.desc}
                </p>
                
                <div className="mt-auto grid sm:grid-cols-2 gap-4 border-t border-slate-50 pt-8">
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-aemb-green">
                      <MapPin size={18} />
                    </div>
                    <span>{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-aemb-gold">
                      <Clock size={18} />
                    </div>
                    <span>{ev.time}</span>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button className="bg-aemb-green text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-emerald-900/10 flex items-center gap-2">
                    S'inscrire <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Suggest Event */}
      <section className="py-24 bg-aemb-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-white rounded-[32px] shadow-sm flex items-center justify-center mx-auto mb-8 text-aemb-gold">
            <Bell size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Vous avez une idée d'activité ?</h2>
          <p className="text-slate-600 mb-10">L'ACEEMUB encourage les initiatives locales. Proposez un événement pour votre section ou votre établissement.</p>
          <button className="bg-white border-2 border-aemb-green text-aemb-green px-10 py-5 rounded-2xl font-bold hover:bg-aemb-green hover:text-white transition-all">
            Soumettre une proposition
          </button>
        </div>
      </section>
    </div>
  );
}
