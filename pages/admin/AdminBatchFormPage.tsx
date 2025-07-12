// farhanfdlhq/andiamo/andiamo-fd98185f31cea406843a54513c763dd912491ed9/pages/admin/AdminBatchFormPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BatchForm from "../../components/admin/BatchForm";
import { Batch } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import ToastNotification from "../../components/ToastNotification";

const AdminBatchFormPage: React.FC<{ mode: "create" | "edit" }> = ({ mode }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [initialData, setInitialData] = useState<Batch | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [pageError, setPageError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (mode === "edit" && id && apiBaseUrl) {
            setIsLoading(true);
            setPageError(null);
            const fetchBatchForEdit = async () => {
                try {
                    const response = await fetch(`${apiBaseUrl}/batches/${id}`);
                    if (!response.ok) {
                        let msg = `Gagal mengambil data batch (ID: ${id}). Status: ${response.status}`;
                        try {
                            const errData = await response.json();
                            msg = errData.message || msg;
                        } catch (e) {}
                        throw new Error(msg);
                    }
                    const data: Batch = await response.json();
                    setInitialData(data);
                } catch (err) {
                    setPageError(err instanceof Error ? err.message : "Terjadi kesalahan.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchBatchForEdit();
        } else if (mode === "create") {
            setInitialData(null);
        }
    }, [mode, id, apiBaseUrl]);

    const handleFormSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setToastMessage("");

        let url = `${apiBaseUrl}/batches`;
        if (mode === "edit" && id) {
            url = `${apiBaseUrl}/batches/${id}`;
            formData.append("_method", "PUT");
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json",
                },
                credentials: 'include', // <-- PENTING untuk sesi
            });
            const responseData = await response.json();
            if (!response.ok) {
                let errorMessage = `Gagal ${mode === "create" ? "menyimpan" : "memperbarui"} batch.`;
                if (responseData && responseData.message) {
                    errorMessage = responseData.message;
                }
                if (responseData && responseData.errors) {
                    const validationErrors = Object.values(responseData.errors).flat().join(" \n");
                    errorMessage = `Data tidak valid:\n${validationErrors}`;
                }
                throw new Error(errorMessage);
            }

            setToastMessage(`Batch berhasil ${mode === "create" ? "dibuat" : "diperbarui"}!`);
            setToastType("success");
            setTimeout(() => {
                navigate("/admin/batches", { state: { refresh: true } });
            }, 1500);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat mengirimkan data.";
            setSubmitError(errorMessage);
            setToastMessage(errorMessage);
            setToastType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && mode === "edit") {
        return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner /></div>;
    }
    if (pageError && mode === "edit") {
        return <div className="container mx-auto p-6 text-center text-red-600 bg-red-50 rounded-lg shadow"><p>{pageError}</p></div>;
    }
    if (mode === "edit" && !initialData && !isLoading) {
        return <div className="container mx-auto p-6 text-center text-orange-600 bg-orange-50 rounded-lg shadow"><p>Batch tidak ditemukan.</p></div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 relative">
            {toastMessage && <ToastNotification message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />}
            <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                {mode === "create" ? "Tambah Batch Order Baru" : "Edit Batch Order"}
            </h1>
            <BatchForm
                initialData={initialData}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                mode={mode}
                submitError={submitError}
            />
        </div>
    );
};

export default AdminBatchFormPage;