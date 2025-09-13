'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || 'Échec de connexion');
        setLoading(false);
        return;
      }
      // Assure que le Set-Cookie est appliqué, puis redirige en navigation complète
      const q = router.query && router.query.redirect;
      const redirect = Array.isArray(q) ? (q[0] || '/Admin/dashbord') : (q || '/Admin/dashbord');
      setTimeout(() => {
        window.location.href = redirect;
      }, 50);
    } catch (e) {
      setError('Erreur réseau');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">G</div>
                <h1 className="text-2xl font-bold text-gray-900">Connexion Admin</h1>
              </div>

              {error && (
                <div className="mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-gray-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-gray-50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                >
                  {loading ? 'Connexion…' : 'Se connecter'}
                </button>
              </form>

              <p className="mt-6 text-xs text-gray-500 text-center">
                Accès réservé au personnel autorisé.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-xl p-10">
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
                backgroundSize: '18px 18px'
              }} />
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-green-600 mb-6 shadow-lg" />
                <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Panneau d’administration</h2>
                <p className="text-gray-600 leading-relaxed">
                  Gérez les produits, commandes, marques et opérations du magasin dans une interface
                  moderne et sécurisée.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="font-semibold text-gray-900">Produits</p>
                    <p className="text-gray-600 mt-1">Catalogue, stocks</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="font-semibold text-gray-900">Commandes</p>
                    <p className="text-gray-600 mt-1">Suivi, factures</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="font-semibold text-gray-900">Marques</p>
                    <p className="text-gray-600 mt-1">Ajouts, mises à jour</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="font-semibold text-gray-900">Utilisateurs</p>
                    <p className="text-gray-600 mt-1">Accès, permissions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


