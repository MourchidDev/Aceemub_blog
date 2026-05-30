import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { articlesApi, categoriesApi } from "@/api";
import ArticleCard from "@/components/ArticleCard";
import CategoryTabs from "@/components/CategoryTabs";
import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";



function BlogPage() {
  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");

  const { data: articles = [] } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: () => articlesApi.getPublished().catch(() => []),
    initialData: [],
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll().catch(() => []),
    initialData: [],
  });

  const tabs = useMemo(
    () => [
      { id: "all", label: "Tout", count: articles.length },
      ...categories.map((c) => ({
        id: c.id,
        label: c.name,
        count: articles.filter((a) => a.categoryId === c.id).length,
      })),
    ],
    [categories, articles],
  );

  const filtered = articles.filter((a) => {
    if (active !== "all" && a.categoryId !== active) return false;
    if (q && !`${a.title} ${a.excerpt}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Le blog"
        title={<>Lire, comprendre,<br />progresser.</>}
        description="Articles, témoignages et ressources sélectionnés par la rédaction ACEEMUB ."
      />

      <div className="mx-auto max-w-3xl px-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un article…"
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-card focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-5 px-5">
        <CategoryTabs tabs={tabs} value={active} onChange={setActive} />
      </div>

      <section className="px-5 pt-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Aucun article ne correspond à ta recherche.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default BlogPage;
