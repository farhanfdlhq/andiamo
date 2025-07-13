// Andiamo/components/admin/AdminSidebar.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { APP_NAME, SECONDARY_COLOR, PRIMARY_COLOR } from "../../constants";

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="mr-3 w-5 h-5 inline-block text-center">{children}</span>
);

const navItems = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: <Icon>📊</Icon>,
  },
  {
    to: "/admin/batches",
    label: "Kelola Batch",
    icon: <Icon>📦</Icon>,
  },
  {
    to: "/admin/settings",
    label: "Pengaturan",
    icon: <Icon>⚙️</Icon>,
  },
  {
    to: "/admin/profile",
    label: "Edit Profil",
    icon: <Icon>👤</Icon>,
  },
];

const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 group ${
      isActive
        ? "text-black bg-yellow-400 font-semibold"
        : "text-white hover:text-yellow-400 hover:bg-black hover:font-semibold"
    }`;

  const activeStyle = {
    backgroundColor: PRIMARY_COLOR || "#2563eb",
  };

  return (
    <div
      className="w-64 h-full flex flex-col shadow-lg"
      style={{ backgroundColor: SECONDARY_COLOR || "#1f2937" }}
    >
      <div
        className="px-6 py-5 flex items-center"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <h1
          className="font-poppins text-xl font-bold"
          style={{ color: PRIMARY_COLOR || "#eff6ff" }}
        >
          {APP_NAME}
        </h1>
        <span
          className="ml-2 text-xs font-semibold px-2 py-0.5 rounded"
          style={{
            backgroundColor: PRIMARY_COLOR || "#2563eb",
            color: SECONDARY_COLOR || "#eff6ff",
          }}
        >
          ADMIN
        </span>
      </div>
      <nav className="flex-grow p-4 space-y-1.5">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={navLinkClasses}
            style={({ isActive }) => (isActive ? activeStyle : {})}
          >
            {icon} {label}
          </NavLink>
        ))}
      </nav>
      <div
        className="p-4 mt-auto"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 group text-gray-300 hover:bg-red-600 hover:text-white"
        >
          <Icon>🚪</Icon> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
