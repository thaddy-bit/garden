'use client';

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

const HeroSlider = () => {
  // Configuration du slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    fade: true,
    cssEase: 'linear'
  };

  // Tableau de vos images (remplacez par vos propres images)
  const slides = [
    {
      id: 1,
      title: "Promotion d'été",
      description: "Découvrez nos offres spéciales",
      image: "/images/g5.jpg",
      buttonText: "Voir les offres"
    },
    {
      id: 2,
      title: "Nouvelle collection",
      description: "Découvrez les dernières tendances",
      image: "/images/g6.jpg",
      buttonText: "Découvrir"
    },
    {
      id: 3,
      title: "Livraison gratuite",
      description: "Sur toutes les commandes de plus de 50€",
      image: "/images/g2.jpg",
      buttonText: "En savoir plus"
    },
    {
      id: 4,
      title: "Cadeaux exclusifs",
      description: "Pour vos commandes spéciales",
      image: "/images/g4.jpg",
      buttonText: "Offrir maintenant"
    }
  ];

  return (
    <div className="relative w-full h-[500px] overflow-hidden mb-30">
      <Slider {...settings} className="h-full">
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-[500px] w-full">
            {/* Image de fond */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              <div className=" inset-0 bg-black bg-opacity-50"></div>
            </div>
            
            {/* Contenu superposé */}
            <div className="relative z-10 flex flex-col items-start justify-center h-full px-8 sm:px-16 lg:px-24 text-white">
              <h2 className="text-4xl sm:text-5xl text-white lg:text-6xl font-bold mb-4 animate-fadeIn">
                {slide.title}
              </h2>
              <p className="text-xl sm:text-2xl text-white mb-9 max-w-lg animate-fadeIn delay-100">
                {slide.description}
              </p>
              <button className="px-8 py-3 bg-green-900 hover:bg-green-800 rounded-md text-lg font-medium transition-colors animate-fadeIn delay-200">
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </Slider>

      {/* Styles personnalisés pour les flèches et les points */}
      <style jsx global>{`
        .slick-prev, .slick-next {
          width: 40px;
          height: 40px;
          z-index: 10;
        }
        .slick-prev:before, .slick-next:before {
          font-size: 45px;
          color: green;
        }
        .slick-prev {
          left: 20px;
        }
        .slick-next {
          right: 20px;
        }
        .slick-dots {
          bottom: 20px;
        }
        .slick-dots li button:before {
          font-size: 12px;
          color: white;
        }
        .slick-dots li.slick-active button:before {
          color: #074719FF; /* Couleur indigo-600 */
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;