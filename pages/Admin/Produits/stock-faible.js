import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../../components/Admin/Layout_admin";
import Image from "next/image";
import { 
  Package, 
  AlertTriangle, 
  RefreshCw, 
  Settings,
  TrendingDown,
  ShoppingCart,
  Eye
} from "lucide-react";

export default function StockFaible() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seuil, setSeuil] = useState(3);
  const [total, setTotal] = useState(0);

  const fetchProduits = async (nouveauSeuil = seuil) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/produits/stock-faible?seuil=${nouveauSeuil}`);
      const data = await res.json();
      setProduits(data.produits);
      setTotal(data.total);
    } catch (err) {
      console.error("Erreur lors du chargement des produits :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const handleSeuilChange = (nouveauSeuil) => {
    setSeuil(nouveauSeuil);
    fetchProduits(nouveauSeuil);
  };

  const getStockStatus = (stock, stockMinimum) => {
    if (stock === 0) return { label: "Rupture", color: "bg-red-500", textColor: "text-red-600" };
    if (stock < stockMinimum) return { label: "Critique", color: "bg-red-400", textColor: "text-red-600" };
    return { label: "Faible", color: "bg-gray-500", textColor: "text-gray-600" };
  };

  return (
    <LayoutAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-green-800 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black">Stock Faible</h1>
            <p className="text-gray-600">Surveillance des produits en rupture ou stock critique</p>
          </div>
        </div>

        {/* Contrôles */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Seuil d'alerte :</label>
              </div>
              <select
                value={seuil}
                onChange={(e) => handleSeuilChange(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800"
              >
                <option value={1}>≤ 1</option>
                <option value={2}>≤ 2</option>
                <option value={3}>≤ 3</option>
                <option value={5}>≤ 5</option>
                <option value={10}>≤ 10</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchProduits()}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-800 hover:bg-green-900 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-800" />
                <span className="text-sm font-medium text-green-800">Produits concernés</span>
              </div>
              <p className="text-2xl font-bold text-black mt-1">{total}</p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-800">En rupture</span>
              </div>
              <p className="text-2xl font-bold text-black mt-1">
                {produits.filter(p => p.stock === 0).length}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Stock critique</span>
              </div>
              <p className="text-2xl font-bold text-black mt-1">
                {produits.filter(p => p.stock > 0 && p.stock < p.stock_minimum).length}
              </p>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
          </div>
        ) : produits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-green-800" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Excellent !</h3>
            <p className="text-green-800">Tous les produits ont un stock suffisant (≥ {seuil})</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produits.map((produit) => {
              const status = getStockStatus(produit.stock, produit.stock_minimum);
              return (
                <div
                  key={produit.id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={produit.image_url || "/images/placeholder.png"}
                      alt={produit.nom}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-black line-clamp-2">{produit.nom}</h3>
                      <p className="text-sm text-gray-600">{produit.marque_nom}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Prix :</span>
                        <span className="font-semibold text-black">{Math.round(produit.prix).toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Stock actuel :</span>
                        <span className={`font-bold ${status.textColor}`}>{produit.stock}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Stock minimum :</span>
                        <span className="text-sm text-gray-600">{produit.stock_minimum}</span>
                      </div>
                      
                      {produit.sku && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">SKU :</span>
                          <span className="text-xs text-gray-600 font-mono">{produit.sku}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-800 hover:bg-green-900 text-white text-sm rounded-lg transition-colors">
                          <ShoppingCart className="w-4 h-4" />
                          Réapprovisionner
                        </button>
                        <button className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
}