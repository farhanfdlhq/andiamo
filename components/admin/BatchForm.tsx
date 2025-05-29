import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Batch, Region } from "../../types";
import {
  REGION_LABELS,
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  PRIMARY_COLOR,
} from "../../constants";

interface BatchFormProps {
  initialData?: Batch | null;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
  mode: "create" | "edit";
  submitError?: string | null;
}

const WHATSAPP_PREFIX_DISPLAY = "62";
const WHATSAPP_LINK_PREFIX = "https://wa.me/62";
const MAX_IMAGE_UPLOADS = 50;

const BatchForm: React.FC<BatchFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  mode,
  submitError,
}) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [region, setRegion] = useState<Region | string>("");
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [status, setStatus] = useState<"active" | "closed" | string>("active");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  const backendStorageUrl = import.meta.env.VITE_BACKEND_STORAGE_URL;

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setShortDescription(initialData.shortDescription || "");
      setRegion(initialData.region || "");
      setDepartureDate(
        initialData.departure_date
          ? initialData.departure_date.split("T")[0]
          : ""
      );
      setArrivalDate(
        initialData.arrival_date ? initialData.arrival_date.split("T")[0] : ""
      );

      if (initialData.whatsappLink) {
        if (initialData.whatsappLink.startsWith(WHATSAPP_LINK_PREFIX)) {
          setWhatsappNumber(
            initialData.whatsappLink.substring(WHATSAPP_LINK_PREFIX.length)
          );
        } else if (initialData.whatsappLink.startsWith(`https://wa.me/`)) {
          const numOnly = initialData.whatsappLink.substring(
            `https://wa.me/`.length
          );
          setWhatsappNumber(
            numOnly.startsWith("62") ? numOnly.substring(2) : numOnly
          );
        } else {
          setWhatsappNumber(
            initialData.whatsappLink.replace(/[^0-9]/g, "").startsWith("62")
              ? initialData.whatsappLink.replace(/[^0-9]/g, "").substring(2)
              : initialData.whatsappLink.replace(/[^0-9]/g, "")
          );
        }
      } else {
        setWhatsappNumber("");
      }

      setStatus(initialData.status || "active");
      const currentImages = Array.isArray(initialData.image_urls)
        ? initialData.image_urls
        : [];
      setExistingImageUrls(currentImages);
      setImagePreviews(
        currentImages.map((url) => `${backendStorageUrl}/${url}`)
      );
      setImageFiles([]);
    } else {
      setName("");
      setDescription("");
      setShortDescription("");
      setRegion("");
      setDepartureDate("");
      setArrivalDate("");
      setWhatsappNumber("");
      setStatus("active");
      setImageFiles([]);
      setImagePreviews([]);
      setExistingImageUrls([]);
    }
  }, [mode, initialData, backendStorageUrl]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const totalPreviewCount =
        (mode === "edit" ? existingImageUrls.length : 0) + filesArray.length;

      if (totalPreviewCount > MAX_IMAGE_UPLOADS) {
        alert(
          `Anda hanya bisa memiliki maksimal ${MAX_IMAGE_UPLOADS} gambar secara total (termasuk yang sudah ada jika mode edit). Silakan kurangi pilihan Anda.`
        );
        event.target.value = "";
        return;
      }

      setImageFiles(filesArray);
      const newFilePreviews = filesArray.map((file) =>
        URL.createObjectURL(file)
      );
      const existingPreviews =
        mode === "edit" && Array.isArray(initialData?.image_urls)
          ? initialData.image_urls.map((url) => `${backendStorageUrl}/${url}`)
          : [];
      setImagePreviews([...existingPreviews, ...newFilePreviews]);
    }
  };

  const removeNewlySelectedImage = (
    indexToRemoveInCombinedPreviews: number
  ) => {
    const numberOfExistingImages = existingImageUrls.length;
    const indexInNewFiles =
      indexToRemoveInCombinedPreviews - numberOfExistingImages;

    if (indexInNewFiles >= 0 && indexInNewFiles < imageFiles.length) {
      setImageFiles((prevFiles) =>
        prevFiles.filter((_, index) => index !== indexInNewFiles)
      );
      const updatedNewFilePreviews = imageFiles
        .filter((_, index) => index !== indexInNewFiles)
        .map((file) => URL.createObjectURL(file));

      const existingPreviews =
        mode === "edit" && Array.isArray(initialData?.image_urls)
          ? initialData.image_urls.map((url) => `${backendStorageUrl}/${url}`)
          : [];
      setImagePreviews([...existingPreviews, ...updatedNewFilePreviews]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formDataObj = new FormData();

    formDataObj.append("name", name);
    formDataObj.append("description", description);
    formDataObj.append("shortDescription", shortDescription);
    if (region) formDataObj.append("region", region as string);
    if (departureDate) formDataObj.append("departure_date", departureDate);
    if (arrivalDate) formDataObj.append("arrival_date", arrivalDate);

    if (whatsappNumber.trim() !== "") {
      formDataObj.append(
        "whatsappLink",
        `${WHATSAPP_LINK_PREFIX}${whatsappNumber.trim()}`
      );
    }

    formDataObj.append("status", status as string);

    imageFiles.forEach((file, index) => {
      formDataObj.append(`images[${index}]`, file);
    });

    if (mode === "edit") {
      if (imageFiles.length > 0) {
        formDataObj.append("replace_existing_images", "true");
      }
    }

    await onSubmit(formDataObj);
  };

  const inputClass =
    "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm font-inter";
  const labelClass = "block text-sm font-medium text-gray-700 font-inter";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-xl"
    >
      <div>
        <label htmlFor="name" className={labelClass}>
          Nama Batch <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
          style={{ borderColor: PRIMARY_COLOR }}
        />
      </div>

      <div>
        <label htmlFor="images" className={labelClass}>
          Gambar Unggulan (Maks. {MAX_IMAGE_UPLOADS} gambar)
          {mode === "edit" &&
          existingImageUrls.length > 0 &&
          imageFiles.length === 0
            ? " (Biarkan kosong jika tidak ingin ganti gambar yang sudah ada)"
            : ""}
        </label>
        <input
          type="file"
          name="images"
          id="images"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
        />
        {imagePreviews.length > 0 && (
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {imagePreviews.map((previewUrl, index) => (
              <div
                key={
                  previewUrl ===
                  existingImageUrls.find(
                    (exUrl) => `${backendStorageUrl}/${exUrl}` === previewUrl
                  )
                    ? `existing-${index}`
                    : `new-${index}`
                }
                className="relative group"
              >
                <img
                  src={previewUrl}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-full object-cover rounded-md shadow-sm"
                />
                {!(initialData?.image_urls || [])
                  .map((url) => `${backendStorageUrl}/${url}`)
                  .includes(previewUrl) && (
                  <button
                    type="button"
                    onClick={() => removeNewlySelectedImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs opacity-75 group-hover:opacity-100 transition-opacity"
                    title="Hapus gambar ini dari pilihan upload"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="shortDescription" className={labelClass}>
          Deskripsi Singkat
        </label>
        <textarea
          name="shortDescription"
          id="shortDescription"
          rows={2}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className={inputClass}
          style={{ borderColor: PRIMARY_COLOR }}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Deskripsi Lengkap
        </label>
        <textarea
          name="description"
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          style={{ borderColor: PRIMARY_COLOR }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="region" className={labelClass}>
            Region
          </label>
          <select
            name="region"
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value as Region | string)}
            className={inputClass}
            style={{ borderColor: PRIMARY_COLOR }}
          >
            <option value="">Pilih Region</option>
            {(
              Object.keys(REGION_LABELS) as Array<keyof typeof REGION_LABELS>
            ).map((key) => (
              <option key={key} value={key}>
                {REGION_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            name="status"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className={inputClass}
            style={{ borderColor: PRIMARY_COLOR }}
          >
            <option value="active">Aktif</option>
            <option value="closed">Ditutup</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="departureDate" className={labelClass}>
            Perkiraan Tanggal Berangkat
          </label>
          <input
            type="date"
            name="departureDate"
            id="departureDate"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className={inputClass}
            style={{ borderColor: PRIMARY_COLOR }}
          />
        </div>
        <div>
          <label htmlFor="arrivalDate" className={labelClass}>
            Perkiraan Tanggal Tiba
          </label>
          <input
            type="date"
            name="arrivalDate"
            id="arrivalDate"
            value={arrivalDate}
            onChange={(e) => setArrivalDate(e.target.value)}
            className={inputClass}
            style={{ borderColor: PRIMARY_COLOR }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="whatsappNumber" className={labelClass}>
          Nomor WhatsApp
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            {WHATSAPP_PREFIX_DISPLAY}
          </span>
          <input
            type="tel"
            name="whatsappNumber"
            id="whatsappNumber"
            value={whatsappNumber}
            onChange={(e) =>
              setWhatsappNumber(e.target.value.replace(/[^0-9]/g, ""))
            }
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-sky-500 focus:border-sky-500 sm:text-sm border-gray-300"
            placeholder="8123456789"
            style={{ borderColor: PRIMARY_COLOR }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 font-inter">
          Masukkan nomor setelah +62 (misal: 812xxxx). Link lengkap akan
          otomatis dibuat.
        </p>
      </div>

      {submitError && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          Error: {submitError}
        </div>
      )}

      <div className="flex items-center justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() =>
            window.history.length > 2
              ? window.history.back()
              : navigate("/admin/batches")
          }
          className="font-inter px-6 py-2.5 rounded-md text-sm font-medium transition-colors duration-300 border-2"
          style={{
            borderColor: BUTTON_COLOR || "#6b7280",
            color: BUTTON_COLOR || "#6b7280",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#f0f0f0";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "white";
          }}
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="font-inter px-6 py-2.5 rounded-md text-sm font-medium transition-colors duration-300 flex items-center justify-center"
          style={{
            backgroundColor: BUTTON_COLOR || "#2563eb",
            color: BUTTON_TEXT_COLOR || "white",
          }}
        >
          {isSubmitting && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {isSubmitting
            ? "Memproses..."
            : mode === "create"
            ? "Buat Batch"
            : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
};

export default BatchForm;
