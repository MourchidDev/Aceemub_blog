import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, History, Users, MapPin, Award, ArrowRight } from 'lucide-react';

const TEAM = [
  { name: "M. Abdoulaye S.", role: "Président National", image: "https://picsum.photos/seed/p1/400/400" },
  { name: "Mme. Fatouma B.", role: "Secrétaire Générale", image: "https://picsum.photos/seed/p2/400/400" },
  { name: "M. Ismaël K.", role: "Trésorier National", image: "https://picsum.photos/seed/p3/400/400" },
  { name: "Mlle. Zainab O.", role: "Responsable Sœur", image: "https://picsum.photos/seed/p4/400/400" }
];

const SECTIONS = [
  "Cotonou", "Abomey-Calavi", "Porto-Novo", "Parakou", "Bohicon", "Natitingou", "Djougou", "Kandi"
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-emerald-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 border-2 border-white rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">L'Association</h1>
            <p className="text-emerald-100 text-lg max-w-3xl mx-auto leading-relaxed">
              Depuis 1989, l'ACEEMUB œuvre pour l'épanouissement spirituel et la réussite académique des élèves et étudiants musulmans du Bénin.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 text-aemb-green font-bold uppercase tracking-widest text-xs mb-6">
                <History size={16} /> Notre Histoire
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Plus de trois décennies d'engagement</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                L'Association des Élèves et Étudiants Musulmans du Bénin (ACEEMUB) est née de la volonté de créer un cadre d'expression, de formation et de solidarité pour la jeunesse musulmane. 
              </p>
              <p className="text-slate-600 leading-relaxed">
                Au fil des années, elle est devenue une institution incontournable dans le paysage associatif béninois, reconnue pour son sérieux, son dynamisme et sa contribution au dialogue interreligieux et à la paix sociale.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-6">
              <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-aemb-green mb-6 shadow-sm">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">Notre Mission</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Accompagner chaque étudiant musulman vers l'excellence, en lui offrant les outils nécessaires pour réussir ses études tout en restant fidèle à ses principes religieux.
                </p>
              </div>
              <div className="p-8 bg-amber-50 rounded-[32px] border border-amber-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-aemb-gold mb-6 shadow-sm">
                  <Eye size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">Notre Vision</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Être le leader de la jeunesse musulmane au Bénin, une force de proposition et d'action pour le développement durable du pays et le rayonnement de l'Islam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Le Bureau National</h2>
            <p className="text-slate-500">Une équipe dévouée au service de la communauté estudiantine.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-6 rounded-[32px] text-center shadow-sm border border-slate-100"
              >
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-emerald-50">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-lg mb-1">{member.name}</h4>
                <p className="text-aemb-green text-sm font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections Map Placeholder */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 text-aemb-gold font-bold uppercase tracking-widest text-xs mb-6">
            <MapPin size={16} /> Présence Nationale
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-12">Nos Sections à travers le Bénin</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {SECTIONS.map((city) => (
              <span key={city} className="px-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-aemb-green hover:text-white hover:border-aemb-green transition-all cursor-default">
                {city}
              </span>
            ))}
          </div>
          <div className="mt-16 p-12 bg-emerald-900 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <h3 className="text-2xl font-serif font-bold mb-2">Vous ne trouvez pas votre section ?</h3>
              <p className="text-emerald-100">Contactez-nous pour savoir comment créer une cellule ACEEMUB dans votre établissement.</p>
            </div>
            <button className="bg-aemb-gold text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform whitespace-nowrap">
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
