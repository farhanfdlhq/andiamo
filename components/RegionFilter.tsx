
import React from 'react';
import { Region, RegionFilterOption } from '../types';
import { REGION_FILTERS, PRIMARY_COLOR } from '../constants';

interface RegionFilterProps {
  selectedRegion: Region | "all";
  onSelectRegion: (region: Region | "all") => void;
}

const RegionFilter: React.FC<RegionFilterProps> = ({ selectedRegion, onSelectRegion }) => {
  return (
    <div className="my-8 flex justify-center space-x-2 sm:space-x-4 flex-wrap">
      {REGION_FILTERS.map((regionOpt) => (
        <button
          key={regionOpt.value}
          onClick={() => onSelectRegion(regionOpt.value)}
          className={`font-inter font-medium py-2 px-4 rounded-md transition-all duration-200 ease-in-out text-sm sm:text-base mb-2
            ${selectedRegion === regionOpt.value 
              ? `text-black shadow-lg transform scale-105` 
              : `text-gray-600 hover:text-black hover:shadow-md`}
          `}
          style={{
            backgroundColor: selectedRegion === regionOpt.value ? PRIMARY_COLOR : '#FFFFFF',
            border: selectedRegion === regionOpt.value ? `2px solid ${PRIMARY_COLOR}` : '2px solid #E5E7EB'
          }}
        >
          {regionOpt.label}
        </button>
      ))}
    </div>
  );
};

export default RegionFilter;
