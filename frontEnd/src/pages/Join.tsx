import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { membershipApi } from "@/api";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import Loader from "@/components/Loader";



const STEPS = ["Identité", "Études", "Photo"] as const;

function JoinPage() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    school: "", level: "Licence 1", city: "Cotonou",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setSubmitting(true);
    try {
      const card = await membershipApi.apply({ ...form, photo });
      toast.success("Adhésion envoyée !");
      nav(`/membre/${card.id}`);
    } catch {
      toast.error("Impossible d'envoyer la demande. Réessaie plus tard.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) return <Loader isLoading={true} />;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Rejoindre"
        title="Devenir membre de l'ACEEMUB "
        description="Trois étapes simples pour rejoindre la fraternité."
      />

      <div className="px-5">
        <div className="mb-5 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${
                i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>{i + 1}</span>
              <span className={`text-xs font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Prénom" v={form.firstName} on={(v) => set("firstName", v)} />
              <F label="Nom" v={form.lastName} on={(v) => set("lastName", v)} />
              <F label="Email" type="email" v={form.email} on={(v) => set("email", v)} />
              <F label="Téléphone" v={form.phone} on={(v) => set("phone", v)} />
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Établissement" v={form.school} on={(v) => set("school", v)} />
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Niveau</label>
                <select
                  value={form.level}
                  onChange={(e) => set("level", e.target.value)}
                  className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm"
                >
                  {["Lycée", "Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2", "Doctorat"].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <F label="Ville" v={form.city} on={(v) => set("city", v)} />
            </div>
          )}
          {step === 2 && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Photo (optionnel)</label>
              <input
                type="file" accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                className="mt-2 block w-full rounded-2xl border border-dashed border-border bg-background p-4 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground"
              />
              <p className="mt-3 text-sm text-muted-foreground">
                Ta photo apparaîtra sur ta carte de membre digitale.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-medium disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
              >
                Suivant <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-foreground px-5 text-sm font-medium text-background disabled:opacity-50"
              >
                {submitting ? "Envoi…" : "Envoyer mon adhésion"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function F({ label, v, on, type = "text" }: { label: string; v: string; on: (s: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type} value={v} onChange={(e) => on(e.target.value)}
        className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none"
      />
    </div>
  );
}

export default JoinPage;
