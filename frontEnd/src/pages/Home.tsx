import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, BookOpen, Users } from "lucide-react";
import { articlesApi, eventsApi } from "@/api";
import ArticleCard from "@/components/ArticleCard";
import heroStudent from "@/assets/hero-student.jpg";

function HomePage() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: () => articlesApi.getPublished(),
  });
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventsApi.getAll().catch(() => []),
  });

  const hero = articles[0];
  const rest = articles.slice(1, 5);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero dynamique */}
      <section className="px-5 pt-6 pb-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-soft pattern-chevrons shadow-elevated">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="p-6 sm:p-10 md:py-14">
              {hero?.category?.name && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-[11px] font-medium text-primary shadow-sm">
                  {hero.category.name}
                </div>
              )}
              <h1 className="mt-4 font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
                {hero?.title || "Apprendre, prier, servir — ensemble."}
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                {hero?.excerpt || "L'ACEEMUB accompagne les élèves et étudiants musulmans du Bénin sur le chemin du savoir et de la spiritualité, dans la fraternité."}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to={hero ? `/blog/${hero.id}` : "/blog"}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background hover:bg-foreground/90"
                >
                  {hero ? "Lire l'article" : "Lire le blog"} <ArrowRight className="h-4 w-4" />
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
                src={hero?.coverImage || heroStudent}
                alt={hero?.title || "Étudiante musulmane lisant un livre au Bénin"}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="mx-5 mt-8 grid grid-cols-3 gap-2">
        {[
          { icon: BookOpen, label: "Articles", value: articles.length },
          { icon: Calendar, label: "Événements", value: events.length || 0 },
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
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Chargement...</p>
        ) : rest.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {rest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">Aucun article disponible</p>
        )}
      </section>

      {/* CTA rejoindre */}
      <section className="px-5 pt-12 pb-8">
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
