import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from 'react';
import { CartContext } from "../../context/CartContext";
import ProductImageCarousel from "../../components/ProductImageCarousel";
import toast, { Toaster } from "react-hot-toast";
import { findMarqueBySlug } from '../../lib/slug';

export default function MarqueProduits() {
  const { setCartCount } = useContext(CartContext);
  const router = useRouter();
  const { marqueSlug } = router.query;
  const [produits, setProduits] = useState([]);
  const [produitsFiltres, setProduitsFiltres] = useState([]);
  const [marque, setMarque] = useState(null);
  const [sousCategories, setSousCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [categorieSelectionnee, setCategorieSelectionnee] = useState('all');
  const [collectionSelectionnee, setCollectionSelectionnee] = useState('all');
  const [prixMin, setPrixMin] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [nouveaute, setNouveaute] = useState(false);
  const [enSolde, setEnSolde] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [likes, setLikes] = useState([]);
  const [user, setUser] = useState(null);

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

  const ajouterAuPanier = async (produit) => {
    if (!user) {
      return router.push("/login");
    }
    const clientId = user;
    const ID = clientId.id;

    try {
      const res = await fetch("/api/panier/ajouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produitId: produit.id, userId: ID, quantite: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
    } catch (error) {
      console.error("Erreur :", error);
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  const handleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const handleLike = (productId) => {
    if (likes.includes(productId)) {
      setLikes(likes.filter((id) => id !== productId));
    } else {
      setLikes([...likes, productId]);
    }
  };

  const filtrerParCategorie = (categorieId) => {
    setCategorieSelectionnee(categorieId);
    appliquerFiltres(categorieId, collectionSelectionnee, prixMin, prixMax, nouveaute, enSolde);
  };

  const filtrerParCollection = (collectionId) => {
    setCollectionSelectionnee(collectionId);
    appliquerFiltres(categorieSelectionnee, collectionId, prixMin, prixMax, nouveaute, enSolde);
  };

  const filtrerParPrix = (min, max) => {
    setPrixMin(min);
    setPrixMax(max);
    appliquerFiltres(categorieSelectionnee, collectionSelectionnee, min, max, nouveaute, enSolde);
  };

  const filtrerParNouveaute = (checked) => {
    setNouveaute(checked);
    appliquerFiltres(categorieSelectionnee, collectionSelectionnee, prixMin, prixMax, checked, enSolde);
  };

  const filtrerParSolde = (checked) => {
    setEnSolde(checked);
    appliquerFiltres(categorieSelectionnee, collectionSelectionnee, prixMin, prixMax, nouveaute, checked);
  };

  const resetFiltres = () => {
    setCategorieSelectionnee('all');
    setCollectionSelectionnee('all');
    setPrixMin('');
    setPrixMax('');
    setNouveaute(false);
    setEnSolde(false);
    setProduitsFiltres(produits);
  };

  const appliquerFiltres = (categorieId, collectionId, prixMinVal, prixMaxVal, nouveauteVal, enSoldeVal) => {
    let produitsFiltres = produits;

    // Filtrer par catégorie
    if (categorieId !== 'all') {
      produitsFiltres = produitsFiltres.filter(produit => 
        produit.sous_categorie_id == categorieId
      );
    }

    // Filtrer par collection
    if (collectionId !== 'all') {
      produitsFiltres = produitsFiltres.filter(produit => 
        produit.collection_id == collectionId
      );
    }

    // Filtrer par prix
    if (prixMinVal) {
      produitsFiltres = produitsFiltres.filter(produit => 
        parseFloat(produit.prix) >= parseFloat(prixMinVal)
      );
    }
    if (prixMaxVal) {
      produitsFiltres = produitsFiltres.filter(produit => 
        parseFloat(produit.prix) <= parseFloat(prixMaxVal)
      );
    }

    // Filtrer par nouveauté
    if (nouveauteVal) {
      produitsFiltres = produitsFiltres.filter(produit => 
        produit.nouveaute === 1
      );
    }

    // Filtrer par solde
    if (enSoldeVal) {
      produitsFiltres = produitsFiltres.filter(produit => 
        produit.en_solde === 1
      );
    }

    setProduitsFiltres(produitsFiltres);
  };

  useEffect(() => {
    if (!marqueSlug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer toutes les marques pour trouver celle qui correspond au slug
        const resMarque = await fetch(`/api/marques`);
        const marquesData = await resMarque.json();
        const marqueInfo = findMarqueBySlug(marquesData, marqueSlug);
        
        if (!marqueInfo) {
          toast.error("Marque non trouvée");
          router.push('/marques/liste');
          return;
        }
        
        // Récupérer les produits de la marque
        const resProduits = await fetch(`/api/marques/${marqueInfo.id}/produits`);
        const produitsData = await resProduits.json();
        
        // Récupérer les sous-catégories de la marque
        const resSousCategories = await fetch(`/api/marques/${marqueInfo.id}/sous-categories`);
        const sousCategoriesData = await resSousCategories.json();
        
        // Récupérer les collections de la marque
        const resCollections = await fetch(`/api/marques/${marqueInfo.id}/collections`);
        const collectionsData = await resCollections.json();
        
        setProduits(produitsData);
        setProduitsFiltres(produitsData);
        setMarque(marqueInfo);
        setSousCategories(sousCategoriesData);
        setCollections(collectionsData);

      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
        toast.error("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [marqueSlug, router]);

  if (loading) {
    return (
      <Layout>
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des produits...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster />
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{marque?.nom || 'Marque'}</h1>
                <p className="text-gray-600">{marque?.description}</p>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {sidebarOpen ? 'Masquer les filtres' : 'Afficher les filtres'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-8">
            {/* Sidebar Filtres */}
            <div className={`w-80 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
                  <button
                    onClick={resetFiltres}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Réinitialiser
                  </button>
                </div>

                {/* Filtres par Catégories */}
                {sousCategories.length > 0 && (
            <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Catégories</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="categorie"
                          checked={categorieSelectionnee === 'all'}
                          onChange={() => filtrerParCategorie('all')}
                          className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                        />
                        <span className="ml-3 text-sm text-gray-700">Toutes les catégories</span>
                      </label>
                      {sousCategories.map((categorie) => (
                        <label key={categorie.id} className="flex items-center">
                          <input
                            type="radio"
                            name="categorie"
                            checked={categorieSelectionnee == categorie.id}
                            onChange={() => filtrerParCategorie(categorie.id)}
                            className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            {categorie.nom} ({categorie.produit_count})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filtres par Collections */}
                {collections.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Collections</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="collection"
                          checked={collectionSelectionnee === 'all'}
                          onChange={() => filtrerParCollection('all')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300"
                        />
                        <span className="ml-3 text-sm text-gray-700">Toutes les collections</span>
                      </label>
                      {collections.map((collection) => (
                        <label key={collection.id} className="flex items-center">
                          <input
                            type="radio"
                            name="collection"
                            checked={collectionSelectionnee == collection.id}
                            onChange={() => filtrerParCollection(collection.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300"
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            {collection.nom} ({collection.produit_count})
                          </span>
                        </label>
                      ))}
                    </div>
            </div>
          )}

                {/* Filtres par Prix */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Prix</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min (€)</label>
                      <input
                        type="number"
                        value={prixMin}
                        onChange={(e) => filtrerParPrix(e.target.value, prixMax)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-gray-900 focus:border-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Max (€)</label>
                      <input
                        type="number"
                        value={prixMax}
                        onChange={(e) => filtrerParPrix(prixMin, e.target.value)}
                        placeholder="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-gray-900 focus:border-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Filtres par Options */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Options</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={nouveaute}
                        onChange={(e) => filtrerParNouveaute(e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Nouveautés</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={enSolde}
                        onChange={(e) => filtrerParSolde(e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">En solde</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone Produits */}
            <div className="flex-1">
              {/* Compteur de résultats */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {produitsFiltres.length} produit{produitsFiltres.length > 1 ? 's' : ''} trouvé{produitsFiltres.length > 1 ? 's' : ''}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Trier par:</span>
                  <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600">
                    <option>Pertinence</option>
                    <option>Prix croissant</option>
                    <option>Prix décroissant</option>
                    <option>Nouveauté</option>
                  </select>
                </div>
              </div>

              {/* Grille de produits */}
              {produitsFiltres.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">Aucun produit trouvé avec ces filtres.</p>
            </div>
          ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {produitsFiltres.map((produit) => (
                <div key={produit.id} className="group bg-white overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <Link href={`/produit/${produit.slug}`}>
                      <ProductImageCarousel
                        images={produit.images}
                        productName={produit.nom}
                        className="w-full h-64"
                        autoSlideMs={3500}
                      />
                    </Link>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-2">
                      {produit.nouveaute === 1 && (
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-[10px] font-semibold">Nouveau</span>
                      )}
                      {produit.en_vedette === 1 && (
                        <span className="bg-gray-900 text-white px-2 py-1 rounded-full text-[10px] font-semibold">Vedette</span>
                      )}
                    </div>
                    {produit.prix_reduction && (
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        -{produit.pourcentage_reduction}%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-1 text-gray-900 group-hover:text-green-700 transition-colors">{produit.nom}</h3>
                    <p className="text-sm text-gray-600 mb-3">{produit.sous_categorie_nom}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {produit.prix_reduction ? (
                          <>
                            <span className="text-lg font-bold text-green-700">
                              FCFA {produit.prix_reduction.toLocaleString('fr-FR')}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              FCFA {produit.prix.toLocaleString('fr-FR')}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            FCFA {produit.prix.toLocaleString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => ajouterAuPanier(produit)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm font-medium"
                      >
                        Ajouter au panier
                      </button>
                      
                      <div className="flex ml-2 space-x-2">
                        <button
                          onClick={() => handleFavorite(produit.id)}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              favorites.includes(produit.id) ? "text-green-700" : "text-gray-500"
                            }`}
                            fill={favorites.includes(produit.id) ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleLike(produit.id)}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              likes.includes(produit.id) ? "text-green-700" : "text-gray-500"
                            }`}
                            fill={likes.includes(produit.id) ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
