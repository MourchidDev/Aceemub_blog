import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import type { Article } from "@/types";
import { cn } from "@/lib/utils";
import logo from "@/assets/ac.png";

type Props = {
  article: Article;
  variant?: "default" | "hero" | "compact";
};

const readMinutes = (content: string) => {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

export default function ArticleCard({ article, variant = "default" }: Props) {
  const img = article.coverImage || logo;
  const isLogo = !article.coverImage;
  const href = `/blog/${article.id}`;

  if (variant === "hero") {
    return (
      <Link to={href} className="group block">
        <article className="overflow-hidden rounded-3xl bg-card shadow-card">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={img}
              alt={article.title}
              loading="lazy"
              className={cn(
                "h-full w-full transition-transform duration-500 group-hover:scale-105",
                isLogo ? "object-contain p-12" : "object-cover"
              )}
            />
            {article.category?.name && (
              <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-medium text-foreground backdrop-blur">
                {article.category.name}
              </span>
            )}
          </div>
          <div className="p-5">
            <h2 className="font-serif text-2xl leading-tight text-foreground">{article.title}</h2>
            {article.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
            )}
            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readMinutes(article.content)} min</span>
              {article.author?.name && <span>· {article.author.name}</span>}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={href} className="group flex gap-3">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
          <img 
            src={img} 
            alt={article.title} 
            loading="lazy" 
            className={cn(
              "h-full w-full",
              isLogo ? "object-contain p-2" : "object-cover"
            )} 
          />
        </div>
        <div className="min-w-0 flex-1">
          {article.category?.name && (
            <span className="text-[10px] uppercase tracking-wider text-primary">{article.category.name}</span>
          )}
          <h3 className="line-clamp-2 font-serif text-base leading-snug text-foreground group-hover:underline">
            {article.title}
          </h3>
          <p className="mt-1 text-[11px] text-muted-foreground">{article.date} · {readMinutes(article.content)} min</p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={href} className="group block">
      <article className={cn("overflow-hidden rounded-2xl bg-card shadow-card")}>
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={img}
            alt={article.title}
            loading="lazy"
            className={cn(
              "h-full w-full transition-transform duration-500 group-hover:scale-105",
              isLogo ? "object-contain p-8" : "object-cover"
            )}
          />
          {article.category?.name && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-0.5 text-[10px] font-medium text-foreground backdrop-blur">
              {article.category.name}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 font-serif text-lg leading-tight text-foreground">
            {article.title}
          </h3>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>{article.date}</span>
            <span>·</span>
            <span>{readMinutes(article.content)} min de lecture</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
