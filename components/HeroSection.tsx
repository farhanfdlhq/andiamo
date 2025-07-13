
import React from 'react';
import { PRIMARY_COLOR, BUTTON_COLOR, BUTTON_TEXT_COLOR } from '../constants';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
          Selamat Datang di <span style={{ color: PRIMARY_COLOR }}>Andiamo.id</span>
        </h1>
        <p className="font-inter mt-6 text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
          Platform Jastip terpercaya Anda dari Indonesia ke Italia dan sebaliknya.
          Temukan batch order terbaru dan titip barang impianmu dengan mudah!
        </p>
        <div className="mt-10">
          <a
            href="#batch-listing" // Smooth scroll to batch listing
            className="font-inter inline-block px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300"
            style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
          >
            Yuk, Jastip Sekarang!
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
