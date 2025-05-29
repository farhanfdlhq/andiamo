// Andiamo/pages/BatchDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Batch } from "../types"; // Pastikan tipe Batch sudah benar
import LoadingSpinner from "../components/LoadingSpinner";
import ImageGallery from "../components/ImageGallery"; // Asumsi Anda punya komponen ini
import { WhatsAppIcon } from "../components/icons"; // Sesuaikan path jika perlu

const BatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Mengambil 'id' dari URL
  const [batch, setBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const backendStorageUrl = import.meta.env.VITE_BACKEND_STORAGE_URL;

  useEffect(() => {
    if (id && apiBaseUrl) {
      setIsLoading(true);
      setError(null);
      const fetchBatch = async () => {
        try {
          const response = await fetch(`${apiBaseUrl}/batches/${id}`);
          if (!response.ok) {
            let errorMessage = `Gagal mengambil detail batch. Status: ${response.status}`;
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              /* biarkan error message default */
            }
            throw new Error(errorMessage);
          }
          let data: Batch = await response.json();
          // Pastikan image_urls adalah array
          if (typeof data.image_urls === "string") {
            try {
              data.image_urls = JSON.parse(data.image_urls);
            } catch (e) {
              console.error(
                "Failed to parse image_urls for batch ID:",
                data.id,
                data.image_urls
              );
              data.image_urls = data.image_urls ? [data.image_urls] : [];
            }
          } else if (!Array.isArray(data.image_urls)) {
            data.image_urls = [];
          }
          data.image_urls = (data.image_urls || []).filter(
            (url) => typeof url === "string" && url.trim() !== ""
          );

          setBatch(data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Batch tidak ditemukan atau terjadi kesalahan."
          );
          console.error("Error fetching batch detail:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBatch();
    } else if (!id) {
      setError("ID Batch tidak valid.");
      setIsLoading(false);
    } else if (!apiBaseUrl) {
      setError("Konfigurasi API tidak ditemukan.");
      setIsLoading(false);
    }
  }, [id, apiBaseUrl]);

  const formatPrice = (price?: number) => {
    // Jika Anda menghapus harga dari tipe Batch, sesuaikan atau hapus fungsi ini
    if (price === undefined || price === null)
      return "Hubungi untuk info harga";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Batch Tidak Ditemukan
        </h2>
        <p className="text-gray-700 mb-6">
          {error ||
            "Maaf, batch order yang Anda cari tidak dapat ditemukan. Mungkin sudah dihapus atau URL tidak valid."}
        </p>
        <Link
          to="/"
          className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition-colors"
        >
          Kembali ke Halaman Utama
        </Link>
      </div>
    );
  }

  const imagePaths = (batch.image_urls || []).map(
    (url) => `${backendStorageUrl}/${url}`
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="bg-white shadow-xl rounded-lg overflow-hidden">
        {imagePaths.length > 0 ? (
          // Jika Anda memiliki komponen ImageGallery:
          <ImageGallery images={imagePaths} altText={batch.name} />
        ) : batch.image_urls &&
          batch.image_urls.length === 1 &&
          backendStorageUrl ? ( // Fallback jika hanya 1 gambar dan tidak ada gallery
          <img
            src={`${backendStorageUrl}/${batch.image_urls[0]}`}
            alt={batch.name}
            className="w-full h-72 md:h-96 object-cover"
          />
        ) : (
          <div className="w-full h-72 md:h-96 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Tidak ada gambar</span>
          </div>
        )}

        <div className="p-6 md:p-8">
          <h1 className="font-poppins text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {batch.name}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
            <span>
              <strong>Region:</strong> {batch.region || "N/A"}
            </span>
            <span>
              <strong>Status:</strong>{" "}
              <span
                className={`capitalize px-2 py-0.5 rounded-full text-xs font-semibold ${
                  batch.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {batch.status || "N/A"}
              </span>
            </span>
            <span>
              <strong>Keberangkatan:</strong>{" "}
              {batch.departure_date
                ? new Date(batch.departure_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Segera"}
            </span>
            <span>
              <strong>Tiba:</strong>{" "}
              {batch.arrival_date
                ? new Date(batch.arrival_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Segera"}
            </span>
          </div>

          {batch.shortDescription && (
            <p className="text-gray-700 text-lg mb-6 italic">
              {batch.shortDescription}
            </p>
          )}

          <div
            className="prose prose-sm sm:prose lg:prose-lg max-w-none mb-6"
            dangerouslySetInnerHTML={{
              __html: batch.description || "<p>Tidak ada deskripsi detail.</p>",
            }}
          />

          {/* Harga dihapus, tampilkan WhatsApp link jika ada */}
          {batch.whatsappLink && (
            <div className="mt-6 mb-4">
              <a
                href={batch.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-center bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors text-base font-medium shadow-md"
              >
                <WhatsAppIcon className="w-5 h-5 mr-2.5" />
                Hubungi via WhatsApp
              </a>
            </div>
          )}

          <div className="mt-8 border-t pt-6">
            <Link
              to="/"
              className="text-sky-600 hover:text-sky-800 transition-colors"
            >
              &larr; Kembali ke Daftar Batch
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BatchDetailPage;
