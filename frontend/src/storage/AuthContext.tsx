import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
  type AuthSession,
} from "./auth";
import {
  setAccessToken,
  setRefreshToken,
  setOnLogout,
  setOnRefreshSuccess,
  logout as apiLogout,
  type AuthSuccessResponse,
} from "../services/api";

type AuthContextType = {
  session: AuthSession | null;
  booting: boolean;
  login: (auth: AuthSuccessResponse) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [booting, setBooting] = useState(true);

  const doLogout = useCallback(async () => {
    await clearAuthSession();
    setAccessToken(null);
    setRefreshToken(null);
    setSession(null);
  }, []);

  useEffect(() => {
    let alive = true;
    getAuthSession()
      .then((stored) => {
        if (!alive) return;
        setSession(stored);
        setAccessToken(stored?.access_token ?? null);
        setRefreshToken(stored?.refresh_token ?? null);
      })
      .finally(() => {
        if (!alive) return;
        setBooting(false);
      });

    setOnLogout(() => {
      clearAuthSession().then(() => {
        setAccessToken(null);
        setRefreshToken(null);
        setSession(null);
      });
    });

    setOnRefreshSuccess(({ access_token, refresh_token }) => {
      getAuthSession().then((current) => {
        if (!current) return;
        const updated: AuthSession = {
          ...current,
          access_token,
          ...(refresh_token ? { refresh_token } : {}),
        };
        saveAuthSession(updated);
        setSession(updated);
      });
    });

    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async (auth: AuthSuccessResponse) => {
    const next: AuthSession = {
      access_token: auth.access_token,
      refresh_token: auth.refresh_token,
      token_type: auth.token_type,
      user: auth.user,
    };
    await saveAuthSession(next);
    setAccessToken(next.access_token);
    setRefreshToken(next.refresh_token ?? null);
    setSession(next);
  }, []);

  const logout = useCallback(async () => {
    const current = await getAuthSession();
    try {
      await apiLogout(current?.refresh_token);
    } catch {
      // ignore — revoke best-effort
    }
    await doLogout();
  }, [doLogout]);

  return (
    <AuthContext.Provider value={{ session, booting, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
