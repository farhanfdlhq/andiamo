import React from "react";
import { Link } from "react-router-dom";
import { Batch } from "../types";
import InfoIcon from "./icons/InfoIcon";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import { useAuth } from "../hooks/useAuth";

interface BatchCardProps {
  batch: Batch;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch }) => {
  const { settings } = useAuth();
  const backendStorageUrl = import.meta.env.VITE_BACKEND_STORAGE_URL;
  const imageUrl = batch.image_url
    ? `${backendStorageUrl}/${batch.image_url}`
    : "https://via.placeholder.com/400x300.png?text=No+Image+Available";

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "Hubungi kami";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const whatsAppLinkToUse =
    batch.whatsappLink ||
    (settings?.defaultWhatsAppNumber
      ? `https://wa.me/62${settings.defaultWhatsAppNumber}`
      : null);

  const ctaMessage =
    settings?.defaultCTAMessage ||
    `Halo, saya tertarik dengan batch ${batch.name}.`;

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl">
      <Link to={`/batch/${batch.id}`} className="block">
        <img
          src={imageUrl}
          alt={batch.name}
          className="w-full h-56 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x300.png?text=Image+Error";
          }}
        />
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/batch/${batch.id}`} className="block">
          <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-2 hover:text-sky-600 transition-colors">
            {batch.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-1">
          <span className="font-medium">Region:</span> {batch.region || "N/A"}
        </p>
        <p className="text-sm text-gray-500 mb-3">
          <span className="font-medium">Keberangkatan:</span>
          {batch.departure_date
            ? new Date(batch.departure_date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Segera"}
        </p>
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {batch.shortDescription ||
            batch.description ||
            "Deskripsi tidak tersedia."}
        </p>

        <div className="mt-auto">
          <p className="font-poppins text-2xl font-bold text-sky-600 mb-4">
            {formatPrice(batch.price)}
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to={`/batch/${batch.id}`}
              className="flex-1 flex items-center justify-center text-center bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium"
            >
              <InfoIcon className="w-4 h-4 mr-2" />
              Lihat Detail
            </Link>
            {whatsAppLinkToUse && (
              <a
                href={`${whatsAppLinkToUse}${
                  ctaMessage ? "?text=" + encodeURIComponent(ctaMessage) : ""
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center text-center bg-green-500 text-white px-5 py-2.5 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                <WhatsAppIcon className="w-4 h-4 mr-2" />
                Hubungi Jastip
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchCard;
