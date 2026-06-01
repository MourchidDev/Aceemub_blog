import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, useAddAlbum } from '../hooks/useEvents';
import { useNotification } from '../components/NotificationContainer';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import { Event, CreateEventPayload, UpdateEventPayload, ContentStatus } from '../types';
import {
  Plus, Pencil, Trash2, X, Calendar, MapPin, Image, Upload,
  FolderOpen, Eye, EyeOff, Archive,
} from 'lucide-react';

const STATUS_LABELS: Record<ContentStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publié',
  ARCHIVED: 'Archivé',
};
const STATUS_COLORS: Record<ContentStatus, string> = {
  DRAFT: 'bg-secondary/20 text-secondary',
  PUBLISHED: 'bg-primary/20 text-primary',
  ARCHIVED: 'bg-muted text-muted-foreground',
};
const STATUS_ICONS: Record<ContentStatus, React.ReactNode> = {
  DRAFT: <EyeOff size={11} />,
  PUBLISHED: <Eye size={11} />,
  ARCHIVED: <Archive size={11} />,
};

// ─── ImageDropzone ────────────────────────────────────────────────────────────
interface ImageDropzoneProps {
  files: File[];
  onChange: (files: File[]) => void;
  min?: number;
  label?: string;
}

function ImageDropzone({ files, onChange, min = 0, label }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files, ...Array.from(incoming)];
    onChange(next);
  }, [files, onChange]);

  const remove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const previews = files.map((f) => URL.createObjectURL(f));

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label} {min > 0 && <span className="text-destructive">* (min {min})</span>}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
      >
        <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Glissez vos images ici ou <span className="text-primary font-medium">parcourez</span></p>
        <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WEBP — max 5 Mo chacune</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
      {min > 0 && files.length < min && (
        <p className="text-xs text-destructive">{files.length}/{min} images sélectionnées</p>
      )}
    </div>
  );
}

// ─── EventModal (Create / Edit) ───────────────────────────────────────────────
interface EventModalProps {
  initial?: Event;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventPayload | ({ id: string } & UpdateEventPayload)) => void;
}

