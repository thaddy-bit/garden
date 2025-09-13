'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BrandsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les marques depuis la base de données
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/marques');
        if (response.ok) {
          const data = await response.json();
          setBrands(Array.isArray(data) ? data : []);
        } else {
          console.error('Erreur lors du chargement des marques');
          setBrands([]);
        }
      } catch (error) {
        console.error('Erreur réseau:', error);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  const itemsPerView = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, brands.length - itemsPerView);

  // Détecter la taille d'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [maxIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Nos Marques Partenaires
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Découvrez les créateurs et marques qui font l'excellence de Garden Concept Store
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-black text-lg">Aucune marque disponible pour le moment.</p>
            </div>
          ) : (
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {brands.map((brand, index) => (
              <div
                key={brand.id}
                className={`flex-shrink-0 px-4 ${isMobile ? 'w-full' : 'w-1/4'}`}
              >
                  <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-50 h-full flex flex-col hover:bg-green-800 hover:text-white">
                    {/* Brand Logo */}
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                        <Image
                          src={brand.image_url || "/images/garden.png"}
                          alt={brand.nom}
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Brand Info */}
                    <div className="text-center flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-black mb-2 group-hover:text-white transition-colors line-clamp-2">
                          {brand.nom}
                        </h3>
                        <p className="text-sm text-black mb-2 font-medium group-hover:text-white transition-colors">
                          {brand.zone || 'Marque Partenaire'}
                        </p>
                      </div>
                      <p className="text-sm text-black leading-relaxed line-clamp-3 group-hover:text-white transition-colors">
                        {brand.description || 'Découvrez nos produits exclusifs'}
                      </p>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-green-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
              </div>
            ))}
          </div>
          )}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-black ${
              isMobile ? '-translate-x-2' : '-translate-x-4'
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-black group-hover:text-green-800 group-hover:scale-110 transition-all" />
          </button>
          
          <button
            onClick={nextSlide}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-black ${
              isMobile ? 'translate-x-2' : 'translate-x-4'
            }`}
          >
            <ChevronRight className="w-5 h-5 text-black group-hover:text-green-800 group-hover:scale-110 transition-all" />
          </button>
        </div>

        {/* Dots Indicator */}
        {!loading && brands.length > 0 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-green-800 scale-125' 
                  : 'bg-black hover:bg-green-800'
              }`}
            />
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
