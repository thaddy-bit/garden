import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../components/Admin/Layout_admin";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  Edit3,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

export default function Profil() {
  const [user, setUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    role: '',
    created_at: '',
    last_login_at: ''
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/admin-me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Utiliser des données par défaut si l'API n'est pas disponible
        setUser({
          nom: 'Admin',
          prenom: 'Garden',
          email: 'admin@garden.com',
          telephone: '+225 07 00 00 00 00',
          adresse: 'Abidjan, Côte d\'Ivoire',
          role: 'superadmin',
          created_at: '2024-01-01T00:00:00Z',
          last_login_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      // Utiliser des données par défaut en cas d'erreur
      setUser({
        nom: 'Admin',
        prenom: 'Garden',
        email: 'admin@garden.com',
        telephone: '+225 07 00 00 00 00',
        adresse: 'Abidjan, Côte d\'Ivoire',
        role: 'superadmin',
        created_at: '2024-01-01T00:00:00Z',
        last_login_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
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

  const validateForm = () => {
    const newErrors = {};

    if (!user.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!user.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }

    if (!user.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!user.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }

    if (!user.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone,
          adresse: user.adresse
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Profil mis à jour avec succès !' 
        });
        setEditing(false);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Erreur lors de la mise à jour du profil' 
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erreur de connexion. Veuillez réessayer.' 
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleLabel = (role) => {
    const roles = {
      'superadmin': 'Super Administrateur',
      'admin': 'Administrateur',
      'cassier': 'Caissier'
    };
    return roles[role] || role;
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-800 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">Mon Profil</h1>
              <p className="text-gray-600">Gérez vos informations personnelles</p>
            </div>
          </div>
          
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 bg-green-800 hover:bg-green-900 text-white rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            {editing ? 'Annuler' : 'Modifier'}
          </button>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations personnelles */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-black mb-6">Informations personnelles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={user.nom}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 transition-colors ${
                      errors.nom ? 'border-red-300' : 'border-gray-300'
                    } ${!editing ? 'bg-gray-50' : ''}`}
                    placeholder="Votre nom"
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>

                {/* Prénom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={user.prenom}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 transition-colors ${
                      errors.prenom ? 'border-red-300' : 'border-gray-300'
                    } ${!editing ? 'bg-gray-50' : ''}`}
                    placeholder="Votre prénom"
                  />
                  {errors.prenom && (
                    <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 transition-colors ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } ${!editing ? 'bg-gray-50' : ''}`}
                      placeholder="votre@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="telephone"
                      value={user.telephone}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 transition-colors ${
                        errors.telephone ? 'border-red-300' : 'border-gray-300'
                      } ${!editing ? 'bg-gray-50' : ''}`}
                      placeholder="+225 07 00 00 00 00"
                    />
                  </div>
                  {errors.telephone && (
                    <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
                  )}
                </div>

                {/* Adresse */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="adresse"
                      value={user.adresse}
                      onChange={handleInputChange}
                      disabled={!editing}
                      rows={3}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 transition-colors resize-none ${
                        errors.adresse ? 'border-red-300' : 'border-gray-300'
                      } ${!editing ? 'bg-gray-50' : ''}`}
                      placeholder="Votre adresse complète"
                    />
                  </div>
                  {errors.adresse && (
                    <p className="mt-1 text-sm text-red-600">{errors.adresse}</p>
                  )}
                </div>
              </div>

              {/* Bouton de sauvegarde */}
              {editing && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-green-800 hover:bg-green-900 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Sauvegarder les modifications
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Informations système */}
          <div className="space-y-6">
            {/* Rôle et statut */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Informations système</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Rôle</label>
                  <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-800 font-medium">{getRoleLabel(user.role)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Compte créé le</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{formatDate(user.created_at)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Dernière connexion</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{formatDate(user.last_login_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Actions rapides</h3>
              
              <div className="space-y-3">
                <a
                  href="/Admin/parametres/mot-de-passe"
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Modifier le mot de passe</span>
                </a>

                <button
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                      fetch('/api/auth/admin-logout', { method: 'POST' })
                        .then(() => window.location.href = '/login');
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                >
                  <EyeOff className="w-5 h-5 text-red-600" />
                  <span className="text-red-700">Se déconnecter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}


