
import React, { useState } from 'react';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import { BUTTON_COLOR, BUTTON_TEXT_COLOR } from '../constants';

interface ImageGalleryProps {
  images: string[];
  altText: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, altText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500 font-inter">Tidak ada gambar tersedia.</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-lg shadow-lg bg-gray-100">
        <img 
          src={images[currentIndex]} 
          alt={`${altText} - Gambar ${currentIndex + 1}`} 
          className="w-full h-auto max-h-[500px] object-contain transition-opacity duration-300 ease-in-out" 
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 p-2 rounded-full shadow-md focus:outline-none transition-opacity hover:opacity-100 opacity-80"
            style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
            aria-label="Gambar Sebelumnya"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 p-2 rounded-full shadow-md focus:outline-none transition-opacity hover:opacity-100 opacity-80"
            style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
            aria-label="Gambar Berikutnya"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageGallery;
