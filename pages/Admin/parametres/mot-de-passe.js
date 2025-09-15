import React, { useState } from "react";
import LayoutAdmin from "../../../components/Admin/Layout_admin";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Save
} from "lucide-react";

export default function ModifierMotDePasse() {
  const [formData, setFormData] = useState({
    motDePasseActuel: '',
    nouveauMotDePasse: '',
    confirmerMotDePasse: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    actuel: false,
    nouveau: false,
    confirmer: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.motDePasseActuel.trim()) {
      newErrors.motDePasseActuel = 'Le mot de passe actuel est requis';
    }

    if (!formData.nouveauMotDePasse.trim()) {
      newErrors.nouveauMotDePasse = 'Le nouveau mot de passe est requis';
    } else if (formData.nouveauMotDePasse.length < 6) {
      newErrors.nouveauMotDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.confirmerMotDePasse.trim()) {
      newErrors.confirmerMotDePasse = 'La confirmation du mot de passe est requise';
    } else if (formData.nouveauMotDePasse !== formData.confirmerMotDePasse) {
      newErrors.confirmerMotDePasse = 'Les mots de passe ne correspondent pas';
    }

    if (formData.motDePasseActuel === formData.nouveauMotDePasse) {
      newErrors.nouveauMotDePasse = 'Le nouveau mot de passe doit être différent de l\'actuel';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          motDePasseActuel: formData.motDePasseActuel,
          nouveauMotDePasse: formData.nouveauMotDePasse
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Mot de passe modifié avec succès !' 
        });
        setFormData({
          motDePasseActuel: '',
          nouveauMotDePasse: '',
          confirmerMotDePasse: ''
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Erreur lors de la modification du mot de passe' 
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erreur de connexion. Veuillez réessayer.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAdmin>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-green-800 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black">Modifier le mot de passe</h1>
            <p className="text-gray-600">Changez votre mot de passe pour sécuriser votre compte</p>
          </div>
        </div>

        {/* Message de statut */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mot de passe actuel */}
            <div>
              <label htmlFor="motDePasseActuel" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe actuel
              </label>
              <div className="relative">
                <input
                  type={showPasswords.actuel ? "text" : "password"}
                  id="motDePasseActuel"
                  name="motDePasseActuel"
                  value={formData.motDePasseActuel}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 transition-colors ${
                    errors.motDePasseActuel ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Entrez votre mot de passe actuel"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('actuel')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.actuel ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.motDePasseActuel && (
                <p className="mt-1 text-sm text-red-600">{errors.motDePasseActuel}</p>
              )}
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label htmlFor="nouveauMotDePasse" className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPasswords.nouveau ? "text" : "password"}
                  id="nouveauMotDePasse"
                  name="nouveauMotDePasse"
                  value={formData.nouveauMotDePasse}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 transition-colors ${
                    errors.nouveauMotDePasse ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Entrez votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('nouveau')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.nouveau ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.nouveauMotDePasse && (
                <p className="mt-1 text-sm text-red-600">{errors.nouveauMotDePasse}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Le mot de passe doit contenir au moins 6 caractères
              </p>
            </div>

            {/* Confirmation du mot de passe */}
            <div>
              <label htmlFor="confirmerMotDePasse" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmer ? "text" : "password"}
                  id="confirmerMotDePasse"
                  name="confirmerMotDePasse"
                  value={formData.confirmerMotDePasse}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 transition-colors ${
                    errors.confirmerMotDePasse ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirmez votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmer')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirmer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmerMotDePasse && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmerMotDePasse}</p>
              )}
            </div>

            {/* Bouton de soumission */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-green-800 hover:bg-green-900 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Modifier le mot de passe
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Conseils de sécurité */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Conseils pour un mot de passe sécurisé</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-800 rounded-full mt-2 flex-shrink-0"></div>
              Utilisez au moins 8 caractères
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-800 rounded-full mt-2 flex-shrink-0"></div>
              Mélangez lettres majuscules et minuscules
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-800 rounded-full mt-2 flex-shrink-0"></div>
              Incluez des chiffres et des symboles
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-800 rounded-full mt-2 flex-shrink-0"></div>
              Évitez les informations personnelles
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-800 rounded-full mt-2 flex-shrink-0"></div>
              Changez régulièrement votre mot de passe
            </li>
          </ul>
        </div>
      </div>
    </LayoutAdmin>
  );
}



