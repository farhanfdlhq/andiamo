import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User, AdminSettings } from "../types";
import { getItem, removeItem, setItem } from "../utils/localStorage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  settings: AdminSettings | null;
  fetchSettings: (authToken?: string) => Promise<void>;
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

  // Fungsi fetchCsrfCookie telah dihapus karena tidak diperlukan untuk backend PHP Native Session

  const fetchSettingsInternal = useCallback(async (currentAuthToken: string | null) => {
    if (apiBaseUrl && currentAuthToken) {
      try {
        const response = await fetch(`${apiBaseUrl}/admin/settings`, {
          headers: {
            Authorization: `Bearer ${currentAuthToken}`,
            Accept: "application/json",
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
          console.log("Admin settings fetched successfully.");
        } else {
           console.error("Failed to fetch admin settings, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching admin settings:", error);
      }
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    const initializeAuth = async () => {
      // Pemanggilan fetchCsrfCookie telah dihapus dari sini

      const storedToken = getItem<string>(AUTH_TOKEN_KEY);
      const storedUser = getItem<User>(USER_DATA_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
        console.log("AuthContext: Token & user loaded from localStorage");
        await fetchSettingsInternal(storedToken);
      } else {
        console.log("AuthContext: No token/user in localStorage or parse failed");
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [fetchSettingsInternal]); // Dependensi fetchCsrfCookie dihapus

  const login = async (newToken: string, userData: User) => {
    setItem(AUTH_TOKEN_KEY, newToken);
    setItem(USER_DATA_KEY, userData);
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    await fetchSettingsInternal(newToken);
    console.log("User logged in, token and user data set in AuthContext.");
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
          credentials: 'include',
        });
        console.log("Logout API call successful.");
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
    console.log("User logged out, local storage cleared from AuthContext.");
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
        fetchSettings: () => fetchSettingsInternal(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;