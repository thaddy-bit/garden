import LayoutAdmin from '../../../components/Admin/Layout_admin';
import { useState } from "react";

export default function AjouterSoin() {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: ""
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    if (image) {
      formDataToSend.append("image", image);
    }

    const response = await fetch("/api/wellness", {
      method: "POST",
      body: formDataToSend,
    });

    const data = await response.json();
    alert(data.message || data.error);
  };

  return (
    <LayoutAdmin>
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
        <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="number" name="prix" placeholder="Prix" onChange={handleChange} required />
        <input type="file" onChange={handleImageChange} required />
        <button type="submit">Ajouter Produit</button>
        </form>
    </LayoutAdmin>
    
  );
}
