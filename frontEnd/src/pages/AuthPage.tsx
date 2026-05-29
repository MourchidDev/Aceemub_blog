import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import logo from "@/assets/logo-aceemub.png";
import hero from "@/assets/hero-student.jpg";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import Loader from "@/components/Loader";

export default function AuthPage() {
  return <AuthScreen mode="login" />;
}


const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? "";

declare global {
  interface Window {
    google?: any;
  }
}

function loadGsi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("ssr"));
    if (window.google?.accounts?.id) return resolve();
    const existing = document.querySelector<HTMLScriptElement>('script[data-gsi="1"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.dataset.gsi = "1";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("gsi-load"));
    document.head.appendChild(s);
  });
}

export function AuthScreen({ mode }: { mode: "login" | "register" }) {
  const nav = useNavigate();
  const { loginWithEmail, registerWithEmail, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const isLogin = mode === "login";

  // Render the official Google button when client id is set
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleBtnRef.current) return;
    let cancelled = false;
    loadGsi()
      .then(() => {
        if (cancelled || !googleBtnRef.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (resp: { credential: string }) => {
            try {
              await signInWithGoogle(resp.credential);
              toast.success("Bienvenue !");
              nav("/");
            } catch {
              toast.error("Connexion Google impossible.");
            }
          },
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: isLogin ? "signin_with" : "signup_with",
          width: 320,
        });
      })
      .catch(() => {
        /* silencieux — fallback bouton visuel */
      });
    return () => {
      cancelled = true;
    };
  }, [signInWithGoogle, nav, isLogin]);

  const handleGoogleFallback = async () => {
    if (!GOOGLE_CLIENT_ID) {
      toast.error("Connexion Google non configurée (VITE_GOOGLE_CLIENT_ID manquant).");
      return;
    }
    try {
      await loadGsi();
      window.google?.accounts.id.prompt();
    } catch {
      toast.error("Impossible de charger Google.");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) await loginWithEmail({ email: form.email, password: form.password });
      else await registerWithEmail(form);
      toast.success(isLogin ? "Bienvenue !" : "Compte créé.");
      nav("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Identifiants invalides ou erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader isLoading={true} />;

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-muted/30 px-3 py-4 md:px-8 md:py-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-card md:grid-cols-2">
        {/* LEFT visual panel */}
        <aside className="relative hidden min-h-[560px] overflow-hidden md:block">
          <img
            src={hero}
            alt="Étudiants musulmans du Bénin"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/40 to-foreground/70" />
          <div className="absolute inset-0 pattern-chevrons opacity-15" />

          <div className="relative flex h-full flex-col justify-between p-8 text-primary-foreground">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Espace membre
              </span>
              <div className="inline-flex gap-2 rounded-full bg-background/15 p-1 text-xs backdrop-blur">
                <Link
                  to="/connexion"
                  className={`rounded-full px-4 py-1.5 transition ${
                    isLogin ? "bg-background text-foreground" : "text-primary-foreground/90"
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className={`rounded-full px-4 py-1.5 transition ${
                    !isLogin ? "bg-background text-foreground" : "text-primary-foreground/90"
                  }`}
                >
                  Inscription
                </Link>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-4xl leading-tight lg:text-5xl">
                {isLogin
                  ? "Reprends ta lecture, retrouve ta communauté."
                  : "Rejoins une génération savante, engagée et utile."}
              </h2>
              <p className="mt-3 max-w-md text-sm text-primary-foreground/85">
                Articles, événements, annonces et carte de membre — tout l'univers
                ACEEMUB dans un espace dédié.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-background/15 backdrop-blur">
                  <img src={logo} alt="" className="h-7 w-7 object-contain" />
                </div>
                <div>
                  <p className="text-sm font-semibold">ACEEMUB</p>
                  <p className="text-xs text-primary-foreground/80">
                    Élèves &amp; étudiants musulmans du Bénin
                  </p>
                </div>
              </div>
              <Link
                to="/"
                aria-label="Retour"
                className="grid h-10 w-10 place-items-center rounded-full bg-background/15 backdrop-blur transition hover:bg-background/25"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>

        {/* RIGHT form panel */}
        <section className="flex flex-col px-5 py-8 sm:px-10 sm:py-12">
          <header className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="ACEEMUB" className="h-9 w-9 object-contain" />
              <span className="font-serif text-lg">ACEEMUB</span>
            </Link>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              FR
            </span>
          </header>

          <div className="mx-auto mt-10 w-full max-w-sm flex-1">
            <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
              {isLogin ? "Bon retour" : "Bienvenue"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin
                ? "Connecte-toi à ton espace ACEEMUB."
                : "Crée ton compte en une minute."}
            </p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              {!isLogin && (
                <Field
                  label="Nom complet"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  required
                  placeholder="Ex. Aïssatou Diallo"
                />
              )}
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
                placeholder="prenom@exemple.com"
              />
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Mot de passe
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    required
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-12 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? "Masquer" : "Afficher"}
                    className="absolute inset-y-0 right-3 my-auto grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {isLogin && (
                  <div className="mt-2 text-right">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info("Contacte l'équipe pour réinitialiser ton mot de passe.");
                      }}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "…" : isLogin ? "Se connecter" : "Créer mon compte"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              ou
              <span className="h-px flex-1 bg-border" />
            </div>

            {/* Google */}
            <div className="flex flex-col items-center gap-3">
              <div ref={googleBtnRef} className="min-h-[40px]" />
              {!GOOGLE_CLIENT_ID && (
                <button
                  type="button"
                  onClick={handleGoogleFallback}
                  className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-background text-sm font-medium hover:bg-muted"
                >
                  <GoogleIcon />
                  Continuer avec Google
                </button>
              )}
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {isLogin ? (
                <>
                  Pas encore de compte ?{" "}
                  <Link to="/inscription" className="font-semibold text-primary hover:underline">
                    Créer un compte
                  </Link>
                </>
              ) : (
                <>
                  Déjà membre ?{" "}
                  <Link to="/connexion" className="font-semibold text-primary hover:underline">
                    Se connecter
                  </Link>
                </>
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.8 29 5 24 5 16.3 5 9.7 9.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 43c5 0 9.5-1.9 12.9-5l-6-4.9c-2 1.4-4.4 2.2-6.9 2.2-5.3 0-9.7-3.1-11.3-7.4l-6.5 5C9.5 38.7 16.2 43 24 43z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6 4.9c-.4.4 6.5-4.7 6.5-14.6 0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
