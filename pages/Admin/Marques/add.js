import LayoutAdmin from '../../../components/Admin/Layout_admin';
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function AjouterMarque() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    zone:"",
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const isEdit = typeof router.query.id !== 'undefined' && router.query.id !== null;


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setImage(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.nom.trim()) {
      setError('Le nom est requis');
      return;
    }
    // En création, image requise. En édition, facultative.
    if (!isEdit && !image) {
      setError("L'image est requise");
      return;
    }

    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (image) formDataToSend.append("image", image);

      const url = isEdit ? `/api/marques/${router.query.id}` : "/api/marques/add";
      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch(url, { method, body: formDataToSend });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Erreur lors de la création');
        setIsLoading(false);
        return;
      }
      // Redirection vers la liste
      router.replace('/Admin/Marques/getAll');
    } catch (_e) {
      setError('Erreur réseau');
      setIsLoading(false);
    }
  };

  // Charger données en édition
  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!isEdit) return;
      try {
        setIsLoading(true);
        const res = await fetch(`/api/marques/${router.query.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!alive) return;
        setFormData({
          nom: data.nom || '',
          description: data.description || '',
          zone: data.zone || '',
        });
        if (data.image_url) setImagePreview(data.image_url);
      } finally {
        if (alive) setIsLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [isEdit, router.query.id]);

  return (
    <LayoutAdmin>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gray-50 py-4 px-6 md:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{isEdit ? 'Modifier la marque' : 'Ajouter une marque'}</h1>
              <p className="mt-1 text-sm text-gray-500">Renseignez les informations de la marque</p>
            </div>
        </div>
        <form onSubmit={handleSubmit} className="p-4 md:p-6 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
        <div className="col-span-1">
          <label htmlFor="brand-name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            id="brand-name"
            name="nom"
            type="text"
            required
            value={formData.nom}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 text-sm"
            placeholder="Nom de la marque"
          />
        </div>

        <div className="col-span-1">
          <label htmlFor="brand-zone" className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
          <select
            id="brand-zone"
            name="zone"
            value={formData.zone}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 text-sm"
          >
            <option value="">Choisir une zone</option>
            <option value="International">International</option>
            <option value="Afrique">Afrique</option>
            <option value="Europe">Europe</option>
            <option value="Amériques">Amériques</option>
            <option value="Asie">Asie</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="brand-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="brand-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 text-sm"
            placeholder="Décrivez la marque (facultatif)"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="brand-image" className="block text-sm font-medium text-gray-700 mb-1">Logo / Image</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2">
              <input
                id="brand-image"
                type="file"
                accept="image/*"
                required={!isEdit}
                onChange={handleImageChange}
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 text-sm"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
            <div className="h-28 rounded-lg border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Prévisualisation" className="h-full object-contain" />
              ) : (
                <span className="text-xs text-gray-400">Prévisualisation</span>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex justify-center items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-black hover:bg-gray-900 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Enregistrement...' : 'Ajouter la marque'}
          </button>
        </div>
        </form>
        </div>
        
    </LayoutAdmin>
    
  );
}
