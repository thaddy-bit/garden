import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function TestProduit() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/produits/slug/air-max-270-1')
      .then(res => res.json())
      .then(data => {
        console.log('Données reçues:', data);
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-red-600">Produit non trouvé</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">{product.nom}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-2xl font-bold text-green-600">
          {product.prix} FCFA
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Marque: {product.marque_nom} | Catégorie: {product.sous_categorie_nom}
        </p>
        {product.images && product.images.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Images:</h3>
            <div className="grid grid-cols-2 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="bg-gray-100 p-4 rounded">
                  <p className="text-sm text-gray-600">{img.image_url}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

