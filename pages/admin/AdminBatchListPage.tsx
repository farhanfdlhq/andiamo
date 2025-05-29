// Andiamo/pages/admin/AdminBatchListPage.tsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Batch } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import ToastNotification from "../../components/ToastNotification";
import {
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  PRIMARY_COLOR,
} from "../../constants";
// Impor ikon jika Anda akan menggunakannya (contoh)
// import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Contoh menggunakan Heroicons

type SortableBatchColumns =
  | "name"
  | "region"
  | "status"
  | "departure_date"
  | "arrival_date";
type SortDirection = "asc" | "desc";

const AdminBatchListPage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );

  const location = useLocation();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const backendStorageUrl = import.meta.env.VITE_BACKEND_STORAGE_URL; // Pastikan ini ada di .env

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const [statusFilter, setStatusFilter] = useState<string>(
    queryParams.get("status") || "all"
  );
  const [sortBy, setSortBy] = useState<SortableBatchColumns | null>(
    (queryParams.get("sortBy") as SortableBatchColumns) || "departure_date"
  ); // Default sort
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    (queryParams.get("sortDir") as SortDirection) || "desc"
  ); // Default direction

  const fetchAdminBatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (statusFilter !== "all") params.append("status", statusFilter);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortBy && sortDirection) params.append("sortDir", sortDirection);

    // Update URL tanpa reload halaman (hanya state history)
    // Ini akan memperbarui URL di browser saat filter/sort berubah
    navigate(`${location.pathname}?${params.toString()}`, {
      replace: true,
      state: location.state,
    });

    try {
      const response = await fetch(
        `${apiBaseUrl}/batches?${params.toString()}`
      ); // Panggil API dengan parameter
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      let data: Batch[] = await response.json();
      data = data.map((batch) => {
        let parsedImageUrls: string[] = [];
        if (typeof batch.image_urls === "string") {
          try {
            parsedImageUrls = JSON.parse(batch.image_urls);
          } catch (e) {
            console.warn(
              "Failed to parse image_urls for batch ID:",
              batch.id,
              batch.image_urls
            );
            parsedImageUrls = batch.image_urls ? [batch.image_urls] : [];
          }
        } else if (Array.isArray(batch.image_urls)) {
          parsedImageUrls = batch.image_urls;
        }
        return {
          ...batch,
          image_urls: parsedImageUrls.filter(
            (url) => typeof url === "string" && url.trim() !== ""
          ),
        };
      });
      setBatches(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    apiBaseUrl,
    statusFilter,
    sortBy,
    sortDirection,
    navigate,
    location.pathname,
  ]); // location.pathname ditambahkan agar URL update

  useEffect(() => {
    if (apiBaseUrl) {
      fetchAdminBatches();
    } else {
      setError("API URL is not configured.");
      setIsLoading(false);
    }
    if (location.state?.refresh) {
      // Bersihkan state setelah refresh agar tidak refresh terus menerus jika user kembali ke halaman ini
      const { refresh, ...restState } = location.state;
      navigate(location.pathname + location.search, {
        state: restState,
        replace: true,
      });
    }
  }, [apiBaseUrl, fetchAdminBatches, location.state]); // fetchAdminBatches dan location.state ditambahkan

  const handleSort = (column: SortableBatchColumns) => {
    const direction: SortDirection =
      sortBy === column && sortDirection === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortDirection(direction);
    // fetchAdminBatches akan dipanggil oleh useEffect karena sortBy/sortDirection berubah dan memicu update URL
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus batch ini?")) return;
    setToastMessage("");
    // const token = localStorage.getItem('authToken'); // Untuk otentikasi nanti
    try {
      const response = await fetch(`${apiBaseUrl}/batches/${id}`, {
        method: "DELETE" /* headers: { 'Authorization': `Bearer ${token}` } */,
      });
      if (!response.ok) {
        /* ... error handling ... */ throw new Error("Gagal hapus");
      }
      setToastMessage("Batch berhasil dihapus.");
      setToastType("success");
      fetchAdminBatches();
    } catch (err) {
      /* ... error handling ... */
    }
  };

  const headerClass =
    "px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer";

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto p-4 text-red-600 text-center">
        Error: {error}
      </div>
    );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Manajemen Batch
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm w-full sm:w-auto"
            style={{ borderColor: PRIMARY_COLOR }}
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="closed">Ditutup</option>
          </select>
          <Link
            to="/admin/batches/new"
            className="font-inter inline-block px-6 py-2.5 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-colors duration-300 text-center whitespace-nowrap w-full sm:w-auto"
            style={{
              backgroundColor: BUTTON_COLOR || "#1e40af",
              color: BUTTON_TEXT_COLOR || "white",
            }}
          >
            Tambah Batch Baru
          </Link>
        </div>
      </div>

      {batches.length === 0 && !isLoading ? (
        <p className="text-center text-gray-500 py-10">
          Belum ada batch yang ditambahkan.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: PRIMARY_COLOR || "#fbbf24" }}>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider"
                >
                  Gambar Utama
                </th>
                {(
                  [
                    { key: "name", label: "Judul/Nama" },
                    { key: "region", label: "Region" },
                    { key: "status", label: "Status" },
                    { key: "departure_date", label: "Tgl Berangkat" },
                    { key: "arrival_date", label: "Tgl Tiba" },
                  ] as { key: SortableBatchColumns; label: string }[]
                ).map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={headerClass}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    {sortBy === col.key ? (
                      sortDirection === "asc" ? (
                        " ▲"
                      ) : (
                        " ▼"
                      )
                    ) : (
                      <span className="opacity-30"> ◇</span>
                    )}
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-medium text-black uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.map((batch) => (
                <tr
                  key={batch.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={
                        batch.image_urls &&
                        batch.image_urls.length > 0 &&
                        backendStorageUrl
                          ? `${backendStorageUrl}/${batch.image_urls[0]}`
                          : "https://via.placeholder.com/100x75.png?text=No+Img"
                      }
                      alt={batch.name}
                      className="w-24 h-16 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/100x75.png?text=Error";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {batch.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.region || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        batch.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {batch.status === "active"
                        ? "Aktif"
                        : batch.status === "closed"
                        ? "Ditutup"
                        : batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.departure_date
                      ? new Date(batch.departure_date).toLocaleDateString(
                          "id-ID",
                          { day: "2-digit", month: "short", year: "numeric" }
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.arrival_date
                      ? new Date(batch.arrival_date).toLocaleDateString(
                          "id-ID",
                          { day: "2-digit", month: "short", year: "numeric" }
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <Link
                      to={`/admin/batches/edit/${batch.id}`}
                      title="Edit"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {/* Ganti dengan SVG Icon Edit */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline-block"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path
                          fillRule="evenodd"
                          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(batch.id)}
                      title="Hapus"
                      className="text-red-600 hover:text-red-800"
                    >
                      {/* Ganti dengan SVG Icon Delete */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline-block"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminBatchListPage;
