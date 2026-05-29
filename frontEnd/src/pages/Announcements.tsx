
import { useQuery } from "@tanstack/react-query";
import { announcementsApi } from "@/api";
import PageHeader from "@/components/PageHeader";



const dotColor = (p: string) => p === "High" ? "bg-destructive" : p === "Medium" ? "bg-primary" : "bg-secondary";

function AnnoncesPage() {
  const { data = [] } = useQuery({
    queryKey: ["annonces"],
    queryFn: () => announcementsApi.getAll(),
    initialData: [],
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Annonces"
        title="Communiqués & infos"
        description="Toutes les nouvelles officielles de l'ACEEMUB  en un seul flux."
      />

      <ul className="space-y-3 px-5">
        {data.map((a) => (
          <li key={a.id} className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${dotColor(a.priority)}`} />
              {a.category} · {a.date}
            </div>
            <h3 className="mt-2 font-serif text-xl leading-snug">{a.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AnnoncesPage;
