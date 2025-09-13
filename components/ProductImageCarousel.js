import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ProductImageCarousel({ images, productName, className = "", autoSlideMs = 3500 }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Si pas d'images multiples, utiliser l'image par défaut
  if (!images || images.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <Image
          width={3000}
          height={1000}
          src="/images/garden.png"
          alt={productName}
          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onError={(e) => {
            e.currentTarget.src = '/images/garden.png';
          }}
        />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Auto-slide
  useEffect(() => {
    if (!images || images.length <= 1) return;
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, Math.max(2000, autoSlideMs));
    return () => clearInterval(timer);
  }, [images, autoSlideMs, isHovered]);

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image principale */}
      <div className="relative overflow-hidden h-full">
        <Image
          width={3000}
          height={1000}
          src={images[currentImageIndex]?.image_url || '/images/garden.png'}
          alt={images[currentImageIndex]?.image_alt || productName}
          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onError={(e) => {
            e.currentTarget.src = '/images/garden.png';
          }}
        />
        
        {/* Boutons de navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Indicateurs de navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex
                  ? 'bg-white shadow-lg'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Compteur d'images */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

