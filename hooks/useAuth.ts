// Andiamo/hooks/useAuth.ts
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext"; // Pastikan path benar
import { AuthContextType } from "../types"; // Pastikan path benar

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
