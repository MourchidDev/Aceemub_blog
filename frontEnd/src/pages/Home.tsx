import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Calendar, BookOpen, Users } from "lucide-react";
import { articlesApi, eventsApi, announcementsApi } from "@/api";
import ArticleCard from "@/components/ArticleCard";
import type { Article } from "@/types";
import heroStudent from "@/assets/hero-student.jpg";



const SAMPLE_ARTICLES: Article[] = [
  {
    id: "demo-1",
    title: "Concilier études exigeantes et pratique religieuse au quotidien",
    slug: "concilier-etudes-pratique",
    content: "Conseils concrets, témoignages d'aînés et organisation d'une semaine type pour étudier sereinement sans compromettre sa spiritualité.",
    status: "PUBLISHED", authorId: "u",
    author: { id: "u", name: "Aïssatou D.", email: "" },
    category: { id: "c", name: "Vie étudiante", slug: "vie-etudiante" },
    createdAt: "2026-02-20T10:00:00Z", updatedAt: "2026-02-20T10:00:00Z",
    date: "20 Fév 2026", excerpt: "Conseils concrets, témoignages d'aînés et organisation d'une semaine type.",
    coverImage: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1200&q=70",
  },
  {
    id: "demo-2",
    title: "Ramadan à l'université : retours d'expérience de Cotonou",
    slug: "ramadan-universite-cotonou",
    content: "Cinq étudiants partagent leur quotidien pendant le mois béni : organisation, jeûne, examens et vie en cité U.",
    status: "PUBLISHED", authorId: "u",
    author: { id: "u", name: "Ibrahim S.", email: "" },
    category: { id: "c2", name: "Spiritualité", slug: "spiritualite" },
    createdAt: "2026-02-15T10:00:00Z", updatedAt: "2026-02-15T10:00:00Z",
    date: "15 Fév 2026", excerpt: "Cinq étudiants partagent leur quotidien pendant le mois béni.",
    coverImage: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&q=70",
  },
  {
    id: "demo-3",
    title: "Bourses, mentorat, tutorat : ce que l'ACEEMUB  met à votre service",
    slug: "services-ACEEMUB ",
    content: "Un tour d'horizon complet des dispositifs d'accompagnement académique pour les membres de l'association.",
    status: "PUBLISHED", authorId: "u",
    author: { id: "u", name: "Rédaction ACEEMUB ", email: "" },
    category: { id: "c3", name: "Association", slug: "association" },
    createdAt: "2026-02-08T10:00:00Z", updatedAt: "2026-02-08T10:00:00Z",
    date: "8 Fév 2026", excerpt: "Un tour d'horizon des dispositifs d'accompagnement académique.",
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=70",
  },
  {
    id: "demo-4",
    title: "Rentrée 2026 : comment bien préparer son arrivée à l'UAC",
    slug: "rentree-uac",
    content: "Logement, démarches, vie associative — le guide indispensable pour les bacheliers musulmans.",
    status: "PUBLISHED", authorId: "u",
    author: { id: "u", name: "Khadidja F.", email: "" },
    category: { id: "c", name: "Vie étudiante", slug: "vie-etudiante" },
    createdAt: "2026-02-01T10:00:00Z", updatedAt: "2026-02-01T10:00:00Z",
    date: "1er Fév 2026", excerpt: "Le guide indispensable pour les bacheliers musulmans.",
    coverImage: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1200&q=70",
  },
];

function HomePage() {
  const { data: articles } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: () => articlesApi.getPublished().catch(() => SAMPLE_ARTICLES),
    initialData: SAMPLE_ARTICLES,
    retry: false,
  });
  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventsApi.getAll().catch(() => []),
    initialData: [],
    retry: false,
  });
  const { data: annonces } = useQuery({
    queryKey: ["annonces"],
    queryFn: () => announcementsApi.getAll(),
    initialData: [],
  });

  const list = articles?.length ? articles : SAMPLE_ARTICLES;
  const hero = list[0];
  const rest = list.slice(1, 5);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero éditorial */}
      <section className="px-5 pt-6 pb-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-soft pattern-chevrons shadow-elevated">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="p-6 sm:p-10 md:py-14">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-[11px] font-medium text-primary shadow-sm">
                <Sparkles className="h-3 w-3" /> Édition de la semaine
              </div>
              <h1 className="mt-4 font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
                Apprendre, prier,<br />servir — ensemble.
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                L'ACEEMUB  accompagne les élèves et étudiants musulmans du Bénin sur le
                chemin du savoir et de la spiritualité, dans la fraternité.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to="/blog"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background hover:bg-foreground/90"
                >
                  Lire le blog <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/rejoindre"
                  className="inline-flex h-11 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Devenir membre
                </Link>
              </div>
            </div>
            <div className="relative h-56 sm:h-72 md:h-auto md:min-h-[420px]">
              <img
                src={heroStudent}
                alt="Étudiante musulmane lisant un livre au Bénin"
                width={1600}
                height={1200}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Article à la une */}
      {hero && (
        <section className="px-5 pt-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-serif text-2xl">À la une</h2>
            <Link to="/blog" className="text-xs font-medium text-primary hover:underline">
              Tous les articles →
            </Link>
          </div>
          <ArticleCard article={hero} variant="hero" />
        </section>
      )}

      {/* Quick stats / values */}
      <section className="mx-5 mt-8 grid grid-cols-3 gap-2">
        {[
          { icon: BookOpen, label: "Articles", value: list.length },
          { icon: Calendar, label: "Événements", value: events.length || 12 },
          { icon: Users, label: "Membres", value: "1 200+" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-card p-3 text-center shadow-card">
            <s.icon className="mx-auto h-4 w-4 text-primary" />
            <div className="mt-1 font-serif text-xl">{s.value}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Latest grid */}
      <section className="px-5 pt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-serif text-2xl">Derniers articles</h2>
          <Link to="/blog" className="text-xs font-medium text-primary hover:underline">Voir tout →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {rest.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* Annonces */}
      {annonces && annonces.length > 0 && (
        <section className="px-5 pt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-serif text-2xl">Annonces</h2>
            <Link to="/annonces" className="text-xs font-medium text-primary hover:underline">Tout voir →</Link>
          </div>
          <div className="space-y-3">
            {annonces.slice(0, 3).map((a) => (
              <Link
                key={a.id}
                to="/annonces"
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/30"
              >
                <span
                  className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                    a.priority === "High" ? "bg-destructive" : a.priority === "Medium" ? "bg-primary" : "bg-secondary"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {a.category} · {a.date}
                  </div>
                  <h3 className="mt-0.5 font-serif text-base leading-snug">{a.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA rejoindre */}
      <section className="px-5 pt-12">
        <div className="overflow-hidden rounded-3xl bg-foreground p-7 text-background sm:p-10">
          <h2 className="font-serif text-3xl sm:text-4xl">Une fraternité qui te soutient.</h2>
          <p className="mt-3 max-w-md text-sm text-background/70 sm:text-base">
            Rejoins une communauté d'étudiants musulmans présents partout au Bénin.
            Mentorat, bourses, événements, formation : on grandit ensemble.
          </p>
          <Link
            to="/rejoindre"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Demander mon adhésion <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
