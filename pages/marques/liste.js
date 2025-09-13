// pages/marques/liste.js
import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { pool } from '../../lib/db';
import MarqueSkeleton from '../../components/MarqueSkeleton';
import { generateSlug } from '../../lib/slug';

export default function MarquesList({ marques, error }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  // Skeleton loading pour le refresh
  if (isRefreshing) {
    return (
      <Layout>
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
          <div className='bg-white p-2 w-full top-0 z-50'>
            <h2 className="ml-10 text-2xl font-bold text-gray-800">
              Garden / Découvrez ici nos marques Africaines et internationales
            </h2>
          </div>
          
          <div className="max-w-7xl mx-auto mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:m-15 lg:pl-2 lg:pr-2 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <MarqueSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRefreshing ? 'Rechargement...' : 'Réessayer'}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 py-16 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(rgba(5,150,105,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0',
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos <span className="text-green-600">Marques</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Découvrez notre sélection exclusive de marques africaines et internationales, 
            soigneusement choisies pour leur qualité et leur authenticité.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Marques Africaines
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Marques Internationales
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Qualité Garantie
            </div>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {marques.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Aucune marque disponible</h3>
              <p className="text-gray-600 text-lg">Nous travaillons pour vous proposer de nouvelles marques très bientôt.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {marques.map((marque) => (
                <div key={marque.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="relative overflow-hidden">
                    <Link href={`/marques/${generateSlug(marque.nom)}`} className="block">
                      <div className="aspect-[4/3] relative cursor-pointer">
                        <Image
                          width={400}
                          height={300}
                          src={marque.image_url || '/images/garden.png'}
                          alt={marque.nom || 'Marque sans nom'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                          onError={(e) => {
                            e.currentTarget.src = '/images/garden.png';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </Link>
                    
                    {/* Zone Badge */}
                    {marque.zone && (
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          marque.zone.toLowerCase() === 'afrique' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {marque.zone}
                        </span>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-green-600/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <p className="text-sm font-medium">Découvrir</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                      {marque.nom}
                    </h3>
                    {marque.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {marque.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Link href={`/marques/${generateSlug(marque.nom)}`} className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-300">
                        Voir les produits
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      
                      <div className="flex items-center text-xs text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {marque.created_at && new Date(marque.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [marques] = await pool.query(`
      SELECT id, nom, description, image_url, zone, created_at 
      FROM marques 
      ORDER BY nom ASC
    `);
    
    // Convertir les dates en chaînes pour la sérialisation JSON
    const marquesSerialized = marques.map(marque => ({
      ...marque,
      created_at: marque.created_at ? marque.created_at.toISOString() : null
    }));
    
    return {
      props: {
        marques: marquesSerialized || [],
        error: null
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des marques :', error);
    
    return {
      props: {
        marques: [],
        error: 'Impossible de charger les marques. Veuillez réessayer plus tard.'
      }
    };
  }
}
