import { createContext, useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiRequest("/readers/");
      setUser(data.reader ?? data.user ?? data.data);
      return data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUser();
  }, [refreshUser]);

  async function login(username, password) {
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          reader_user_name: username,
          reader_password: password,
        }),
      });

      if (data.reader || data.user) {
        setUser(data.reader ?? data.user);
      } else {
        await refreshUser();
      }

      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Login failed";
    }
  }

  async function logout() {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
