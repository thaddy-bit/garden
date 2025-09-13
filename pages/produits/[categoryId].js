'use client';

import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from 'react';
import { CartContext } from "../../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star, 
  Filter, 
  Grid, 
  List,
  X,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import ProductSkeleton from '../../components/ProductSkeleton';
import QuickViewModal from '../../components/QuickViewModal';

export default function CategoryProductsPremium() {
  const { setCartCount } = useContext(CartContext);
  const router = useRouter();
  const { categoryId } = router.query;
  
  // États principaux
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("Loading...");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // États pour l'aperçu rapide
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // États pour les interactions
  const [favorites, setFavorites] = useState([]);
  const [likes, setLikes] = useState([]);
  
  // États pour les filtres et vue
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Non connecté");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Charger les données
  useEffect(() => {
    if (!categoryId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const resProducts = await fetch(`/api/products/${categoryId}`);
        const productsData = await resProducts.json();

        const resCategories = await fetch(`/api/categories`);
        const categoriesData = await resCategories.json();

        const category = categoriesData.find((cat) => cat.id === parseInt(categoryId));
        const categoryName = category ? category.nom : "Catégorie inconnue";
        const categoryDescription = category ? category.description : "Aucune description trouvée";

        setProducts(productsData);
        setCategoryName(categoryName);
        setCategoryDescription(categoryDescription);
      } catch (err) {
        console.error("Erreur lors de la récupération des produits :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // Fonctions d'interaction
  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter au panier");
      return router.push("/login");
    }

    try {
      const res = await fetch("/api/panier/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          produit_id: product.id, 
          quantite: quantity 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success(`${product.nom} ajouté au panier !`);
      setIsModalOpen(false);
      setQuantity(1);
    } catch (error) {
      console.error("Erreur :", error);
      toast.error(error.message);
    }
  };

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleLike = (productId) => {
    setLikes(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Fonction pour obtenir l'image du produit
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[selectedImageIndex]?.image_url || product.images[0]?.image_url;
    }
    return product.image_url || '/images/products/default-product.jpg';
  };

  // Fonction pour créer un layout asymétrique dynamique
  const createAsymmetricLayout = (products) => {
    const layout = [];
    let index = 0;

    while (index < products.length) {
      // Pattern dynamique basé sur l'index
      const patternIndex = Math.floor(index / 6);
      
      if (patternIndex % 2 === 0) {
        // Pattern 1: Grande carte + 2 moyennes + 2 petites
        if (index < products.length) {
          layout.push({
            type: 'large',
            product: products[index],
            index: index
          });
          index++;
        }
        
        for (let i = 0; i < 2 && index < products.length; i++) {
          layout.push({
            type: 'medium',
            product: products[index],
            index: index
          });
          index++;
        }
        
        for (let i = 0; i < 2 && index < products.length; i++) {
          layout.push({
            type: 'small',
            product: products[index],
            index: index
          });
          index++;
        }
      } else {
        // Pattern 2: 2 moyennes + grande carte + 2 petites
        for (let i = 0; i < 2 && index < products.length; i++) {
          layout.push({
            type: 'medium',
            product: products[index],
            index: index
          });
          index++;
        }
        
        if (index < products.length) {
          layout.push({
            type: 'large',
            product: products[index],
            index: index
          });
          index++;
        }
        
        for (let i = 0; i < 2 && index < products.length; i++) {
          layout.push({
            type: 'small',
            product: products[index],
            index: index
          });
          index++;
        }
      }
    }

    return layout;
  };

  // Filtrage et tri des produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.prix >= priceRange[0] && product.prix <= priceRange[1];
    return matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.prix - b.prix;
      case 'price-high':
        return b.prix - a.prix;
      case 'name':
        return a.nom.localeCompare(b.nom);
      case 'popularity':
      default:
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  const asymmetricLayout = createAsymmetricLayout(sortedProducts);

  if (loading) {
    return (
      <Layout>
        {/* Hero Section Skeleton */}
        <div className="relative bg-gradient-to-r from-gray-300 to-gray-400 text-white py-20 animate-pulse">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="h-12 bg-gray-400 rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-400 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Barre de filtres skeleton */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="h-10 bg-gray-200 rounded w-80"></div>
              <div className="flex items-center gap-4">
                <div className="h-10 bg-gray-200 rounded w-32"></div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductSkeleton type="large" />
            <ProductSkeleton type="medium" />
            <ProductSkeleton type="medium" />
            <ProductSkeleton type="small" />
            <ProductSkeleton type="small" />
            <ProductSkeleton type="medium" />
            <ProductSkeleton type="medium" />
            <ProductSkeleton type="small" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-800 to-black text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">{categoryName}</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {categoryDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Barre de filtres et contrôles */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800"
              />
            </div>

            {/* Contrôles */}
            <div className="flex items-center gap-4">
              
              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800"
              >
                <option value="popularity">Popularité</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
              </select>

              {/* Bouton filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
              </button>

              {/* Mode d'affichage */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-green-800 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-green-800 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fourchette de prix
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grille de produits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 auto-rows-[300px]"
               style={{
                 gridTemplateRows: 'repeat(auto-fit, minmax(300px, auto))'
               }}>
            {asymmetricLayout.map((item, index) => {
              const { type, product } = item;
              
              return (
                <div
                  key={product.id}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                    type === 'large' ? 'md:col-span-2 md:row-span-2 lg:col-span-2 xl:col-span-2' : 
                    type === 'medium' ? 'md:col-span-1 lg:col-span-1 xl:col-span-1' : 
                    'md:col-span-1 lg:col-span-1 xl:col-span-1'
                  }`}
                >
                  {/* Image du produit */}
                  <div className={`relative overflow-hidden ${
                    type === 'large' ? 'h-80' : 
                    type === 'medium' ? 'h-64' : 
                    'h-48'
                  }`}>
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
                    </div>

                    {/* Actions au hover */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleFavorite(product.id)}
                        className={`p-3 rounded-full transition-all duration-300 ${
                          favorites.includes(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => openQuickView(product)}
                        className="p-3 bg-white/90 text-gray-600 rounded-full hover:bg-green-800 hover:text-white transition-all duration-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bouton ajouter au panier */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => openQuickView(product)}
                        className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-green-800 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Aperçu rapide
                      </button>
                    </div>
                  </div>

                  {/* Informations du produit */}
                  <div className={`p-6 ${type === 'large' ? 'p-8' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 font-medium">{product.marque_nom}</span>
                      <span className="text-xs text-gray-400">{product.sous_categorie_nom}</span>
                    </div>

                    <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-green-800 transition-colors ${
                      type === 'large' ? 'text-2xl' : 'text-lg'
                    }`}>
                      {product.nom}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
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
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`font-bold text-gray-900 ${
                        type === 'large' ? 'text-3xl' : 'text-xl'
                      }`}>
                        {product.prix.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-2">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        product.stock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 10 ? 'En stock' : product.stock > 0 ? 'Stock faible' : 'Rupture'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Vue liste
          <div className="space-y-4">
            {sortedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="flex">
                  <div className="relative w-48 h-48 flex-shrink-0">
                    <Image
                      src={getProductImage(product)}
                      alt={product.nom}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-500">{product.marque_nom}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">{product.sous_categorie_nom}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.nom}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.round(product.rating || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">({product.reviews || 0} avis)</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-4">
                          {product.prix.toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => openQuickView(product)}
                          className="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Aperçu
                        </button>
                        <button
                          onClick={() => handleFavorite(product.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            favorites.includes(product.id)
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Aperçu Rapide */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleFavorite}
        favorites={favorites}
      />
    </Layout>
  );
}