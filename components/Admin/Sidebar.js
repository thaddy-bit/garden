import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MenuIcon, XIcon } from './Icons';
import {
  HomeIcon,
  SettingsIcon,
  FolderIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from './Icons';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    dashboard: true,
    commandes: true,
    achats: true,
    ajustements: false,
    mouvements: true,
    marques: true,
    sousCats: false,
    produits: true,
    settings: false,
  });

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleGroup = (key) => setOpenGroups((s) => ({ ...s, [key]: !s[key] }));

  const isActive = (href) => router.asPath.startsWith(href);

  const NavItem = ({ href, icon, label, badge }) => (
    <Link
      href={href}
      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition text-sm border ${
        isActive(href) ? 'bg-green-600 text-white border-green-600 shadow' : 'text-gray-800 hover:bg-gray-50 border-transparent'
      }`}
      onClick={() => setMobileMenuOpen(false)}
    >
      <span className="flex items-center gap-2">
        {icon}
        {isOpen && <span>{label}</span>}
      </span>
      {isOpen && badge != null && (
        <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* Bouton mobile */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-16 left-4 z-50 p-2 rounded-xl bg-black text-white shadow"
        aria-label="Ouvrir le menu"
      >
        {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </button>

      {/* Overlay mobile */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Barre latérale */}
      <aside
        className={`bg-white/90 backdrop-blur-xl border-r border-gray-100 text-gray-900 transition-all duration-300 ease-in-out fixed top-0 bottom-0 h-screen z-50 flex flex-col relative shadow-lg
          ${isOpen ? 'w-64' : 'w-20'}
          ${mobileMenuOpen ? 'left-0' : '-left-full md:left-0'}
        `}
        aria-label="Barre latérale"
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          {isOpen ? (
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
            {isOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="p-3 flex-1 overflow-y-auto space-y-6 pb-8 overscroll-contain">
          {/* Dashboard */}
          <div>
            <button
              className="w-full flex items-center justify-between text-left px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
              onClick={() => toggleGroup('dashboard')}
              aria-expanded={openGroups.dashboard}
            >
              {isOpen ? 'Tableau de bord' : 'TB'}
              {isOpen && (openGroups.dashboard ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
            </button>
            <div
              className={`mt-2`}
              style={{ overflow: 'hidden', transition: 'max-height 600ms ease-in-out', maxHeight: openGroups.dashboard ? (isOpen ? '200px' : '80px') : '0px' }}
            >
              <div className="space-y-1">
                <NavItem href="/Admin/dashbord" icon={<HomeIcon className="w-4 h-4" />} label="Dashboard" />
              </div>
            </div>
          </div>

          {/* Commandes */}
          <div>
            <button
              className="w-full flex items-center justify-between text-left px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
              onClick={() => toggleGroup('commandes')}
              aria-expanded={openGroups.commandes}
            >
              {isOpen ? 'Commandes' : 'CM'}
              {isOpen && (openGroups.commandes ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
            </button>
            <div
              className={`mt-2`}
              style={{ overflow: 'hidden', transition: 'max-height 600ms ease-in-out', maxHeight: openGroups.commandes ? (isOpen ? '200px' : '80px') : '0px' }}
            >
              <div className="space-y-1">
                <NavItem href="/Admin/commandes" icon={<FolderIcon className="w-4 h-4" />} label="Gestion des commandes" />
              </div>
            </div>
          </div>

          {/* Achats */}
          <div>
            <button
              className="w-full flex items-center justify-between text-left px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
              onClick={() => toggleGroup('achats')}
              aria-expanded={openGroups.achats}
            >
              {isOpen ? 'Achats' : 'AC'}
              {isOpen && (openGroups.achats ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
            </button>
            <div
              className={`mt-2`}
              style={{ overflow: 'hidden', transition: 'max-height 600ms ease-in-out', maxHeight: openGroups.achats ? (isOpen ? '240px' : '120px') : '0px' }}
            >
              <div className="space-y-1">
                <NavItem href="/Admin/achats" icon={<FolderIcon className="w-4 h-4" />} label="Liste des achats" />
                <NavItem href="/Admin/achats/nouveau" icon={<FolderIcon className="w-4 h-4" />} label="Nouvelle commande" />
              </div>
            </div>
          </div>

          {/* Ajustements */}
          <div>
            <button
              className="w-full flex items-center justify-between text-left px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
              onClick={() => toggleGroup('ajustements')}
              aria-expanded={openGroups.ajustements}
            >
              {isOpen ? 'Ajustements' : 'AJ'}
              {isOpen && (openGroups.ajustements ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
            </button>
            <div
              className={`mt-2`}
              style={{ overflow: 'hidden', transition: 'max-height 600ms ease-in-out', maxHeight: openGroups.ajustements ? (isOpen ? '200px' : '80px') : '0px' }}
            >
              <div className="space-y-1">
                <NavItem href="/Admin/ajustements/nouveau" icon={<FolderIcon className="w-4 h-4" />} label="Nouvel ajustement" />
              </div>
            </div>
          </div>

          {/* Mouvements */}
          <div>
            <button
              className="w-full flex items-center justify-between text-left px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
              onClick={() => toggleGroup('mouvements')}
              aria-expanded={openGroups.mouvements}
            >
              {isOpen ? 'Mouvements' : 'MV'}
              {isOpen && (openGroups.mouvements ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
            </button>
            <div
              className={`mt-2`}
              style={{ overflow: 'hidden', transition: 'max-height 600ms ease-in-out', maxHeight: openGroups.mouvements ? (isOpen ? '200px' : '80px') : '0px' }}
            >
              <div className="space-y-1">
                <NavItem href="/Admin/mouvements" icon={<FolderIcon className="w-4 h-4" />} label="Journal des mouvements" />
              </div>
            </div>
          </div>

          {/* Marques */}
          <div>
            <button
              className="w-full flex items-center justify-between text-left px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
              onClick={() => toggleGroup('marques')}
              aria-expanded={openGroups.marques}
            >
              {isOpen ? 'Marques' : 'MQ'}
              {isOpen && (openGroups.marques ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
            </button>
            <div
              className={`mt-2`}
              style={{ overflow: 'hidden', transition: 'max-height 600ms ease-in-out', maxHeight: openGroups.marques ? (isOpen ? '300px' : '120px') : '0px' }}
            >
              <div className="space-y-1">
                <NavItem href="/Admin/Marques/add" icon={<FolderIcon className="w-4 h-4" />} label="Ajouter une marque" />
                <NavItem href="/Admin/Marques/getAll" icon={<FolderIcon className="w-4 h-4" />} label="Liste des marques" />
              </div>
            </div>
          </div>

          {/* Sous Catégories */}
          <div>
            <button
              className="w-full flex items-center justify-between text-left px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
              onClick={() => toggleGroup('sousCats')}
              aria-expanded={openGroups.sousCats}
            >
              {isOpen ? 'Sous Catégories' : 'SC'}
              {isOpen && (openGroups.sousCats ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
            </button>
            <div
              className={`mt-2`}
              style={{ overflow: 'hidden', transition: 'max-height 600ms ease-in-out', maxHeight: openGroups.sousCats ? (isOpen ? '300px' : '120px') : '0px' }}
            >
              <div className="space-y-1">
                <NavItem href="/Admin/Sous_collections/add" icon={<FolderIcon className="w-4 h-4" />} label="Ajouter une sous catégorie" />
                <NavItem href="/Admin/Sous_collections/list" icon={<FolderIcon className="w-4 h-4" />} label="Liste des sous catégories" />
              </div>
            </div>
          </div>

          {/* Produits */}
          <div>
            <button
              className="w-full flex items-center justify-between text-left px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
              onClick={() => toggleGroup('produits')}
              aria-expanded={openGroups.produits}
            >
              {isOpen ? 'Produits' : 'PD'}
              {isOpen && (openGroups.produits ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
            </button>
            <div
              className={`mt-2`}
              style={{ overflow: 'hidden', transition: 'max-height 600ms ease-in-out', maxHeight: openGroups.produits ? (isOpen ? '400px' : '160px') : '0px' }}
            >
              <div className="space-y-1">
                <NavItem href="/Admin/Produits/add-product" icon={<FolderIcon className="w-4 h-4" />} label="Ajouter un produit" />
                <NavItem href="/Admin/Produits/list" icon={<FolderIcon className="w-4 h-4" />} label="Liste des produits" />
                <NavItem href="/Admin/Produits/stock-faible" icon={<FolderIcon className="w-4 h-4" />} label="Stock faible" />
              </div>
            </div>
          </div>

          {/* Paramètres */}
          <div>
            <button
              className="w-full flex items-center justify-between text-left px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
              onClick={() => toggleGroup('settings')}
              aria-expanded={openGroups.settings}
            >
              {isOpen ? 'Paramètres' : 'PR'}
              {isOpen && (openGroups.settings ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
            </button>
            <div
              className={`mt-2`}
              style={{ overflow: 'hidden', transition: 'max-height 600ms ease-in-out', maxHeight: openGroups.settings ? (isOpen ? '200px' : '80px') : '0px' }}
            >
              <div className="space-y-1">
                <NavItem href="/Admin/settings" icon={<SettingsIcon className="w-4 h-4" />} label="Paramètres" />
              </div>
            </div>
          </div>
        </nav>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
      </aside>
    </>
  );
};

export default Sidebar;