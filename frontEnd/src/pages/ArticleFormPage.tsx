import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Bold, Italic, List, Link as LinkIcon, Heading2 } from "lucide-react";
import { articlesApi, categoriesApi } from "@/api";
import { toast } from "sonner";

function ArticleFormShared({ id }: { id?: string }) {
  const nav = useNavigate();
  const qc = useQueryClient();
  const editing = !!id;

  const { data: existing } = useQuery({
    queryKey: ["article", id],
    queryFn: () => articlesApi.getById(id!),
    enabled: editing,
    retry: false,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll().catch(() => []),
    initialData: [],
  });

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [coverImage, setCoverImage] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, LinkExt.configure({ openOnClick: false })],
    content: "<p></p>",
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none min-h-[300px] focus:outline-none px-4 py-3",
      },
    },
  });

  useEffect(() => {
    if (existing && editor) {
      setTitle(existing.title);
      setSlug(existing.slug);
      setCategoryId(existing.categoryId ?? "");
      setStatus(existing.status === "ARCHIVED" ? "DRAFT" : existing.status as any);
      setCoverImage(existing.coverImage ?? "");
      editor.commands.setContent(existing.content || "<p></p>");
    }
  }, [existing, editor]);

  const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  useEffect(() => {
    if (!editing && title && !slug) setSlug(slugify(title));
  }, [title, slug, editing]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title, slug: slug || slugify(title), categoryId,
        content: editor?.getHTML() ?? "<p></p>",
        coverImage: coverImage || undefined, status,
      };
      return editing ? articlesApi.update(id!, payload) : articlesApi.create(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Article mis à jour" : "Article créé");
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
      nav("/admin/articles");
    },
    onError: () => toast.error("Erreur lors de l'enregistrement"),
  });

  if (!editor) return null;

  const TBtn = ({ on, active, children, label }: any) => (
    <button type="button" onClick={on} aria-label={label}
      className={`grid h-8 w-8 place-items-center rounded-md hover:bg-muted ${active ? "bg-foreground text-background hover:bg-foreground" : ""}`}>
      {children}
    </button>
  );

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/admin/articles" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Articles
      </Link>
      <h1 className="mt-2 font-serif text-3xl">{editing ? "Modifier l'article" : "Nouvel article"}</h1>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <input
            value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'article"
            className="w-full bg-transparent font-serif text-3xl placeholder:text-muted-foreground/50 focus:outline-none"
          />
          <input
            value={slug} onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-de-larticle"
            className="h-9 w-full rounded-full border border-border bg-background px-3 text-xs text-muted-foreground focus:outline-none"
          />

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2">
              <TBtn label="H2" on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
                <Heading2 className="h-4 w-4" />
              </TBtn>
              <TBtn label="Gras" on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
                <Bold className="h-4 w-4" />
              </TBtn>
              <TBtn label="Italique" on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
                <Italic className="h-4 w-4" />
              </TBtn>
              <TBtn label="Liste" on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
                <List className="h-4 w-4" />
              </TBtn>
              <TBtn label="Lien" on={() => {
                const url = prompt("URL du lien"); if (url) editor.chain().focus().setLink({ href: url }).run();
              }} active={editor.isActive("link")}>
                <LinkIcon className="h-4 w-4" />
              </TBtn>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Publication</h3>
            <select
              value={status} onChange={(e) => setStatus(e.target.value as any)}
              className="mt-2 h-10 w-full rounded-full border border-border bg-background px-3 text-sm"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publié</option>
            </select>
            <button
              onClick={() => save.mutate()} disabled={save.isPending || !title}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {save.isPending ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Catégorie</h3>
            <select
              value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className="mt-2 h-10 w-full rounded-full border border-border bg-background px-3 text-sm"
            >
              <option value="">— Aucune —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Image de couverture (URL)</h3>
            <input
              value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://…"
              className="mt-2 h-10 w-full rounded-full border border-border bg-background px-3 text-sm"
            />
            {coverImage && (
              <img src={coverImage} alt="" className="mt-3 aspect-video w-full rounded-xl object-cover" />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}



export { ArticleFormShared };

export default ArticleFormShared;
