import React from 'react';
import { Link } from 'react-router-dom';
import { getAllBatches } from '../../constants'; // To get batch count
import { PRIMARY_COLOR, BUTTON_COLOR, BUTTON_TEXT_COLOR } from '../../constants';

const AdminDashboardPage: React.FC = () => {
  const totalBatches = getAllBatches().length;
  const activeBatches = getAllBatches().filter(b => b.status === 'active').length;

  return (
    <div>
      <h1 className="font-poppins text-3xl font-bold text-black mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-poppins text-xl font-semibold text-black">Total Batch Orders</h3>
          <p className="font-inter text-4xl font-bold mt-2" style={{ color: PRIMARY_COLOR }}>{totalBatches}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-poppins text-xl font-semibold text-black">Batch Aktif</h3>
          <p className="font-inter text-4xl font-bold mt-2" style={{ color: PRIMARY_COLOR }}>{activeBatches}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center">
           <h3 className="font-poppins text-xl font-semibold text-black mb-3">Aksi Cepat</h3>
          <Link
            to="/admin/batches/new"
            className="font-inter inline-block px-6 py-3 text-sm font-semibold rounded-lg transition-colors duration-300 text-center w-full"
            style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
          >
            Buat Batch Baru
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="font-poppins text-2xl font-semibold text-black mb-4">Selamat Datang!</h2>
        <p className="font-inter text-gray-700">
          Ini adalah panel admin Andiamo.id. Dari sini Anda dapat mengelola batch order,
          mengubah pengaturan, dan memantau aktivitas situs.
        </p>
        <p className="font-inter text-gray-700 mt-2">
          Gunakan navigasi di sebelah kiri untuk mengakses berbagai fitur.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
