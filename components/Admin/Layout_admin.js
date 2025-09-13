import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaBars,
  FaTimes,
  FaBuilding,
  FaTicketAlt,
  FaClipboardList,
  FaCog,
  FaHome,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt
} from 'react-icons/fa';

export default function LayoutAdmin({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [user, setUser] = useState({
    nom: '',
    role: '',
    is_superadmin: 0,
    agence: { nom: '' },
    societe: { nom: '', logo: '' }
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const profileRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/admin-me");
        if (!res.ok) throw new Error("Non connecté");
        const data = await res.json();
        setUser(data.user);
      } catch {
        // Pour l'instant, on utilise un utilisateur par défaut pour éviter la redirection
        setUser({
          nom: 'Admin',
          role: 'admin',
          is_superadmin: 1,
          email: 'admin@garden.com',
          agence: { nom: 'Garden' },
          societe: { nom: 'Garden Admin', logo: '' }
        });
      }
    };
    fetchUser();
  }, [router]);

  // Gestion de la fermeture du menu profil en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // déconnexion
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const menuItems = [
    {
      title: 'Tableau de bord',
      icon: <FaHome />,
      path: '/Admin/dashbord'
    },
    {
      title: 'Vente Boutique',
      icon: <FaTicketAlt />,
      path: '/Admin/vente-boutique'
    },
    {
      title: 'Commandes',
      icon: <FaClipboardList />,
      path: '/Admin/commandes'
    },
    {
      title: 'Produits',
      icon: <FaBuilding />,
      submenu: [
        { title: 'Ajouter un produit', path: '/Admin/Produits/add-product' },
        { title: 'Liste des produits', path: '/Admin/Produits/list' },
        { title: 'Stock faible', path: '/Admin/Produits/stock-faible' },
      ]
    },
    {
      title: 'Marques',
      icon: <FaBuilding />,
      submenu: [
        { title: 'Ajouter une marque', path: '/Admin/Marques/add' },
        { title: 'Liste des marques', path: '/Admin/Marques/getAll' },
      ]
    },
    {
      title: 'Sous Catégories',
      icon: <FaBuilding />,
      submenu: [
        { title: 'Ajouter une sous catégorie', path: '/Admin/Sous_collections/add' },
        { title: 'Liste des sous catégories', path: '/Admin/Sous_collections/list' },
      ]
    },
    {
      title: 'Paramètres',
      icon: <FaCog />,
      submenu: [
        { title: 'Modifier le mot de passe', path: '/Admin/parametres/mot-de-passe' },
        { title: 'Profil', path: '/Admin/settings' },
      ]
    }
  ];

  // Afficher le loader si l'utilisateur n'est pas encore chargé
  if (!user || !user.nom) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar fixe */}
      <div 
        className={`fixed inset-y-0 left-0 bg-white/90 backdrop-blur-xl border-r border-gray-100 text-gray-900 transition-all duration-300 ease-in-out z-50 flex flex-col shadow-lg ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white font-semibold shadow">G</span>
              <span className="font-semibold tracking-wide">Garden Admin</span>
            </div>
          ) : (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white font-semibold shadow">G</span>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-gray-50 hidden md:block text-gray-700"
            aria-label="Réduire la barre"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="p-3 flex-1 overflow-y-auto space-y-6 pb-8 overscroll-contain">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className={`w-full flex items-center justify-between text-left px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2`}
                  >
                    {sidebarOpen ? item.title : item.title.substring(0, 2)}
                    {sidebarOpen && (activeSubmenu === index ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />)}
                  </button>
                  {sidebarOpen && activeSubmenu === index && (
                    <div className="space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link key={subIndex} href={subItem.path}>
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition text-sm border ${
                            router.pathname === subItem.path ? 'bg-green-600 text-white border-green-600 shadow' : 'text-gray-800 hover:bg-gray-50 border-transparent'
                          }`}>
                            <span className="text-xs">{subItem.title}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.path}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition text-sm border ${
                    router.pathname === item.path ? 'bg-green-600 text-white border-green-600 shadow' : 'text-gray-800 hover:bg-gray-50 border-transparent'
                  }`}>
                    <span className="mr-3">{item.icon}</span>
                    {sidebarOpen && <span>{item.title}</span>}
                  </div>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Pied de page avec déconnexion */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold mr-2">
                  {user?.nom?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.nom || 'Utilisateur'}</p>
                  <button 
                    onClick={logout}
                    className="text-xs text-gray-500 hover:text-gray-700 mt-1 flex items-center"
                  >
                    <FaSignOutAlt className="mr-1" /> Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={logout}
                className="text-gray-700 hover:text-gray-900 mx-auto"
                title="Déconnexion"
              >
                <FaSignOutAlt />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content avec décalage */}
      <div className={`h-screen min-h-0 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Navbar fixe */}
        <header className={`fixed top-0 bg-white/80 backdrop-blur-xl shadow-sm z-40 transition-all duration-300 ${
          sidebarOpen ? 'left-64 right-0' : 'left-20 right-0'
        }`}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar} 
                className="mr-4 text-gray-600 lg:hidden focus:outline-none"
                aria-label="Toggle sidebar"
              >
                <FaBars />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {menuItems.find((item) => router.pathname.startsWith(item.path))?.title || 'Tableau de bord'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4" ref={profileRef}>
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Menu profil"
                >
                  <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                    {user?.nom?.charAt(0) || 'U'}
                  </div>
                  <span className="text-gray-700 hidden md:inline-block">{user?.nom || 'Utilisateur'}</span>
                  <FaChevronDown className="text-gray-600 text-xs" />
                </button>
                
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">{user?.email || 'email@exemple.com'}</p>
                      <p className="text-xs text-gray-500">Administrateur</p>
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-2" /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Contenu scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Spacer pour la navbar fixe */}
          <div className="h-20" />
          <main className="min-h-0 px-0 py-4 bg-white">
          {children}
        </main>
        </div>
      </div>
      </div>
  );
}