function EventModal({ initial, isPending, onClose, onSubmit }: EventModalProps) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    location: initial?.location ?? '',
    eventDate: initial ? initial.eventDate.slice(0, 16) : '',
    status: (initial?.status ?? 'DRAFT') as ContentStatus,
    albumTitle: '',
  });
  const [images, setImages] = useState<File[]>([]);

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location || !form.eventDate) return;

    if (isEdit) {
      onSubmit({ id: initial!.id, ...form });
    } else {
      onSubmit({ ...form, images });
    }
  };

  const inputCls = "w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar size={16} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {isEdit ? "Modifier l'événement" : 'Nouvel événement'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Titre <span className="text-destructive">*</span></label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="Titre de l'événement" autoFocus />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Date <span className="text-destructive">*</span></label>
              <input type="datetime-local" value={form.eventDate} onChange={(e) => set('eventDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Statut</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                {(Object.keys(STATUS_LABELS) as ContentStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Lieu <span className="text-destructive">*</span></label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)} className={`${inputCls} pl-9`} placeholder="Lieu de l'événement" />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Description <span className="text-destructive">*</span></label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} className={`${inputCls} resize-none`} placeholder="Description de l'événement" />
            </div>
            {!isEdit && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Nom de l'album <span className="text-muted-foreground font-normal">(optionnel)</span></label>
                <div className="relative">
                  <FolderOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" value={form.albumTitle} onChange={(e) => set('albumTitle', e.target.value)} className={`${inputCls} pl-9`} placeholder="Laissez vide pour utiliser le titre de l'événement" />
                </div>
              </div>
            )}
          </div>

          {!isEdit && (
            <ImageDropzone files={images} onChange={setImages} label="Photos de l'événement (optionnel)" />
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || !form.title || !form.description || !form.location || !form.eventDate}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── AddAlbumModal ────────────────────────────────────────────────────────────
interface AddAlbumModalProps {
  eventId: string;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (images: File[], albumTitle?: string) => void;
}

function AddAlbumModal({ isPending, onClose, onSubmit }: AddAlbumModalProps) {
  const [images, setImages] = useState<File[]>([]);
  const [albumTitle, setAlbumTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return;
    onSubmit(images, albumTitle || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FolderOpen size={16} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Ajouter un album</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nom de l'album <span className="text-muted-foreground font-normal">(optionnel)</span></label>
            <div className="relative">
              <FolderOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                placeholder="ex: Photos du jour J"
              />
            </div>
          </div>
          <ImageDropzone files={images} onChange={setImages} label="Images" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || images.length === 0}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Upload...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── AdminEvents (main) ───────────────────────────────────────────────────────
export default function AdminEvents() {
  const navigate = useNavigate();
  const { data: events, isLoading } = useEvents();
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();
  const addAlbumMutation = useAddAlbum();

  const { success, error } = useNotification();
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [addAlbumEventId, setAddAlbumEventId] = useState<string | null>(null);

  const openCreate = () => { setEditingEvent(null); setModalOpen(true); };
  const openEdit = (ev: Event) => { setEditingEvent(ev); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingEvent(null); };

  const handleSubmit = (data: CreateEventPayload | ({ id: string } & UpdateEventPayload)) => {
    if ('id' in data) {
      const { id, ...rest } = data;
      updateMutation.mutate({ id, ...rest }, {
        onSuccess: () => { success('Événement mis à jour'); closeModal(); },
        onError: () => error('Erreur lors de la mise à jour'),
      });
    } else {
      createMutation.mutate(data as CreateEventPayload, {
        onSuccess: () => { success('Événement créé avec succès'); closeModal(); },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
          error(msg ?? 'Erreur lors de la création');
        },
      });
    }
  };

  const handleDelete = async (ev: Event) => {
    const confirmed = await confirm({
      title: "Supprimer l'événement ?",
      message: `L'événement <strong>${ev.title}</strong> et toutes ses images seront supprimés définitivement.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      confirmColor: 'danger',
    });
    if (confirmed) {
      deleteMutation.mutate(ev.id, {
        onSuccess: () => success('Événement supprimé'),
        onError: () => error('Erreur lors de la suppression'),
      });
    }
  };

  const handleAddAlbum = (images: File[], albumTitle?: string) => {
    if (!addAlbumEventId) return;
    addAlbumMutation.mutate({ eventId: addAlbumEventId, images, albumTitle }, {
      onSuccess: () => { success('Album ajouté'); setAddAlbumEventId(null); },
      onError: () => error("Erreur lors de l'ajout de l'album"),
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const getCoverImage = (ev: Event) =>
    ev.albums?.[0]?.media?.[0]?.url ?? null;

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <Loader isLoading={isLoading} />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Événements</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {events?.length ?? 0} événement{(events?.length ?? 0) !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Nouvel événement
          </button>
        </div>

        {isLoading ? null : !events?.length ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Calendar size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Aucun événement pour l'instant</p>
            <button onClick={openCreate} className="mt-4 text-primary text-sm font-medium hover:underline">
              Créer le premier
            </button>
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Événement</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lieu</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statut</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Albums</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((ev) => {
                  const cover = getCoverImage(ev);
                  return (
                    <tr key={ev.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {cover
                              ? <img src={cover} alt="" className="w-full h-full object-cover" />
                              : <Image size={18} className="m-auto mt-2.5 text-muted-foreground" />
                            }
                          </div>
                          <span className="font-medium text-foreground line-clamp-1">{ev.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(ev.eventDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground max-w-[160px] truncate">{ev.location}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[ev.status]}`}>
                          {STATUS_ICONS[ev.status]}
                          {STATUS_LABELS[ev.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{ev._count?.albums ?? ev.albums?.length ?? 0}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/evenements/${ev.id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                          >
                            <Eye size={12} />
                            Voir
                          </button>
                          <button
                            onClick={() => setAddAlbumEventId(ev.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary bg-secondary/10 hover:bg-secondary/20 transition-colors"
                          >
                            <FolderOpen size={12} />
                            Album
                          </button>
                          <button
                            onClick={() => openEdit(ev)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                          >
                            <Pencil size={12} />
                            Éditer
                          </button>
                          <button
                            onClick={() => handleDelete(ev)}
                            disabled={deleteMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={12} />
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <EventModal
          initial={editingEvent ?? undefined}
          isPending={isPending}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

      {addAlbumEventId && (
        <AddAlbumModal
          eventId={addAlbumEventId}
          isPending={addAlbumMutation.isPending}
          onClose={() => setAddAlbumEventId(null)}
          onSubmit={handleAddAlbum}
        />
      )}

      {isOpen && options && (
        <ConfirmDialog {...options} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </div>
  );
}