import { useEffect, useState } from "react";
import axios from "axios";

import Link from "next/link";
import Image from "next/image";
import { Toaster } from "sonner";
import PageLoader from "../../components/PageLoader";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children, loading = false }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [estOuvert, setEstOuvert] = useState(false);

  const [lowStockCount, setLowStockCount] = useState(0);

useEffect(() => {
  const fetchLowStock = async () => {
    try {
      const res = await axios.get("/api/produits/stock-faible-count");
      setLowStockCount(res.data.count);
    } catch (error) {
      console.error("Erreur lors du chargement du stock faible :", error);
    }
  };

  fetchLowStock();
}, []);

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* MAIN CONTENT */}
      <div className={`h-screen min-h-0 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* PAGE CONTENT */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Spacer for fixed navbar height */}
          <div className="h-20" />
          <main className="min-h-0 px-0 py-4 bg-white">
          {loading && <PageLoader />}
          {children}
          </main>
        </div>
      </div>

      {/* CLICK OUTSIDE DROPDOWN */}
      {estOuvert && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setEstOuvert(false)}
        ></div>
      )}

      {/* TOASTER */}
      <Toaster richColors position="top-right" />
    </div>
  );
}

// Sub-components
function SidebarLink({ href, icon, label, badge }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 px-2 py-2 hover:bg-amber-50 rounded-lg transition text-black relative"
    >
      <span className="flex items-center gap-2">
        {icon} {label}
      </span>
      {badge && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
          {badge}
        </span>
      )}
    </Link>
  );
}

function DropdownLink({ href, label }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-md transition"
    >
      {label}
    </Link>
  );
}