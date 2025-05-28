import React, { useState, useEffect } from 'react';
import { AdminSettings } from '../../types';
import { LocalStorageKeys, getItem, setItem } from '../../utils/localStorage';
import { DEFAULT_ADMIN_SETTINGS, BUTTON_COLOR, BUTTON_TEXT_COLOR, PRIMARY_COLOR } from '../../constants';

const SettingsForm: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedSettings = getItem<AdminSettings>(LocalStorageKeys.ADMIN_SETTINGS);
    if (storedSettings) {
      setSettings(storedSettings);
    }
    setIsLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setItem<AdminSettings>(LocalStorageKeys.ADMIN_SETTINGS, settings);
    setSuccessMessage('Pengaturan berhasil disimpan!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (isLoading) {
    return <p className="font-inter text-gray-600">Memuat pengaturan...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      {successMessage && (
        <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700 border border-green-300 font-inter">
          {successMessage}
        </div>
      )}
      <div>
        <label htmlFor="defaultWhatsAppNumber" className="block text-sm font-medium text-gray-700 font-inter">
          Nomor WhatsApp Default
        </label>
        <input
          type="text"
          name="defaultWhatsAppNumber"
          id="defaultWhatsAppNumber"
          value={settings.defaultWhatsAppNumber}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm font-inter"
          style={{ borderColor: PRIMARY_COLOR }}
          placeholder="+628123456789"
        />
        <p className="mt-1 text-xs text-gray-500 font-inter">Nomor WhatsApp yang akan digunakan jika link WhatsApp batch tidak diisi.</p>
      </div>

      <div>
        <label htmlFor="defaultCTAMessage" className="block text-sm font-medium text-gray-700 font-inter">
          Pesan CTA WhatsApp Default
        </label>
        <textarea
          name="defaultCTAMessage"
          id="defaultCTAMessage"
          rows={3}
          value={settings.defaultCTAMessage}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm font-inter"
          style={{ borderColor: PRIMARY_COLOR }}
          placeholder="Halo, saya tertarik dengan jastip ini..."
        />
        <p className="mt-1 text-xs text-gray-500 font-inter">Pesan default yang akan terisi saat pengguna klik tombol WhatsApp.</p>
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors duration-300 font-inter"
          style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
        >
          Simpan Pengaturan
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;