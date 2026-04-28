import React from 'react';
import { motion } from 'motion/react';
import { Megaphone, Calendar, ArrowRight, Bell } from 'lucide-react';
import { useAnnouncements } from '../hooks/useAnnouncements';

export default function Announcements() {
  const { data: announcements = [] } = useAnnouncements();

  return (
    <div className="pt-24 pb-20">
      <section className="bg-emerald-900 py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Annonces & Communiqués</h1>
            <p className="text-emerald-100 text-lg max-w-3xl mx-auto leading-relaxed">
              Restez informé des dernières décisions, opportunités et informations officielles de l'ACEEMUB.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-8">
            {announcements.map((ann, i) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-[32px] border-l-8 shadow-sm hover:shadow-md transition-all ${
                  ann.priority === 'High' ? 'bg-rose-50 border-rose-500' :
                  ann.priority === 'Medium' ? 'bg-amber-50 border-amber-500' :
                  'bg-slate-50 border-slate-300'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ann.priority === 'High' ? 'bg-rose-500 text-white' :
                      ann.priority === 'Medium' ? 'bg-amber-500 text-white' :
                      'bg-slate-500 text-white'
                    }`}>
                      {ann.category}
                    </span>
                    <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                      <Calendar size={12} /> {ann.date}
                    </span>
                  </div>
                  {ann.priority === 'High' && (
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-xs animate-pulse">
                      <Bell size={14} /> Urgent
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{ann.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{ann.desc}</p>
                <button className="text-aemb-green font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                  Lire le communiqué complet <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-12 bg-slate-900 rounded-[48px] text-white text-center">
            <Megaphone className="text-aemb-gold mx-auto mb-6" size={48} />
            <h3 className="text-2xl font-serif font-bold mb-4">Abonnez-vous aux alertes SMS</h3>
            <p className="text-slate-400 mb-8">Recevez les annonces les plus importantes directement sur votre téléphone.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input type="tel" placeholder="Votre numéro WhatsApp" className="flex-grow px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-aemb-green" />
              <button className="bg-aemb-green px-8 py-4 rounded-2xl font-bold">S'abonner</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
