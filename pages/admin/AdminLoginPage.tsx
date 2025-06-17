import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; 
import { User } from "../../types";
import {
  APP_NAME,
  PRIMARY_COLOR,
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  TEXT_COLOR,
} from "../../constants";
import apiClient from '../../src/api/axios'; 
import axios from 'axios';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [auth.isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsSubmitting(true);

  const backendUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '');

  try {
    // 1. Meminta Cookie CSRF (ini tetap sama)
    await axios.get(`${backendUrl}/sanctum/csrf-cookie`, { withCredentials: true });
    console.log("Frontend: CSRF cookie request sent.");

    // ==================== PERUBAHAN KUNCI DI SINI ====================
    // Kita memanggil endpoint /login, BUKAN /api/admin/login.
    // Kita menggunakan axios langsung agar tidak terkena prefix /api dari apiClient.
    const response = await axios.post(`${backendUrl}/login`, 
      { email, password },
      { 
        withCredentials: true,
        headers: {
          'Accept': 'application/json' // Penting agar Fortify merespons dengan JSON
        }
      }
    );
    // ================================================================
    
    // Jika login berhasil (status 200), ambil data user dan lanjutkan
    if (response.status === 200) {
      // Kita perlu mengambil data user dari endpoint lain setelah login
      // apiClient di sini sudah benar karena /user ada di bawah prefix /api
      const userResponse = await apiClient.get('/user');
      await auth.login(null, userResponse.data); // Login tanpa token
      navigate(from, { replace: true });
    } else {
      throw new Error("Login gagal dengan status tak terduga.");
    }

  } catch (err: any) {
    console.error("Login error:", err);
    const responseData = err.response?.data;
    let errorMessage = "Terjadi kesalahan saat login.";
    
    if (err.response?.status === 422 && responseData.errors) {
      // Fortify mengembalikan error validasi
      const validationErrors = Object.values(responseData.errors).flat().join(" ");
      errorMessage = validationErrors;
    } else {
      // Untuk error login lainnya (401, 404, dll)
      errorMessage = "Email atau password yang Anda masukkan salah.";
    }
    
    setError(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-8">
        <div
          style={{ backgroundColor: PRIMARY_COLOR }}
          className="p-3 rounded-lg inline-block"
        >
          <h1 className="font-poppins text-4xl font-bold text-black">
            {APP_NAME}
          </h1>
        </div>
        <p className="text-center text-xl font-semibold text-black mt-2">
          Admin Panel
        </p>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="font-poppins text-2xl font-bold text-center text-black mb-6">
          Login Admin
        </h2>
        {error && (
          <p className="mb-4 text-center text-red-500 bg-red-100 p-3 rounded-md font-inter">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 font-inter"
            >
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm font-inter"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 font-inter"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm font-inter"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors duration-300 font-inter disabled:opacity-70"
              style={{
                backgroundColor: BUTTON_COLOR,
                color: BUTTON_TEXT_COLOR,
              }}
            >
              {isSubmitting ? "Memproses..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;