// Andiamo/pages/admin/AdminProfilePage.tsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ToastNotification from "../../components/ToastNotification";
import {
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  PRIMARY_COLOR,
} from "../../constants";

const AdminProfilePage: React.FC = () => {
  const { user, token } = useAuth(); // Asumsi useAuth menyediakan data user yang login
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setToastMessage("");

    if (newPassword !== newPasswordConfirmation) {
      setSubmitError("Konfirmasi password baru tidak cocok.");
      setToastMessage("Konfirmasi password baru tidak cocok.");
      setToastType("error");
      setIsSubmitting(false);
      return;
    }

    if (!apiBaseUrl || !token) {
      setSubmitError("Tidak dapat terhubung ke server atau sesi tidak valid.");
      setToastMessage("Tidak dapat terhubung ke server atau sesi tidak valid.");
      setToastType("error");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${apiBaseUrl}/admin/profile/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage =
          responseData.message ||
          `Gagal mengubah password. Status: ${response.status}`;
        if (responseData.errors) {
          const validationErrors = Object.values(responseData.errors)
            .flat()
            .join(" \n");
          errorMessage = `Data tidak valid:\n${validationErrors}`;
        }
        throw new Error(errorMessage);
      }

      setToastMessage(responseData.message || "Password berhasil diubah!");
      setToastType("success");
      // Kosongkan field password setelah berhasil
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan.";
      setSubmitError(errorMessage);
      setToastMessage(errorMessage);
      setToastType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm font-inter";
  const labelClass = "block text-sm font-medium text-gray-700 font-inter";

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
        Edit Profil & Ganti Password
      </h1>

      {/* Form Ganti Password */}
      <div className="mt-8 max-w-xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Ganti Password
        </h2>
        <form
          onSubmit={handleChangePassword}
          className="space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-xl"
        >
          <div>
            <label htmlFor="currentPassword" className={labelClass}>
              Password Saat Ini <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={inputClass}
              style={{
                borderColor:
                  submitError && currentPassword === ""
                    ? "rgb(239 68 68)"
                    : PRIMARY_COLOR,
              }}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className={labelClass}>
              Password Baru <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className={inputClass}
              style={{
                borderColor:
                  submitError && newPassword === ""
                    ? "rgb(239 68 68)"
                    : PRIMARY_COLOR,
              }}
            />
            <p className="mt-1 text-xs text-gray-500 font-inter">
              Minimal 8 karakter dan kombinasi angka
            </p>
          </div>
          <div>
            <label htmlFor="newPasswordConfirmation" className={labelClass}>
              Konfirmasi Password Baru <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="newPasswordConfirmation"
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              required
              className={inputClass}
              style={{
                borderColor:
                  submitError && newPasswordConfirmation === ""
                    ? "rgb(239 68 68)"
                    : PRIMARY_COLOR,
              }}
            />
          </div>

          {submitError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {submitError.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: BUTTON_COLOR || "#16a34a",
                color: BUTTON_TEXT_COLOR || "white",
              }}
            >
              {isSubmitting ? "Menyimpan..." : "Ganti Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfilePage;
