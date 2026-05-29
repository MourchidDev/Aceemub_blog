
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin } from "lucide-react";
import { eventsApi } from "@/api";
import PageHeader from "@/components/PageHeader";
import type { Event } from "@/types";



const SAMPLE: Event[] = [
  {
    id: "1", title: "Séminaire National de Formation 2026", slug: "snf-2026",
    description: "Trois jours de cours, conférences et ateliers à Cotonou autour du thème : « Savoir et engagement ».",
    location: "Université d'Abomey-Calavi", eventDate: "2026-04-12T09:00:00Z",
    status: "PUBLISHED", albums: [], createdAt: "", updatedAt: "",
  },
  {
    id: "2", title: "Conférence Ramadan — Spiritualité & études", slug: "conf-ramadan",
    description: "Soirée de conférence avec des intervenants invités, suivie d'un iftar communautaire.",
    location: "Mosquée centrale, Cotonou", eventDate: "2026-03-05T18:30:00Z",
    status: "PUBLISHED", albums: [], createdAt: "", updatedAt: "",
  },
  {
    id: "3", title: "Caravane sociale — distribution kits scolaires", slug: "caravane-kits",
    description: "Mobilisation des sections ACEEMUB  du Sud-Bénin pour soutenir 500 élèves.",
    location: "Porto-Novo & environs", eventDate: "2026-02-28T08:00:00Z",
    status: "PUBLISHED", albums: [], createdAt: "", updatedAt: "",
  },
];

function EventsPage() {
  const { data = SAMPLE } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventsApi.getAll().catch(() => SAMPLE),
    initialData: SAMPLE,
  });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Agenda"
        title="Événements à venir"
        description="Formations, conférences, actions sociales et moments fraternels."
      />

      <ul className="space-y-4 px-5">
        {data.map((e) => {
          const d = new Date(e.eventDate);
          const day = d.toLocaleDateString("fr-FR", { day: "2-digit" });
          const month = d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "");
          const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
          return (
            <li key={e.id} className="overflow-hidden rounded-3xl bg-card shadow-card">
              <div className="flex">
                <div className="flex w-20 flex-col items-center justify-center bg-foreground py-5 text-background sm:w-24">
                  <span className="font-serif text-3xl leading-none">{day}</span>
                  <span className="mt-1 text-[11px] uppercase tracking-widest text-background/70">{month}</span>
                </div>
                <div className="flex-1 p-5">
                  <h3 className="font-serif text-xl leading-tight">{e.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {time}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default EventsPage;
