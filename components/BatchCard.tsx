// Andiamo/components/BatchCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Batch, Region } from "../types"; // Menggunakan tipe Batch dari proyek Anda
import { WhatsAppIcon } from "./icons"; // Menggunakan ikon dari proyek Anda
import { useAuth } from "../hooks/useAuth";
import {
  PRIMARY_COLOR,
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  REGION_LABELS,
} from "../constants"; // Menggunakan konstanta dari proyek Anda

interface BatchCardProps {
  batch: Batch; // Menggunakan tipe Batch dari proyek Anda
}

const BatchCard: React.FC<BatchCardProps> = ({ batch }) => {
  const { settings } = useAuth(); // Tetap menggunakan useAuth untuk default settings
  const backendStorageUrl = import.meta.env.VITE_BACKEND_STORAGE_URL;

  // Fungsi yang sudah ada untuk gambar, disesuaikan dengan struktur data Anda
  const imageUrl =
    batch.image_urls && batch.image_urls.length > 0 && backendStorageUrl
      ? `${backendStorageUrl}/${batch.image_urls[0]}` // Mengambil gambar pertama dari array image_urls
      : "https://picsum.photos/800/600?grayscale"; // Fallback seperti referensi

  // Fungsi yang sudah ada untuk WhatsApp link, tetap dipertahankan
  const defaultWhatsAppNumber = settings?.defaultWhatsAppNumber?.startsWith(
    "62"
  )
    ? settings.defaultWhatsAppNumber
    : settings?.defaultWhatsAppNumber
    ? `62${settings.defaultWhatsAppNumber}`
    : null;

  const whatsAppLinkToUse =
    batch.whatsappLink ||
    (defaultWhatsAppNumber ? `https://wa.me/${defaultWhatsAppNumber}` : null);

  const ctaMessage =
    settings?.defaultCTAMessage ||
    `Halo, saya tertarik dengan batch ${batch.name}.`;

  const isClosed = batch.status === "closed";

  // Fungsi formatPrice tidak ada di referensi, jadi saya akan menghapusnya dari tampilan utama
  // namun Anda bisa menambahkannya kembali jika diperlukan.

  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl ${
        isClosed ? "opacity-70" : ""
      }`}
    >
      <div className="relative">
        {/* Link ke detail batch membungkus gambar dan judul */}
        <Link to={`/batch/${batch.id}`} className="block">
          <img
            src={imageUrl}
            alt={batch.name} // Menggunakan batch.name dari tipe Anda
            className="w-full h-56 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null; // Mencegah loop error jika fallback juga error
              (e.target as HTMLImageElement).src =
                "https://picsum.photos/800/600?grayscale&text=Error"; // Fallback error
            }}
          />
        </Link>
        {isClosed && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <span className="font-poppins text-white text-2xl font-bold border-2 border-white px-4 py-2 rounded">
              CLOSED
            </span>
          </div>
        )}
        {/* Menampilkan Region di atas gambar */}
        {batch.region && REGION_LABELS[batch.region as Region] && (
          <div
            className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold text-black shadow"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            {REGION_LABELS[batch.region as Region]}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/batch/${batch.id}`} className="block">
          <h3
            className="font-poppins text-xl font-bold text-black mb-2 truncate"
            title={batch.name}
          >
            {batch.name} {/* Menggunakan batch.name dari tipe Anda */}
          </h3>
        </Link>
        <p className="font-inter text-gray-700 text-sm mb-4 flex-grow min-h-[60px]">
          {" "}
          {/* min-h-[60px] untuk konsistensi tinggi deskripsi */}
          {batch.shortDescription ||
            batch.description?.substring(0, 100) +
              (batch.description && batch.description.length > 100
                ? "..."
                : "") ||
            "Deskripsi tidak tersedia."}{" "}
          {/* Menggunakan shortDescription atau potongan description */}
        </p>

        {/* Menampilkan tanggal berangkat dan tiba seperti referensi */}
        {batch.departure_date && (
          <p className="font-inter text-xs text-gray-500 mb-1">
            Perk. Berangkat:{" "}
            {new Date(batch.departure_date).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
        {batch.arrival_date && (
          <p className="font-inter text-xs text-gray-500 mb-3">
            Perk. Tiba:{" "}
            {new Date(batch.arrival_date).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        <div className="mt-auto space-y-3">
          {" "}
          {/* mt-auto untuk mendorong tombol ke bawah */}
          <Link
            to={`/batch/${batch.id}`} // Fungsi Link ke detail batch dipertahankan
            className="font-inter w-full block text-center px-6 py-2.5 rounded-md text-sm font-medium transition-colors duration-300 border-2"
            style={{
              borderColor: BUTTON_COLOR,
              color: BUTTON_COLOR,
              backgroundColor: "white",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = BUTTON_COLOR;
              e.currentTarget.style.color = BUTTON_TEXT_COLOR;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = BUTTON_COLOR;
            }}
          >
            Lihat Detail
          </Link>
          {/* Tombol WhatsApp tetap menggunakan logika yang sudah ada */}
          {whatsAppLinkToUse && !isClosed && (
            <a
              href={`${whatsAppLinkToUse}${
                ctaMessage ? "?text=" + encodeURIComponent(ctaMessage) : ""
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter w-full flex items-center justify-center px-6 py-2.5 rounded-md text-sm font-medium transition-colors duration-300"
              style={{
                backgroundColor: BUTTON_COLOR,
                color: BUTTON_TEXT_COLOR,
              }}
            >
              <WhatsAppIcon className="w-5 h-5 mr-2" />{" "}
              {/* Menggunakan ikon dari proyek Anda */}
              Hubungi via WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchCard;
