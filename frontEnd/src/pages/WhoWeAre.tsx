import React from 'react';
import { motion } from 'motion/react';
import { History, Users, Award, ShieldCheck } from 'lucide-react';

export default function WhoWeAre() {
  return (
    <div className="pt-24 pb-20">
      <section className="bg-emerald-900 py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Qui sommes-nous ?</h1>
            <p className="text-emerald-100 text-lg max-w-3xl mx-auto leading-relaxed">
              Découvrez l'histoire, les fondements et l'organisation de l'ACEEMUB Bénin.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold mb-6">Une institution au service de la jeunesse</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                L'Association Culturelle des Élèves et Étudiants Musulmans du Bénin (ACEEMUB) est une organisation à but non lucratif, apolitique et confessionnelle. Elle regroupe les élèves et étudiants musulmans de tous les établissements d'enseignement secondaire et supérieur du Bénin.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Depuis sa création en 1989, l'ACEEMUB s'est imposée comme un acteur majeur de la société civile béninoise, œuvrant pour la promotion des valeurs de paix, de tolérance et d'excellence.
              </p>
            </motion.div>
            <div className="rounded-[40px] overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/seed/aemb-group/800/600" alt="Groupe AEMB" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 bg-slate-50 rounded-[32px] border border-slate-100">
              <History className="text-aemb-green mb-6" size={40} />
              <h3 className="text-xl font-bold mb-4">Notre Histoire</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Née de la fusion de plusieurs mouvements estudiantins locaux, l'ACEEMUB a su unifier la voix des étudiants musulmans pour mieux répondre à leurs besoins spécifiques.
              </p>
            </div>
            <div className="p-10 bg-slate-50 rounded-[32px] border border-slate-100">
              <Users className="text-aemb-gold mb-6" size={40} />
              <h3 className="text-xl font-bold mb-4">Notre Structure</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Une organisation pyramidale allant des cellules d'établissement aux sections communales, chapeautées par un Bureau National élu démocratiquement.
              </p>
            </div>
            <div className="p-10 bg-slate-50 rounded-[32px] border border-slate-100">
              <ShieldCheck className="text-emerald-600 mb-6" size={40} />
              <h3 className="text-xl font-bold mb-4">Nos Principes</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                L'indépendance, la transparence, la démocratie interne et le respect strict des principes de l'Islam sont au cœur de notre gouvernance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
