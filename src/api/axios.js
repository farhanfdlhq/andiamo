import axios from 'axios';

// Buat instance Axios dengan konfigurasi dasar
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Mengambil dari .env Anda
  withCredentials: true, // WAJIB! Agar cookie bisa dikirim dan diterima
});

// Axios akan secara otomatis menangani header X-XSRF-TOKEN untuk Anda.
// Anda tidak perlu melakukan apa-apa lagi.

export default apiClient;