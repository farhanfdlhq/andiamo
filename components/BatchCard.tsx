
import React from 'react';
import { Link } from 'react-router-dom';
import { BatchOrder } from '../types';
import { BUTTON_COLOR, BUTTON_TEXT_COLOR, PRIMARY_COLOR, REGION_LABELS } from '../constants';
import WhatsAppIcon from './icons/WhatsAppIcon';

interface BatchCardProps {
  batch: BatchOrder;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch }) => {
  const isClosed = batch.status === 'closed';

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl ${isClosed ? 'opacity-70' : ''}`}>
      <div className="relative">
        <img 
          src={batch.images[0] || 'https://picsum.photos/800/600?grayscale'} 
          alt={batch.title} 
          className="w-full h-56 object-cover" 
        />
        {isClosed && (
          <div 
            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          >
            <span className="font-poppins text-white text-2xl font-bold border-2 border-white px-4 py-2 rounded">CLOSED</span>
          </div>
        )}
        <div 
            className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold text-black shadow"
            style={{ backgroundColor: PRIMARY_COLOR }}
        >
            {REGION_LABELS[batch.region]}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-poppins text-xl font-bold text-black mb-2 truncate" title={batch.title}>
          {batch.title}
        </h3>
        <p className="font-inter text-gray-700 text-sm mb-4 flex-grow min-h-[60px]">
          {batch.shortDescription}
        </p>
        
        {batch.departureDate && (
            <p className="font-inter text-xs text-gray-500 mb-1">
                Perk. Berangkat: {new Date(batch.departureDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        )}
        {batch.arrivalDate && (
            <p className="font-inter text-xs text-gray-500 mb-3">
                Perk. Tiba: {new Date(batch.arrivalDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        )}

        <div className="mt-auto space-y-3">
          <Link
            to={`/batch/${batch.id}`}
            className="font-inter w-full block text-center px-6 py-2.5 rounded-md text-sm font-medium transition-colors duration-300 border-2"
            style={{ borderColor: BUTTON_COLOR, color: BUTTON_COLOR, backgroundColor: 'white' }}
            hover-style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }} // Note: pseudo-classes in style need JS or specific Tailwind setup
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = BUTTON_COLOR; e.currentTarget.style.color = BUTTON_TEXT_COLOR;}}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = BUTTON_COLOR;}}
          >
            Lihat Detail
          </Link>
          <a
            href={batch.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter w-full flex items-center justify-center px-6 py-2.5 rounded-md text-sm font-medium transition-colors duration-300"
            style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
          >
            <WhatsAppIcon className="w-5 h-5 mr-2" />
            Hubungi via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default BatchCard;
