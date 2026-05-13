import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AuthUser,
  getCurrentUser,
  login,
  loginWithGoogle,
  register,
  LoginPayload,
  RegisterPayload,
} from '../api/auth';

const TOKEN_STORAGE_KEY = 'token';

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithEmail: (payload: LoginPayload) => Promise<void>;
  registerWithEmail: (payload: RegisterPayload) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback((nextUser: AuthUser, token: string) => {
    // Le backend reste la source de verite. Le front garde seulement le token
    // d'acces pour authentifier les prochains appels API.
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (isMounted) setUser(currentUser);
      } catch {
        // Token expire, supprime ou falsifie: on nettoie localement pour eviter
        // une boucle de requetes 401 difficile a debugger.
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const loginWithEmail = useCallback(
    async (payload: LoginPayload) => {
      const result = await login(payload);
      persistSession(result.user, result.token);
    },
    [persistSession],
  );

  const registerWithEmail = useCallback(
    async (payload: RegisterPayload) => {
      const result = await register(payload);
      persistSession(result.user, result.token);
    },
    [persistSession],
  );

  const signInWithGoogle = useCallback(
    async (idToken: string) => {
      const result = await loginWithGoogle(idToken);
      persistSession(result.user, result.token);
    },
    [persistSession],
  );

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      loginWithEmail,
      registerWithEmail,
      signInWithGoogle,
      logout,
    }),
    [isLoading, loginWithEmail, logout, registerWithEmail, signInWithGoogle, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit etre utilise dans AuthProvider.');
  }
  return context;
}
