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
  Building,
  Users,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Settings,
  MoreVertical,
  Edit3,
  Save,
  X,
  Plus,
  Minus,
  ArrowUpDown,
  BarChart3,
  Activity,
  Zap,
  Star,
  Crown,
  Sparkles
} from 'lucide-react';
import LayoutAdmin from '../../components/Admin/Layout_admin';
import Notification from '../../components/Notification';
import { StatsGrid, DetailedStats } from '../../components/Admin/StatsCards';
import StatusWorkflowVisualizer from '../../components/Admin/StatusWorkflowVisualizer';
import Image from 'next/image';

export default function AdminCommandesPage() {
  const [commandes, setCommandes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [commandeExpanded, setCommandeExpanded] = useState(null);
  const [editingCommande, setEditingCommande] = useState(null);
  
  // Filtres et recherche
  const [filtres, setFiltres] = useState({
    statut: '',
    search: '',
    date_debut: '',
    date_fin: '',
    tri: 'date_commande',
    ordre: 'DESC'
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // États pour les modales et interactions
  const [showStatutModal, setShowStatutModal] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [nouveauStatut, setNouveauStatut] = useState('');
  const [notesInternes, setNotesInternes] = useState('');
  const [numeroSuivi, setNumeroSuivi] = useState('');
  const [transporteur, setTransporteur] = useState('');
  const [statutsDisponibles, setStatutsDisponibles] = useState([]);
  const [loadingStatuts, setLoadingStatuts] = useState(false);
  
  // Notifications
  const [notification, setNotification] = useState(null);

  // Charger les commandes
  const fetchCommandes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filtres
      });

      const response = await axios.get(`/api/admin/commandes?${params}`);
      
      setCommandes(response.data.commandes);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, [pagination.page, filtres]);

  // Mettre à jour le statut d'une commande
  const updateStatutCommande = async () => {
    if (!selectedCommande || !nouveauStatut) return;

    try {
      setUpdating(selectedCommande.id);
      
      const response = await axios.put(`/api/admin/commandes/${selectedCommande.id}/statut`, {
        statut: nouveauStatut,
        notes_internes: notesInternes,
        numero_suivi: numeroSuivi,
        transporteur: transporteur
      });

      // Rafraîchir les données
      await fetchCommandes();
      
      // Afficher notification de succès avec numéro de suivi si généré
      let message = `Le statut de la commande ${selectedCommande.numero_commande} a été mis à jour avec succès.`;
      if (response.data.numero_suivi_generé) {
        message += ` Numéro de suivi généré: ${response.data.numero_suivi_generé}`;
      }
      
      setNotification({
        type: 'success',
        title: 'Statut mis à jour',
        message: message
      });
      
      // Fermer la modale
      setShowStatutModal(false);
      setSelectedCommande(null);
      setNouveauStatut('');
      setNotesInternes('');
      setNumeroSuivi('');
      setTransporteur('');
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      
      // Afficher notification d'erreur
      setNotification({
        type: 'error',
        title: 'Erreur de mise à jour',
        message: 'Une erreur est survenue lors de la mise à jour du statut. Veuillez réessayer.'
      });
    } finally {
      setUpdating(null);
    }
  };

  // Charger les statuts disponibles pour une commande
  const fetchStatutsDisponibles = async (commandeId) => {
    try {
      setLoadingStatuts(true);
      const response = await axios.get(`/api/admin/commandes/${commandeId}/statuts-disponibles`);
      setStatutsDisponibles(response.data.statuts_disponibles);
    } catch (error) {
      console.error("Erreur lors de la récupération des statuts disponibles:", error);
      setStatutsDisponibles([]);
    } finally {
      setLoadingStatuts(false);
    }
  };

  // Ouvrir la modale de changement de statut
  const openStatutModal = async (commande) => {
    setSelectedCommande(commande);
    setNouveauStatut(commande.statut);
    setNotesInternes(commande.notes_internes || '');
    setNumeroSuivi(commande.numero_suivi || '');
    setTransporteur(commande.transporteur || '');
    setShowStatutModal(true);
    
    // Charger les statuts disponibles pour cette commande
    await fetchStatutsDisponibles(commande.id);
  };

  // Styles et icônes pour les statuts
  const getStatutConfig = (statut) => {
    const configs = {
      'en_attente': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        label: 'En attente',
        gradient: 'from-yellow-400 to-orange-500'
      },
      'confirmee': {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle,
        label: 'Confirmée',
        gradient: 'from-blue-400 to-indigo-500'
      },
      'en_preparation': {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: Package,
        label: 'En préparation',
        gradient: 'from-orange-400 to-red-500'
      },
      'prete': {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: Truck,
        label: 'Prête',
        gradient: 'from-purple-400 to-pink-500'
      },
      'en_livraison': {
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: Truck,
        label: 'En livraison',
        gradient: 'from-indigo-400 to-blue-500'
      },
      'livree': {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        label: 'Livrée',
        gradient: 'from-green-400 to-emerald-500'
      },
      'annulee': {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        label: 'Annulée',
        gradient: 'from-red-400 to-pink-500'
      },
      'retournee': {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: AlertCircle,
        label: 'Retournée',
        gradient: 'from-gray-400 to-slate-500'
      },
      'refusee': {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        label: 'Refusée',
        gradient: 'from-red-400 to-rose-500'
      }
    };
    return configs[statut] || configs['en_attente'];
  };

  // Changer de page
  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Appliquer les filtres
  const applyFilters = (newFilters) => {
    setFiltres(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header Ultra-Premium */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full mb-8 shadow-2xl">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-6">
                Gestion des Commandes
                <span className="block text-3xl font-light text-white/80 mt-2">
                  Interface Ultra-Premium
                </span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                Gérez toutes vos commandes avec style et efficacité. Interface premium pour une expérience d'administration exceptionnelle.
              </p>
              
              {/* Stats rapides */}
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4 mx-auto">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.total_commandes || 0}</div>
                    <div className="text-sm text-white/80">Total Commandes</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4 mx-auto">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {Math.round(stats.chiffre_affaires_total || 0).toLocaleString('fr-FR')}
                    </div>
                    <div className="text-sm text-white/80">FCFA Chiffre d'Affaires</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4 mx-auto">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {Math.round(stats.panier_moyen || 0).toLocaleString('fr-FR')}
                    </div>
                    <div className="text-sm text-white/80">Panier Moyen</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4 mx-auto">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.en_attente || 0}</div>
                    <div className="text-sm text-white/80">En Attente</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Filtres Ultra-Premium */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Filter className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Filtres Avancés</h2>
                <p className="text-gray-600">Affinez votre recherche avec précision</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Recherche */}
              <div className="lg:col-span-2">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-green-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Rechercher par numéro, client, email..."
                    value={filtres.search}
                    onChange={(e) => applyFilters({ search: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                  />
                </div>
              </div>
              
              {/* Statut */}
              <div>
                <div className="relative group">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-green-600 transition-colors" />
                  <select
                    value={filtres.statut}
                    onChange={(e) => applyFilters({ statut: e.target.value })}
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
              
              {/* Tri */}
              <div>
                <div className="relative group">
                  <ArrowUpDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-green-600 transition-colors" />
                  <select
                    value={`${filtres.tri}-${filtres.ordre}`}
                    onChange={(e) => {
                      const [tri, ordre] = e.target.value.split('-');
                      applyFilters({ tri, ordre });
                    }}
                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 appearance-none bg-gray-50/50 hover:bg-white"
                  >
                    <option value="date_commande-DESC">Plus récentes</option>
                    <option value="date_commande-ASC">Plus anciennes</option>
                    <option value="montant_total-DESC">Montant décroissant</option>
                    <option value="montant_total-ASC">Montant croissant</option>
                    <option value="numero_commande-ASC">Numéro A-Z</option>
                    <option value="numero_commande-DESC">Numéro Z-A</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-hover:text-green-600 transition-colors" />
                </div>
              </div>
            </div>
            
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début</label>
                <input
                  type="date"
                  value={filtres.date_debut}
                  onChange={(e) => applyFilters({ date_debut: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin</label>
                <input
                  type="date"
                  value={filtres.date_fin}
                  onChange={(e) => applyFilters({ date_fin: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Statistiques détaillées */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Statistiques Détaillées</h2>
                <p className="text-gray-600">Répartition des commandes par statut</p>
              </div>
            </div>
            
            <DetailedStats stats={stats} isLoading={loading} />
          </div>

          {/* Contenu principal */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Loader2 className="animate-spin w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 bg-green-600/20 rounded-full mx-auto animate-ping"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Chargement des commandes</h3>
                <p className="text-gray-600">Récupération des données en cours...</p>
              </div>
            </div>
          ) : commandes.length === 0 ? (
            <div className="text-center py-24">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-gray-100/50 rounded-full mx-auto animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune commande trouvée</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Aucune commande ne correspond à vos critères de recherche.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {commandes.map((commande) => {
                const statutConfig = getStatutConfig(commande.statut);
                const StatutIcon = statutConfig.icon;
                
                return (
                  <div
                    key={commande.id}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden hover:shadow-3xl transition-all duration-500 group"
                  >
                    {/* Header de la commande */}
                    <div className="p-8 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-white/50">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-6 mb-6">
                            <div className="relative">
                              <div className={`w-16 h-16 bg-gradient-to-r ${statutConfig.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                                <StatutIcon className="w-8 h-8 text-white" />
                              </div>
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full border-2 border-white flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-white" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {commande.numero_commande}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  {commande.client_prenom} {commande.client_nom}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {commande.client_email}
                                </div>
                              </div>
                            </div>
                            <Badge className={`${statutConfig.color} flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-lg`}>
                              <StatutIcon className="w-5 h-5" />
                              {statutConfig.label}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-semibold text-gray-900">
                                  {new Date(commande.date_commande).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Montant</p>
                                <p className="font-semibold text-gray-900">
                                  {Math.round(commande.montant_total).toLocaleString('fr-FR')} FCFA
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Articles</p>
                                <p className="font-semibold text-gray-900">
                                  {commande.nombre_produits} produit{commande.nombre_produits > 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Paiement</p>
                                <p className="font-semibold text-gray-900">
                                  {commande.mode_paiement_nom || 'Non spécifié'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => openStatutModal(commande)}
                            className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Settings className="w-5 h-5" />
                            Modifier le statut
                          </Button>
                          
                          <Button
                            onClick={() => setCommandeExpanded(commande.id === commandeExpanded ? null : commande.id)}
                            className="flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Eye className="w-5 h-5" />
                            {commandeExpanded === commande.id ? 'Masquer' : 'Voir détails'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Détails de la commande (expandable) */}
                    {commandeExpanded === commande.id && (
                      <div className="p-8 bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                          {/* Produits */}
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-white" />
                              </div>
                              Articles commandés
                            </h4>
                            <div className="space-y-4">
                              {commande.produits.map((produit) => (
                                <div key={produit.id} className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg">
                                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    {produit.image_url ? (
                                      <Image
                                        src={produit.image_url}
                                        alt={produit.nom}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Package className="w-8 h-8" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-lg font-semibold text-gray-900 truncate">{produit.nom}</h5>
                                    <p className="text-sm text-gray-600">{produit.marque_nom}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">
                                      {Math.round(produit.prix).toLocaleString('fr-FR')} FCFA
                                    </p>
                                    <p className="text-sm text-gray-600">x {produit.quantite}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Informations client et livraison */}
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Informations client
                              </h4>
                              <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                  <Users className="w-5 h-5 text-gray-400" />
                                  <div>
                                    <p className="font-medium text-gray-900">{commande.client_prenom} {commande.client_nom}</p>
                                    <p className="text-sm text-gray-600">{commande.client_email}</p>
                                  </div>
                                </div>
                                {commande.client_telephone && (
                                  <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <p className="text-sm text-gray-600">{commande.client_telephone}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Livraison
                              </h4>
                              <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <p className="text-sm text-gray-600 mb-2">{commande.adresse_livraison}</p>
                                {commande.ville_livraison && (
                                  <p className="text-sm text-gray-600">
                                    {commande.ville_livraison}
                                    {commande.code_postal_livraison && `, ${commande.code_postal_livraison}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-6 py-3 rounded-xl font-semibold"
              >
                Précédent
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      onClick={() => changePage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        page === pagination.page 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-6 py-3 rounded-xl font-semibold"
              >
                Suivant
              </Button>
            </div>
          )}
        </div>

        {/* Modale de changement de statut */}
        {showStatutModal && selectedCommande && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Modifier le statut</h2>
                    <p className="text-gray-600">Commande {selectedCommande.numero_commande}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Visualiseur de workflow */}
                  <StatusWorkflowVisualizer 
                    currentStatus={selectedCommande?.statut} 
                    availableStatuses={statutsDisponibles} 
                  />

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Nouveau statut</label>
                    {loadingStatuts ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 flex items-center gap-3">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        <span className="text-gray-500">Chargement des statuts disponibles...</span>
                      </div>
                    ) : (
                      <select
                        value={nouveauStatut}
                        onChange={(e) => setNouveauStatut(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                      >
                        <option value={selectedCommande?.statut}>
                          {selectedCommande?.statut ? `Actuel: ${getStatutConfig(selectedCommande.statut).label}` : 'Sélectionner...'}
                        </option>
                        {statutsDisponibles.map((statut) => (
                          <option key={statut.value} value={statut.value}>
                            {statut.label} - {statut.description}
                          </option>
                        ))}
                      </select>
                    )}
                    {statutsDisponibles.length === 0 && !loadingStatuts && (
                      <p className="text-sm text-gray-500 mt-2">
                        Aucun changement de statut possible pour cette commande.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Numéro de suivi</label>
                    <input
                      type="text"
                      value={numeroSuivi}
                      onChange={(e) => setNumeroSuivi(e.target.value)}
                      placeholder="Ex: TRK123456789"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Transporteur</label>
                    <input
                      type="text"
                      value={transporteur}
                      onChange={(e) => setTransporteur(e.target.value)}
                      placeholder="Ex: DHL, FedEx, Colissimo..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Notes internes</label>
                    <textarea
                      value={notesInternes}
                      onChange={(e) => setNotesInternes(e.target.value)}
                      placeholder="Notes pour l'équipe..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <Button
                    onClick={updateStatutCommande}
                    disabled={updating === selectedCommande.id}
                    className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {updating === selectedCommande.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {updating === selectedCommande.id ? 'Mise à jour...' : 'Sauvegarder'}
                  </Button>
                  
                  <Button
                    onClick={() => setShowStatutModal(false)}
                    className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </LayoutAdmin>
  );
}
