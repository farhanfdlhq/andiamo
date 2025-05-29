// Andiamo/pages/admin/AdminDashboardPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import {
  APP_NAME,
  PRIMARY_COLOR,
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
} from "../../constants";

interface DashboardSummary {
  totalBatches: number;
  activeBatches: number;
  closedBatches: number; // Pastikan backend mengirimkan field ini
}

const AdminDashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);

  const { token, isLoading: authIsLoading, logout: authLogout } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (authIsLoading) {
      setIsLoadingData(true);
      return;
    }
    if (!token) {
      setErrorData("Sesi tidak valid. Silakan login kembali.");
      setIsLoadingData(false);
      return;
    }
    if (apiBaseUrl && token && !authIsLoading) {
      const fetchSummary = async () => {
        setIsLoadingData(true);
        setErrorData(null);
        try {
          const response = await fetch(
            `${apiBaseUrl}/admin/dashboard-summary`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );
          if (!response.ok) {
            if (response.status === 401) {
              authLogout();
              throw new Error(
                `Sesi Anda sudah berakhir atau tidak valid. Silakan login kembali.`
              );
            }
            const errorResponseData = await response
              .json()
              .catch(() => ({
                message: `Gagal mengambil data summary: Status ${response.status}`,
              }));
            throw new Error(
              errorResponseData.message ||
                `Gagal mengambil data summary: Status ${response.status}`
            );
          }
          const data: DashboardSummary = await response.json();
          setSummary(data);
        } catch (err) {
          setErrorData(
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan saat mengambil summary."
          );
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchSummary();
    } else if (!apiBaseUrl) {
      setErrorData("Konfigurasi API URL tidak ditemukan.");
      setIsLoadingData(false);
    }
  }, [apiBaseUrl, token, authIsLoading, authLogout]);

  if (authIsLoading || isLoadingData) {
    return (
      <div className="flex justify-center items-center p-10 min-h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (errorData) {
    return (
      <div className="p-6 text-red-600 bg-red-100 rounded-md shadow">
        Error: {errorData}
      </div>
    );
  }

  const totalBatchesToDisplay = summary?.totalBatches ?? 0;
  const activeBatchesToDisplay = summary?.activeBatches ?? 0;
  const closedBatchesToDisplay = summary?.closedBatches ?? 0; // Ambil data batch ditutup

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <h1 className="font-poppins text-3xl font-bold text-black">
          Admin Dashboard
        </h1>
        {/* Tombol Aksi Cepat dipindahkan ke sini */}
        <Link
          to="/admin/batches/new"
          className="font-inter inline-block px-6 py-3 text-sm font-semibold rounded-lg transition-colors duration-300 text-center shadow-md hover:shadow-lg whitespace-nowrap"
          style={{
            backgroundColor: BUTTON_COLOR || "#1e40af",
            color: BUTTON_TEXT_COLOR || "white",
          }}
        >
          Buat Batch Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <h3 className="font-poppins text-xl font-semibold text-gray-800">
            Total Batch Orders
          </h3>
          <p
            className="font-inter text-4xl font-bold mt-2"
            style={{ color: PRIMARY_COLOR || "#2563eb" }}
          >
            {totalBatchesToDisplay}
          </p>
          <Link
            to="/admin/batches"
            className="text-sm hover:underline mt-4 block"
            style={{ color: PRIMARY_COLOR || "#2563eb" }}
          >
            Kelola Batch &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <h3 className="font-poppins text-xl font-semibold text-gray-800">
            Batch Aktif
          </h3>
          <p
            className="font-inter text-4xl font-bold mt-2"
            style={{ color: "#16a34a" }}
          >
            {" "}
            {/* Warna hijau untuk aktif */}
            {activeBatchesToDisplay}
          </p>
          <Link
            to="/admin/batches?status=active"
            className="text-sm hover:underline mt-4 block"
            style={{ color: "#16a34a" }}
          >
            Lihat Batch Aktif &rarr;
          </Link>
        </div>

        {/* Card Batch Ditutup (Baru) */}
        <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <h3 className="font-poppins text-xl font-semibold text-gray-800">
            Batch Ditutup
          </h3>
          <p
            className="font-inter text-4xl font-bold mt-2"
            style={{ color: "#ef4444" }}
          >
            {" "}
            {/* Warna merah untuk ditutup */}
            {closedBatchesToDisplay}
          </p>
          <Link
            to="/admin/batches?status=closed"
            className="text-sm hover:underline mt-4 block"
            style={{ color: "#ef4444" }}
          >
            Lihat Batch Ditutup &rarr;
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="font-poppins text-2xl font-semibold text-gray-800 mb-4">
          Selamat Datang!
        </h2>
        <p className="font-inter text-gray-700 leading-relaxed">
          Ini adalah panel admin {APP_NAME || "Andiamo.id"}. Dari sini Anda
          dapat mengelola batch order, mengubah pengaturan, dan memantau
          aktivitas situs.
        </p>
        <p className="font-inter text-gray-700 mt-2 leading-relaxed">
          Gunakan navigasi di sebelah kiri untuk mengakses berbagai fitur yang
          tersedia.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
