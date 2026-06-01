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
  DRAFT: 'bg-amber-100 text-amber-700',
  PUBLISHED: 'bg-emerald-100 text-emerald-700',
  ARCHIVED: 'bg-gray-100 text-gray-500',
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
        <label className="block text-sm font-medium text-gray-700">
          {label} {min > 0 && <span className="text-red-400">* (min {min})</span>}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors"
      >
        <Upload size={24} className="mx-auto mb-2 text-gray-300" />
        <p className="text-sm text-gray-500">Glissez vos images ici ou <span className="text-indigo-600 font-medium">parcourez</span></p>
        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WEBP — max 5 Mo chacune</p>
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
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
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
        <p className="text-xs text-red-500">{files.length}/{min} images sélectionnées</p>
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

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Calendar size={16} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {isEdit ? "Modifier l'événement" : 'Nouvel événement'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre <span className="text-red-400">*</span></label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="Titre de l'événement" autoFocus />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date <span className="text-red-400">*</span></label>
              <input type="datetime-local" value={form.eventDate} onChange={(e) => set('eventDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                {(Object.keys(STATUS_LABELS) as ContentStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Lieu <span className="text-red-400">*</span></label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)} className={`${inputCls} pl-9`} placeholder="Lieu de l'événement" />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-400">*</span></label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} className={`${inputCls} resize-none`} placeholder="Description de l'événement" />
            </div>
            {!isEdit && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l'album <span className="text-gray-400 font-normal">(optionnel)</span></label>
                <div className="relative">
                  <FolderOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.albumTitle} onChange={(e) => set('albumTitle', e.target.value)} className={`${inputCls} pl-9`} placeholder="Laissez vide pour utiliser le titre de l'événement" />
                </div>
              </div>
            )}
          </div>

          {!isEdit && (
            <ImageDropzone files={images} onChange={setImages} label="Photos de l'événement (optionnel)" />
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || !form.title || !form.description || !form.location || !form.eventDate}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FolderOpen size={16} className="text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Ajouter un album</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l'album <span className="text-gray-400 font-normal">(optionnel)</span></label>
            <div className="relative">
              <FolderOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="ex: Photos du jour J"
              />
            </div>
          </div>
          <ImageDropzone files={images} onChange={setImages} label="Images" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || images.length === 0}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

  const del = useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => { toast.success("Événement supprimé"); qc.invalidateQueries({ queryKey: ["admin", "events"] }); },
  });

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await confirm({
      title: "Supprimer l'événement",
      message: `Êtes-vous sûr de vouloir supprimer <strong>${title}</strong> ?`,
      confirmText: "Supprimer",
      confirmColor: "danger",
    });
    if (confirmed) del.mutate(id);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Événements</h1>
          <p className="text-sm text-muted-foreground">Gère les événements et leurs albums photos.</p>
        </div>
        <Link to="/admin/evenements/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Créer
        </Link>
      </div>

      <ul className="mt-6 space-y-3">
        {list.map((e) => (
          <li key={e.id} className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-lg">{e.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(e.eventDate).toLocaleString("fr-FR")}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</span>
                <span>{e._count?.albums ?? e.albums.length} album(s)</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Link to={`/admin/evenements/${e.id}/edit`} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" title="Modifier">
                <Pencil className="h-4 w-4" />
              </Link>
              <Link to={`/admin/evenements/${e.id}`} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" title="Détails">
                <Eye className="h-4 w-4" />
              </Link>
              <button onClick={() => handleDelete(e.id, e.title)} className="grid h-9 w-9 place-items-center rounded-full text-destructive hover:bg-destructive/10" title="Supprimer">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
        {list.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Aucun événement.
          </li>
        )}
      </ul>
      {isOpen && options && (
        <ConfirmDialog
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          confirmColor={options.confirmColor}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default AdminEventsPage;
