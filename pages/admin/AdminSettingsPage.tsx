import React, { useEffect, useState } from "react";
import SettingsForm from "../../components/admin/SettingsForm";
import { AdminSettings } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import ToastNotification from "../../components/ToastNotification";
import { useAuth } from "../../hooks/useAuth"; // Tambahkan ini

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Partial<AdminSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { token } = useAuth(); // Ambil token dari context

  useEffect(() => {
    if (apiBaseUrl && token) {
      const fetchSettings = async () => {
        setIsLoading(true);
        setPageError(null);
        try {
          const response = await fetch(`${apiBaseUrl}/admin/settings`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(
              `Gagal mengambil pengaturan: ${response.statusText}`
            );
          }
          const data: AdminSettings = await response.json();
          setSettings(data);
        } catch (err) {
          setPageError(
            err instanceof Error ? err.message : "Terjadi kesalahan"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchSettings();
    } else if (!token) {
      setPageError("Anda tidak terotentikasi. Silakan login.");
      setIsLoading(false);
    } else {
      setPageError("API URL tidak dikonfigurasi.");
      setIsLoading(false);
    }
  }, [apiBaseUrl, token]);

  const handleSettingsSubmit = async (settingsData: AdminSettings) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    setToastMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/admin/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsData),
      });
      const responseData = await response.json();
      if (!response.ok) {
        let errMsg = responseData.message || "Gagal menyimpan pengaturan.";
        if (responseData.errors) {
          const validationErrors = Object.values(responseData.errors)
            .flat()
            .join(" \n");
          errMsg = `Data tidak valid:\n${validationErrors}`;
        }
        throw new Error(errMsg);
      }
      setSubmitSuccess(responseData.message || "Pengaturan berhasil disimpan!");
      setToastMessage(responseData.message || "Pengaturan berhasil disimpan!");
      setToastType("success");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setSubmitError(errMsg);
      setToastMessage(errMsg);
      setToastType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center p-10">
        <LoadingSpinner />
      </div>
    );
  if (pageError)
    return (
      <div className="p-6 text-red-600 bg-red-100 rounded-md">
        Error: {pageError}
      </div>
    );

  return (
    <div>
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      )}
      <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Pengaturan Admin
      </h1>
      <SettingsForm
        initialSettings={settings}
        onSubmit={handleSettingsSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
      />
    </div>
  );
};

export default AdminSettingsPage;
