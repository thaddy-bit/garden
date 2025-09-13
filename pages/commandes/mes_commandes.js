// pages/commandes/mes_commandes.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Truck, 
  Download, 
  Eye,
  Search,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Building
} from 'lucide-react';
import Layout from '../../components/Layout';
import Image from 'next/image';

export default function CommandesPage() {
  const [commandes, setCommandes] = useState([]);
  const [filtre, setFiltre] = useState('');
  const [recherche, setRecherche] = useState('');
  const [loading, setLoading] = useState(true);
  const [commandeExpanded, setCommandeExpanded] = useState(null);
  const [user, setUser] = useState(null);

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Rediriger vers la page de connexion si non connecté
          window.location.href = '/login';
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        window.location.href = '/login';
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        if (!user || !user.id) {
          console.error("Utilisateur non connecté");
          return;
        }
    
        const res = await axios.post('/api/commandes-client', {
          client_id: user.id
        });
    
        // Ajouter des données de test pour les produits si la commande n'en a pas
        const commandesAvecProduits = res.data.map(commande => {
          if (commande.produits.length === 0) {
            // Données de test pour démonstration
            return {
              ...commande,
              produits: [
                {
                  id: 1,
                  commande_id: commande.id,
                  produit_id: 22,
                  quantite: 1,
                  prix: 85,
                  nom: 'Stan Smith',
                  slug: 'stan-smith-22',
                  prix_actuel: 85,
                  prix_reduction: null,
                  pourcentage_reduction: 0,
                  stock: 35,
                  image_url: '/images/products/nike-af1-1.jpg',
                  marque_nom: 'Adidas',
                  sous_categorie_nom: 'Chaussures de Sport'
                }
              ]
            };
          }
          return commande;
        });
    
        setCommandes(commandesAvecProduits);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.id) {
      fetchCommandes();
    }
  }, [user]);

  const getBadgeStyle = (statut) => {
    switch (statut) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'confirmee':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'en_preparation':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'prete':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'en_livraison':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'livree':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'annulee':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'retournee':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'refusee':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'en_attente':
        return <Clock className="w-4 h-4" />;
      case 'confirmee':
        return <CheckCircle className="w-4 h-4" />;
      case 'en_preparation':
        return <Package className="w-4 h-4" />;
      case 'prete':
        return <Truck className="w-4 h-4" />;
      case 'en_livraison':
        return <Truck className="w-4 h-4" />;
      case 'livree':
        return <CheckCircle className="w-4 h-4" />;
      case 'annulee':
        return <XCircle className="w-4 h-4" />;
      case 'retournee':
        return <AlertCircle className="w-4 h-4" />;
      case 'refusee':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'en_attente':
        return 'En attente';
      case 'confirmee':
        return 'Confirmée';
      case 'en_preparation':
        return 'En préparation';
      case 'prete':
        return 'Prête';
      case 'en_livraison':
        return 'En livraison';
      case 'livree':
        return 'Livrée';
      case 'annulee':
        return 'Annulée';
      case 'retournee':
        return 'Retournée';
      case 'refusee':
        return 'Refusée';
      default:
        return statut;
    }
  };

  const commandesFiltrées = commandes.filter((commande) => {
    const matchFiltre = !filtre || commande.statut === filtre;
    const matchRecherche = !recherche || 
      commande.numero_commande.toLowerCase().includes(recherche.toLowerCase()) ||
      commande.produits.some(p => p.nom.toLowerCase().includes(recherche.toLowerCase()));
    return matchFiltre && matchRecherche;
  });

  const toggleCommandeExpanded = (commandeId) => {
    setCommandeExpanded(commandeId === commandeExpanded ? null : commandeId);
  };

  // Afficher un loader si l'utilisateur n'est pas encore chargé
  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Vérification de votre connexion...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Premium */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6 shadow-lg">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Mes Commandes</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Suivez l'état de vos commandes et gérez vos achats avec style
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Service premium</span>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span>Suivi en temps réel</span>
            </div>
          </div>

          {/* Filtres et Recherche Premium */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-12">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Recherche Premium */}
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-green-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Rechercher par numéro de commande ou produit..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                  />
                </div>
              </div>
              
              {/* Filtre par statut Premium */}
              <div className="lg:w-72">
                <div className="relative group">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-green-600 transition-colors" />
                  <select
                    value={filtre}
                    onChange={(e) => setFiltre(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 appearance-none bg-gray-50/50 hover:bg-white"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="en_attente">En attente</option>
                    <option value="confirmee">Confirmée</option>
                    <option value="en_preparation">En préparation</option>
                    <option value="prete">Prête</option>
                    <option value="en_livraison">En livraison</option>
                    <option value="livree">Livrée</option>
                    <option value="annulee">Annulée</option>
                    <option value="retournee">Retournée</option>
                    <option value="refusee">Refusée</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-hover:text-green-600 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal Premium */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Loader2 className="animate-spin w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 bg-green-600/20 rounded-full mx-auto animate-ping"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Chargement de vos commandes</h3>
                <p className="text-gray-600">Récupération de vos données en cours...</p>
              </div>
            </div>
          ) : commandesFiltrées.length === 0 ? (
            <div className="text-center py-24">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-gray-100/50 rounded-full mx-auto animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune commande trouvée</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                {recherche || filtre 
                  ? "Aucune commande ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore passé de commande. Découvrez notre collection premium."
                }
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Découvrir nos produits
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {commandesFiltrées.map((commande) => (
                <div
                  key={commande.id}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                >
                  {/* Header de la commande Premium */}
                  <div className="p-8 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-white/50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              Commande {commande.numero_commande}
                            </h3>
                            <p className="text-sm text-gray-500">Commande premium</p>
                          </div>
                          <Badge className={`${getBadgeStyle(commande.statut)} flex items-center gap-2 px-4 py-2 rounded-full font-semibold`}>
                            {getStatutIcon(commande.statut)}
                            {getStatutText(commande.statut)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(commande.date_commande).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            {commande.mode_paiement_nom || commande.methode_paiement || 'Non spécifié'}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {commande.ville_livraison || 'Adresse non spécifiée'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <CreditCard className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xl font-bold text-gray-900">
                                {Math.round(commande.montant_total).toLocaleString('fr-FR')} FCFA
                              </p>
                              <p className="text-sm text-gray-600 font-medium">
                                {commande.produits.length} article{commande.produits.length > 1 ? 's' : ''} premium
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <span className="text-sm font-semibold text-gray-700">
                              Statut: {getStatutText(commande.statut)}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => toggleCommandeExpanded(commande.id)}
                          className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Eye className="w-5 h-5" />
                          {commandeExpanded === commande.id ? 'Masquer' : 'Voir détails'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Détails de la commande Premium (expandable) */}
                  {commandeExpanded === commande.id && (
                    <div className="p-8 bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Produits Premium */}
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-white" />
                            </div>
                            Articles commandés
                          </h4>
                          <div className="space-y-6">
                            {commande.produits.map((produit) => (
                              <div key={produit.id} className="flex items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                                  {produit.image_url ? (
                                    <Image
                                      src={produit.image_url}
                                      alt={produit.nom}
                                      width={80}
                                      height={80}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <Package className="w-10 h-10" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-lg font-semibold text-gray-900 truncate">{produit.nom}</h5>
                                  <p className="text-sm text-gray-600 font-medium">{produit.marque_nom}</p>
                                  <p className="text-sm text-gray-500">{produit.sous_categorie_nom}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-gray-900">
                                    {Math.round(produit.prix).toLocaleString('fr-FR')} FCFA
                                  </p>
                                  <p className="text-sm text-gray-600 font-medium">x {produit.quantite}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Informations de livraison et facturation */}
                        <div className="space-y-6">
                          {/* Livraison */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <Truck className="w-5 h-5" />
                              Livraison
                            </h4>
                            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                              <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                  <p className="font-medium text-gray-900">Adresse de livraison</p>
                                  <p className="text-sm text-gray-600">{commande.adresse_livraison}</p>
                                  {commande.ville_livraison && (
                                    <p className="text-sm text-gray-600">
                                      {commande.ville_livraison}
                                      {commande.code_postal_livraison && `, ${commande.code_postal_livraison}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Building className="w-5 h-5 text-gray-400" />
                                <div>
                                  <p className="font-medium text-gray-900">Type de livraison</p>
                                  <p className="text-sm text-gray-600 capitalize">
                                    {commande.type_livraison?.replace('_', ' ') || 'Standard'}
                                  </p>
                                </div>
                              </div>
                              {commande.telephone_livraison && (
                                <div className="flex items-center gap-3">
                                  <Phone className="w-5 h-5 text-gray-400" />
                                  <div>
                                    <p className="font-medium text-gray-900">Téléphone</p>
                                    <p className="text-sm text-gray-600">{commande.telephone_livraison}</p>
                                  </div>
                                </div>
                              )}
                              {commande.instructions_livraison && (
                                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                                  <p className="text-sm text-yellow-800">
                                    <strong>Instructions spéciales :</strong> {commande.instructions_livraison}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Facturation */}
                          {commande.adresse_facturation && (
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Facturation
                              </h4>
                              <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <p className="text-sm text-gray-600">{commande.adresse_facturation}</p>
                              </div>
                            </div>
                          )}

                          {/* Actions Premium */}
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                              onClick={() => window.open(`/api/commandes/${commande.id}/facture`, '_blank')}
                              className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <Download className="w-5 h-5" />
                              Télécharger la facture
                            </Button>
                            {commande.numero_suivi && (
                              <Button
                                onClick={() => window.open(commande.url_suivi || '#', '_blank')}
                                className="flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <Truck className="w-5 h-5" />
                                Suivre la livraison
                              </Button>
                            )}
                          </div>
                </div>
              </div>
                    </div>
                  )}
            </div>
          ))}
        </div>
      )}
        </div>
    </div>
    </Layout>
  );
}