import React from 'react';
import { motion } from 'motion/react';
import { Eye, Target, Compass, Zap } from 'lucide-react';

export default function Vision() {
  return (
    <div className="pt-24 pb-20">
      <section className="bg-emerald-900 py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Notre Vision & Mission</h1>
            <p className="text-emerald-100 text-lg max-w-3xl mx-auto leading-relaxed">
              Comprendre nos objectifs à long terme et les missions que nous nous fixons au quotidien.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
            <div className="relative">
              <div className="aspect-square bg-emerald-50 rounded-[60px] absolute -top-10 -left-10 w-full h-full -z-10" />
              <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl">
                <img src="https://picsum.photos/seed/vision/800/800" alt="Vision" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 text-aemb-gold font-bold uppercase tracking-widest text-xs mb-6">
                <Eye size={16} /> Notre Vision
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">Être le phare de la jeunesse musulmane</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Nous aspirons à bâtir une génération d'étudiants musulmans béninois qui soient des leaders dans leurs domaines respectifs, tout en étant des modèles de piété et d'éthique.
              </p>
              <ul className="space-y-4">
                {[
                  "Rayonnement intellectuel et spirituel",
                  "Contribution active au développement du Bénin",
                  "Unité et solidarité renforcées",
                  "Excellence dans tous les domaines de la vie"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-2 h-2 bg-aemb-gold rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 text-aemb-green font-bold uppercase tracking-widest text-xs mb-6">
                <Target size={16} /> Notre Mission
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">Accompagner, Former, Unir</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Notre mission est multidimensionnelle. Nous travaillons chaque jour pour offrir à nos membres un environnement propice à leur croissance.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <Compass className="text-aemb-green mb-4" size={32} />
                  <h4 className="font-bold mb-2">Orientation</h4>
                  <p className="text-slate-500 text-sm">Guider les élèves et étudiants dans leurs choix académiques et professionnels.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <Zap className="text-aemb-gold mb-4" size={32} />
                  <h4 className="font-bold mb-2">Dynamisme</h4>
                  <p className="text-slate-500 text-sm">Organiser des activités stimulantes pour maintenir l'engagement des jeunes.</p>
                </div>
              </div>
            </motion.div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-square bg-amber-50 rounded-[60px] absolute -bottom-10 -right-10 w-full h-full -z-10" />
              <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl">
                <img src="https://picsum.photos/seed/mission/800/800" alt="Mission" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
