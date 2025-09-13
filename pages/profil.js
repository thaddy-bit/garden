import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function ProfilPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          window.location.href = '/login';
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch {
        setError("Impossible de charger vos informations.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch {
      // noop
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full shadow-lg">
              <span className="text-xl font-bold">
                {user ? (user.prenom?.[0] || user.nom?.[0] || user.email?.[0] || 'U').toUpperCase() : '...'}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Mon profil</h1>
            <p className="text-gray-600">Gérez vos informations et vos préférences</p>
          </div>

          {isLoading && (
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-2 border-black border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-gray-700">Chargement de votre profil…</p>
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
              <p className="text-red-600 font-semibold">{error}</p>
              <div className="mt-4">
                <Link href="/login" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Se connecter</Link>
              </div>
            </div>
          )}

          {!isLoading && user && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-white/90 backdrop-blur rounded-2xl shadow border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Nom</p>
                    <p className="mt-1 font-medium text-gray-900">{user.nom || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prénom</p>
                    <p className="mt-1 font-medium text-gray-900">{user.prenom || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="mt-1 font-medium text-gray-900 break-all">{user.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="mt-1 font-medium text-gray-900">{user.telephone || '-'}</p>
                  </div>
                </div>
              </section>

              <aside className="space-y-6">
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
                  <div className="space-y-3">
                    <Link href="/commandes/mes_commandes" className="block w-full text-center px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">Mes commandes</Link>
                    <button onClick={handleLogout} className="w-full px-4 py-3 rounded-lg bg-black text-white font-semibold hover:opacity-90 transition">Déconnexion</button>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur rounded-2xl shadow border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Statut</h3>
                  <p className="text-sm text-gray-600">Membre</p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}



