// pages/Admin/SousCollections/add.js
import LayoutAdmin from '../../../components/Admin/Layout_admin';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

export default function AjouterSousCollection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const isEdit = typeof router.query.id !== 'undefined' && router.query.id !== null;

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    categorie_id: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append('nom', formData.nom);
      fd.append('description', formData.description);
      if (!isEdit) {
        if (!image) {
          alert("L'image est requise");
          setIsLoading(false);
          return;
        }
      }
      if (image) fd.append('image', image);

      const url = isEdit ? `/api/sous_collection/${router.query.id}` : '/api/sous_collection/add';
      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch(url, { method, body: fd });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Erreur');
      } else {
        router.replace('/Admin/Sous_collections/list');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      const res = await fetch(`/api/sous_collection/${router.query.id}`);
      if (!res.ok) return;
      const data = await res.json();
      const s = Array.isArray(data) ? data[0] : data;
      setFormData({ nom: s.nom || '', description: s.description || '', categorie_id: '' });
      if (s.image_url) setImagePreview(s.image_url);
    };
    load();
  }, [isEdit, router.query.id]);

  const onImageChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setImage(f || null);
    setImagePreview(f ? URL.createObjectURL(f) : '');
  };

  return (
    <LayoutAdmin>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gray-50 py-4 px-6 md:px-8">
          <h1 className="text-xl font-semibold text-gray-900">{isEdit ? 'Modifier une sous catégorie' : 'Ajouter une sous catégorie'}</h1>
          <p className="mt-1 text-sm text-gray-500">Renseignez les informations</p>
        </div>
        <form onSubmit={handleSubmit} className="p-4 md:p-6 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              name="nom"
              type="text"
              required
              value={formData.nom}
              onChange={handleChange}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-900 focus:border-green-900 sm:text-sm"
              placeholder="Nom de la sous-collection"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-900 focus:border-green-900 sm:text-sm"
              placeholder="Description"
            />
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-2">
                <input type="file" accept="image/*" onChange={onImageChange} required={!isEdit} className="block w-full px-3 py-2 border border-gray-200 rounded-lg" />
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

          <div className="md:col-span-2">
            <button type="submit" disabled={isLoading} className={`inline-flex items-center px-4 py-2.5 rounded-lg text-sm text-white bg-black hover:bg-gray-900 ${isLoading ? 'opacity-75 cursor-not-allowed':''}`}>
              {isEdit ? (isLoading ? 'Enregistrement...' : 'Enregistrer') : (isLoading ? 'Ajout...' : 'Ajouter')}
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}