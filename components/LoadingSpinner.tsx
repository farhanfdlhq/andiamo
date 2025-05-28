
import React from 'react';
import { PRIMARY_COLOR } from '../constants';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div 
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
        style={{ borderColor: PRIMARY_COLOR, borderTopColor: 'transparent' }}
      ></div>
      <p className="ml-3 font-inter text-gray-700">Memuat...</p>
    </div>
  );
};

export default LoadingSpinner;
