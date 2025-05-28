import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BatchOrder } from '../../types';
import { getAllBatches, deleteBatch, REGION_LABELS, BUTTON_COLOR, BUTTON_TEXT_COLOR, PRIMARY_COLOR } from '../../constants';
import LoadingSpinner from '../../components/LoadingSpinner';
import InfoIcon from '../../components/icons/InfoIcon';

// Simple SVG Icons for actions
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.242.078 3.223.224M5 5a48.068 48.068 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;


const AdminBatchListPage: React.FC = () => {
  const [batches, setBatches] = useState<BatchOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setIsLoading(true);
    setTimeout(() => {
      setBatches(getAllBatches());
      setIsLoading(false);
    }, 200); 
  }, []);

  const handleDeleteBatch = (batchId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus batch ini?')) {
      const success = deleteBatch(batchId);
      if (success) {
        setBatches(prevBatches => prevBatches.filter(b => b.id !== batchId));
      } else {
        alert('Gagal menghapus batch.');
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-poppins text-3xl font-bold text-black">Kelola Batch Orders</h1>
        <Link
          to="/admin/batches/new"
          className="font-inter inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-300"
          style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
        >
          + Tambah Batch Baru
        </Link>
      </div>

      {batches.length === 0 ? (
        <div className="text-center py-12 bg-white p-8 rounded-lg shadow">
            <InfoIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="font-inter text-xl text-gray-600">
            Belum ada batch yang dibuat.
            </p>
            <p className="font-inter text-sm text-gray-500 mt-2">
            Klik tombol "Tambah Batch Baru" untuk memulai.
            </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 font-inter">
            <thead style={{backgroundColor: PRIMARY_COLOR}}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Judul</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Region</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Tanggal Berangkat</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-yellow-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={batch.title}>{batch.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{REGION_LABELS[batch.region]}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      batch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {batch.status === 'active' ? 'Aktif' : 'Ditutup'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.departureDate ? new Date(batch.departureDate).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <Link to={`/admin/batches/edit/${batch.id}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center" title="Edit">
                      <EditIcon /> <span className="sr-only">Edit</span>
                    </Link>
                    <button onClick={() => handleDeleteBatch(batch.id)} className="text-red-600 hover:text-red-900 inline-flex items-center" title="Hapus">
                      <DeleteIcon /> <span className="sr-only">Hapus</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBatchListPage;
