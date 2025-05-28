
import React from 'react';
import { BatchOrder } from '../types';
import BatchCard from './BatchCard';
import InfoIcon from './icons/InfoIcon';

interface BatchListProps {
  batches: BatchOrder[];
}

const BatchList: React.FC<BatchListProps> = ({ batches }) => {
  if (batches.length === 0) {
    return (
      <div className="text-center py-12">
        <InfoIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="font-inter text-xl text-gray-600">
          Belum ada batch yang tersedia untuk filter ini.
        </p>
        <p className="font-inter text-sm text-gray-500 mt-2">
          Silakan coba filter lain atau cek kembali nanti.
        </p>
      </div>
    );
  }

  return (
    <div id="batch-listing" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 py-8">
      {batches.map((batch) => (
        <BatchCard key={batch.id} batch={batch} />
      ))}
    </div>
  );
};

export default BatchList;
