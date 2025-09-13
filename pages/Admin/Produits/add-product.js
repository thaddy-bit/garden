import LayoutAdmin from '../../../components/Admin/Layout_admin';
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function AjouterProduit() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [marques, setMarques] = useState([]);
  const [sousCategories, setSousCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [formData, setFormData] = useState({
    // Informations de base
    nom: '',
    description: '',
    description_courte: '',
    prix: '',
    prix_reduction: '',
    pourcentage_reduction: '',
    sku: '',
    
    // Stock
    stock: '',
    stock_minimum: '',
    
    // Variantes
    poids: '',
    dimensions: '',
    couleur: '',
    taille: '',
    materiau: '',
    
    // Relations
    marque_id: '',
    sous_categorie_id: '',
    collection_id: '',
    
    // Flags
    nouveaute: false,
    en_vedette: false,
    en_solde: false,
    
    // SEO
    meta_titre: '',
    meta_description: '',
    tags: '',
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  useEffect(() => {
    const fetchMarques = async () => {
      const res = await fetch('/api/marques');
      const data = await res.json();
      setMarques(Array.isArray(data) ? data : []);
    };
    fetchMarques();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/sous_collection/getAll');
      const data = await res.json();
      setSousCategories(Array.isArray(data) ? data : []);
    })();
  }, []);

  // Charger les données du produit si on est en mode édition
  useEffect(() => {
    const { id } = router.query;
    if (id && !isEdit) {
      setIsEdit(true);
      loadProductData(id);
    }
  }, [router.query, isEdit]);

  const loadProductData = async (productId) => {
    try {
      const res = await fetch(`/api/produits/${productId}`);
      if (res.ok) {
        const data = await res.json();
        
        // Préremplir le formulaire
        setFormData({
          nom: data.nom || '',
          description: data.description || '',
          description_courte: data.description_courte || '',
          prix: data.prix || '',
          prix_reduction: data.prix_reduction || '',
          pourcentage_reduction: data.pourcentage_reduction || '',
          sku: data.sku || '',
          stock: data.stock || '',
          stock_minimum: data.stock_minimum || '',
          poids: data.poids || '',
          dimensions: data.dimensions || '',
          couleur: data.couleur || '',
          taille: data.taille || '',
          materiau: data.materiau || '',
          marque_id: data.marque_id || '',
          sous_categorie_id: data.sous_categorie_id || '',
          collection_id: data.collection_id || '',
          nouveaute: data.nouveaute === 1,
          en_vedette: data.en_vedette === 1,
          en_solde: data.en_solde === 1,
          meta_titre: data.meta_titre || '',
          meta_description: data.meta_description || '',
          tags: data.tags || '',
        });

        // Charger les images existantes
        setExistingImages(data.images || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleMainImageChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setMainImage(f || null);
    setMainImagePreview(f ? URL.createObjectURL(f) : '');
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    setGalleryImages(files);
    setGalleryPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeGalleryImage = (index) => {
    const newImages = galleryImages.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryImages(newImages);
    setGalleryPreviews(newPreviews);
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const fd = new FormData();
    
    // Informations de base
    fd.append('nom', formData.nom);
    fd.append('description', formData.description);
    fd.append('description_courte', formData.description_courte);
    fd.append('prix', String(Math.max(0, parseInt(formData.prix, 10) || 0)));
    fd.append('prix_reduction', String(Math.max(0, parseInt(formData.prix_reduction, 10) || 0)));
    fd.append('pourcentage_reduction', String(Math.max(0, parseInt(formData.pourcentage_reduction, 10) || 0)));
    fd.append('sku', formData.sku);
    
    // Stock
    fd.append('stock', String(Math.max(0, parseInt(formData.stock, 10) || 0)));
    fd.append('stock_minimum', String(Math.max(0, parseInt(formData.stock_minimum, 10) || 0)));
    
    // Variantes
    fd.append('poids', formData.poids);
    fd.append('dimensions', formData.dimensions);
    fd.append('couleur', formData.couleur);
    fd.append('taille', formData.taille);
    fd.append('materiau', formData.materiau);
    
    // Relations
    fd.append('marque_id', formData.marque_id);
    fd.append('sous_categorie_id', formData.sous_categorie_id);
    if (formData.collection_id) fd.append('collection_id', formData.collection_id);
    
    // Flags
    fd.append('nouveaute', formData.nouveaute ? '1' : '0');
    fd.append('en_vedette', formData.en_vedette ? '1' : '0');
    fd.append('en_solde', formData.en_solde ? '1' : '0');
    
    // SEO
    fd.append('meta_titre', formData.meta_titre);
    fd.append('meta_description', formData.meta_description);
    fd.append('tags', formData.tags);
    
    // Images
    if (mainImage) fd.append('main_image', mainImage);
    galleryImages.forEach((img, index) => {
      fd.append(`gallery_images`, img);
    });

    // Images existantes à supprimer
    const imagesToDelete = existingImages.filter(img => 
      !document.querySelector(`input[data-image-id="${img.id}"]`)?.checked
    ).map(img => img.id).join(',');
    if (imagesToDelete) fd.append('images_to_delete', imagesToDelete);

    const url = isEdit ? `/api/produits/${router.query.id}` : '/api/produits/add';
    const method = isEdit ? 'PUT' : 'POST';
    const response = await fetch(url, { method, body: fd });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Erreur');
    } else {
      router.replace('/Admin/Produits/list');
    }
    setIsLoading(false);
  };

  return (
    <LayoutAdmin>
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden mb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-100 py-6 px-8 text-center">
          <h1 className="text-4xl font-extrabold text-black tracking-wide">
            {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
          
          {/* Section 1: Informations de base */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-amber-400 rounded-full mr-3"></span>
              Informations de base
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom du produit *</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Prix (FCFA) *</label>
                <input type="number" name="prix" value={formData.prix} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-sm" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description courte</label>
              <textarea name="description_courte" value={formData.description_courte} onChange={handleChange} maxLength="500" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-sm" rows="2" />
              <div className="text-xs text-gray-500 mt-1">{formData.description_courte.length}/500 caractères</div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description complète *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-sm" rows="4" />
            </div>
          </div>

          {/* Section 2: Variantes */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-blue-400 rounded-full mr-3"></span>
              Variantes du produit
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Couleur</label>
                <input type="text" name="couleur" value={formData.couleur} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Taille</label>
                <input type="text" name="taille" value={formData.taille} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Matériau</label>
                <input type="text" name="materiau" value={formData.materiau} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Poids (kg)</label>
                <input type="number" step="0.01" name="poids" value={formData.poids} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Dimensions (L x l x H cm)</label>
                <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="ex: 30 x 20 x 10" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm" />
              </div>
            </div>
          </div>

          {/* Section 3: Stock */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-green-400 rounded-full mr-3"></span>
              Gestion du stock
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Stock disponible *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Stock minimum *</label>
                <input type="number" name="stock_minimum" value={formData.stock_minimum} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm" />
              </div>
            </div>
          </div>

          {/* Section 4: Promotions */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-red-400 rounded-full mr-3"></span>
              Promotions & Soldes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Prix de réduction (FCFA)</label>
                <input type="number" name="prix_reduction" value={formData.prix_reduction} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none shadow-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pourcentage de réduction (%)</label>
                <input type="number" name="pourcentage_reduction" value={formData.pourcentage_reduction} onChange={handleChange} min="0" max="100" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none shadow-sm" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center">
                <input type="checkbox" name="nouveaute" checked={formData.nouveaute} onChange={handleChange} className="mr-2" />
                <span className="text-sm font-medium text-gray-700">Nouveau produit</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="en_vedette" checked={formData.en_vedette} onChange={handleChange} className="mr-2" />
                <span className="text-sm font-medium text-gray-700">Produit vedette</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="en_solde" checked={formData.en_solde} onChange={handleChange} className="mr-2" />
                <span className="text-sm font-medium text-gray-700">En solde</span>
              </label>
            </div>
          </div>

          {/* Section 5: Relations */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-purple-400 rounded-full mr-3"></span>
              Classification
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Marque *</label>
                <select name="marque_id" value={formData.marque_id} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm">
                  <option value="">-- Sélectionnez une marque --</option>
                  {marques.map((m) => (
                    <option key={m.id} value={m.id}>{m.nom}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sous-catégorie *</label>
                <select name="sous_categorie_id" value={formData.sous_categorie_id} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm">
                  <option value="">-- Sélectionnez une sous-catégorie --</option>
                  {Array.isArray(sousCategories) && sousCategories.map((sous) => (
                    <option key={sous.id} value={sous.id}>{sous.nom}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 6: Images */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-indigo-400 rounded-full mr-3"></span>
              Images du produit
            </h2>
            
            {/* Image principale */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Image principale {!isEdit ? '*' : ''}
              </label>
              <input type="file" onChange={handleMainImageChange} required={!isEdit} accept="image/*" className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-white focus:outline-none shadow-sm" />
              
              {/* Image principale existante */}
              {isEdit && existingImages.filter(img => img.is_principal === 1).length > 0 && !mainImagePreview && (
                <div className="mt-2">
                  {existingImages.filter(img => img.is_principal === 1).map(img => (
                    <div key={img.id} className="flex items-center gap-2">
                      <Image src={img.image_url} alt="Image principale actuelle" width={200} height={200} className="rounded-lg object-cover" />
                      <span className="text-sm text-gray-600">Image principale actuelle</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Nouvelle image principale */}
              {mainImagePreview && (
                <div className="mt-2">
                  <Image src={mainImagePreview} alt="Nouvelle image principale" width={200} height={200} className="rounded-lg object-cover" />
                  <span className="text-sm text-green-600">Nouvelle image principale</span>
                </div>
              )}
            </div>

            {/* Galerie d'images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Galerie d'images</label>
              <input type="file" onChange={handleGalleryChange} multiple accept="image/*" className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-white focus:outline-none shadow-sm" />
              
              {/* Images existantes de la galerie */}
              {isEdit && existingImages.filter(img => img.is_principal === 0).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Images existantes :</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.filter(img => img.is_principal === 0).map(img => (
                      <div key={img.id} className="relative">
                        <Image src={img.image_url} alt={`Galerie existante ${img.id}`} width={150} height={150} className="rounded-lg object-cover" />
                        <label className="absolute top-2 left-2 flex items-center">
                          <input 
                            type="checkbox" 
                            data-image-id={img.id}
                            defaultChecked={true}
                            className="mr-1"
                          />
                          <span className="text-xs bg-white px-1 rounded">Garder</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Nouvelles images de galerie */}
              {galleryPreviews.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Nouvelles images :</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <Image src={preview} alt={`Nouvelle galerie ${index + 1}`} width={150} height={150} className="rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 7: SEO */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-orange-400 rounded-full mr-3"></span>
              Optimisation SEO
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Meta titre</label>
                <input type="text" name="meta_titre" value={formData.meta_titre} onChange={handleChange} maxLength="255" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm" />
                <div className="text-xs text-gray-500 mt-1">{formData.meta_titre.length}/255 caractères</div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Meta description</label>
                <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} rows="3" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (séparés par des virgules)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="ex: mode, été, casual" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl shadow-lg transition duration-200 text-lg"
            >
              {isLoading ? "Envoi en cours..." : (isEdit ? "Modifier le produit" : "Ajouter le produit")}
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}