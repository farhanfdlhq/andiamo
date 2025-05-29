// Andiamo/components/admin/AdminLayout.tsx
import React, { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar"; // Pastikan path benar

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar/header admin jika ada, bisa ditambahkan di sini */}
        {/* <AdminHeader /> */}

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
