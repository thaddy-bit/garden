import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  BellIcon,
  SearchIcon,
  MenuIcon,
  XIcon,
  UserCircleIcon,
  CogIcon,
  LogoutIcon
} from './Icons';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/admin-logout', { method: 'POST' });
    } catch (e) {
      // ignore
    } finally {
      router.replace('/Admin/login');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Navbar premium */}
      <header
        className={`fixed top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 shadow-lg backdrop-blur-xl border-b border-gray-100' : 'bg-white/80 backdrop-blur-xl'
        } ${isSidebarOpen ? 'md:left-64' : 'md:left-20'} left-0 right-0`}
      >
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          {/* Branding + toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 md:hidden"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white font-semibold shadow-lg">G</span>
              <span className="font-semibold text-gray-900 tracking-wide">Garden Admin</span>
            </div>
          </div>

          {/* Recherche */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-4">
            <div className={`relative w-full transition-all duration-300 ${searchOpen ? 'opacity-100' : 'opacity-95'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Rechercher produits, commandes, clients..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600/40 focus:border-green-600/40 text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 md:hidden"
              aria-label="Rechercher"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 relative" aria-label="Notifications">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-green-600"></span>
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 focus:outline-none rounded-xl hover:bg-gray-100 px-2.5 py-1.5"
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
              >
                <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold shadow-md">
                  SA
                </div>
                <span className="hidden md:inline-block text-sm font-medium text-gray-700">Super Admin</span>
              </button>

              {profileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 text-xs text-gray-500">Compte</div>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <UserCircleIcon className="w-4 h-4" /> Profil
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <CogIcon className="w-4 h-4" /> Paramètres
                    </button>
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={handleAdminLogout}
                      className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LogoutIcon className="w-4 h-4" /> Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Recherche mobile */}
        {searchOpen && (
          <div className="px-4 pb-3 md:hidden">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600/40 focus:border-green-600/40 sm:text-sm"
              />
            </div>
          </div>
        )}
      </header>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-5/6 max-w-sm bg-white shadow-2xl z-50 rounded-r-2xl">
            <div className="h-full overflow-y-auto">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Navigation</h2>
              </div>
              <nav className="p-4 space-y-2">
                <a href="/Admin/dashbord" className="block p-2 rounded-lg hover:bg-gray-100">Dashboard</a>
                <a href="/Admin/commandes" className="block p-2 rounded-lg hover:bg-gray-100">Commandes</a>
                <a href="/Admin/Marques/getAll" className="block p-2 rounded-lg hover:bg-gray-100">Collections</a>
                <a href="/Admin/Produits/add-product" className="block p-2 rounded-lg hover:bg-gray-100">Articles</a>
                <a href="/Admin/Produits/stock-faible" className="block p-2 rounded-lg hover:bg-gray-100">Stock faible</a>
                <a href="/Admin/Sous_collections/add" className="block p-2 rounded-lg hover:bg-gray-100">Sous-collections</a>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;