import LayoutAdmin from '../../../components/Admin/Layout_admin';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FiEdit2 as EditIcon, FiTrash2 as TrashIcon } from 'react-icons/fi';

export default function SousCategoriesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('nom_asc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [confirm, setConfirm] = useState({ open:false, id:null, name:'' });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        // Assuming an API to list all sous_categories exists; otherwise, create it later
        const res = await fetch('/api/sous_collection/getAll');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (alive) setItems(Array.isArray(data) ? data : []);
      } catch (_e) {
        if (alive) setError('Impossible de charger les sous catégories');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    let arr = [...items];
    if (q) {
      const term = q.toLowerCase();
      arr = arr.filter(s => (s.nom || '').toLowerCase().includes(term));
    }
    if (sort === 'nom_asc') arr.sort((a,b)=> (a.nom||'').localeCompare(b.nom||''));
    if (sort === 'nom_desc') arr.sort((a,b)=> (b.nom||'').localeCompare(a.nom||''));
    if (sort === 'recent') arr.sort((a,b)=> new Date(b.created_at||0) - new Date(a.created_at||0));
    return arr;
  }, [items, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const current = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (current - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, current, limit]);

  return (
    <LayoutAdmin>
      <div className="px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Sous catégories</h1>
            <p className="text-sm text-gray-500">Gérez vos sous catégories</p>
          </div>
          <Link href="/Admin/Sous_collections/add" className="inline-flex items-center px-3 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-900">
            Ajouter une sous catégorie
          </Link>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="search"
            placeholder="Rechercher..."
            value={q}
            onChange={(e)=>{ setQ(e.target.value); setPage(1); }}
            className="w-full md:w-80 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20"
          />
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="nom_asc">Nom A → Z</option>
            <option value="nom_desc">Nom Z → A</option>
            <option value="recent">Plus récentes</option>
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
              {Array.from({ length: 8 }).map((_,i)=> (
                <div key={i} className="h-64 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginated.map((s)=> (
                  <div key={s.id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-40 bg-gray-50">
                      {s.image_url ? (
                        <Image src={s.image_url} alt={s.nom} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Aucune image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate">{s.nom}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/Admin/Sous_collections/add?id=${s.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 text-white hover:bg-black" aria-label="Éditer">
                            <EditIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setConfirm({ open: true, id: s.id, name: s.nom })}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                            aria-label="Supprimer"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {s.description && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{s.description}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-400">{s.created_at ? new Date(s.created_at).toLocaleDateString() : ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">Page {current} / {totalPages}</div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded border text-sm disabled:opacity-50" onClick={()=> setPage((p)=> Math.max(1, p-1))} disabled={current === 1}>Précédent</button>
                  <button className="px-3 py-1 rounded border text-sm disabled:opacity-50" onClick={()=> setPage((p)=> Math.min(totalPages, p+1))} disabled={current === totalPages}>Suivant</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {confirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5">
            <h3 className="text-lg font-semibold">Supprimer la sous catégorie</h3>
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
                    const res = await fetch(`/api/sous_collection/${confirm.id}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('fail');
                    setItems((prev)=> prev.filter(x=> x.id !== confirm.id));
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


