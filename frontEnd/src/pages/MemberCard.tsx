import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { Camera, Download, QrCode } from 'lucide-react';
import { membershipApi } from '../api/forms';
import { useAuth } from '../context/AuthContext';
import { MembershipCard } from '../types';
import appLogo from '../assets/ac.png';
import beninLogo from '../assets/benin-logo.png';

export default function MemberCardPage() {
  const { id } = useParams();
  const location = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [card, setCard] = useState<MembershipCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isAuthLoading || !isAuthenticated) return;

    membershipApi
      .get(id)
      .then((memberCard) => {
        setCard(memberCard);
        setError(null);
      })
      .catch(() => setError('Carte membre introuvable.'))
      .finally(() => setIsLoading(false));
  }, [id, isAuthenticated, isAuthLoading]);

  const memberSince = useMemo(() => {
    if (!card) return '';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(card.createdAt));
  }, [card]);

  if (isAuthLoading) {
    return <main className="min-h-screen bg-aemb-cream pt-32 text-center text-aemb-green">Chargement...</main>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace state={{ from: location }} />;
  }

  if (isLoading) {
    return <main className="min-h-screen bg-aemb-cream pt-32 text-center text-aemb-green">Chargement...</main>;
  }

  if (error || !card) {
    return (
      <main className="min-h-screen bg-aemb-cream px-6 pt-32 text-center">
        <h1 className="font-serif text-3xl font-bold text-aemb-green">Carte introuvable</h1>
        <p className="mt-3 text-slate-600">{error}</p>
        <Link to="/" className="mt-8 inline-flex font-bold text-aemb-green underline">
          Retour a l'accueil
        </Link>
      </main>
    );
  }

  const fullName = `${card.firstName} ${card.lastName}`.trim();

  return (
    <main className="min-h-screen bg-aemb-cream px-6 py-32">
      <section className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-2xl shadow-emerald-950/10">
        <div className="grid grid-cols-[72px_1fr_72px] items-center gap-4 bg-aemb-green px-8 py-6 text-white">
          <img src={beninLogo} alt="Logo du gouvernement beninois" className="h-16 w-16 object-contain" />
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">ACEEMUB Benin</p>
            <h1 className="mt-2 font-serif text-3xl font-bold">Verification carte membre</h1>
          </div>
          <img src={appLogo} alt="Logo ACEEMUB" className="h-16 w-16 object-contain" />
        </div>

        <div className="grid gap-8 p-8 sm:grid-cols-[140px_1fr_auto] sm:items-center">
          <div className="h-36 w-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {card.photoDataUrl ? (
              <img src={card.photoDataUrl} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <Camera size={36} />
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-aemb-gold">{card.memberNumber}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{fullName}</h2>
            <p className="mt-3 font-medium text-slate-700">{card.school}</p>
            <p className="text-sm text-slate-500">
              {card.level} - {card.city}
            </p>
            <p className="mt-4 font-semibold text-aemb-green">Membre depuis le {memberSince}</p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-center">
            <img src={card.qrCode} alt="QR Code" className="h-28 w-28 rounded-md bg-white" />
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <QrCode size={14} />
              Valide
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 p-8">
          {downloadError && (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {downloadError}
            </p>
          )}
          <button
            type="button"
            disabled={isDownloading}
            onClick={async () => {
              try {
                setIsDownloading(true);
                setDownloadError(null);
                await membershipApi.downloadPdf(card);
              } catch {
                setDownloadError("Le telechargement de la carte n'a pas pu aboutir.");
              } finally {
                setIsDownloading(false);
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-aemb-green px-5 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDownloading ? 'Preparation du PDF...' : 'Telecharger le PDF'} <Download size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
