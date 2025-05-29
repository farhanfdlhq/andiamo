import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User, AuthContextType, AdminSettings } from "../types";
import { getItem, removeItem, setItem } from "../utils/localStorage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  settings: AdminSettings | null;
  fetchSettings: () => Promise<void>;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchSettings = useCallback(async () => {
    if (apiBaseUrl && token) {
      try {
        const response = await fetch(`${apiBaseUrl}/admin/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    }
  }, [apiBaseUrl, token]);

  useEffect(() => {
    const storedToken = getItem<string>(AUTH_TOKEN_KEY);
    const storedUser = getItem<User>(USER_DATA_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setIsAuthenticated(true);
      console.log("AuthContext: Token & user loaded from localStorage");
    } else {
      console.log("AuthContext: No token/user in localStorage or parse failed");
    }
    setIsLoading(false);
    fetchSettings();
  }, [fetchSettings]);

  const login = (newToken: string, userData: User) => {
    setItem(AUTH_TOKEN_KEY, newToken);
    setItem(USER_DATA_KEY, userData);
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    if (apiBaseUrl && token) {
      try {
        await fetch(`${apiBaseUrl}/admin/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } catch (error) {
        console.error("Error calling logout API:", error);
      }
    }

    removeItem(AUTH_TOKEN_KEY);
    removeItem(USER_DATA_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setSettings(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
        isLoading,
        settings,
        fetchSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
