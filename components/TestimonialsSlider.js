'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

export default function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Aïcha Diop",
      role: "Styliste",
      location: "Dakar, Sénégal",
      image: "/images/kya.jpg",
      rating: 5,
      text: "Garden Concept Store a transformé ma façon de voir la mode. Leur sélection de créateurs africains est exceptionnelle. Chaque pièce raconte une histoire et reflète parfaitement mon style.",
      purchase: "Robe Midi Zara + Stan Smith Adidas"
    },
    {
      id: 2,
      name: "Moussa Fall",
      role: "Entrepreneur",
      location: "Thiès, Sénégal",
      image: "/images/kya2.jpg",
      rating: 5,
      text: "Service client impeccable et livraison rapide. Les conseils de l'équipe m'ont aidé à trouver exactement ce que je cherchais. Je recommande vivement Garden à tous mes amis.",
      purchase: "Ultraboost 22 + Heattech Uniqlo"
    },
    {
      id: 3,
      name: "Fatou Sarr",
      role: "Journaliste Mode",
      location: "Saint-Louis, Sénégal",
      image: "/images/w1.jpg",
      rating: 5,
      text: "En tant que journaliste mode, je suis très exigeante sur la qualité. Garden Concept Store dépasse toutes mes attentes. Leur curation est parfaite et leur engagement envers les créateurs africains est admirable.",
      purchase: "Collection Été 2025"
    },
    {
      id: 4,
      name: "Ibrahima Ba",
      role: "Architecte",
      location: "Kaolack, Sénégal",
      image: "/images/g5.jpg",
      rating: 5,
      text: "L'expérience d'achat chez Garden est unique. L'interface est intuitive, les produits sont de qualité premium, et l'équipe est toujours disponible pour répondre à mes questions.",
      purchase: "Air Max 270 + Robe Été H&M"
    },
    {
      id: 5,
      name: "Mariama Diallo",
      role: "Influenceuse",
      location: "Bamako, Mali",
      image: "/images/g6.jpg",
      rating: 5,
      text: "Garden Concept Store est devenu ma référence pour la mode africaine contemporaine. Leur approche inclusive et leur soutien aux créateurs locaux me touchent profondément.",
      purchase: "Créateurs Exclusifs"
    }
  ];

  const [isMobile, setIsMobile] = useState(false);
  const itemsPerView = isMobile ? 1 : 2;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

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
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-black text-white rounded-full text-sm font-medium mb-4">
            💬 Témoignages
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">
            Ce Que Disent Nos Clients
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Découvrez pourquoi nos clients nous font confiance pour leur style
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`flex-shrink-0 px-4 ${isMobile ? 'w-full' : 'w-1/2'}`}
              >
                <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 text-green-100 group-hover:text-green-200 transition-colors duration-300">
                    <Quote className="w-12 h-12" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Rating */}
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-lg text-gray-700 leading-relaxed mb-8 italic">
                      "{testimonial.text}"
                    </blockquote>

                    {/* Purchase Info */}
                    <div className="mb-8">
                      <p className="text-sm text-gray-500 mb-2">Dernier achat :</p>
                      <p className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                        {testimonial.purchase}
                      </p>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center">
                      <div className="relative">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={60}
                          height={60}
                          className="rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-900 text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {testimonial.role}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-4 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group ${
              isMobile ? '-translate-x-3' : '-translate-x-6'
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-green-600 group-hover:scale-110 transition-all" />
          </button>
          
          <button
            onClick={nextSlide}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-4 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group ${
              isMobile ? 'translate-x-3' : 'translate-x-6'
            }`}
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-green-600 group-hover:scale-110 transition-all" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-12 space-x-3">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-green-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Note moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">2,500+</div>
            <div className="text-gray-600">Clients satisfaits</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-gray-600">Recommandent Garden</div>
          </div>
        </div>
      </div>
    </section>
  );
}
