import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../../components/Layout";
import ProductImageCarousel from "../../components/ProductImageCarousel";

export default function ProduitDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantite, setQuantite] = useState(1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Non connecté");
        const data = await res.json();
        setUser(data); // Stocker l'utilisateur
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`/api/produits/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Erreur de chargement du produit");
          setLoading(false);
        });
    }
  }, [id]);

  const ajouterAuPanier = async () => {
    if (!user) {
      return router.push("/login");
    }
      const clientId = user;
      const ID = clientId.id;

    try {
      const res = await fetch("/api/panier/ajouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produitId: product.id,
          userId: ID,
          quantite: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Ajouté au panier !");
    } catch (err) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  if (loading) return <div className="text-center py-20">Chargement...</div>;
  if (!product) return <div className="text-center py-20">Produit introuvable</div>;

  return (
    <Layout>
      <section className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <Toaster position="top-right" />

      {/* ====== Images ====== */}
      <div className="space-y-4">
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
          <ProductImageCarousel
            images={product.images}
            productName={product.nom}
            className="w-full h-full"
          />
        </div>
        {product.images && product.images.length > 1 && (
          <div className="flex space-x-2">
            {product.images.map((img, i) => (
              <div key={i} className="w-20 h-20 border rounded-lg overflow-hidden">
                <Image 
                  src={img.image_url} 
                  alt={img.image_alt || `miniature ${i}`} 
                  width={80} 
                  height={80} 
                  className="object-cover" 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ====== Infos produit ====== */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">{product.nom}</h1>
        <p className="text-gray-600 text-lg">{product.description}</p>

        <div className="flex items-center space-x-4">
          <span className="text-2xl font-semibold text-amber-600">
            {product.prix ? product.prix.toLocaleString('fr-FR') : '0'} FCFA
          </span>
          {product.prix_reduction && (
            <span className="text-lg text-gray-500 line-through">
              {product.prix_reduction.toLocaleString('fr-FR')} FCFA
            </span>
          )}
          {product.nouveaute && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Nouveau</span>
          )}
          {product.en_solde && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              -{product.pourcentage_reduction}%
            </span>
          )}
          {product.stock <= 5 && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
              Plus que {product.stock} !
            </span>
          )}
        </div>
        

        {/* ====== Caractéristiques techniques ====== */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 border-t pt-4">
          <div><span className="font-medium">Taille :</span> {product.taille || "N/A"}</div>
          <div><span className="font-medium">Couleur :</span> {product.couleur || "N/A"}</div>
          <div><span className="font-medium">Matière :</span> {product.materiau || "N/A"}</div>
          <div><span className="font-medium">Marque :</span> {product.marque_nom || "N/A"}</div>
          <div><span className="font-medium">Poids :</span> {product.poids || "N/A"}</div>
          <div><span className="font-medium">Catégorie :</span> {product.sous_categorie_nom || "N/A"}</div>
        </div>

        {/* ====== Quantité + Ajouter au panier ====== */}
        <div className="space-y-2">
          <label htmlFor="quantite" className="block font-medium">Quantité</label>
          <input
            type="number"
            id="quantite"
            min={1}
            max={product.stock || 1}
            value={quantite}
            onChange={(e) => setQuantite(Number(e.target.value))}
            className="w-24 border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={ajouterAuPanier}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition font-medium"
        >
          Ajouter au panier
        </button>

        {/* ====== Engagements ====== */}
        <ul className="pt-6 space-y-3 border-t text-sm text-gray-600">
          <li>🚚 Livraison rapide & sécurisée</li>
          <li>🔒 Paiement 100% sécurisé</li>
          <li>📦 Retour gratuit sous 14 jours</li>
        </ul>
      </div>
    </section>
    </Layout>
  );
}