import LayoutAdmin from '../../../components/Admin/Layout_admin';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FiEdit2 as EditIcon, FiTrash2 as TrashIcon } from 'react-icons/fi';

export default function ProduitsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);

  const formatDate = (value) => {
    if (!value) return '—';
    try {
      const raw = value ?? '';
      const date = typeof raw === 'string' ? new Date(raw.replace(' ', 'T')) : new Date(raw);
      if (isNaN(date.getTime())) return '—';
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }).format(date);
    } catch {
      return '—';
    }
  };

  const handleDelete = async (productId, productName) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productName}" ?`)) {
      try {
        const response = await fetch(`/api/produits/${productId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Recharger la liste
          fetchProducts();
        } else {
          const data = await response.json();
          alert(data.message || 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/produits?sort=${sort}&page=${page}&limit=${limit}&q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('API');
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (_e) {
      setError('Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sort, page, limit, q]);

  const grid = useMemo(() => items, [items]);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const current = Math.min(page, totalPages);

  return (
    <LayoutAdmin>
      <div className="px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Produits</h1>
            <p className="text-sm text-gray-500">Gérez vos produits et leur visibilité</p>
          </div>
          <Link href="/Admin/Produits/add-product" className="inline-flex items-center px-3 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-900">Ajouter un produit</Link>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
          <input type="search" placeholder="Rechercher (nom, SKU)..." value={q} onChange={(e)=>{ setQ(e.target.value); setPage(1); }} className="w-full md:w-80 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20" />
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="recent">Plus récents</option>
            <option value="name_asc">Nom A → Z</option>
            <option value="name_desc">Nom Z → A</option>
            <option value="price_asc">Prix ↑</option>
            <option value="price_desc">Prix ↓</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={limit} onChange={(e)=>{ setLimit(parseInt(e.target.value,10)||12); setPage(1); }}>
            <option value={12}>12 / page</option>
            <option value={24}>24 / page</option>
            <option value={48}>48 / page</option>
          </select>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_,i)=> (<div key={i} className="h-72 rounded-xl bg-gray-100 animate-pulse" />))}
            </div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {grid.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                  {/* Image du produit */}
                  <div className="aspect-square relative">
                    {p.image_url ? (
                      <Image src={p.image_url} alt={p.nom} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm bg-gray-50">Aucune image</div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {p.nouveaute && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">Nouveau</span>}
                      {p.en_vedette && <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">Vedette</span>}
                      {p.en_solde && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">Solde</span>}
                    </div>
                    {/* Stock status */}
                    <div className="absolute top-2 right-2">
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${p.stock < p.stock_minimum ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                        {p.stock < p.stock_minimum ? 'Stock faible' : `${p.stock} en stock`}
                      </div>
                    </div>
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-5 space-y-3">
                    {/* Nom et SKU */}
                    <div>
                      <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-1">{p.nom}</h3>
                      {p.sku && <div className="text-xs text-gray-500 font-mono">SKU: {p.sku}</div>}
                    </div>

                    {/* Description courte */}
                    {p.description_courte && (
                      <p className="text-sm text-gray-600 line-clamp-2">{p.description_courte}</p>
                    )}

                    {/* Informations produit */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Marque:</span>
                        <span className="font-medium text-gray-900">{p.marque_nom || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Catégorie:</span>
                        <span className="font-medium text-gray-900">{p.sous_categorie_nom || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Variantes */}
                    {(p.couleur || p.taille || p.materiau) && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-700">Variantes:</div>
                        <div className="flex flex-wrap gap-1">
                          {p.couleur && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{p.couleur}</span>}
                          {p.taille && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">{p.taille}</span>}
                          {p.materiau && <span className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded">{p.materiau}</span>}
                        </div>
                      </div>
                    )}

                    {/* Prix */}
                    <div className="space-y-1">
                      {(() => {
                        const base = Number(p.prix) || 0;
                        const reduction = Number(p.prix_reduction) || 0;
                        const enSolde = Boolean(p.en_solde);
                        const promo = Math.max(0, base - reduction);
                        const hasPromo = enSolde && reduction > 0 && promo >= 0;
                        const format = (n) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' });
                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <span className={`text-lg font-bold ${hasPromo ? 'text-red-600' : 'text-gray-900'}`}>
                                {hasPromo ? format(promo) : format(base)}
                              </span>
                              {hasPromo && (
                                <span className="text-sm text-red-600 font-medium">
                                  -{Number(p.pourcentage_reduction) || Math.round((reduction / (base || 1)) * 100)}%
                                </span>
                              )}
                            </div>
                            {hasPromo && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="line-through text-gray-500">{format(base)}</span>
                                <span className="text-gray-500">(réduction: {format(reduction)})</span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    {/* Couleurs disponibles (si tags incluent des couleurs) */}
                    {p.couleurs_disponibles && Array.isArray(p.couleurs_disponibles) && p.couleurs_disponibles.length > 0 && (
                      <div className="pt-2">
                        <div className="text-xs font-medium text-gray-700 mb-1">Couleurs disponibles:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.couleurs_disponibles.slice(0, 6).map((c, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full border bg-white text-gray-700">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Informations techniques */}
                    {(p.poids || p.dimensions) && (
                      <div className="text-xs text-gray-500 space-y-1">
                        {p.poids && <div>Poids: {p.poids}kg</div>}
                        {p.dimensions && <div>Dimensions: {p.dimensions}</div>}
                      </div>
                    )}

                    {/* Dates */}
                    <div className="text-xs text-gray-400 border-t pt-2">
                      {(() => {
                        const created = p.created_at || p.createdAt || p.created || null;
                        const updated = p.updated_at || p.updatedAt || p.updated || null;
                        return (
                          <>
                            <div>Créé: {formatDate(created)}</div>
                            {updated && created && String(updated) !== String(created) && (
                              <div>Modifié: {formatDate(updated)}</div>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                      <Link href={`/Admin/Produits/add-product?id=${p.id}`} className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-900 text-white hover:bg-black transition-colors" aria-label="Éditer">
                        <EditIcon className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(p.id, p.nom)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" 
                        aria-label="Supprimer"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">Page {current} / {totalPages} — {total} produits</div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded border text-sm disabled:opacity-50" onClick={()=> setPage((p)=> Math.max(1, p-1))} disabled={current === 1}>Précédent</button>
                <button className="px-3 py-1 rounded border text-sm disabled:opacity-50" onClick={()=> setPage((p)=> Math.min(totalPages, p+1))} disabled={current === totalPages}>Suivant</button>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
}


