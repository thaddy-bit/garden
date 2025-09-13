import LayoutAdmin from '../../../components/Admin/Layout_admin';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FiEdit2 as EditIcon, FiTrash2 as TrashIcon } from 'react-icons/fi';

export default function MarquesList() {
  const [marques, setMarques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('nom_asc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [deletingId, setDeletingId] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/marques');
        if (!res.ok) throw new Error('Erreur API');
        const data = await res.json();
        if (alive) setMarques(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setError("Impossible de charger les marques");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    let arr = [...marques];
    if (q) {
      const term = q.toLowerCase();
      arr = arr.filter(m => (m.nom || '').toLowerCase().includes(term));
    }
    if (sort === 'nom_asc') arr.sort((a,b)=> (a.nom||'').localeCompare(b.nom||''));
    if (sort === 'nom_desc') arr.sort((a,b)=> (b.nom||'').localeCompare(a.nom||''));
    if (sort === 'recent') arr.sort((a,b)=> new Date(b.created_at||0) - new Date(a.created_at||0));
    return arr;
  }, [marques, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const current = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (current - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, current, limit]);

  return (
    <LayoutAdmin>
      <div className="px-4 md:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Marques</h1>
            <p className="text-sm text-gray-500">Gérez vos marques et leur visibilité</p>
          </div>
          <Link href="/Admin/Marques/add" className="inline-flex items-center px-3 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-900">
            Ajouter une marque
          </Link>
        </div>

        {/* Toolbar */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="search"
            placeholder="Rechercher une marque..."
            value={q}
            onChange={(e)=>{ setQ(e.target.value); setPage(1); }}
            className="w-full md:w-80 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20"
          />
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={sort}
            onChange={(e)=>setSort(e.target.value)}
          >
            <option value="nom_asc">Nom A → Z</option>
            <option value="nom_desc">Nom Z → A</option>
            <option value="recent">Plus récentes</option>
          </select>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={limit}
            onChange={(e)=>{ setLimit(parseInt(e.target.value,10)||12); setPage(1); }}
          >
            <option value={12}>12 / page</option>
            <option value={24}>24 / page</option>
            <option value={48}>48 / page</option>
          </select>
        </div>

        {/* Content */}
        <div className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_,i)=> (
                <div key={i} className="h-64 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginated.map((m)=> (
                  <div key={m.id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-40 bg-gray-50">
                      {m.image_url ? (
                        <Image src={m.image_url} alt={m.nom} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Aucune image</div>
                      )}
                </div>
                <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate">{m.nom}</h3>
                          {m.zone && <span className="mt-1 inline-block text-xs text-gray-500">{m.zone}</span>}
                        </div>
                        <div className="flex items-center gap-2 opacity-100">
                          <Link href={`/Admin/Marques/add?id=${m.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 text-white hover:bg-black" aria-label="Éditer">
                            <EditIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setConfirm({ open: true, id: m.id, name: m.nom })}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                            aria-label="Supprimer"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {m.description && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{m.description}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-400">{m.created_at ? new Date(m.created_at).toLocaleDateString() : ''}</span>
                        <Link href={`/Admin/Marques/getAll`} className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">Collections</Link>
                      </div>
                </div>
              </div>
            ))}
          </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">Page {current} / {totalPages}</div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                    onClick={()=> setPage((p)=> Math.max(1, p-1))}
                    disabled={current === 1}
                  >
                    Précédent
                  </button>
                  <button
                    className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                    onClick={()=> setPage((p)=> Math.min(totalPages, p+1))}
                    disabled={current === totalPages}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {confirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5">
            <h3 className="text-lg font-semibold">Supprimer la marque</h3>
            <p className="mt-2 text-sm text-gray-600">Confirmez la suppression de « {confirm.name} ».</p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button className="px-3 py-2 text-sm rounded border" onClick={() => setConfirm({ open:false, id:null, name:'' })}>Annuler</button>
              <button
                className="px-3 py-2 text-sm rounded bg-red-600 text-white disabled:opacity-50"
                disabled={deletingId === confirm.id}
                onClick={async () => {
                  if (!confirm.id) return;
                  setDeletingId(confirm.id);
                  try {
                    const res = await fetch(`/api/marques/${confirm.id}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('fail');
                    setMarques((prev)=> prev.filter(m=> m.id !== confirm.id));
                    setConfirm({ open:false, id:null, name:'' });
                  } catch (_e) {
                    alert('Suppression impossible');
                  } finally {
                    setDeletingId(null);
                  }
                }}
              >
                {deletingId === confirm.id ? 'Suppression...' : 'Supprimer'}
            </button>
            </div>
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
}