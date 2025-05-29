// components/BatchList.tsx
import React from "react";
import BatchCard from "./BatchCard";
import { Batch } from "../types"; // Pastikan menggunakan tipe Batch yang baru

interface BatchListProps {
  batches: Batch[];
}

const BatchList: React.FC<BatchListProps> = ({ batches }) => {
  if (batches.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        Saat ini belum ada batch yang tersedia.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 py-8">
      {batches.map((batch) => (
        <BatchCard key={batch.id} batch={batch} />
      ))}
    </div>
  );
};

export default BatchList;
