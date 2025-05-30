// Andiamo/pages/admin/AdminBatchListPage.tsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Batch, Region } from "../../types"; // Pastikan path ini benar
import LoadingSpinner from "../../components/LoadingSpinner"; // Pastikan path ini benar
import ToastNotification from "../../components/ToastNotification"; // Pastikan path ini benar
import {
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  PRIMARY_COLOR,
  REGION_LABELS, // Import REGION_LABELS
} from "../../constants"; // Pastikan path ini benar
import { useAuth } from "../../hooks/useAuth";

// Simple SVG Icons for actions (seperti pada kode referensi)
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  </svg>
);
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.242.078 3.223.224M5 5a48.068 48.068 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);
const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-16 h-16 mx-auto text-gray-400 mb-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    />
  </svg>
);

// Mempertahankan tipe SortableBatchColumns Anda sebelumnya
type SortableBatchColumns =
  | "name"
  | "region"
  | "status"
  | "departure_date"
  | "arrival_date"; // Memastikan arrival_date tetap ada jika bisa disortir

type SortDirection = "asc" | "desc";

const AdminBatchListPage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );

  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const backendStorageUrl = import.meta.env.VITE_BACKEND_STORAGE_URL; // Diperlukan lagi untuk "Gambar Utama"

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const [statusFilter, setStatusFilter] = useState<string>(
    queryParams.get("status") || "all"
  );
  const [sortBy, setSortBy] = useState<SortableBatchColumns | null>(
    queryParams.get("sortBy") as SortableBatchColumns | null
  );
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(
    queryParams.get("sortDir") as SortDirection | null
  );

  const fetchAdminBatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (statusFilter !== "all") {
      params.append("status", statusFilter);
    }
    if (sortBy) {
      params.append("sortBy", sortBy);
      if (sortDirection) {
        params.append("sortDir", sortDirection);
      }
    }
    const queryString = params.toString();
    navigate(`${location.pathname}${queryString ? `?${queryString}` : ""}`, {
      replace: true,
      state: location.state,
    });
    try {
      const response = await fetch(
        `${apiBaseUrl}/batches${queryString ? `?${queryString}` : ""}`
      );
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      let data: Batch[] = await response.json();
      // Parsing image_urls diperlukan lagi untuk kolom "Gambar Utama"
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
    location.state,
  ]);

  useEffect(() => {
    if (apiBaseUrl) {
      fetchAdminBatches();
    } else {
      setError("API URL is not configured.");
      setIsLoading(false);
    }
    if (location.state?.refresh) {
      const { refresh, ...restState } = location.state;
      navigate(location.pathname + location.search, {
        state: restState,
        replace: true,
      });
    }
  }, [
    apiBaseUrl,
    fetchAdminBatches,
    location.state,
    location.pathname,
    location.search,
  ]);

  const handleSort = (column: SortableBatchColumns) => {
    let newDirection: SortDirection;
    if (sortBy === column) {
      newDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      newDirection = "asc";
    }
    setSortBy(column);
    setSortDirection(newDirection);
  };

  const handleDeleteBatch = async (batchId: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus batch ini?")) {
      if (!token) {
        setToastMessage("Otentikasi diperlukan untuk menghapus.");
        setToastType("error");
        return;
      }
      try {
        const response = await fetch(`${apiBaseUrl}/batches/${batchId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({
              message: `Gagal menghapus batch. Status: ${response.status}`,
            }));
          throw new Error(
            errorData.message ||
              `Gagal menghapus batch. Status: ${response.status}`
          );
        }
        setToastMessage("Batch berhasil dihapus.");
        setToastType("success");
        setBatches((prevBatches) =>
          prevBatches.filter((b) => b.id !== batchId)
        );
      } catch (err) {
        const errMsg =
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat menghapus.";
        setToastMessage(errMsg);
        setToastType("error");
      }
    }
  };

  const headerClass =
    "px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider cursor-pointer";

  if (isLoading && batches.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-600 text-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 font-inter">
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="font-poppins text-3xl font-bold text-black">
          Kelola Batch Orders
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
            className="font-inter inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-300 whitespace-nowrap w-full sm:w-auto"
            style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
          >
            + Tambah Batch Baru
          </Link>
        </div>
      </div>

      {isLoading && batches.length > 0 && (
        <div className="py-4 flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && batches.length === 0 ? (
        <div className="text-center py-12 bg-white p-8 rounded-lg shadow">
          <InfoIcon />
          <p className="font-inter text-xl text-gray-600">
            Belum ada batch yang dibuat atau sesuai filter.
          </p>
          <p className="font-inter text-sm text-gray-500 mt-2">
            Klik tombol "+ Tambah Batch Baru" untuk memulai.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 font-inter">
            <thead style={{ backgroundColor: PRIMARY_COLOR }}>
              <tr>
                {/* MEMPERTAHANKAN NAMA KOLOM ASLI ANDA */}
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
                    { key: "arrival_date", label: "Tgl Tiba" }, // Mempertahankan Tgl Tiba
                  ] as { key: SortableBatchColumns; label: string }[]
                ).map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={headerClass}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    {sortBy === col.key && sortDirection ? (
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
                  className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.map((batch) => (
                <tr
                  key={batch.id}
                  className="hover:bg-yellow-50 transition-colors duration-150"
                >
                  {/* MEMPERTAHANKAN KOLOM GAMBAR UTAMA */}
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Menggunakan gaya dari referensi untuk judul */}
                    <div
                      className="text-sm font-medium text-gray-900 truncate max-w-xs"
                      title={batch.name}
                    >
                      {batch.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {batch.region && REGION_LABELS[batch.region as Region]
                        ? REGION_LABELS[batch.region as Region]
                        : batch.region || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        batch.status === "active"
                          ? "bg-green-100 text-green-800"
                          : batch.status === "closed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
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
                  {/* MEMPERTAHANKAN KOLOM TGL TIBA */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.arrival_date
                      ? new Date(batch.arrival_date).toLocaleDateString(
                          "id-ID",
                          { day: "2-digit", month: "short", year: "numeric" }
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <Link
                      to={`/admin/batches/edit/${batch.id}`}
                      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      title="Edit"
                    >
                      <EditIcon /> <span className="sr-only">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteBatch(batch.id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                      title="Hapus"
                    >
                      <DeleteIcon /> <span className="sr-only">Hapus</span>
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
