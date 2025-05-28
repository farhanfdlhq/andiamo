
import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import RegionFilter from '../components/RegionFilter';
import BatchList from '../components/BatchList';
import { BatchOrder, Region } from '../types';
import { SAMPLE_BATCHES } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';


const HomePage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | "all">("all");
  const [filteredBatches, setFilteredBatches] = useState<BatchOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (selectedRegion === "all") {
        setFilteredBatches(SAMPLE_BATCHES);
      } else {
        setFilteredBatches(SAMPLE_BATCHES.filter(batch => batch.region === selectedRegion));
      }
      setIsLoading(false);
    }, 300); // Short delay to show spinner
  }, [selectedRegion]);

  return (
    <div className="font-inter">
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-poppins text-3xl font-bold text-center my-8 text-black">
          Batch Jastip Aktif
        </h2>
        <RegionFilter selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />
        {isLoading ? <LoadingSpinner /> : <BatchList batches={filteredBatches} />}
      </div>
    </div>
  );
};

export default HomePage;
