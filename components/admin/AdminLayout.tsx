// Andiamo/components/admin/AdminLayout.tsx
import React, { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar"; // Pastikan path benar
import Header from "../Header"; // 1. Import komponen Header dari direktori components

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
        {/* 2. Tambahkan komponen Header di sini */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
