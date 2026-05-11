import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Send, GraduationCap, Users, Heart, Star } from 'lucide-react';

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-emerald-900 py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Rejoignez l'ACEEMUB</h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
              Devenez membre d'une communauté dynamique et engagée pour l'excellence et la fraternité.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20">
          {/* Benefits */}
          <div>
            <h2 className="text-3xl font-serif font-bold mb-8">Pourquoi nous rejoindre ?</h2>
            <div className="space-y-8">
              {[
                { icon: <GraduationCap />, title: "Accompagnement Académique", desc: "Bénéficiez de séances de tutorat, de conseils d'orientation et de partage d'expérience avec vos aînés." },
                { icon: <Heart />, title: "Épanouissement Spirituel", desc: "Participez à des cercles d'études, des conférences et des moments de rappel pour nourrir votre foi." },
                { icon: <Users />, title: "Réseautage & Fraternité", desc: "Intégrez un réseau national d'étudiants et de professionnels musulmans partageant vos valeurs." },
                { icon: <Star />, title: "Développement Personnel", desc: "Développez vos soft skills, votre leadership et votre sens des responsabilités à travers nos projets." }
              ].map((benefit, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-aemb-green flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{benefit.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-50 p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-aemb-green text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">Demande envoyée !</h3>
                <p className="text-slate-600 mb-8">Merci pour votre intérêt. Le responsable de votre section locale vous contactera très prochainement.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-aemb-green font-bold underline"
                >
                  Envoyer une autre demande
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-serif font-bold mb-6">Formulaire d'adhésion</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nom complet</label>
                    <input required type="text" className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-aemb-green" placeholder="Ex: Jean Dupont" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email</label>
                    <input required type="email" className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-aemb-green" placeholder="votre@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Téléphone (WhatsApp)</label>
                    <input required type="tel" className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-aemb-green" placeholder="+229 ..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Établissement</label>
                    <input required type="text" className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-aemb-green" placeholder="Ex: UAC, ENEAM..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Niveau d'études</label>
                  <select className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-aemb-green bg-white">
                    <option>Élève (Secondaire)</option>
                    <option>Étudiant (Licence)</option>
                    <option>Étudiant (Master)</option>
                    <option>Doctorant</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Ville / Section</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-aemb-green" placeholder="Ex: Abomey-Calavi" />
                </div>
                <button type="submit" className="w-full bg-aemb-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-900/20">
                  Envoyer ma demande <Send size={18} />
                </button>
                <p className="text-xs text-slate-400 text-center">
                  En soumettant ce formulaire, vous acceptez d'être contacté par l'ACEEMUB pour finaliser votre adhésion.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
