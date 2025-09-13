import Link from 'next/link';
import Image from 'next/image';
import ProductImageCarousel from './ProductImageCarousel';

export default function ProduitsSimilaires({ produits, marqueNom }) {
  if (!produits || produits.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Autres produits {marqueNom}
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez d'autres articles de cette marque
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {produits.slice(0, 4).map((produit) => (
            <div key={produit.id} className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="relative">
                <Link href={`/produit/${produit.slug}`}>
                  <ProductImageCarousel
                    images={produit.images}
                    productName={produit.nom}
                    className="w-full h-64"
                    autoSlideMs={3500}
                  />
                </Link>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-1">
                  {produit.nouveaute === 1 && (
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Nouveau
                    </span>
                  )}
                  {produit.en_vedette === 1 && (
                    <span className="bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Vedette
                    </span>
                  )}
                  {produit.en_solde === 1 && (
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      -{produit.pourcentage_reduction}%
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                  {produit.nom}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{produit.sous_categorie_nom}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline space-x-2">
                    {produit.prix_reduction ? (
                      <>
                        <span className="text-lg font-bold text-green-700">
                          {produit.prix_reduction.toLocaleString('fr-FR')} FCFA
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {produit.prix.toLocaleString('fr-FR')} FCFA
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {produit.prix.toLocaleString('fr-FR')} FCFA
                      </span>
                    )}
                  </div>
                </div>
                
                <Link 
                  href={`/produit/${produit.slug}`}
                  className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  Voir le produit
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href={`/marques/${marqueNom?.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            Voir tous les produits {marqueNom}
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

