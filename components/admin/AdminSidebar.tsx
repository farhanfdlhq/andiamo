// Andiamo/components/admin/AdminSidebar.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Pastikan path benar
import {
  APP_NAME,
  SECONDARY_COLOR, // Warna latar sidebar
  PRIMARY_COLOR, // Warna aksen
  // BUTTON_TEXT_COLOR, // Mungkin tidak terpakai langsung di sini
} from "../../constants"; // Pastikan path benar

// Anda bisa menggunakan ikon SVG asli jika ada, atau biarkan emoji untuk sementara
const DashboardIcon = () => (
  <span className="mr-3 w-5 h-5 inline-block text-center">📊</span>
);
const BatchIcon = () => (
  <span className="mr-3 w-5 h-5 inline-block text-center">📦</span>
);
const SettingsIcon = () => (
  <span className="mr-3 w-5 h-5 inline-block text-center">⚙️</span>
);
const ProfileIcon = () => (
  <span className="mr-3 w-5 h-5 inline-block text-center">👤</span>
); // Tambahkan ikon profil
const LogoutIcon = () => (
  <span className="mr-3 w-5 h-5 inline-block text-center">🚪</span>
);

const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Jadikan async jika logout di AuthContext async
    await logout(); // Tunggu proses logout selesai
    navigate("/admin/login");
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 group ${
      isActive
        ? `text-white` // Teks putih untuk link aktif jika backgroundnya PRIMARY_COLOR
        : `text-gray-300 hover:text-white hover:bg-opacity-20 hover:bg-white` // Efek hover
    } ${isActive ? "font-semibold" : "font-normal"}`;

  const activeStyle = {
    backgroundColor: PRIMARY_COLOR || "#2563eb", // Fallback jika PRIMARY_COLOR undefined
  };

  return (
    <div
      className="w-64 h-full flex flex-col shadow-lg" // h-full akan merujuk ke h-screen dari parent
      style={{ backgroundColor: SECONDARY_COLOR || "#1f2937" }} // Fallback jika SECONDARY_COLOR undefined
    >
      <div
        className="px-6 py-5 flex items-center" // Tinggi header sidebar bisa disesuaikan di sini
        style={{ borderBottom: `1px solid rgba(255,255,255,0.1)` }} // Garis bawah yang lebih soft
      >
        {/* Anda bisa menambahkan LogoIcon di sini jika ada */}
        {/* <LogoIcon className="h-8 w-auto mr-2" style={{ fill: PRIMARY_COLOR }} /> */}
        <h1
          className="font-poppins text-xl font-bold"
          style={{ color: PRIMARY_COLOR || "#eff6ff" }} // Warna teks logo
        >
          {APP_NAME}
        </h1>
        <span
          className="ml-2 text-xs font-semibold px-2 py-0.5 rounded"
          style={{
            backgroundColor: PRIMARY_COLOR || "#2563eb",
            color: SECONDARY_COLOR || "#eff6ff",
          }} // Kontras warna
        >
          ADMIN
        </span>
      </div>
      <nav className="flex-grow p-4 space-y-1.5">
        {" "}
        {/* Kurangi space-y jika terlalu renggang */}
        <NavLink
          to="/admin/dashboard"
          className={navLinkClasses}
          style={({ isActive }) => (isActive ? activeStyle : {})}
        >
          <DashboardIcon /> Dashboard
        </NavLink>
        <NavLink
          to="/admin/batches"
          className={navLinkClasses}
          style={({ isActive }) => (isActive ? activeStyle : {})}
        >
          <BatchIcon /> Kelola Batch
        </NavLink>
        <NavLink
          to="/admin/settings"
          className={navLinkClasses}
          style={({ isActive }) => (isActive ? activeStyle : {})}
        >
          <SettingsIcon /> Pengaturan
        </NavLink>
        <NavLink
          to="/admin/profile"
          className={navLinkClasses} // Gunakan fungsi className yang konsisten
          style={({ isActive }) => (isActive ? activeStyle : {})} // Terapkan activeStyle
        >
          <ProfileIcon /> Edit Profil
        </NavLink>
      </nav>
      <div
        className="p-4 mt-auto" // mt-auto akan mendorong ini ke bawah
        style={{ borderTop: `1px solid rgba(255,255,255,0.1)` }} // Garis atas yang lebih soft
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 group text-gray-300 hover:bg-red-600 hover:text-white"
        >
          <LogoutIcon /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
