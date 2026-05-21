import React, { useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { motion } from 'motion/react';
import {
  Camera,
  CheckCircle2,
  Download,
  GraduationCap,
  Heart,
  Loader2,
  QrCode,
  Send,
  Star,
  Users,
} from 'lucide-react';
import { membershipApi } from '../api/forms';
import { useAuth } from '../context/AuthContext';
import { MembershipCard, MembershipPayload } from '../types';
import appLogo from '../assets/ac.png';
import beninLogo from '../assets/benin-logo.png';

const initialForm: MembershipPayload = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  school: '',
  level: 'Eleve (Secondaire)',
  city: '',
  photo: null,
};

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === 'string') return apiMessage;
  }
  return "Impossible d'envoyer votre demande pour le moment.";
}

function MemberBadge({ card }: { card: MembershipCard }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const fullName = `${card.firstName} ${card.lastName}`.trim();
  const memberSince = useMemo(
    () =>
      new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(card.createdAt)),
    [card.createdAt],
  );

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/10">
        <div className="grid grid-cols-[112px_1fr_92px] items-center gap-4 bg-aemb-green px-6 py-6 text-white">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-white/95 shadow-sm">
            <img
              src={beninLogo}
              alt="Logo du gouvernement beninois"
              className="h-full w-full translate-y-8 scale-[2.15] object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold uppercase tracking-[0.18em] text-amber-200">ACEEMUB Benin</p>
            <h3 className="mt-1 font-serif text-3xl font-bold">Carte membre</h3>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white/95 p-2 shadow-sm">
            <img src={appLogo} alt="Logo ACEEMUB" className="h-full w-full object-contain" />
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-[120px_1fr_auto] sm:items-center">
          <div className="h-32 w-28 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {card.photoDataUrl ? (
              <img src={card.photoDataUrl} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <Camera size={32} />
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-aemb-gold">Matricule</p>
            <p className="mt-1 text-sm font-extrabold uppercase tracking-[0.12em] text-aemb-green">{card.memberNumber}</p>
            <h4 className="mt-2 text-2xl font-bold text-slate-950">{fullName}</h4>
            <p className="mt-2 text-sm font-medium text-slate-600">{card.school}</p>
            <p className="text-sm text-slate-500">
              {card.level} - {card.city}
            </p>
            <p className="mt-4 text-sm font-semibold text-aemb-green">Membre depuis le {memberSince}</p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-center">
            <img src={card.qrCode} alt="QR Code de verification" className="h-28 w-28 rounded-md bg-white" />
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <QrCode size={14} />
              Verification
            </span>
          </div>
        </div>
      </div>

      {downloadError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{downloadError}</p>
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
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-aemb-green px-5 py-4 font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDownloading ? 'Preparation du PDF...' : 'Telecharger ma carte membre'} <Download size={18} />
      </button>
    </motion.div>
  );
}

