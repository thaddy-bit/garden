import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../../components/Layout";
import ProductImageCarousel from "../../components/ProductImageCarousel";
import ProduitsSimilaires from "../../components/ProduitsSimilaires";

export default function ProduitDetail({ product, produitsSimilaires, error }) {
  const [quantite, setQuantite] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const ajouterAuPanier = async () => {
    // Fonction d'ajout au panier
    toast.success(`${quantite} article(s) ajouté(s) au panier !`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Like retiré" : "Produit liké");
  };

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Produit introuvable</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/marques/liste" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              Retour aux marques
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Produit introuvable</h1>
            <p className="text-gray-600 mb-6">Ce produit n'existe pas ou a été supprimé.</p>
            <Link href="/marques/liste" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              Retour aux marques
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const prixFinal = product.prix_reduction || product.prix;
  const economie = product.prix_reduction ? product.prix - product.prix_reduction : 0;

  return (
    <Layout>
      <Toaster position="top-right" />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Accueil</Link>
            <span>/</span>
            <Link href="/marques/liste" className="hover:text-gray-900">Marques</Link>
            <span>/</span>
            <Link href={`/marques/${product.marque_nom?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-gray-900">
              {product.marque_nom}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.nom}</span>
          </nav>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              {/* ====== Section Images ====== */}
              <div className="relative bg-gray-100">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                  {product.nouveaute && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      ✨ Nouveau
                    </span>
                  )}
                  {product.en_vedette && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      ⭐ Vedette
                    </span>
                  )}
                  {product.en_solde && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      🔥 -{product.pourcentage_reduction}%
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                  <button
                    onClick={toggleFavorite}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <svg className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                  <button
                    onClick={toggleLike}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <svg className={`w-5 h-5 ${isLiked ? 'text-blue-500 fill-current' : 'text-gray-600'}`} viewBox="0 0 24 24">
                      <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                    </svg>
                  </button>
                </div>

                {/* Image principale */}
                <div className="aspect-square relative">
                  {product.images && product.images.length > 0 ? (
                    <ProductImageCarousel
                      images={product.images}
                      productName={product.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">Aucune image disponible</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Miniatures */}
                {product.images && product.images.length > 1 && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex space-x-2 overflow-x-auto">
                      {product.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === i ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <Image 
                            src={img.image_url} 
                            alt={img.image_alt || `Vue ${i + 1}`} 
                            width={64} 
                            height={64} 
                            className="w-full h-full object-cover" 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ====== Section Informations ====== */}
              <div className="p-8 lg:p-12">
                <div className="space-y-6">
                  
                  {/* Titre et marque */}
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {product.marque_nom}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{product.sous_categorie_nom}</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      {product.nom}
                    </h1>
                    {product.description_courte && (
                      <p className="text-lg text-gray-600 mt-2">{product.description_courte}</p>
                    )}
                  </div>

                  {/* Prix */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {prixFinal.toLocaleString('fr-FR')} FCFA
                      </span>
                      {product.prix_reduction && (
                        <span className="text-xl text-gray-500 line-through">
                          {product.prix.toLocaleString('fr-FR')} FCFA
                        </span>
                      )}
                    </div>
                    {economie > 0 && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Économisez {economie.toLocaleString('fr-FR')} FCFA
                      </span>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="flex items-center space-x-4">
                    {product.stock > 0 ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {product.stock > 10 ? 'En stock' : `Plus que ${product.stock} en stock`}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-red-600 font-medium">Rupture de stock</span>
                      </div>
                    )}
                    {product.sku && (
                      <span className="text-sm text-gray-400">SKU: {product.sku}</span>
                    )}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>
                  )}

                  {/* Caractéristiques */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-t border-b border-gray-200">
                    {product.couleur && (
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-gray-300 border-2 border-gray-400"></div>
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Couleur:</span> {product.couleur}
                        </span>
                      </div>
                    )}
                    {product.taille && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Taille:</span> {product.taille}
                        </span>
                      </div>
                    )}
                    {product.materiau && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Matière:</span> {product.materiau}
                        </span>
                      </div>
                    )}
                    {product.poids && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Poids:</span> {product.poids}g
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quantité et actions */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label htmlFor="quantite" className="text-sm font-medium text-gray-700">
                        Quantité:
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantite(Math.max(1, quantite - 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={quantite <= 1}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          id="quantite"
                          min={1}
                          max={product.stock || 1}
                          value={quantite}
                          onChange={(e) => setQuantite(Math.max(1, Math.min(product.stock || 1, Number(e.target.value))))}
                          className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
                        />
                        <button
                          onClick={() => setQuantite(Math.min(product.stock || 1, quantite + 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={quantite >= (product.stock || 1)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={ajouterAuPanier}
                        disabled={product.stock === 0}
                        className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                        </svg>
                        <span>{product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Garanties */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Livraison gratuite</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <span>Retour 14 jours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      <ProduitsSimilaires 
        produits={produitsSimilaires} 
        marqueNom={product.marque_nom} 
      />
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const { slug } = params;
    
    // Récupérer le produit
    const productRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/produits/slug/${slug}`);
    
    if (!productRes.ok) {
      return {
        props: {
          product: null,
          produitsSimilaires: [],
          error: 'Produit non trouvé'
        }
      };
    }
    
    const product = await productRes.json();
    
    // Récupérer les produits similaires
    let produitsSimilaires = [];
    if (product.marque_id) {
      try {
        const similairesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/marques/${product.marque_id}/produits`);
        if (similairesRes.ok) {
          const tousProduits = await similairesRes.json();
          produitsSimilaires = tousProduits.filter(p => p.id !== product.id);
        }
      } catch (err) {
        console.log('Erreur lors du chargement des produits similaires:', err);
      }
    }
    
    return {
      props: {
        product,
        produitsSimilaires,
        error: null
      }
    };
  } catch (error) {
    console.error('Erreur getServerSideProps:', error);
    return {
      props: {
        product: null,
        produitsSimilaires: [],
        error: 'Erreur lors du chargement du produit'
      }
    };
  }
}

