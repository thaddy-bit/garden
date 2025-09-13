'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Eye } from 'lucide-react';

export default function TrendingProductsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wishlist, setWishlist] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(false);
  const itemsPerView = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  // Charger les produits tendance depuis l'API
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await fetch('/api/produits/trending');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Erreur lors du chargement des produits tendance');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits tendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

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
    }, 4000);

    return () => clearInterval(interval);
  }, [maxIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const addToCart = async (product) => {
    try {
      const response = await fetch('/api/panier/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produit_id: product.id,
          quantite: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Afficher une notification de succès
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
        notification.innerHTML = `
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          ${product.nom} ajouté au panier !
        `;
        document.body.appendChild(notification);
        
        // Supprimer la notification après 3 secondes
        setTimeout(() => {
          notification.remove();
        }, 3000);
      } else {
        const error = await response.json();
        console.error('Erreur lors de l\'ajout au panier:', error);
        
        // Si erreur d'authentification, rediriger vers la page de connexion
        if (response.status === 401) {
          const notification = document.createElement('div');
          notification.className = 'fixed top-4 right-4 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
          notification.innerHTML = `
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            Vous devez vous connecter pour ajouter au panier
          `;
          document.body.appendChild(notification);
          
          setTimeout(() => {
            notification.remove();
            // Rediriger vers la page de connexion après 2 secondes
            window.location.href = '/login';
          }, 2000);
        } else {
          // Autres erreurs
          const notification = document.createElement('div');
          notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
          notification.innerHTML = `
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            ${error.error || 'Erreur lors de l\'ajout au panier'}
          `;
          document.body.appendChild(notification);
          
          setTimeout(() => {
            notification.remove();
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      
      // Afficher une notification d'erreur
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
      notification.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        Erreur de connexion
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  // Fonction pour obtenir l'image du produit
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].image_url || product.images[0].url;
    }
    return product.image || '/images/products/default-product.jpg';
  };

  // Fonction pour calculer le pourcentage de réduction
  const getDiscountPercentage = (product) => {
    if (product.prix_reduction && product.prix_reduction > 0) {
      return Math.round(((product.prix - product.prix_reduction) / product.prix) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-black text-white rounded-full text-sm font-medium mb-4">
              🔥 Produits Tendance
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">
              Les Plus Demandés
            </h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Chargement des produits...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-black text-white rounded-full text-sm font-medium mb-4">
              🔥 Produits Tendance
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">
              Les Plus Demandés
            </h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Aucun produit tendance disponible pour le moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium mb-4">
            🔥 Produits Tendance
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">
            Les Plus Demandés
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Découvrez les produits qui font sensation cette saison
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className={`flex-shrink-0 px-4 ${isMobile ? 'w-full' : 'w-1/3'}`}
              >
                <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                  {/* Product Image Container */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={getProductImage(product)}
                      alt={product.nom}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.nouveaute === 1 && (
                        <span className="px-3 py-1 bg-green-800 text-white text-xs font-bold rounded-full">
                          NOUVEAU
                        </span>
                      )}
                      {product.en_vedette === 1 && (
                        <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                          TENDANCE
                        </span>
                      )}
                      {getDiscountPercentage(product) > 0 && (
                        <span className="px-3 py-1 bg-green-800 text-white text-xs font-bold rounded-full">
                          -{getDiscountPercentage(product)}%
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-3 rounded-full transition-all duration-300 ${
                          wishlist.has(product.id)
                            ? 'bg-green-800 text-white'
                            : 'bg-white/90 text-black hover:bg-green-800 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${wishlist.has(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <Link href={`/produit/${product.slug}`}>
                        <button className="p-3 bg-white/90 text-black rounded-full hover:bg-green-800 hover:text-white transition-all duration-300">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>

                    {/* Quick Add Button */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full py-3 bg-black text-white font-semibold rounded-full hover:bg-green-800 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Ajouter au panier
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    {/* Brand & Category */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-black font-medium">{product.marque_nom}</span>
                      <span className="text-xs text-black">{product.sous_categorie_nom}</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-black mb-3 group-hover:text-green-800 transition-colors">
                      {product.nom}
                    </h3>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        product.stock > 10 
                          ? 'bg-green-800 text-white' 
                          : product.stock > 0 
                            ? 'bg-black text-white'
                            : 'bg-black text-white'
                      }`}>
                        {product.stock > 10 ? 'En stock' : product.stock > 0 ? 'Stock faible' : 'Rupture'}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-black">
                        {formatPrice(product.prix_reduction || product.prix)} FCFA
                      </span>
                      {product.prix_reduction && product.prix_reduction > 0 && (
                        <span className="text-lg text-black line-through">
                          {formatPrice(product.prix)} FCFA
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-4 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group border border-black ${
              isMobile ? '-translate-x-3' : '-translate-x-6'
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-black group-hover:text-green-800 group-hover:scale-110 transition-all" />
          </button>
          
          <button
            onClick={nextSlide}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-4 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group border border-black ${
              isMobile ? 'translate-x-3' : 'translate-x-6'
            }`}
          >
            <ChevronRight className="w-6 h-6 text-black group-hover:text-green-800 group-hover:scale-110 transition-all" />
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
                  ? 'bg-green-800 scale-125' 
                  : 'bg-black hover:bg-green-800'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link href="/produits">
            <button className="px-8 py-4 bg-black text-white font-semibold text-lg rounded-full hover:bg-green-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              Voir Tous les Produits
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
