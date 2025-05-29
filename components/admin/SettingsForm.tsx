// Andiamo/components/admin/SettingsForm.tsx
import React, { useState, useEffect, FormEvent } from "react";
import { AdminSettings } from "../../types"; // Pastikan tipe ini sesuai
import {
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  PRIMARY_COLOR,
} from "../../constants";

interface SettingsFormProps {
  initialSettings?: Partial<AdminSettings>; // Bisa jadi tidak semua setting ada awalnya
  onSubmit: (settingsData: AdminSettings) => Promise<void>;
  isSubmitting: boolean;
  submitError?: string | null;
  submitSuccess?: string | null;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  initialSettings,
  onSubmit,
  isSubmitting,
  submitError,
  submitSuccess,
}) => {
  const [defaultWhatsAppNumber, setDefaultWhatsAppNumber] = useState("");
  const [defaultCTAMessage, setDefaultCTAMessage] = useState("");

  useEffect(() => {
    if (initialSettings) {
      setDefaultWhatsAppNumber(initialSettings.defaultWhatsAppNumber || "");
      setDefaultCTAMessage(initialSettings.defaultCTAMessage || "");
    }
  }, [initialSettings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      defaultWhatsAppNumber,
      defaultCTAMessage,
    });
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
        <label htmlFor="defaultWhatsAppNumber" className={labelClass}>
          Nomor WhatsApp Default (tanpa 62 atau 0 di depan, misal: 812xxxx)
        </label>
        <input
          type="tel"
          name="defaultWhatsAppNumber"
          id="defaultWhatsAppNumber"
          value={defaultWhatsAppNumber}
          onChange={(e) =>
            setDefaultWhatsAppNumber(e.target.value.replace(/[^0-9]/g, ""))
          }
          className={inputClass}
          style={{ borderColor: PRIMARY_COLOR }}
          placeholder="81234567890"
        />
      </div>

      <div>
        <label htmlFor="defaultCTAMessage" className={labelClass}>
          Pesan Call-to-Action Default untuk WhatsApp
        </label>
        <textarea
          name="defaultCTAMessage"
          id="defaultCTAMessage"
          rows={3}
          value={defaultCTAMessage}
          onChange={(e) => setDefaultCTAMessage(e.target.value)}
          className={inputClass}
          style={{ borderColor: PRIMARY_COLOR }}
          placeholder="Halo, saya tertarik dengan batch jastip..."
        />
        <p className="mt-1 text-xs text-gray-500 font-inter">
          Pesan ini akan digunakan jika link WhatsApp batch tidak diisi.
        </p>
      </div>

      {submitError && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          Error: {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
          {submitSuccess}
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: BUTTON_COLOR || "#2563eb",
            color: BUTTON_TEXT_COLOR || "white",
          }}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;
