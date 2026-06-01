import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Bold, Italic, List, Link as LinkIcon, Heading2, Upload, X } from "lucide-react";
import { articlesApi, categoriesApi } from "@/api";
import { useCreateArticle, useUpdateArticle } from "@/hooks/useArticles";
import { toast } from "sonner";

function ArticleFormShared({ id }: { id?: string }) {
  const nav = useNavigate();
  const qc = useQueryClient();
  const editing = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [coverImage, setCoverImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

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
      setCategoryId(existing.categoryId ?? "");
      setStatus(existing.status === "ARCHIVED" ? "DRAFT" : existing.status as any);
      setCoverImage(existing.coverImage ?? "");
      setImagePreview(existing.coverImage ?? "");
      editor.commands.setContent(existing.content || "<p></p>");
    }
  }, [existing, editor]);

  const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setCoverImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    const slug = slugify(title);
    
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("slug", slug);
        formData.append("categoryId", categoryId);
        formData.append("content", editor?.getHTML() ?? "<p></p>");
        formData.append("status", status);
        formData.append("coverImage", imageFile);
        
        if (editing) {
          await updateMutation.mutateAsync({ id: id!, payload: formData });
        } else {
          await createMutation.mutateAsync(formData);
        }
      } else {
        const payload = {
          title, slug, categoryId,
          content: editor?.getHTML() ?? "<p></p>",
          coverImage: coverImage || undefined, status,
        };
        
        if (editing) {
          await updateMutation.mutateAsync({ id: id!, payload });
        } else {
          await createMutation.mutateAsync(payload);
        }
      }
      
      toast.success(editing ? "Article mis à jour" : "Article créé");
      qc.invalidateQueries({ queryKey: ["articles"] });
      nav("/admin/articles");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  if (!editor) return null;

  const isPending = createMutation.isPending || updateMutation.isPending;

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
              onClick={handleSave} disabled={isPending || !title}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {isPending ? "Enregistrement…" : "Enregistrer"}
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
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Image de couverture</h3>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 flex h-24 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground hover:bg-muted/50"
              >
                <Upload className="h-4 w-4" /> Choisir une image
              </button>
            ) : (
              <div className="relative mt-2">
                <img src={imagePreview} alt="" className="aspect-video w-full rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            <input
              value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Ou URL de l'image..."
              className="mt-2 h-9 w-full rounded-full border border-border bg-background px-3 text-xs"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

export { ArticleFormShared };
export default ArticleFormShared;
