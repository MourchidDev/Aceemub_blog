import { useState } from "react";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { contactApi } from "@/api";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";



function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await contactApi.send(form);
      toast.success("Message envoyé. Nous te répondrons rapidement.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Envoi impossible. Réessaie plus tard.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Contact"
        title="Écris-nous"
        description="Une question, une suggestion, un partenariat ? L'équipe te répond."
      />

      <div className="grid gap-5 px-5 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom complet" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field type="email" label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          </div>
          <div className="mt-4">
            <Field label="Sujet" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} required />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Message</label>
            <textarea
              required rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> {sending ? "Envoi…" : "Envoyer le message"}
          </button>
        </form>

        <aside className="space-y-3">
          {[
            { icon: MapPin, label: "Siège", value: "Cotonou, Bénin" },
            { icon: Phone, label: "Téléphone", value: "+229 00 00 00 00" },
            { icon: Mail, label: "Email", value: "contact@ACEEMUB .org" },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
              <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <c.icon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{c.label}</div>
                <div className="font-medium">{c.value}</div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none"
      />
    </div>
  );
}

export default ContactPage;
