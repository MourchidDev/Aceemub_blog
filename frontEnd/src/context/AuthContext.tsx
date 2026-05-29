import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, type LoginPayload, type RegisterPayload } from "@/api/auth";
import type { AuthUser } from "@/types";

const TOKEN_KEY = "token";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithEmail: (p: LoginPayload) => Promise<void>;
  registerWithEmail: (p: RegisterPayload) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persist = useCallback((nextUser: AuthUser, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    let mounted = true;
    authApi
      .me()
      .then((u) => mounted && setUser(u))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        if (mounted) setUser(null);
      })
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const loginWithEmail = useCallback(
    async (p: LoginPayload) => {
      const r = await authApi.login(p);
      persist(r.user, r.token);
    },
    [persist],
  );
  const registerWithEmail = useCallback(
    async (p: RegisterPayload) => {
      const r = await authApi.register(p);
      persist(r.user, r.token);
    },
    [persist],
  );
  const signInWithGoogle = useCallback(
    async (idToken: string) => {
      const r = await authApi.loginWithGoogle(idToken);
      persist(r.user, r.token);
    },
    [persist],
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
    [user, isLoading, loginWithEmail, registerWithEmail, signInWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}
