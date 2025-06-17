import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import BatchDetailPage from "./pages/BatchDetailPage";

// Admin imports
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminBatchListPage from "./pages/admin/AdminBatchListPage";
import AdminBatchFormPage from "./pages/admin/AdminBatchFormPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import { useAuth } from "./hooks/useAuth";

const ProtectedAdminRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth(); // Ambil juga isLoading
  const location = useLocation();

  if (isLoading) {
    // Jika AuthContext masih loading status otentikasi awal
    console.log("ProtectedAdminRoute: Auth context is loading..."); // DEBUG
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />{" "}
        {/* Pastikan LoadingSpinner adalah komponen yang valid */}
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(
      "ProtectedAdminRoute: Not authenticated, redirecting to login."
    ); // DEBUG
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log("ProtectedAdminRoute: Authenticated, rendering admin layout."); // DEBUG
  return (
    <AdminLayout>
      {" "}
      {/* Pastikan AdminLayout adalah komponen yang valid */}
      <Outlet />
    </AdminLayout>
  );
};

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* Ganti :batchId menjadi :id agar konsisten dengan useParams di AdminBatchFormPage */}
          <Route path="/batch/:id" element={<BatchDetailPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/batches" element={<AdminBatchListPage />} />
          <Route
            path="/admin/batches/new"
            element={<AdminBatchFormPage mode="create" />}
          />
          <Route
            path="/admin/batches/edit/:id"
            element={<AdminBatchFormPage mode="edit" />}
          />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />{" "}
          {/* RUTE BARU */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
        </Route>

        {/* Fallback untuk path yang tidak terdefinisi */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;