
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BatchOrder } from '../types';
import { SAMPLE_BATCHES, BUTTON_COLOR, BUTTON_TEXT_COLOR, PRIMARY_COLOR, REGION_LABELS } from '../constants';
import WhatsAppIcon from '../components/icons/WhatsAppIcon';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import ImageGallery from '../components/ImageGallery';
import LoadingSpinner from '../components/LoadingSpinner';
import InfoIcon from '../components/icons/InfoIcon';

const BatchDetailPage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [batch, setBatch] = useState<BatchOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const foundBatch = SAMPLE_BATCHES.find(b => b.id === batchId);
      setBatch(foundBatch || null);
      setIsLoading(false);
    }, 300);
  }, [batchId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!batch) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <InfoIcon className="w-20 h-20 mx-auto text-gray-400 mb-6" />
        <h2 className="font-poppins text-3xl font-bold text-red-600 mb-4">Batch Tidak Ditemukan</h2>
        <p className="font-inter text-lg text-gray-700 mb-8">
          Maaf, batch order yang Anda cari tidak dapat ditemukan. Mungkin sudah dihapus atau URL tidak valid.
        </p>
        <Link
          to="/"
          className="font-inter inline-flex items-center px-6 py-3 rounded-lg transition-colors duration-300"
          style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
        >
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          Kembali ke Daftar Batch
        </Link>
      </div>
    );
  }
  
  const isClosed = batch.status === 'closed';

  return (
    <div className="font-inter container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium transition-colors duration-300"
          style={{color: BUTTON_COLOR}}
          hover-style={{color: PRIMARY_COLOR}} // Note: pseudo-classes in style need JS or specific Tailwind setup
          onMouseOver={(e) => { e.currentTarget.style.color = PRIMARY_COLOR;}}
          onMouseOut={(e) => { e.currentTarget.style.color = BUTTON_COLOR;}}
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Kembali ke Daftar Batch
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ImageGallery images={batch.images} altText={batch.title} />
          </div>
          <div className="flex flex-col">
            <span 
                className="self-start px-3 py-1 mb-3 rounded-full text-xs font-semibold text-black shadow"
                style={{ backgroundColor: PRIMARY_COLOR }}
            >
                {REGION_LABELS[batch.region]}
            </span>
            <h1 className="font-poppins text-3xl sm:text-4xl font-bold text-black mb-4">{batch.title}</h1>
            
            {isClosed && (
                <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300">
                    <p className="font-bold font-poppins">Batch ini Telah Ditutup</p>
                    <p className="text-sm">Terima kasih atas partisipasinya. Nantikan batch selanjutnya!</p>
                </div>
            )}

            {batch.departureDate && (
                <p className="font-inter text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Perkiraan Berangkat:</span> {new Date(batch.departureDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            )}
            {batch.arrivalDate && (
                <p className="font-inter text-sm text-gray-600 mb-4">
                    <span className="font-semibold">Perkiraan Tiba:</span> {new Date(batch.arrivalDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            )}

            <div className="font-inter text-gray-700 prose prose-sm sm:prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: batch.description }} />
            
            <div className="mt-auto pt-6 border-t border-gray-200">
              <a
                href={batch.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter w-full flex items-center justify-center px-8 py-3 text-lg rounded-lg font-semibold transition-colors duration-300"
                style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
              >
                <WhatsAppIcon className="w-6 h-6 mr-3" />
                Hubungi Jastiper via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailPage;
