import { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useEvent, useUpdateEvent, useDeleteEvent,
  useAddAlbum, useAddImagesToAlbum, useDeleteAlbum, useRenameAlbum, useDeleteMedia,
} from '../hooks/useEvents';
import { useNotification } from '../components/NotificationContainer';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import { ContentStatus, Album, Media, UpdateEventPayload } from '../types';
import {
  ArrowLeft, Calendar, MapPin, Pencil, Trash2, Plus, FolderOpen,
  Upload, X, ChevronLeft, ChevronRight, Image, Eye, EyeOff, Archive,
  MoreVertical, Check, Images,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<ContentStatus, string> = { DRAFT: 'Brouillon', PUBLISHED: 'Publié', ARCHIVED: 'Archivé' };
const STATUS_COLORS: Record<ContentStatus, string> = {
  DRAFT: 'bg-amber-100 text-amber-700',
  PUBLISHED: 'bg-emerald-100 text-emerald-700',
  ARCHIVED: 'bg-gray-100 text-gray-500',
};
const STATUS_ICONS: Record<ContentStatus, React.ReactNode> = {
  DRAFT: <EyeOff size={12} />, PUBLISHED: <Eye size={12} />, ARCHIVED: <Archive size={12} />,
};
const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition';

// ─── ImageDropzone ────────────────────────────────────────────────────────────
function ImageDropzone({ files, onChange }: { files: File[]; onChange: (f: File[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const handle = useCallback((list: FileList | null) => {
    if (!list) return;
    onChange([...files, ...Array.from(list)]);
  }, [files, onChange]);

  return (
    <div className="space-y-3">
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handle(e.dataTransfer.files); }}
        className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors"
      >
        <Upload size={22} className="mx-auto mb-1.5 text-gray-300" />
        <p className="text-sm text-gray-500">Glissez ou <span className="text-indigo-600 font-medium">parcourez</span></p>
        <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handle(e.target.files)} />
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {files.map((f, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => onChange(files.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onDelete, isDeleting }: {
  images: Media[]; index: number; onClose: () => void;
  onDelete?: (id: string) => void; isDeleting?: boolean;
}) {
  const [current, setCurrent] = useState(index);
  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  return (
    <div className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center" onClick={onClose}>
      {/* Nav prev */}
      <button onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10">
        <ChevronLeft size={20} />
      </button>

      {/* Image */}
      <img src={images[current].url} alt="" onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg shadow-2xl" />

      {/* Nav next */}
      <button onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10">
        <ChevronRight size={20} />
      </button>

      {/* Top bar */}
      <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4" onClick={(e) => e.stopPropagation()}>
        <span className="text-white/60 text-sm">{current + 1} / {images.length}</span>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button onClick={() => onDelete(images[current].id)} disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium transition-colors disabled:opacity-50">
              <Trash2 size={12} /> Supprimer
            </button>
          )}
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AlbumSection ─────────────────────────────────────────────────────────────
interface AlbumSectionProps {
  album: Album; eventId: string;
  onAddImages: (albumId: string, files: File[]) => void;
  onRename: (albumId: string, title: string) => void;
  onDelete: (albumId: string) => void;
  onDeleteMedia: (albumId: string, mediaId: string) => void;
  isAddingImages: boolean; isDeletingAlbum: boolean; isDeletingMedia: boolean;
}

function AlbumSection({ album, onAddImages, onRename, onDelete, onDeleteMedia, isAddingImages, isDeletingAlbum, isDeletingMedia }: AlbumSectionProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(album.title);

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) return;
    onAddImages(album.id, files);
    setFiles([]); setAddOpen(false);
  };

  const submitRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameVal.trim()) return;
    onRename(album.id, renameVal.trim());
    setRenaming(false);
  };

  const handleDeleteMedia = (mediaId: string) => {
    onDeleteMedia(album.id, mediaId);
    // close lightbox if last image
    if (album.media.length <= 1) setLightbox(null);
    else setLightbox((i) => i !== null ? Math.min(i, album.media.length - 2) : null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Album header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
        <FolderOpen size={15} className="text-indigo-500 flex-shrink-0" />
        {renaming ? (
          <form onSubmit={submitRename} className="flex items-center gap-2 flex-1">
            <input autoFocus value={renameVal} onChange={(e) => setRenameVal(e.target.value)}
              className="flex-1 px-2 py-1 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <button type="submit" className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors"><Check size={13} /></button>
            <button type="button" onClick={() => { setRenaming(false); setRenameVal(album.title); }}
              className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"><X size={13} /></button>
          </form>
        ) : (
          <span className="font-semibold text-gray-800 flex-1">{album.title}</span>
        )}
        <span className="text-xs text-gray-400 mr-2">{album.media.length} photo{album.media.length !== 1 ? 's' : ''}</span>

        {/* Add images button */}
        <button onClick={() => setAddOpen((v) => !v)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
          <Plus size={12} /> Ajouter
        </button>

        {/* Album menu */}
        <div className="relative">
          <button onClick={() => setMenuOpen((v) => !v)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-40" onMouseLeave={() => setMenuOpen(false)}>
              <button onClick={() => { setRenaming(true); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Pencil size={13} /> Renommer
              </button>
              <button onClick={() => { onDelete(album.id); setMenuOpen(false); }} disabled={isDeletingAlbum}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                <Trash2 size={13} /> Supprimer l'album
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add images form */}
      {addOpen && (
        <form onSubmit={submitAdd} className="px-5 py-4 border-b border-gray-100 bg-indigo-50/30 space-y-3">
          <ImageDropzone files={files} onChange={setFiles} />
          <div className="flex gap-2">
            <button type="button" onClick={() => { setAddOpen(false); setFiles([]); }}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
            <button type="submit" disabled={isAddingImages || !files.length}
              className="flex-1 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {isAddingImages ? 'Upload...' : `Ajouter ${files.length > 0 ? files.length + ' photo' + (files.length > 1 ? 's' : '') : ''}`}
            </button>
          </div>
        </form>
      )}

      {/* Photo grid */}
      {album.media.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-300">
          <Image size={30} className="mb-2" /><p className="text-sm">Aucune photo</p>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {album.media.map((m, i) => (
            <button key={m.id} onClick={() => setLightbox(i)}
              className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <img src={m.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox !== null && album.media.length > 0 && (
        <Lightbox images={album.media} index={lightbox} onClose={() => setLightbox(null)}
          onDelete={handleDeleteMedia} isDeleting={isDeletingMedia} />
      )}
    </div>
  );
}

// ─── EditEventModal ───────────────────────────────────────────────────────────
interface EditEventModalProps {
  event: { id: string; title: string; description: string; location: string; eventDate: string; status: ContentStatus };
  isPending: boolean; onClose: () => void;
  onSubmit: (data: { id: string } & UpdateEventPayload) => void;
}

function EditEventModal({ event, isPending, onClose, onSubmit }: EditEventModalProps) {
  const [form, setForm] = useState({
    title: event.title, description: event.description,
    location: event.location, eventDate: event.eventDate.slice(0, 16),
    status: event.status,
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><Calendar size={15} className="text-emerald-600" /></div>
            <span className="font-semibold text-gray-800">Modifier l'événement</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"><X size={17} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ id: event.id, ...form }); }} className="overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
              <input type="datetime-local" value={form.eventDate} onChange={(e) => set('eventDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                {(Object.keys(STATUS_LABELS) as ContentStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Lieu</label>
            <div className="relative"><MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={form.location} onChange={(e) => set('location', e.target.value)} className={`${inputCls} pl-9`} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} className={`${inputCls} resize-none`} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
            <button type="submit" disabled={isPending} className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
              {isPending ? 'Enregistrement...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── AddAlbumModal ────────────────────────────────────────────────────────────
function AddAlbumModal({ isPending, onClose, onSubmit }: {
  isPending: boolean; onClose: () => void;
  onSubmit: (images: File[], title?: string) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center"><FolderOpen size={15} className="text-indigo-600" /></div>
            <span className="font-semibold text-gray-800">Nouvel album</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"><X size={17} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (!files.length) return; onSubmit(files, title || undefined); }}
          className="overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l'album <span className="text-gray-400 font-normal">(optionnel)</span></label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="ex: Cérémonie d'ouverture" />
          </div>
          <ImageDropzone files={files} onChange={setFiles} />
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
            <button type="submit" disabled={isPending || !files.length}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {isPending ? 'Upload...' : 'Créer l\'album'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── AdminEventDetail (main) ──────────────────────────────────────────────────
export default function AdminEventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: event, isLoading } = useEvent(id!);
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();
  const addAlbumMutation = useAddAlbum();
  const addImagesMutation = useAddImagesToAlbum();
  const deleteAlbumMutation = useDeleteAlbum();
  const renameAlbumMutation = useRenameAlbum();
  const deleteMediaMutation = useDeleteMedia();

  const { success, error } = useNotification();
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();

  const [editOpen, setEditOpen] = useState(false);
  const [addAlbumOpen, setAddAlbumOpen] = useState(false);

  if (isLoading) return <Loader isLoading />;
  if (!event) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
      <Calendar size={40} className="mb-3 opacity-30" />
      <p className="text-sm">Événement introuvable</p>
      <button onClick={() => navigate('/admin/evenements')} className="mt-4 text-emerald-600 text-sm font-medium hover:underline">Retour</button>
    </div>
  );

  const totalPhotos = event.albums?.reduce((acc, a) => acc + a.media.length, 0) ?? 0;
  const cover = event.albums?.[0]?.media?.[0]?.url;

  const handleUpdate = (data: { id: string } & UpdateEventPayload) => {
    updateMutation.mutate(data, {
      onSuccess: () => { success('Événement mis à jour'); setEditOpen(false); },
      onError: () => error('Erreur lors de la mise à jour'),
    });
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Supprimer l'événement ?",
      message: `<strong>${event.title}</strong> et toutes ses photos seront supprimés définitivement.`,
      confirmText: 'Supprimer', cancelText: 'Annuler', confirmColor: 'danger',
    });
    if (ok) deleteMutation.mutate(event.id, {
      onSuccess: () => { success('Événement supprimé'); navigate('/admin/evenements'); },
      onError: () => error('Erreur lors de la suppression'),
    });
  };

  const handleAddAlbum = (images: File[], albumTitle?: string) => {
    addAlbumMutation.mutate({ eventId: event.id, images, albumTitle }, {
      onSuccess: () => { success('Album créé'); setAddAlbumOpen(false); },
      onError: () => error("Erreur lors de la création de l'album"),
    });
  };

  const handleAddImages = (albumId: string, images: File[]) => {
    addImagesMutation.mutate({ eventId: event.id, albumId, images }, {
      onSuccess: () => success('Photos ajoutées'),
      onError: () => error("Erreur lors de l'ajout des photos"),
    });
  };

  const handleRenameAlbum = (albumId: string, title: string) => {
    renameAlbumMutation.mutate({ eventId: event.id, albumId, title }, {
      onSuccess: () => success('Album renommé'),
      onError: () => error('Erreur lors du renommage'),
    });
  };

  const handleDeleteAlbum = async (albumId: string) => {
    const ok = await confirm({
      title: 'Supprimer cet album ?',
      message: 'Toutes les photos de cet album seront supprimées définitivement.',
      confirmText: 'Supprimer', cancelText: 'Annuler', confirmColor: 'danger',
    });
    if (ok) deleteAlbumMutation.mutate({ eventId: event.id, albumId }, {
      onSuccess: () => success('Album supprimé'),
      onError: () => error("Erreur lors de la suppression de l'album"),
    });
  };

  const handleDeleteMedia = (albumId: string, mediaId: string) => {
    deleteMediaMutation.mutate({ eventId: event.id, albumId, mediaId }, {
      onSuccess: () => success('Photo supprimée'),
      onError: () => error('Erreur lors de la suppression'),
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Breadcrumb */}
      <button onClick={() => navigate('/admin/evenements')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={14} /> Retour aux événements
      </button>

      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {cover && <div className="h-56 w-full overflow-hidden"><img src={cover} alt="" className="w-full h-full object-cover" /></div>}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{event.title}</h1>
            <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[event.status]}`}>
              {STATUS_ICONS[event.status]} {STATUS_LABELS[event.status]}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1.5"><Calendar size={13} className="text-gray-400" />
              {new Date(event.eventDate).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" />{event.location}</span>
            <span className="flex items-center gap-1.5"><FolderOpen size={13} className="text-gray-400" />{event.albums?.length ?? 0} album{(event.albums?.length ?? 0) !== 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1.5"><Images size={13} className="text-gray-400" />{totalPhotos} photo{totalPhotos !== 1 ? 's' : ''}</span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-5">{event.description}</p>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            <button onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors">
              <Pencil size={14} /> Modifier
            </button>
            <button onClick={() => setAddAlbumOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors">
              <Plus size={14} /> Nouvel album
            </button>
            <button onClick={handleDelete} disabled={deleteMutation.isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 ml-auto">
              <Trash2 size={14} /> Supprimer l'événement
            </button>
          </div>
        </div>
      </div>

      {/* Albums */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <FolderOpen size={15} className="text-indigo-500" /> Albums ({event.albums?.length ?? 0})
          </h2>
        </div>

        {!event.albums?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-300 bg-white rounded-2xl border border-gray-100">
            <FolderOpen size={36} className="mb-2" />
            <p className="text-sm mb-3">Aucun album pour cet événement</p>
            <button onClick={() => setAddAlbumOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
              <Plus size={14} /> Créer le premier album
            </button>
          </div>
        ) : (
          event.albums.map((album) => (
            <AlbumSection key={album.id} album={album} eventId={event.id}
              onAddImages={handleAddImages} onRename={handleRenameAlbum}
              onDelete={handleDeleteAlbum} onDeleteMedia={handleDeleteMedia}
              isAddingImages={addImagesMutation.isPending}
              isDeletingAlbum={deleteAlbumMutation.isPending}
              isDeletingMedia={deleteMediaMutation.isPending}
            />
          ))
        )}
      </div>

      {editOpen && <EditEventModal event={event} isPending={updateMutation.isPending} onClose={() => setEditOpen(false)} onSubmit={handleUpdate} />}
      {addAlbumOpen && <AddAlbumModal isPending={addAlbumMutation.isPending} onClose={() => setAddAlbumOpen(false)} onSubmit={handleAddAlbum} />}
      {isOpen && options && <ConfirmDialog {...options} onConfirm={handleConfirm} onCancel={handleCancel} />}
    </div>
  );
}
