import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User, AdminSettings } from "../types"; // Ambil AuthContextType dari sini jika sesuai
import { getItem, removeItem, setItem } from "../utils/localStorage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";

// Definisikan AuthContextType di sini agar konsisten dengan implementasi
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => Promise<void>; // Jadikan async
  logout: () => Promise<void>;
  isLoading: boolean;
  settings: AdminSettings | null;
  fetchSettings: (authToken?: string) => Promise<void>; // Terima token opsional
}

// Ambil BASE URL backend TANPA /api untuk CSRF cookie endpoint
const backendRootUrl = import.meta.env.VITE_API_BASE_URL?.replace("/api", "");

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchCsrfCookie = useCallback(async () => {
    if (!backendRootUrl) {
      console.error("Backend root URL for CSRF cookie is not configured.");
      return;
    }
    try {
      console.log("Attempting to fetch CSRF cookie from:", `${backendRootUrl}/sanctum/csrf-cookie`);
      await fetch(`${backendRootUrl}/sanctum/csrf-cookie`, {
        credentials: 'include', // Sangat penting!
      });
      console.log("CSRF cookie request sent successfully (expected 204).");
    } catch (error) {
      console.error("Error fetching CSRF cookie:", error);
    }
  }, []);

  const fetchSettingsInternal = useCallback(async (currentAuthToken: string | null) => {
    if (apiBaseUrl && currentAuthToken) {
      try {
        const response = await fetch(`${apiBaseUrl}/admin/settings`, {
          headers: {
            Authorization: `Bearer ${currentAuthToken}`,
            Accept: "application/json",
          },
          credentials: 'include', // Penting untuk request yang butuh otentikasi cookie/session
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
    } else if (!currentAuthToken) {
        // console.log("Cannot fetch settings: No token provided.");
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    const initializeAuth = async () => {
      await fetchCsrfCookie(); // PENTING: Panggil fetchCsrfCookie di sini

      const storedToken = getItem<string>(AUTH_TOKEN_KEY);
      const storedUser = getItem<User>(USER_DATA_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
        console.log("AuthContext: Token & user loaded from localStorage");
        await fetchSettingsInternal(storedToken); // Panggil fetchSettings setelah token di-load
      } else {
        console.log("AuthContext: No token/user in localStorage or parse failed");
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [fetchCsrfCookie, fetchSettingsInternal]);

  const login = async (newToken: string, userData: User) => {
    setItem(AUTH_TOKEN_KEY, newToken);
    setItem(USER_DATA_KEY, userData);
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    await fetchSettingsInternal(newToken); // Ambil settings setelah login dengan token baru
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
          credentials: 'include', // Penting jika logout memerlukan session/cookie
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
    // Opsional: Ambil token CSRF baru untuk form login berikutnya
    // await fetchCsrfCookie();
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
        fetchSettings: () => fetchSettingsInternal(token), // Sediakan fungsi fetchSettings ke consumer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;