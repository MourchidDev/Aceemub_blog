import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { eventsApi, API_ORIGIN } from "@/api";



function AdminEventDetailPage() {
  const { id } = useParams() as any;
  const { data: e, isLoading } = useQuery({
    queryKey: ["admin", "event", id],
    queryFn: () => eventsApi.getById(id),
    retry: false,
  });

  if (isLoading) return <div className="text-sm text-muted-foreground">Chargement…</div>;
  if (!e) return <div className="text-sm text-muted-foreground">Événement introuvable.</div>;

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/admin/evenements" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Événements
      </Link>
      <h1 className="mt-2 font-serif text-3xl">{e.title}</h1>
      <p className="mt-2 text-muted-foreground">{e.description}</p>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(e.eventDate).toLocaleString("fr-FR")}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</span>
      </div>

      <section className="mt-8 space-y-5">
        {e.albums.map((a) => (
          <article key={a.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <h3 className="font-serif text-xl">{a.title}</h3>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {a.media.map((m) => (
                <img key={m.id} src={m.url.startsWith("/") ? `${API_ORIGIN}${m.url}` : m.url}
                  alt="" className="aspect-square w-full rounded-xl object-cover bg-muted" />
              ))}
            </div>
          </article>
        ))}
        {e.albums.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Aucun album associé à cet événement.
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminEventDetailPage;
