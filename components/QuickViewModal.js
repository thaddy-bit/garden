import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Heart, 
  Star 
} from 'lucide-react';

export default function QuickViewModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onToggleFavorite,
  favorites 
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const getProductImage = (product, index = 0) => {
    if (product.images && product.images.length > 0) {
      return product.images[index]?.image_url || product.images[0]?.image_url;
    }
    return product.image_url || '/images/products/default-product.jpg';
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col lg:flex-row">
          
          {/* Images */}
          <div className="lg:w-1/2 p-6">
            <div className="relative h-96 mb-4">
              <Image
                src={getProductImage(product, selectedImageIndex)}
                alt={product.nom}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            
            {/* Miniatures */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      index === selectedImageIndex ? 'border-green-800' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={`${product.nom} ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="lg:w-1/2 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-sm text-gray-500">{product.marque_nom}</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">{product.nom}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviews || 0} avis)</span>
            </div>

            {/* Prix */}
            <div className="text-3xl font-bold text-gray-900 mb-6">
              {product.prix.toLocaleString('fr-FR')} FCFA
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              {product.description || "Produit de qualité premium disponible dans notre boutique."}
            </p>

            {/* Quantité */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantité :</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stock */}
            <div className="mb-6">
              <span className={`text-sm px-3 py-1 rounded-full ${
                product.stock > 10 
                  ? 'bg-green-100 text-green-800' 
                  : product.stock > 0 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 10 ? 'En stock' : product.stock > 0 ? 'Stock faible' : 'Rupture'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-green-800 text-white py-3 px-6 rounded-lg hover:bg-green-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Ajouter au panier
              </button>
              <button
                onClick={() => onToggleFavorite(product.id)}
                className={`p-3 rounded-lg transition-colors ${
                  favorites.includes(product.id)
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Lien vers la page détaillée */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link href={`/detail/${product.id}`}>
                <button className="w-full text-center text-green-800 hover:text-green-900 font-medium transition-colors">
                  Voir tous les détails →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


