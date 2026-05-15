import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authHeroImage from '../assets/auth-hero.jpg';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme: 'outline'; size: 'large'; width: number; text: 'signin_with' | 'signup_with' },
          ) => void;
        };
      };
    };
  }
}

type AuthMode = 'login' | 'register';

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === 'string') return apiMessage;
  }
  return "Une erreur est survenue. Verifiez vos informations puis reessayez.";
}

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEmail, registerWithEmail, signInWithGoogle, isAuthenticated } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === 'register';
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const title = useMemo(() => (isRegister ? 'Creer un compte' : 'Connexion'), [isRegister]);
  const redirectTo =
    typeof location.state === 'object' &&
    location.state &&
    'from' in location.state &&
    typeof location.state.from === 'object' &&
    location.state.from &&
    'pathname' in location.state.from &&
    typeof location.state.from.pathname === 'string'
      ? `${location.state.from.pathname}${'search' in location.state.from && typeof location.state.from.search === 'string' ? location.state.from.search : ''}`
      : '/';

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    // Debug OAuth: le client id n'est pas un secret. Cette trace permet de
    // verifier que Vite n'utilise pas encore une ancienne valeur du fichier .env.
    console.info('[ACEEMUB Auth] Google client id:', googleClientId);
    console.info('[ACEEMUB Auth] Browser origin:', window.location.origin);
  }, [googleClientId]);

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return;

    const scriptId = 'google-identity-services';
    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) return;

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response.credential) {
            setError('Google n a pas renvoye de jeton valide.');
            return;
          }

          try {
            setIsSubmitting(true);
            setError(null);
            await signInWithGoogle(response.credential);
            navigate(redirectTo, { replace: true });
          } catch (caughtError) {
            setError(getErrorMessage(caughtError));
          } finally {
            setIsSubmitting(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: isRegister ? 'signup_with' : 'signin_with',
      });
    };

    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);
  }, [googleClientId, isRegister, navigate, redirectTo, signInWithGoogle]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isRegister) {
        await registerWithEmail({ name, email, password });
      } else {
        await loginWithEmail({ email, password });
      }
      navigate(redirectTo, { replace: true });
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-aemb-cream pt-20">
      <section className="auth-shell grid w-full overflow-hidden bg-white shadow-2xl shadow-emerald-950/10 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="auth-visual relative min-h-[280px] overflow-hidden lg:min-h-full">
          <img
            src={authHeroImage}
            alt="Mere et enfant lisant ensemble"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/65 via-emerald-950/10 to-transparent lg:bg-gradient-to-r" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">ACEEMUB Benin</p>
            <h1 className="mt-3 max-w-md font-serif text-3xl font-bold sm:text-4xl">
              Grandir dans la foi, le savoir et la fraternite.
            </h1>
          </div>
        </div>

        <div className="auth-form-panel flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="mt-2 font-serif text-3xl font-bold text-aemb-green sm:text-4xl">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                {isRegister
                  ? 'Creez votre compte pour rejoindre la communaute.'
                  : 'Heureux de vous revoir. Connectez-vous pour continuer.'}
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Nom complet</span>
                  <span className="mt-1 flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2.5 transition focus-within:border-aemb-green focus-within:shadow-sm">
                    <UserRound size={18} className="text-gray-400" />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full outline-none"
                      minLength={2}
                      maxLength={80}
                      required
                      autoComplete="name"
                    />
                  </span>
                </label>
              )}

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="mt-1 flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2.5 transition focus-within:border-aemb-green focus-within:shadow-sm">
                  <Mail size={18} className="text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full outline-none"
                    required
                    autoComplete="email"
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Mot de passe</span>
                <span className="mt-1 flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2.5 transition focus-within:border-aemb-green focus-within:shadow-sm">
                  <Lock size={18} className="text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full outline-none"
                    minLength={isRegister ? 12 : 1}
                    required
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="text-gray-400 transition hover:text-aemb-green"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-aemb-green px-4 py-3 font-semibold text-white transition duration-300 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Traitement...' : title}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              ou
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {googleClientId ? (
              <div className="flex justify-center" ref={googleButtonRef} />
            ) : (
              <p className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Configurez VITE_GOOGLE_CLIENT_ID pour activer Google.
              </p>
            )}

            <p className="mt-8 text-center text-sm text-gray-600">
              {isRegister ? 'Deja inscrit ?' : 'Pas encore de compte ?'}{' '}
              <Link
                to={isRegister ? '/connexion' : '/inscription'}
                className="font-semibold text-aemb-green transition hover:text-aemb-gold"
              >
                {isRegister ? 'Se connecter' : 'Creer un compte'}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
