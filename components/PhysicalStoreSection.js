'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Clock, Users, Square, Star, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export default function PhysicalStoreSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const storeImages = [
    {
      id: 1,
      src: "/images/kya2.jpg",
      title: "Niveau 1 - Accueil & Collections",
      description: "Découvrez nos collections exclusives dans un espace moderne et chaleureux"
    },
    {
      id: 2,
      src: "/images/w1.jpg",
      title: "Niveau 2 - Créateurs Africains",
      description: "Un espace dédié aux talents africains et aux collaborations uniques"
    },
    {
      id: 3,
      src: "/images/g5.jpg",
      title: "Niveau 3 - Exclusivités",
      description: "Des pièces rares distribuées exclusivement dans des concepts stores réputés"
    },
    {
      id: 4,
      src: "/images/g6.jpg",
      title: "Niveau 4 - Espace VIP",
      description: "Un lieu privé pour nos clients les plus fidèles et les événements spéciaux"
    }
  ];

  const storeStats = [
    {
      icon: <Square className="w-8 h-8" />,
      number: "800",
      unit: "m²",
      label: "Superficie totale",
      color: "text-green-800"
    },
    {
      icon: <Users className="w-8 h-8" />,
      number: "20+",
      unit: "",
      label: "Personnes dans l'équipe",
      color: "text-black"
    },
    {
      icon: <Star className="w-8 h-8" />,
      number: "4",
      unit: "niveaux",
      label: "Dédiés à la mode",
      color: "text-green-800"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      number: "10h",
      unit: "/jour",
      label: "Ouvert tous les jours",
      color: "text-black"
    }
  ];

  const services = [
    {
      title: "Conseil Styliste",
      description: "Notre équipe vous aide à créer des looks parfaits",
      icon: "👗"
    },
    {
      title: "Essayage Privé",
      description: "Cabines d'essayage spacieuses et confortables",
      icon: "🪞"
    },
    {
      title: "Personnalisation",
      description: "Services de retouche et personnalisation sur mesure",
      icon: "✂️"
    },
    {
      title: "Événements Exclusifs",
      description: "Lancements de collections et rencontres créateurs",
      icon: "🎉"
    }
  ];

  const events = [
    {
      date: "15 Sept 2025",
      title: "Lancement Collection Été",
      description: "Découvrez les dernières créations de nos créateurs partenaires",
      type: "Lancement"
    },
    {
      date: "22 Sept 2025",
      title: "Rencontre avec les Créateurs",
      description: "Échangez avec les designers africains de notre sélection",
      type: "Rencontre"
    },
    {
      date: "30 Sept 2025",
      title: "Soirée VIP",
      description: "Événement privé pour nos clients les plus fidèles",
      type: "VIP"
    }
  ];

  // Auto-play pour les images
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % storeImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, storeImages.length]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % storeImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + storeImages.length) % storeImages.length);
  };

  const goToImage = (index) => {
    setCurrentImage(index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-black text-white rounded-full text-sm font-medium mb-4">
            🏪 Notre Boutique Physique
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">
            Découvrez Garden Concept Store
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Une expérience unique sur 800m² répartis sur 4 niveaux, dédiés à l'art de la mode
          </p>
        </div>

        {/* Hero Gallery */}
        <div className="relative mb-20">
          <div className="relative h-96 sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            {storeImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                    {image.title}
                  </h3>
                  <p className="text-lg opacity-90 max-w-2xl">
                    {image.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/20 backdrop-blur-sm rounded-full hover:bg-green-800/30 transition-all duration-300 group"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/20 backdrop-blur-sm rounded-full hover:bg-green-800/30 transition-all duration-300 group"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute top-4 right-4 z-10 p-3 bg-black/20 backdrop-blur-sm rounded-full hover:bg-green-800/30 transition-all duration-300 group"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              ) : (
                <Play className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-3">
              {storeImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImage 
                      ? 'bg-green-800 scale-125' 
                      : 'bg-white/50 hover:bg-green-800/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {storeStats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`${stat.color} mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-black mb-2">
                {stat.number}
                <span className="text-lg text-black">{stat.unit}</span>
              </div>
              <div className="text-black font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-black mb-12">
            Nos Services Exclusifs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h4 className="text-xl font-bold text-black mb-3 group-hover:text-green-800 transition-colors">
                  {service.title}
                </h4>
                <p className="text-black leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Map & Info */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-green-800" />
              Notre Localisation
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-black mt-1" />
                <div>
                  <p className="font-semibold text-black">Adresse</p>
                  <p className="text-black">Route de NGOR, Face Hôtel BOMA</p>
                  <p className="text-black">DAKAR - SÉNÉGAL</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-black mt-1" />
                <div>
                  <p className="font-semibold text-black">Horaires</p>
                  <p className="text-black">Lundi - Samedi : 10h - 20h</p>
                  <p className="text-black">Dimanche : 10h - 18h</p>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-green-800 text-white font-semibold rounded-xl hover:bg-black transition-colors duration-300">
              Voir sur la carte
            </button>
          </div>

          {/* Events */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-black mb-6">
              Événements à Venir
            </h3>
            
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={index} className="border-l-4 border-green-800 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white bg-green-800 px-2 py-1 rounded-full">
                      {event.type}
                    </span>
                    <span className="text-sm text-black">{event.date}</span>
                  </div>
                  <h4 className="font-semibold text-black mb-1">
                    {event.title}
                  </h4>
                  <p className="text-sm text-black">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 border-2 border-green-800 text-green-800 font-semibold rounded-xl hover:bg-green-800 hover:text-white transition-all duration-300">
              Voir tous les événements
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-green-800 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Venez Nous Rendre Visite
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Découvrez l'expérience Garden Concept Store dans notre boutique physique
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-green-800 font-semibold rounded-xl hover:bg-black hover:text-white transition-colors duration-300">
              Planifier ma visite
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-green-800 transition-all duration-300">
              Nous contacter
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
