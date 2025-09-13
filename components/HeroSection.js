'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "GARDEN CONCEPT STORE",
      subtitle: "Découvrez l'Art de la Mode",
      description: "Une sélection pointue de créateurs africains et internationaux. L'avant-garde de la mode vous attend.",
      image: "/images/kya2.jpg",
      buttonText: "Découvrir la Collection",
      buttonLink: "/produits",
      overlay: "rgba(0,0,0,0.4)"
    },
    {
      id: 2,
      title: "NOUVELLE COLLECTION",
      subtitle: "Été 2025",
      description: "Des créations exclusives qui célèbrent l'élégance et l'authenticité. Portez votre style avec confiance.",
      image: "/images/w1.jpg",
      buttonText: "Voir la Collection",
      buttonLink: "/collections/ete-2025",
      overlay: "rgba(0,0,0,0.3)"
    },
    {
      id: 3,
      title: "CRÉATEURS AFRICAINS",
      subtitle: "Talent & Innovation",
      description: "Mettons en avant les designers africains à travers des collaborations et échanges culturels uniques.",
      image: "/images/g5.jpg",
      buttonText: "Découvrir les Créateurs",
      buttonLink: "/createurs",
      overlay: "rgba(0,0,0,0.5)"
    },
    {
      id: 4,
      title: "EXCLUSIVITÉ",
      subtitle: "Produits Rares",
      description: "Des pièces distribuées exclusivement dans des concepts stores réputés dans le monde entier.",
      image: "/images/g6.jpg",
      buttonText: "Voir les Exclusivités",
      buttonLink: "/exclusivites",
      overlay: "rgba(0,0,0,0.4)"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Main Slider */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
                quality={95}
              />
              {/* Overlay */}
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: slide.overlay }}
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 sm:px-8 lg:px-16 max-w-6xl">
                {/* Subtitle */}
                <div className="mb-4">
                  <span className="text-lg sm:text-xl font-light tracking-widest uppercase opacity-90">
                    {slide.subtitle}
                  </span>
                </div>
                
                {/* Main Title */}
                <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>
                
                {/* Description */}
                <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-95">
                  {slide.description}
                </p>
                
                {/* CTA Button */}
                <button className="group relative px-8 py-4 bg-white text-black font-semibold text-lg rounded-full hover:bg-green-800 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <span className="relative z-10">{slide.buttonText}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/20 backdrop-blur-sm rounded-full hover:bg-green-800/30 transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/20 backdrop-blur-sm rounded-full hover:bg-green-800/30 transition-all duration-300 group"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 p-3 bg-black/20 backdrop-blur-sm rounded-full hover:bg-green-800/30 transition-all duration-300 group"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        ) : (
          <Play className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-green-800 scale-125' 
                : 'bg-white/50 hover:bg-green-800/70'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}