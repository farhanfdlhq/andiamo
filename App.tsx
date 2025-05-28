import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BatchDetailPage from './pages/BatchDetailPage';

// Admin imports
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBatchListPage from './pages/admin/AdminBatchListPage';
import AdminBatchFormPage from './pages/admin/AdminBatchFormPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import { useAuth } from './hooks/useAuth';

const ProtectedAdminRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <AdminLayout><Outlet /></AdminLayout>;
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
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/batch/:batchId" element={<BatchDetailPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/batches" element={<AdminBatchListPage />} />
          <Route path="/admin/batches/new" element={<AdminBatchFormPage />} />
          <Route path="/admin/batches/edit/:batchId" element={<AdminBatchFormPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
           <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
        
        {/* Fallback for any other undefined public routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;