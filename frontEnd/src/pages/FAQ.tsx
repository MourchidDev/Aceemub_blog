import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';

const FAQS = [
  {
    question: "Comment devenir membre de l'ACEEMUB ?",
    answer: "Pour devenir membre, il vous suffit de vous rapprocher de la cellule ACEEMUB de votre établissement ou de remplir le formulaire d'adhésion en ligne sur notre site. Une petite cotisation annuelle peut être demandée selon votre section."
  },
  {
    question: "L'ACEEMUB est-elle réservée uniquement aux étudiants ?",
    answer: "L'ACEEMUB s'adresse aux élèves (enseignement secondaire) et aux étudiants (enseignement supérieur). Nous avons des programmes adaptés pour chaque niveau."
  },
  {
    question: "Quelles sont les activités principales de l'association ?",
    answer: "Nos activités incluent des conférences thématiques, des cercles d'études (Halqa), des séminaires de formation, des journées de solidarité, des sorties culturelles et des compétitions sportives."
  },
  {
    question: "Comment l'ACEEMUB aide-t-elle les étudiants dans leurs études ?",
    answer: "Nous organisons des séances de tutorat, des partages d'expériences avec des anciens, des ateliers sur les méthodes de travail et nous offrons parfois des bourses d'excellence aux plus méritants."
  },
  {
    question: "Où se trouve le siège de l'ACEEMUB ?",
    answer: "Le siège national se trouve à Cotonou, dans le quartier Zongo. Cependant, nous avons des bureaux de section dans toutes les grandes villes universitaires du Bénin."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pt-24 pb-20">
      <section className="bg-emerald-900 py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Foire Aux Questions</h1>
            <p className="text-emerald-100 text-lg max-w-3xl mx-auto leading-relaxed">
              Retrouvez les réponses aux questions les plus fréquemment posées sur l'ACEEMUB.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-3xl overflow-hidden">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="font-bold text-slate-900">{faq.question}</span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-aemb-green shadow-sm">
                    {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 bg-white text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-20 p-12 bg-amber-50 rounded-[48px] border border-amber-100 text-center">
            <HelpCircle className="text-aemb-gold mx-auto mb-6" size={48} />
            <h3 className="text-2xl font-serif font-bold mb-4">Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="text-slate-600 mb-8">Notre équipe est là pour vous aider. Envoyez-nous votre question directement.</p>
            <button className="bg-aemb-gold text-white px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
              <MessageCircle size={20} /> Poser une question
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
