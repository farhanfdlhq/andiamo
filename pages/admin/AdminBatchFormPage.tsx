import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BatchForm from '../../components/admin/BatchForm';
import { BatchOrder } from '../../types';
import { getBatchById, addBatch, updateBatch } from '../../constants'; // Using direct functions for demo
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminBatchFormPage: React.FC = () => {
  const { batchId } = useParams<{ batchId?: string }>();
  const navigate = useNavigate();
  const [initialBatch, setInitialBatch] = useState<BatchOrder | null | undefined>(undefined); // undefined for loading, null if not found/new
  const isEditMode = Boolean(batchId);

  useEffect(() => {
    if (isEditMode && batchId) {
      const foundBatch = getBatchById(batchId);
      setInitialBatch(foundBatch); // Will be BatchOrder or undefined if not found
    } else {
      setInitialBatch(null); // For new batch
    }
  }, [batchId, isEditMode]);

  const handleSubmit = (batchData: Omit<BatchOrder, 'id'> | BatchOrder) => {
    if (isEditMode && batchId) {
      updateBatch(batchId, batchData as Partial<Omit<BatchOrder, 'id'>>);
    } else {
      addBatch(batchData as Omit<BatchOrder, 'id'>);
    }
    navigate('/admin/batches');
  };

  if (isEditMode && initialBatch === undefined) {
    return <LoadingSpinner />; // Show loader while fetching batch for edit
  }
  
  if (isEditMode && !initialBatch) {
     return (
        <div className="text-center py-10">
            <h2 className="font-poppins text-2xl font-bold text-red-600 mb-4">Batch Tidak Ditemukan</h2>
            <p className="font-inter text-gray-700">Batch dengan ID ini tidak dapat ditemukan.</p>
        </div>
     )
  }


  return (
    <div>
      <h1 className="font-poppins text-3xl font-bold text-black mb-8">
        {isEditMode ? 'Edit Batch Order' : 'Buat Batch Order Baru'}
      </h1>
      <BatchForm
        initialBatch={initialBatch} // Will be BatchOrder or null
        onSubmit={handleSubmit}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default AdminBatchFormPage;
