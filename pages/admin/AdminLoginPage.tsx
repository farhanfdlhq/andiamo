import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; //
import { User } from "../../types"; //
import {
  APP_NAME,
  PRIMARY_COLOR,
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  TEXT_COLOR,
} from "../../constants"; //

// Helper function untuk membaca cookie
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState(""); //
  const [password, setPassword] = useState(""); //
  const [error, setError] = useState(""); //
  const [isSubmitting, setIsSubmitting] = useState(false); //
  const auth = useAuth(); //
  const navigate = useNavigate(); //
  const location = useLocation(); //

  const from = location.state?.from?.pathname || "/admin/dashboard"; //

  useEffect(() => {
    if (auth.isAuthenticated) { //
      navigate(from, { replace: true }); //
    }
  }, [auth.isAuthenticated, navigate, from]); //

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //
    setError(""); //
    setIsSubmitting(true); //

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; //
    if (!apiBaseUrl) { //
      setError("Konfigurasi API tidak ditemukan."); //
      setIsSubmitting(false); //
      return; //
    }

    const xsrfToken = getCookie('XSRF-TOKEN'); // Ambil nilai cookie XSRF-TOKEN

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json", //
        "Accept": "application/json", //
      };

      if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
        console.log("Frontend: XSRF Token found in cookie and added to headers:", xsrfToken);
      } else {
        console.warn("Frontend: XSRF-TOKEN cookie not found. Proceeding without X-XSRF-TOKEN header.");
      }

      const response = await fetch(`${apiBaseUrl}/admin/login`, { //
        method: "POST", //
        headers: headers,
        body: JSON.stringify({ email, password }), //
        credentials: 'include', //
      });

      const data = await response.json(); //

      if (!response.ok) { //
        let errorMessage = data.message || `Login gagal. Status: ${response.status}`; //
        if (response.status === 419) { //
          errorMessage = "Sesi login mungkin telah berakhir atau ada masalah validasi (CSRF). Silakan coba muat ulang halaman dan login lagi. Pastikan cookie XSRF-TOKEN ada dan header X-XSRF-TOKEN terkirim."; //
        } else if (data.errors) { //
          const validationErrors = Object.values(data.errors).flat().join(" "); //
          errorMessage += ` Detail: ${validationErrors}`; //
        }
        throw new Error(errorMessage); //
      }

      if (data.token && data.user) { //
        await auth.login(data.token, data.user as User); //
        navigate(from, { replace: true }); //
      } else { //
        throw new Error("Respon login tidak valid dari server."); //
      }
    } catch (err) { //
      setError( //
        err instanceof Error ? err.message : "Terjadi kesalahan saat login." //
      );
    } finally { //
      setIsSubmitting(false); //
    }
  };

  return (
    // ... sisa JSX tidak berubah ...
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
              style={{
                borderColor: error ? "rgb(239 68 68)" : PRIMARY_COLOR,
                ringColor: error ? "rgb(239 68 68)" : PRIMARY_COLOR,
              }}
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
              style={{
                borderColor: error ? "rgb(239 68 68)" : PRIMARY_COLOR,
                ringColor: error ? "rgb(239 68 68)" : PRIMARY_COLOR,
              }}
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
            <Link
              to="/"
              className="w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors duration-300 font-inter"
              style={{
                borderColor: TEXT_COLOR,
                color: TEXT_COLOR,
                backgroundColor: "white",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f0f0";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Kembali ke Beranda
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;