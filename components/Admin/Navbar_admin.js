import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaBars,
  FaTimes,
  FaBuilding,
  FaRoute,
  FaBus,
  FaMoneyBillWave,
  FaTicketAlt,
  FaClipboardList,
  FaCog,
  FaHome,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaPercentage,
  FaSms
} from 'react-icons/fa';

const AdminNavbar = ({ children }) => {
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
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Non connecté");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
        router.push("/login");
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
      path: '/dashboard'
    },
    {
      title: 'Agences & Utilisateurs',
      icon: <FaBuilding />,
      path: '/admin/societes',
      submenu: [
        { title: 'Liste des sociétés', path: '/admin/societes/liste' },
        { title: 'Ajouter une société', path: '/admin/societes/add' },
        { title: 'Utilisateurs', path: '/admin/utilisateurs/liste' },
        { title: 'Employés', path: '/employes' },
        { title: 'Agences', path: '/admin/agences/liste' },
        { title: 'Transporteurs Partenaires', path: '/admin/partenariats-societes' },
        { title: 'Revendeurs', path: '/admin/partenaires' },
      ]
    },
    {
      title: 'Réseau de Transport',
      icon: <FaRoute />,
      submenu: [
        { title: 'Pays', path: '/admin/pays' },
        { title: 'Villes', path: '/admin/villes' },
        { title: 'Routes', path: '/admin/routes/liste' },
        { title: 'Itinéraires', path: '/admin/itineraire/liste' },
        { title: 'Trajets', path: '/admin/trajets/liste' },
      ]
    },
    {
      title: 'Moyen de Transport',
      icon: <FaBus />,
      path: '/admin/bus',
      submenu: [
        { title: 'Liste des moyens de transport', path: '/admin/bus' },
      ]
    },
    {
      title: 'Voyages',
      icon: <FaTicketAlt />,
      path: '/admin/voyages',
      submenu: [
        { title: 'Programmation', path: '/admin/voyages/liste' },
        { title: 'Manifeste', path: '/admin/manifeste' },
      ]
    },
    {
      title: 'Comptabilité',
      icon: <FaMoneyBillWave />,
      path: '/admin/comptabilite',
      submenu: [
        // { title: 'Encaissement', path: '/admin/journal/paiements' },
        // { title: 'Dépenses Agence', path: '/admin/depenses' },
        { title: 'Suivi des voyages', path: '/admin/voyages/suivi' },
        { title: 'Dépenses Voyage', path: '/depense-voyage' },
        { title: 'Balance Voyage', path: '/reports/chiffre-affaires' },
        { title: 'Balance Générale', path: '/reports/synthese' }
      ]
    },
    {
      title: 'Fret',
      icon: <FaRoute />,
      path: '/admin/fret',
      submenu: [
        { title: 'Type de colis', path: '/fret/types_colis/' },
        { title: 'Tarification', path: '/fret/poids_tarif/' },
        { title: 'Colis', path: '/admin/fret/fret_agence' },
        { title: 'Organisation des Colis', path: '/admin/colis/organisation' },
        // { title: 'Scanner & Gérer Colis', path: '/agence/scanner-colis', icon: <FaQrcode /> },
       // { title: 'Transbordement', path: '/agence/transbordement/' }
      ]
    },
    {
      title: 'Ventes',
      icon: <FaTicketAlt />,
      path: '/admin/ventes',
      submenu: [
        { title: 'Vente billet adulte (Admin)', path: '/admin/ventes/billet' },
        // ... autres sous-menus ventes si besoin ...
      ]
    },
    {
      title: 'Réclamations',
      icon: <FaClipboardList />,
      path: '#'
    },
    {
      title: 'SMS',
      icon: <FaSms />,
      path: '/admin/sms',
      submenu: [
        { title: 'Logs des SMS', path: '/admin/sms/logs' },
      ]
    },
    {
      title: 'Paramètres',
      icon: <FaCog />,
      path: '/admin/parametres/password'
    }
  ];

  // Menu des commissions (visible uniquement pour le super admin)
  const commissionMenuItems = [
    {
      title: 'Configuration',
      path: '/admin/commissions/config'
    },
    {
      title: 'Suivi des Commissions',
      path: '/admin/commissions/suivi'
    },
    {
      title: 'Paiements',
      path: '/admin/commissions/paiements'
    }
  ];

  // Restriction des menus selon le rôle
  const isDirection = user && user.role === 'direction';
  const isSuperAdmin = user && user.is_superadmin === 1;

  // Filtrer les menus selon le rôle
  const filteredMenuItems = menuItems.map(item => {
    // Créer une copie de l'item pour éviter de modifier l'original
    const newItem = { ...item };
    
    // Filtrer les sous-menus selon le rôle
    if (newItem.submenu) {
      newItem.submenu = newItem.submenu.filter(subItem => {
        // Gestion des sociétés : visible uniquement pour superadmin
        if ((subItem.path === '/admin/societes/liste' || subItem.path === '/admin/societes/add') && !isSuperAdmin) {
          return false;
        }
        return true;
      });
    }
    
    return newItem;
  }).filter(item => {
    // Comptabilité : visible direction, superadmin et fret (gestion financière du fret)
    if (item.title === 'Comptabilité' && !isDirection && !isSuperAdmin && user.role !== 'fret') return false;
    
    // Fret/Colis (fret_agence) : masquer pour admin
    if (item.title === 'Fret') {
      if (!isDirection && !isSuperAdmin) {
        // On retire le sous-menu fret_agence
        item.submenu = item.submenu?.filter(sub => sub.path !== '/admin/fret/fret_agence');
      }
      // Si plus de sous-menu, masquer le menu
      if (!item.submenu || item.submenu.length === 0) return false;
    }
    
    return true;
  });

  // Afficher le loader si l'utilisateur n'est pas encore chargé
  if (!user || !user.nom) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Vérifier les permissions
  // Le rôle 'fret' a les mêmes droits qu'admin
  const hasValidRole = user.role === 'admin' || user.role === 'direction' || user.role === 'fret' || user.is_superadmin === 1;
  if (!hasValidRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">🚫 Accès non autorisé</div>
          <div className="text-gray-600">Vous n&apos;avez pas les permissions nécessaires pour accéder à cette section.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`bg-blue-800 text-white flex flex-col h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-blue-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">{user?.societe?.nom || "Admin Panel"}</h1>
          ) : (
            <div className="font-bold">SP</div>
          )}
          <button 
            onClick={toggleSidebar} 
            className="text-white hover:text-blue-200 focus:outline-none"
            aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <ul>
            {filteredMenuItems.map((item, index) => (
              <li key={index} className="mb-1">
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className={`w-full flex items-center p-3 hover:bg-blue-700 transition-colors ${
                        router.pathname.startsWith(item.path || '') ? 'bg-blue-700' : ''
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left">{item.title}</span>
                          {activeSubmenu === index ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
                        </>
                      )}
                    </button>
                    {sidebarOpen && activeSubmenu === index && (
                      <ul className="bg-blue-900 ml-2">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link href={subItem.path} passHref legacyBehavior>
                              <a
                                className={`block py-2 px-4 hover:bg-blue-800 pl-10 ${
                                  router.pathname === subItem.path ? 'bg-blue-800 font-medium' : ''
                                }`}
                              >
                                {subItem.title}
                              </a>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link href={item.path} passHref legacyBehavior>
                    <a
                      className={`flex items-center p-3 hover:bg-blue-700 ${
                        router.pathname === item.path ? 'bg-blue-700' : ''
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {sidebarOpen && <span>{item.title}</span>}
                    </a>
                  </Link>
                )}
              </li>
            ))}
            
            {/* Menu des Commissions - Visible uniquement pour le Super Admin */}
            {isSuperAdmin && (
              <li className="mb-1">
                <button
                  onClick={() => toggleSubmenu('commissions')}
                  className={`w-full flex items-center p-3 hover:bg-blue-700 transition-colors ${
                    router.pathname.startsWith('/admin/commissions') ? 'bg-blue-700' : ''
                  }`}
                >
                  <span className="mr-3"><FaPercentage /></span>
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">Commissions</span>
                      {activeSubmenu === 'commissions' ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
                    </>
                  )}
                </button>
                {sidebarOpen && activeSubmenu === 'commissions' && (
                  <ul className="bg-blue-900 ml-2">
                    {commissionMenuItems.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link href={subItem.path} passHref legacyBehavior>
                          <a
                            className={`block py-2 px-4 hover:bg-blue-800 pl-10 ${
                              router.pathname === subItem.path ? 'bg-blue-800 font-medium' : ''
                            }`}
                          >
                            {subItem.title}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}
          </ul>
        </nav>

        {/* Pied de page avec déconnexion */}
        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-2">
                  {user?.nom?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.nom || 'Utilisateur'}</p>
                  <button 
                    onClick={logout}
                    className="text-xs text-blue-200 hover:text-white mt-1 flex items-center"
                  >
                    <FaSignOutAlt className="mr-1" /> Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={logout}
                className="text-white hover:text-blue-200 mx-auto"
                title="Déconnexion"
              >
                <FaSignOutAlt />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
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
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user?.nom?.charAt(0) || 'U'}
                  </div>
                  <span className="text-gray-700 hidden md:inline-block">{user?.nom || 'Utilisateur'}</span>
                  <FaChevronDown className="text-gray-600 text-xs" />
                </button>
                
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">{user?.email || 'email@exemple.com'}</p>
                      <p className="text-xs text-gray-500">{user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'direction' ? 'Direction' : 'Administrateur'}</p>
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

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminNavbar;