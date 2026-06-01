import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import ShareButton from '../components/ShareButton';
import { motion } from 'motion/react';
import { useArticle } from '../hooks/useArticles';
import Loader from '../components/Loader';
import CommentSection from '../components/CommentSection';

export default function ArticleDetail() {
  const { id } = useParams();
  const { data: article, isLoading } = useArticle(id || '');

  if (!article && !isLoading) {
    return <div className="pt-40 text-center text-slate-400">Article introuvable.</div>;
  }

  const handleSend = async () => {
    if (!draft.trim()) return;
    setSending(true);
    try {
      await commentsApi.create({ content: draft.trim(), articleId: id });
      setDraft("");
      toast.success("Commentaire envoyé. Il sera publié après modération.");
      refetch();
    } catch {
      toast.error("Envoi impossible. Réessaie plus tard.");
    } finally {
      setSending(false);
    }
  };

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
        {/* Share rail */}
        <div className="sticky top-20 float-left -ml-2 mr-4 hidden flex-col gap-2 md:flex">
          <button aria-label="Partager" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card hover:bg-muted">
            <Share2 className="h-4 w-4" />
          </button>
          <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card hover:bg-muted">
            <Facebook className="h-4 w-4" />
          </a>
          <a href="#" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card hover:bg-muted">
            <Twitter className="h-4 w-4" />
          </a>
        </div>

        <div
          className="prose prose-neutral mx-auto max-w-2xl font-sans text-[17px] leading-[1.75] text-foreground prose-headings:font-serif prose-headings:tracking-tight prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.excerpt ?? ""}</p>` }}
        />
      </div>

      {/* Comments */}
      <section className="mt-12 border-t border-border px-5 pt-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="flex items-center gap-2 font-serif text-2xl">
            <MessageCircle className="h-5 w-5" /> Commentaires ({comments.length})
          </h2>

          {isAuthenticated ? (
            <div className="mt-4 flex gap-3">
              <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {user?.name?.[0]?.toUpperCase() ?? "M"}
              </div>
              <div className="flex items-center gap-2 text-sm ml-auto">
                <ShareButton
                  title={article.title}
                  text={article.excerpt ?? article.title}
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-primary/10 p-4 text-sm">
              <Link to="/connexion" className="font-medium text-primary hover:underline">
                Connecte-toi
              </Link>{" "}
              pour laisser un commentaire.
            </div>
          )}

          <ul className="mt-8 space-y-5">
            {comments.filter((c) => c.status === "APPROVED").map((c) => (
              <li key={c.id} className="flex gap-3">
                <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold">
                  {(c.user?.name ?? c.authorName ?? "?")[0]?.toUpperCase()}
                </div>
                <div className="flex-1 rounded-2xl border border-border bg-card p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{c.user?.name ?? c.authorName ?? "Membre"}</span>
                    <span className="text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-foreground">{c.content}</p>
                </div>
              </li>
            ))}
            {comments.length === 0 && (
              <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Aucun commentaire pour l'instant. Sois le premier !
              </li>
            )}
          </ul>
        </div>
      </section>
    </article>
  );
}

export default ArticleDetailPage;
