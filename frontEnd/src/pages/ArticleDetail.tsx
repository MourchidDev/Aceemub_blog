import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import ShareButton from '../components/ShareButton';
import { useArticle } from '../hooks/useArticles';
import Loader from '../components/Loader';
import CommentSection from '../components/CommentSection';

const readMinutes = (html: string) => {
  const text = html.replace(/<[^>]*>/g, '');
  return Math.ceil(text.split(/\s+/).length / 200);
};

export default function ArticleDetail() {
  const { id } = useParams();
  const { data: article, isLoading } = useArticle(id || '');

  if (!article || isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  return (
    <article className="mx-auto max-w-2xl">
      <div className="px-5 pt-4">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Blog
        </Link>
      </div>

      <header className="px-5 pt-6 text-center">
        {article.category?.name && (
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-primary">
            {article.category.name}
          </span>
        )}
        <h1 className="mt-4 font-serif text-3xl leading-[1.1] text-foreground sm:text-5xl">
          {article.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-widest">Date</div>
            <div className="mt-1 flex items-center gap-1 text-foreground"><Calendar className="h-3 w-3" /> {article.date}</div>
          </div>
          {article.author?.name && (
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest">Auteur</div>
              <div className="mt-1 text-foreground">{article.author.name}</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-widest">Lecture</div>
            <div className="mt-1 flex items-center gap-1 text-foreground"><Clock className="h-3 w-3" /> {readMinutes(article.content)} min</div>
          </div>
        </div>
      </header>

      {article.coverImage && (
        <div className="mt-7 px-5">
          <div className="overflow-hidden rounded-3xl bg-muted">
            <img
              src={article.coverImage}
              alt={article.title}
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      <div className="relative mt-8 px-5">
        <div
          className="prose prose-neutral mx-auto max-w-2xl font-sans text-[17px] leading-[1.75] text-foreground prose-headings:font-serif prose-headings:tracking-tight prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.excerpt ?? ""}</p>` }}
        />
      </div>

      <div className="mx-auto max-w-2xl px-5 mt-8 border-t border-border pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-foreground">Partager</h2>
          <ShareButton
            title={article.title}
            text={article.excerpt ?? article.title}
            url={`${window.location.origin}/blog/${article.id}`}
          />
        </div>
      </div>

      {id && <CommentSection articleId={id} />}
    </article>
  );
}
