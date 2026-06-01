import { useState } from 'react';
import { Share2, Link, Check, Facebook, Twitter, MessageCircle } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  /** Affichage compact (icône seule) ou avec label */
  compact?: boolean;
}

export default function ShareButton({ title, text, url, compact = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareUrl = url ?? window.location.href;
  const shareText = text ?? title;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
      } catch {
        // L'utilisateur a annulé — pas d'erreur à afficher
      }
      return;
    }
    setOpen((v) => !v);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 2000);
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ${compact ? 'p-2 rounded-full hover:bg-muted' : 'text-sm font-medium'}`}
        aria-label="Partager"
        title="Partager"
      >
        <Share2 size={compact ? 16 : 18} />
        {!compact && <span>Partager</span>}
      </button>

      {/* Dropdown fallback (si Web Share API non disponible) */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-card rounded-2xl shadow-xl border border-border p-2 min-w-[180px]">
            <button onClick={shareOnFacebook} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
              <Facebook size={16} className="text-blue-600" /> Facebook
            </button>
            <button onClick={shareOnTwitter} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
              <Twitter size={16} className="text-sky-500" /> Twitter / X
            </button>
            <button onClick={shareOnWhatsApp} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
              <MessageCircle size={16} className="text-green-500" /> WhatsApp
            </button>
            <div className="border-t border-border my-1" />
            <button onClick={copyLink} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
              {copied ? <Check size={16} className="text-primary" /> : <Link size={16} className="text-muted-foreground" />}
              {copied ? 'Lien copié !' : 'Copier le lien'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
