// farhanfdlhq/andiamo/andiamo-fd98185f31cea406843a54513c763dd912491ed9/pages/BatchDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Batch, Region } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import ImageGallery from "../components/ImageGallery";
import { WhatsAppIcon, ChevronLeftIcon, InfoIcon } from "../components/icons";
import {
  PRIMARY_COLOR,
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  REGION_LABELS,
} from "../constants";

const BatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const backendStorageUrl = import.meta.env.VITE_BACKEND_STORAGE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          data.image_urls = Array.isArray(data.image_urls)
            ? data.image_urls.filter(
                (url) => typeof url === "string" && url.trim() !== ""
              )
            : [];
          setBatch(data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Batch tidak ditemukan atau terjadi kesalahan."
          );
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !batch) {
    return (
      <div className="font-inter container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <InfoIcon className="w-20 h-20 mx-auto text-gray-400 mb-6" />
        <h2 className="font-poppins text-3xl font-bold text-red-600 mb-4">
          Batch Tidak Ditemukan
        </h2>
        <p className="font-inter text-lg text-gray-700 mb-8">
          {error ||
            "Maaf, batch order yang Anda cari tidak dapat ditemukan. Mungkin sudah dihapus atau URL tidak valid."}
        </p>
        <Link
          to="/"
          className="font-inter inline-flex items-center px-6 py-3 rounded-lg transition-colors duration-300"
          style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
        >
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          Kembali ke Daftar Batch
        </Link>
      </div>
    );
  }

  const imagePaths = (batch.image_urls || []).map(
    (url) => `${backendStorageUrl}/${url}`
  );
  const isClosed = batch.status === "closed";

  return (
    <div className="font-inter container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium transition-colors duration-300"
          style={{ color: BUTTON_COLOR }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = PRIMARY_COLOR;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = BUTTON_COLOR;
          }}
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Kembali ke Daftar Batch
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ImageGallery images={imagePaths} altText={batch.name} />
          </div>
          <div className="flex flex-col">
            {batch.region && REGION_LABELS[batch.region as Region] && (
              <span
                className="self-start px-3 py-1 mb-3 rounded-full text-xs font-semibold text-black shadow"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                {REGION_LABELS[batch.region as Region]}
              </span>
            )}
            <h1 className="font-poppins text-3xl sm:text-4xl font-bold text-black mb-4">
              {batch.name}
            </h1>

            {isClosed && (
              <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300">
                <p className="font-bold font-poppins">
                  Batch ini Telah Ditutup
                </p>
                <p className="text-sm">
                  Terima kasih atas partisipasinya. Nantikan batch selanjutnya!
                </p>
              </div>
            )}

            {batch.departure_date && (
              <p className="font-inter text-sm text-gray-600 mb-1">
                <span className="font-semibold">Perkiraan Berangkat:</span>{" "}
                {new Date(batch.departure_date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            {batch.arrival_date && (
              <p className="font-inter text-sm text-gray-600 mb-4">
                <span className="font-semibold">Perkiraan Tiba:</span>{" "}
                {new Date(batch.arrival_date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}

            {batch.shortDescription && (
              <p className="font-inter text-gray-700 text-base mb-4 italic">
                {batch.shortDescription}
              </p>
            )}
            <div
              className="font-inter text-gray-700 prose prose-sm sm:prose max-w-none mb-6"
              dangerouslySetInnerHTML={{
                __html:
                  batch.description || "<p>Tidak ada deskripsi detail.</p>",
              }}
            />

            {batch.whatsappLink && !isClosed && (
              <div className="mt-auto pt-6 border-t border-gray-200">
                <a
                  href={batch.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter w-full flex items-center justify-center px-8 py-3 text-lg rounded-lg font-semibold transition-colors duration-300"
                  style={{
                    backgroundColor: BUTTON_COLOR,
                    color: BUTTON_TEXT_COLOR,
                  }}
                >
                  <WhatsAppIcon className="w-6 h-6 mr-3" />
                  Hubungi Jastiper via WhatsApp
                </a>
              </div>
            )}
            {isClosed && !batch.whatsappLink && (
              <div className="mt-auto pt-6 border-t border-gray-200">
                <p className="text-center text-gray-500">
                  Informasi kontak tidak tersedia untuk batch yang sudah
                  ditutup.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailPage;
