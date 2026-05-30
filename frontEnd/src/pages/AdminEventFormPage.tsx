import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { eventsApi } from "@/api";
import { toast } from "sonner";

function AdminEventFormPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { id } = useParams() as any;
  const editing = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: existing, isLoading: loadingExisting } = useQuery({
    queryKey: ["admin", "event", id],
    queryFn: () => eventsApi.getById(id!),
    enabled: editing,
    retry: false,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [albumTitle, setAlbumTitle] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDescription(existing.description);
      setLocation(existing.location);
      setEventDate(new Date(existing.eventDate).toISOString().slice(0, 16));
      setStatus(existing.status === "ARCHIVED" ? "DRAFT" : (existing.status as any));
    }
  }, [existing]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setSelectedImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setImagePreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const save = useMutation({
    mutationFn: async () => {
      if (!title.trim() || !description.trim() || !location.trim() || !eventDate) {
        throw new Error("Tous les champs texte sont requis");
      }

      if (!editing && selectedImages.length < 5) {
        throw new Error("Au moins 5 images sont requises pour créer un événement");
      }

      if (editing) {
        // Mode édition : envoyer uniquement les champs texte
        await eventsApi.update(id!, {
          title,
          description,
          location,
          eventDate: new Date(eventDate).toISOString(),
          status,
        });
      } else {
        // Mode création : envoyer avec FormData + images
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("eventDate", new Date(eventDate).toISOString());
        formData.append("status", status);
        if (albumTitle) formData.append("albumTitle", albumTitle);
        selectedImages.forEach(img => formData.append("images", img));
        await eventsApi.create(formData);
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Événement mis à jour" : "Événement créé");
      qc.invalidateQueries({ queryKey: ["admin", "events"] });
      nav("/admin/evenements");
    },
    onError: (err: any) => {
      toast.error(err.message || "Erreur lors de l'enregistrement");
    },
  });

  if (loadingExisting) return <div className="text-sm text-muted-foreground">Chargement…</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/evenements" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Événements
      </Link>

      <h1 className="mt-4 font-serif text-3xl">{editing ? "Modifier l'événement" : "Créer un événement"}</h1>

      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="mt-6 space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Titre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'événement…"
            className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description détaillée…"
            className="min-h-[120px] w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Lieu *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lieu de l'événement…"
              className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Date & Heure *</label>
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publié</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Titre de l'album</label>
            <input
              type="text"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              placeholder="Par défaut : titre de l'événement"
              className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
            />
          </div>
        </div>

        {!editing && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Images (minimum 5) *</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-24 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card/50 text-sm text-muted-foreground hover:bg-muted/30"
            >
              <Upload className="h-4 w-4" /> Cliquez ou glissez les images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">{selectedImages.length} image(s) sélectionnée(s)</p>
          </div>
        )}

        {editing && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Album actuel</label>
            <p className="text-xs text-muted-foreground">{existing?.albums.length ?? 0} album(s) · {(existing?.albums ?? []).reduce((acc, a) => acc + a.media.length, 0)} photo(s)</p>
            <p className="text-xs text-muted-foreground">Pour ajouter des photos à cet événement, utilisez la page de détail.</p>
          </div>
        )}

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {imagePreviews.map((preview, i) => (
              <div key={i} className="group relative aspect-square">
                <img src={preview} alt="" className="h-full w-full rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={save.isPending}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {save.isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
          <Link to="/admin/evenements" className="inline-flex h-10 items-center rounded-full border border-border px-6 text-sm font-medium hover:bg-muted">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AdminEventFormPage;
