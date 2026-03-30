import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
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
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Contactez-nous</h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
              Une question ? Un projet ? Une suggestion ? Nous sommes à votre écoute.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h3 className="text-2xl font-serif font-bold mb-8">Nos coordonnées</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-aemb-green flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Email</p>
                    <p className="font-bold text-slate-900">contact@aceemub-benin.org</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-aemb-gold flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Téléphone</p>
                    <p className="font-bold text-slate-900">+229 21 30 00 00</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Siège National</p>
                    <p className="font-bold text-slate-900">Calavi, Quartier Zogbadjè, Bénin</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold mb-6">Suivez-nous</h3>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-aemb-green hover:text-white transition-all"><Facebook size={20} /></a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-aemb-green hover:text-white transition-all"><Twitter size={20} /></a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-aemb-green hover:text-white transition-all"><Instagram size={20} /></a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-slate-50 p-8 md:p-12 rounded-[40px] border border-slate-100">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-aemb-green text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">Message envoyé !</h3>
                <p className="text-slate-600 mb-8">Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-aemb-green font-bold underline"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-serif font-bold mb-6">Envoyez-nous un message</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nom complet</label>
                    <input required type="text" className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-aemb-green" placeholder="Votre nom" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email</label>
                    <input required type="email" className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-aemb-green" placeholder="votre@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Sujet</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-aemb-green" placeholder="De quoi s'agit-il ?" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Message</label>
                  <textarea required rows={5} className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-aemb-green" placeholder="Votre message ici..."></textarea>
                </div>
                <button type="submit" className="w-full bg-aemb-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-900/20">
                  Envoyer le message <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto h-96 bg-slate-200 rounded-[48px] overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold">
            [ Carte interactive du Siège National ]
          </div>
        </div>
      </section>
    </div>
  );
}
