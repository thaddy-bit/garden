'use client';
import Image from 'next/image';
import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  ChevronDown,
  MapPin,
  Phone,
  Gift,
  Star,
  Sparkles,
  Crown,
  Zap,
  Globe,
  ChevronRight,
  ShoppingBag,
  UserCircle,
  Settings,
  LogOut
} from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function Header() {
  const { cartCount, setCartCount } = useContext(CartContext);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour obtenir l'initiale de l'utilisateur
  const getUserInitial = (user) => {
    if (user?.prenom) return user.prenom.charAt(0).toUpperCase();
    if (user?.nom) return user.nom.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  // Détection du scroll pour l'effet de transparence
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Vérifie si l'utilisateur est connecté et charge le panier
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Non connecté");
        const data = await res.json();
        setUser(data);
        
        // Charger le compteur du panier si l'utilisateur est connecté
        if (data && data.id) {
          const cartRes = await fetch(`/api/panier/count?client_id=${data.id}`);
          if (cartRes.ok) {
            const cartData = await cartRes.json();
            setCartCount(cartData.total || 0);
          }
        }
      } catch (error) {
        setUser(null);
        setCartCount(0);
      }
    };
    fetchUser();
  }, [setCartCount]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setCartCount(0);
      setIsDropdownOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };


  // Fonction pour vérifier si un lien est actif
  const isActiveLink = (path) => {
    return router.pathname === path;
  };



  return (
    <>
    <Head>
        <title>Garden - Concept Store & Wellness</title>
        <meta name="description" content="Concept store et wellness premium" />
    </Head>

      {/* Barre d'information supérieure */}
      <div className="bg-black text-white text-sm py-3 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 group">
                <MapPin className="h-4 w-4 text-green-600 group-hover:text-green-500 transition-colors" />
                <span className="font-medium">Dakar, Sénégal</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <Phone className="h-4 w-4 text-green-600 group-hover:text-green-500 transition-colors" />
                <span className="font-medium">+221 33 820 50 10</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <Globe className="h-4 w-4 text-green-600 group-hover:text-green-500 transition-colors" />
                <span className="font-medium">Français</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-green-600">
                <Gift className="h-4 w-4" />
                <span className="text-xs font-medium">Livraison gratuite à partir de 50,000 FCFA</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Star className="h-4 w-4" />
                <span className="text-xs font-medium">Programme VIP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header principal avec glassmorphism */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' 
          : 'bg-white/95 backdrop-blur-sm shadow-lg'
      } ${isScrolled ? 'lg:top-0' : 'lg:top-12'}`}>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            
            {/* Logo avec effet premium */}
            <div className="flex-shrink-0 group">
              <Link href="/" className="flex items-center relative">
                <div className="absolute inset-0 bg-green-600/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image 
                  src="/images/garden.png" 
                  priority 
                  alt="Garden Logo" 
                  width={200} 
                  height={28} 
                  className="object-contain transition-all duration-500 group-hover:scale-110 relative z-10" 
                  unoptimized 
                />
              </Link>
            </div>

            {/* Navigation principale - Desktop avec mega-menu */}
            <nav className="hidden lg:flex items-center space-x-10">
              <Link 
                href="/" 
                className={`text-sm font-semibold transition-all duration-300 relative group px-3 py-2 rounded-lg ${
                  isActiveLink('/') 
                    ? 'text-gray-900 bg-gray-100/50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Accueil</span>
                </span>
                {isActiveLink('/') && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full"></div>
                )}
              </Link>
              
              {/* Mega Menu Boutique */}
              <div className="relative group">
                <button 
                  className="flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-gray-50/50"
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  <span>Boutique</span>
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                
                <div 
                  className="absolute top-full left-0 mt-4 w-screen max-w-4xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-50"
                >
                    <div className="p-8">
                      <div className="grid grid-cols-4 gap-8">
                        {/* Catégories principales */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                            <Crown className="h-4 w-4 mr-2 text-green-600" />
                            Marques Premium
                          </h3>
                          <div className="space-y-3">
                            <Link href="/marques/liste" className="flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 group">
                              <span>Toutes les marques</span>
                              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <Link href="/nouveautes" className="flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 group">
                              <span>Nouveautés</span>
                              <div className="px-2 py-1 bg-black text-white text-xs rounded-full">NEW</div>
                            </Link>
                            <Link href="/tendances" className="flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 group">
                              <span>Tendances</span>
                              <Zap className="h-3 w-3 text-green-600" />
                            </Link>
                          </div>
                        </div>
                        
                        {/* Catégories produits */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-gray-900 mb-4">Catégories</h3>
                          <div className="space-y-3">
                            <Link href="/categories/mode" className="text-sm text-gray-700 hover:text-gray-900">Mode & Accessoires</Link>
                            <Link href="/categories/beaute" className="text-sm text-gray-700 hover:text-gray-900">Beauté & Soins</Link>
                            <Link href="/categories/maison" className="text-sm text-gray-700 hover:text-gray-900">Maison & Déco</Link>
                            <Link href="/categories/tech" className="text-sm text-gray-700 hover:text-gray-900">Tech & Lifestyle</Link>
                          </div>
                        </div>
                        
                        {/* Offres spéciales */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                            <Gift className="h-4 w-4 mr-2 text-green-600" />
                            Offres
                          </h3>
                          <div className="space-y-3">
                            <Link href="/promotions" className="text-sm text-gray-700 hover:text-gray-900">Promotions</Link>
                            <Link href="/vente-privee" className="text-sm text-gray-700 hover:text-gray-900">Vente Privée</Link>
                            <Link href="/packages" className="text-sm text-gray-700 hover:text-gray-900">Packages VIP</Link>
                          </div>
                        </div>
                        
                        {/* Image promotionnelle */}
                        <div className="relative">
                          <div className="bg-green-600/10 rounded-xl p-6 h-full flex flex-col justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="h-8 w-8 text-white" />
                              </div>
                              <h4 className="text-sm font-bold text-gray-900 mb-2">Programme VIP</h4>
                              <p className="text-xs text-gray-600 mb-4">Accédez à des avantages exclusifs</p>
                              <Link href="/vip" className="text-xs bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                                Découvrir
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>

              <Link 
                href="/Wellness" 
                className={`text-sm font-semibold transition-all duration-300 relative group px-3 py-2 rounded-lg ${
                  isActiveLink('/Wellness') 
                    ? 'text-gray-900 bg-gray-100/50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Wellness</span>
                </span>
                {isActiveLink('/Wellness') && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full"></div>
                )}
              </Link>

              <Link 
                href="/marques/liste" 
                className={`text-sm font-semibold transition-all duration-300 relative group px-3 py-2 rounded-lg ${
                  isActiveLink('/marques/liste') 
                    ? 'text-gray-900 bg-gray-100/50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <Crown className="h-4 w-4" />
                  <span>Marques</span>
                </span>
                {isActiveLink('/marques/liste') && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full"></div>
                )}
              </Link>

              <Link 
                href="/Magazine" 
                className={`text-sm font-semibold transition-all duration-300 relative group px-3 py-2 rounded-lg ${
                  isActiveLink('/Magazine') 
                    ? 'text-gray-900 bg-gray-100/50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Magazine</span>
                </span>
                {isActiveLink('/Magazine') && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full"></div>
                )}
              </Link>
            </nav>

            {/* Actions utilisateur - Desktop Premium */}
            <div className="hidden lg:flex items-center space-x-2">
              
              {/* Panier avec animation */}
              <Link href="/panier" className="relative group">
                <div className="p-3 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-gray-50/50">
                  <ShoppingCart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Profil utilisateur premium */}
              {user ? (
                <div className="relative group">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 p-2 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-gray-50/50"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {getUserInitial(user)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-600 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold">
                      {user.nom || user.prenom || 'Utilisateur'}
                      </div>
                      <div className="text-xs text-gray-500">Membre VIP</div>
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-4 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-4 opacity-100 visible animate-in slide-in-from-top-2 duration-300 z-50">
                      <div className="px-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                            {getUserInitial(user)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.nom || user.prenom || 'Utilisateur'}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="flex items-center text-xs text-green-600 mt-1">
                              <Crown className="h-3 w-3 mr-1" />
                              Membre VIP
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          href="/profil"
                          className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <UserCircle className="h-4 w-4 mr-3" />
                          Mon profil
                        </Link>
                        <Link
                          href="/panier"
                          className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-3" />
                          Mon panier
                          {cartCount > 0 && (
                            <span className="ml-auto bg-green-600 text-white text-xs rounded-full px-2 py-1">
                              {cartCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/commandes/mes_commandes"
                          className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <ShoppingBag className="h-4 w-4 mr-3" />
                          Mes commandes
                        </Link>
                        <Link
                          href="/favoris"
                          className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Sparkles className="h-4 w-4 mr-3" />
                          Mes favoris
                        </Link>
                        <Link
                          href="/parametres"
                          className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Paramètres
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-6 py-3 text-sm text-gray-600 hover:bg-gray-50/50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-300"
                  >
                    Connexion
                        </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    S'inscrire
                  </Link>
                </div>
            )}
            </div>
            
            {/* Menu mobile premium */}
            <div className="lg:hidden flex items-center space-x-1">
              <Link href="/panier" className="relative p-3 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-gray-50/50">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-gray-50/50"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            </div>
          </div>
        </div>
        
        {/* Menu mobile premium */}
        {isOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/"
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <Sparkles className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Accueil</span>
                </Link>
                <Link
                  href="/marques/liste"
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Boutique</span>
                </Link>
                <Link
                  href="/marques/liste"
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <Crown className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Marques</span>
                </Link>
                <Link
                  href="/Wellness"
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <Sparkles className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Wellness</span>
                </Link>
                <Link
                  href="/Magazine"
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <Sparkles className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Magazine</span>
                </Link>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                        {getUserInitial(user)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user.nom || user.prenom || 'Utilisateur'}</div>
                        <div className="text-sm text-gray-500">Membre VIP</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/profil"
                        className="flex items-center space-x-2 p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                      <Link
                        href="/commandes/mes_commandes"
                        className="flex items-center space-x-2 p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Commandes</span>
                      </Link>
                      <Link
                        href="/parametres"
                        className="flex items-center space-x-2 p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Paramètres</span>
                      </Link>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center space-x-2 p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center space-x-2 p-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Connexion</span>
                    </Link>
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center space-x-2 p-4 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <Crown className="h-4 w-4" />
                      <span>S'inscrire</span>
                    </Link>
              </div>
            )}
              </div>
            </div>
          </div>
        )}

        {/* Overlay pour fermer les menus */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-0 bg-black/20 backdrop-blur-sm"
            onClick={() => {
              setIsDropdownOpen(false);
            }}
          />
        )}
      </header>

      {/* Espacement pour le header fixe avec animation */}
      <div className="h-2"></div>
    </>
  );
}
////////////////////////////////////