// farhanfdlhq/andiamo/andiamo-fd98185f31cea406843a54513c763dd912491ed9/pages/HomePage.tsx
import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import RegionFilter from "../components/RegionFilter";
import BatchList from "../components/BatchList";
import { Batch, Region } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | "all">("all");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBatchesFromAPI = async () => {
      setIsLoading(true);
      setError(null);
      let url = `${apiBaseUrl}/batches`;
      if (selectedRegion !== "all") {
        url += `?region=${selectedRegion}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Biarkan error message default jika tidak ada JSON
          }
          throw new Error(errorMessage);
        }
        let data: Batch[] = await response.json();
        data = data.map((b) => ({
          ...b,
          image_urls: Array.isArray(b.image_urls)
            ? b.image_urls.filter(
                (url) => typeof url === "string" && url.trim() !== ""
              )
            : [],
        }));
        setBatches(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching batches.");
        }
        console.error("Error fetching batches:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (apiBaseUrl) {
      fetchBatchesFromAPI();
    } else {
      setError("VITE_API_BASE_URL is not configured.");
      setIsLoading(false);
    }
  }, [selectedRegion, apiBaseUrl]);

  return (
    <div className="font-inter">
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-poppins text-3xl font-bold text-center my-8 text-black">
          Batch Jastip Aktif
        </h2>
        <RegionFilter
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {isLoading && (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-md my-6">
            <p>Error: {error}</p>
          </div>
        )}
        {!isLoading && !error && <BatchList batches={batches} />}
      </div>
    </div>
  );
};

export default HomePage;
