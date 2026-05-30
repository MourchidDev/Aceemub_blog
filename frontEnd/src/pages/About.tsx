
import PageHeader from "@/components/PageHeader";
import { BookOpen, Heart, Users, Compass } from "lucide-react";



const pillars = [
  { icon: BookOpen, t: "Savoir", d: "Conférences, cercles d'étude et accompagnement scolaire." },
  { icon: Heart, t: "Spiritualité", d: "Activités cultuelles et formation religieuse continue." },
  { icon: Users, t: "Fraternité", d: "Une présence dans toutes les villes universitaires." },
  { icon: Compass, t: "Engagement", d: "Actions sociales, plaidoyer et leadership étudiant." },
];

const bureau = [
  { name: "Abdoul-Aziz K.", role: "Président national" },
  { name: "Aïssatou D.", role: "Vice-présidente" },
  { name: "Ibrahim S.", role: "Secrétaire général" },
  { name: "Khadidja F.", role: "Trésorière" },
  { name: "Moussa H.", role: "Resp. communication" },
  { name: "Hafsah B.", role: "Resp. spiritualité" },
];

const values = [
  "Sincérité (Ikhlâs) dans toute notre action",
  "Excellence (Itqân) académique et personnelle",
  "Fraternité (Ukhuwwa) sans exclusion",
  "Responsabilité (Amânah) vis-à-vis de la communauté",
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl pb-16">
      <PageHeader
        eyebrow="À propos"
        title="L'ACEEMUB en quelques mots"
        description="Notre histoire, notre vision et l'équipe qui œuvre pour le rayonnement de l'islam et l'épanouissement des élèves et étudiants musulmans du Bénin."
      />

      {/* Histoire */}
      <section className="px-5">
        <div className="overflow-hidden rounded-3xl bg-gradient-soft pattern-chevrons p-6 sm:p-10">
          <h2 className="font-serif text-3xl">Notre histoire</h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Née de la volonté d'un groupe d'étudiants engagés, l'ACEEMUB est aujourd'hui
            présente dans la majorité des universités, instituts et grandes écoles du
            pays. Elle structure ses actions autour de quatre piliers indissociables.
          </p>
        </div>
      </section>

      {/* Piliers */}
      <section className="mt-8 grid gap-3 px-5 sm:grid-cols-2">
        {pillars.map((p) => (
          <div key={p.t} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <span className="inline-grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
              <p.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-serif text-xl">{p.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
          </div>
        ))}
      </section>

      {/* Vision */}
      <section className="mt-10 px-5">
        <h2 className="font-serif text-3xl">Notre vision</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Former une génération savante, engagée et utile — alliant excellence
          académique, profondeur spirituelle et service de la communauté.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-serif text-xl">Mission</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Soutenir les élèves et étudiants musulmans du Bénin dans leurs
              parcours scolaire, universitaire et spirituel.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-serif text-xl">Valeurs</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {values.map((v) => (
                <li key={v} className="flex gap-2">
                  <span className="text-primary">◆</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-serif text-xl">Horizon 2030</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Être l'organisation étudiante musulmane de référence en Afrique de
              l'Ouest, reconnue pour ses programmes et son impact social.
            </p>
          </article>
        </div>
      </section>

      {/* Bureau */}
      <section className="mt-12 px-5">
        <h2 className="font-serif text-3xl">Le bureau national</h2>
        <p className="mt-2 text-muted-foreground">
          Une équipe et des bureaux locaux dans chaque pôle universitaire.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bureau.map((m) => (
            <article
              key={m.name}
              className="rounded-2xl border border-border bg-card p-5 text-center shadow-card"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-warm font-serif text-2xl text-primary-foreground">
                {m.name[0]}
              </div>
              <h3 className="mt-3 font-serif text-lg">{m.name}</h3>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{m.role}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