export default function JoinPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [form, setForm] = useState<MembershipPayload>(initialForm);
  const [card, setCard] = useState<MembershipCard | null>(null);
  const [hasExistingCard, setHasExistingCard] = useState(false);
  const [isCheckingCard, setIsCheckingCard] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photoPreview = useMemo(() => {
    if (!form.photo) return null;
    return URL.createObjectURL(form.photo);
  }, [form.photo]);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentMemberCard() {
      if (isAuthLoading) return;

      if (!isAuthenticated) {
        setIsCheckingCard(false);
        return;
      }

      try {
        const currentCard = await membershipApi.getMine();
        if (!isMounted) return;
        setCard(currentCard);
        setHasExistingCard(Boolean(currentCard));
      } catch {
        if (isMounted) setError("Impossible de verifier votre carte membre pour le moment.");
      } finally {
        if (isMounted) setIsCheckingCard(false);
      }
    }

    loadCurrentMemberCard();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isAuthLoading]);

  useEffect(() => {
    if (!user) return;

    const nameParts = user.name.trim().split(/\s+/);
    const firstName = nameParts.slice(0, -1).join(' ') || user.name;
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

    setForm((current) => ({
      ...current,
      email: current.email || user.email,
      firstName: current.firstName || firstName,
      lastName: current.lastName || lastName,
    }));
  }, [user]);

  function updateField(field: keyof MembershipPayload, value: string | File | null) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const createdCard = await membershipApi.apply(form);
      setCard(createdCard);
      setHasExistingCard(false);
      setForm(initialForm);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pb-20 pt-24">
      <section className="relative overflow-hidden bg-emerald-900 py-24 text-white">
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-6 font-serif text-4xl font-bold md:text-6xl">Rejoignez l'ACEEMUB</h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-emerald-100">
              Devenez membre d'une communaute dynamique et engagee pour l'excellence et la fraternite.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 font-serif text-3xl font-bold">Pourquoi nous rejoindre ?</h2>
            <div className="space-y-8">
              {[
                {
                  icon: <GraduationCap />,
                  title: 'Accompagnement Academique',
                  desc: "Beneficiez de seances de tutorat, de conseils d'orientation et de partage d'experience avec vos aines.",
                },
                {
                  icon: <Heart />,
                  title: 'Epanouissement Spirituel',
                  desc: "Participez a des cercles d'etudes, des conferences et des moments de rappel pour nourrir votre foi.",
                },
                {
                  icon: <Users />,
                  title: 'Reseautage & Fraternite',
                  desc: "Integrez un reseau national d'etudiants et de professionnels musulmans partageant vos valeurs.",
                },
                {
                  icon: <Star />,
                  title: 'Developpement Personnel',
                  desc: 'Developpez vos soft skills, votre leadership et votre sens des responsabilites a travers nos projets.',
                },
              ].map((benefit) => (
                <div key={benefit.title} className="flex gap-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-aemb-green">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-bold">{benefit.title}</h4>
                    <p className="text-sm leading-relaxed text-slate-600">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-6 shadow-xl shadow-slate-200/50 md:p-10">
            {isCheckingCard ? (
              <div className="flex min-h-[320px] items-center justify-center text-aemb-green">
                <Loader2 size={24} className="mr-2 animate-spin" />
                Verification de votre carte...
              </div>
            ) : card ? (
              <div>
                <div className="mb-6 flex items-start gap-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-emerald-900">
                  <CheckCircle2 className="mt-0.5 flex-shrink-0" size={22} />
                  <div>
                    <h3 className="font-bold">
                      {hasExistingCard ? 'Vous avez deja une carte membre' : 'Demande enregistree !'}
                    </h3>
                    <p className="mt-1 text-sm">
                      {hasExistingCard
                        ? 'Vous pouvez telecharger votre carte membre a tout moment.'
                        : 'Votre carte membre a ete generee avec succes.'}
                    </p>
                  </div>
                </div>
                <MemberBadge card={card} />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="mb-6 font-serif text-2xl font-bold">Formulaire d'adhesion</h3>

                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nom</label>
                    <input
                      required
                      type="text"
                      value={form.lastName}
                      onChange={(event) => updateField('lastName', event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-5 py-3 focus:border-aemb-green focus:outline-none"
                      placeholder="Ex: Dupont"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Prenom</label>
                    <input
                      required
                      type="text"
                      value={form.firstName}
                      onChange={(event) => updateField('firstName', event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-5 py-3 focus:border-aemb-green focus:outline-none"
                      placeholder="Ex: Jean"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField('email', event.target.value)}
                      readOnly={isAuthenticated}
                      className="w-full rounded-xl border border-slate-200 px-5 py-3 focus:border-aemb-green focus:outline-none read-only:bg-slate-100 read-only:text-slate-500"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Telephone (WhatsApp)</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(event) => updateField('phone', event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-5 py-3 focus:border-aemb-green focus:outline-none"
                      placeholder="+229 ..."
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Etablissement</label>
                    <input
                      required
                      type="text"
                      value={form.school}
                      onChange={(event) => updateField('school', event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-5 py-3 focus:border-aemb-green focus:outline-none"
                      placeholder="Ex: UAC, ENEAM..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Ville / Section</label>
                    <input
                      required
                      type="text"
                      value={form.city}
                      onChange={(event) => updateField('city', event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-5 py-3 focus:border-aemb-green focus:outline-none"
                      placeholder="Ex: Abomey-Calavi"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-[1fr_160px]">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Niveau d'etudes</label>
                    <select
                      value={form.level}
                      onChange={(event) => updateField('level', event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 focus:border-aemb-green focus:outline-none"
                    >
                      <option>Eleve (Secondaire)</option>
                      <option>Etudiant (Licence)</option>
                      <option>Etudiant (Master)</option>
                      <option>Doctorant</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Photo</label>
                    <label className="flex h-[50px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-aemb-green hover:text-aemb-green">
                      <Camera size={18} />
                      Choisir
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => updateField('photo', event.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                </div>

                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Apercu de la photo"
                    className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
                  />
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-aemb-green py-4 font-bold text-white shadow-lg shadow-emerald-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer ma demande <Send size={18} />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400">
                  En soumettant ce formulaire, vous acceptez d'etre contacte par l'ACEEMUB pour finaliser votre adhesion.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
