import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Filter, Bell } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import { useEvents } from '../hooks/useEvents';

// const CATEGORIES = ["Tous", "Conférence", "Formation", "Social", "Sport"];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const { data: events = [] } = useEvents();

  const filteredEvents = events.filter(event => {
    if (activeCategory === "Tous") return true;
    return true;
  });

  return (
    <div className="pt-24 pb-20">
      {/* Events Hero */}
      <section className="bg-secondary py-20 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-primary/20 skew-x-12 transform -translate-x-20" />
        <div className="max-w-6xl mx-auto px-5 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6">Nos Événements</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl leading-relaxed">
              Formations, conférences, actions sociales et moments fraternels pour accompagner les étudiants musulmans du Bénin.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 max-w-6xl mx-auto px-5">
        {filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredEvents.map((event, index) => {
              const eventDate = new Date(event.eventDate);
              const day = eventDate.getDate().toString().padStart(2, '0');
              const month = eventDate.toLocaleString('fr-FR', { month: 'short' }).toUpperCase();
              const time = eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

              return (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card hover:border-primary/30 transition-all"
                >
                  {/* Date Badge */}
                  <div className="flex">
                    <div className="w-24 sm:w-28 bg-primary text-primary-foreground flex flex-col items-center justify-center py-6">
                      <span className="font-bold text-3xl">{day}</span>
                      <span className="text-xs uppercase tracking-wider opacity-80">{month}</span>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                          {event.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      {/* Event Details */}
                      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-secondary" />
                          <span>{time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-secondary" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Share Button */}
                  <div className="px-6 py-3 bg-muted border-t border-border flex justify-end">
                    <ShareButton
                      title={event.title}
                      text={event.description}
                      url={`${window.location.origin}/evenements/${event.id}`}
                      compact
                    />
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
              <Bell size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Aucun événement</h3>
            <p className="text-muted-foreground">Aucun événement ne correspond à votre sélection.</p>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Reste informé de nos prochains événements</h2>
          <p className="text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Inscris-toi à notre newsletter pour ne manquer aucun de nos événements et actions communautaires.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-grow px-6 py-4 bg-primary-foreground/10 border border-primary-foreground/30 rounded-2xl text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
            />
            <button className="bg-secondary text-primary px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-all">
              S'abonner
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
