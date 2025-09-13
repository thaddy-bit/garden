import { useState, useEffect, useRef } from 'react';
import LayoutAdmin from '../../components/Admin/Layout_admin';
import { 
  Search, 
  Plus, 
  Minus, 
  ShoppingCart, 
  User, 
  CreditCard, 
  Receipt,
  Package,
  Trash2,
  Calculator,
  CheckCircle,
  AlertCircle,
  Printer
} from 'lucide-react';
import Image from 'next/image';
import JsBarcode from 'jsbarcode';

export default function VenteBoutique() {
  // États pour la recherche de produits
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // États pour le panier
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // États pour le client
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [clientSearchResults, setClientSearchResults] = useState([]);
  const [isClientSearching, setIsClientSearching] = useState(false);

  // États pour le paiement
  const [paymentMethod, setPaymentMethod] = useState('especes');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [amountReceived, setAmountReceived] = useState(0);
  const [change, setChange] = useState(0);

  // États pour la vente
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [saleData, setSaleData] = useState(null);
  const [user, setUser] = useState({ nom: 'Admin' });
  const barcodeRef = useRef(null);

  // Charger les modes de paiement
  const loadPaymentMethods = async () => {
    try {
      const response = await fetch('/api/modes-paiement');
      const data = await response.json();
      if (data.success) {
        setPaymentMethods(data.data);
        // Définir le premier mode comme défaut
        if (data.data.length > 0) {
          setPaymentMethod(data.data[0].code_paiement.toLowerCase());
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des modes de paiement:', error);
      // Fallback avec les modes de base
      setPaymentMethods([
        { id: 1, code_paiement: 'ESPECES', nom: 'Espèces', description: 'Paiement en espèces' },
        { id: 2, code_paiement: 'ORANGE_MONEY', nom: 'Orange Money', description: 'Paiement via Orange Money' },
        { id: 5, code_paiement: 'CARTE_BANCAIRE', nom: 'Carte bancaire', description: 'Paiement par carte bancaire' },
        { id: 6, code_paiement: 'VIREMENT', nom: 'Virement', description: 'Virement bancaire' }
      ]);
    }
  };

  // Charger les informations de l'utilisateur
  const loadUser = async () => {
    try {
      const response = await fetch('/api/auth/admin-me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      // Garder la valeur par défaut
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadPaymentMethods();
    loadUser();
  }, []);

  // Générer le code-barres quand le reçu s'affiche
  useEffect(() => {
    if (showReceipt && saleData) {
      setTimeout(() => {
        generateBarcode(saleData.numero_commande);
      }, 100);
    }
  }, [showReceipt, saleData]);

  // Recherche de produits
  const searchProducts = async (term) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/produits/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      setSearchResults(data.produits || []);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Recherche de clients
  const searchClients = async (term) => {
    if (term.length < 2) {
      setClientSearchResults([]);
      return;
    }

    setIsClientSearching(true);
    try {
      const response = await fetch(`/api/clients/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      setClientSearchResults(data.clients || []);
    } catch (error) {
      console.error('Erreur lors de la recherche de clients:', error);
      setClientSearchResults([]);
    } finally {
      setIsClientSearching(false);
    }
  };

  // Ajouter un produit au panier
  const addToCart = (produit) => {
    const existingItem = cart.find(item => item.id === produit.id);
    
    if (existingItem) {
      // Vérifier le stock disponible
      if (existingItem.quantite >= produit.stock_disponible) {
        alert('Stock insuffisant');
        return;
      }
      setCart(cart.map(item => 
        item.id === produit.id 
          ? { ...item, quantite: item.quantite + 1 }
          : item
      ));
    } else {
      if (produit.stock_disponible <= 0) {
        alert('Produit en rupture de stock');
        return;
      }
      setCart([...cart, { ...produit, quantite: 1 }]);
    }
    
    setSearchTerm('');
    setSearchResults([]);
  };

  // Modifier la quantité d'un produit dans le panier
  const updateCartQuantity = (produitId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(produitId);
      return;
    }

    const produit = cart.find(item => item.id === produitId);
    if (newQuantity > produit.stock_disponible) {
      alert('Stock insuffisant');
      return;
    }

    setCart(cart.map(item => 
      item.id === produitId 
        ? { ...item, quantite: newQuantity }
        : item
    ));
  };

  // Supprimer un produit du panier
  const removeFromCart = (produitId) => {
    setCart(cart.filter(item => item.id !== produitId));
  };

  // Calculer le total du panier
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    setCartTotal(total);
  }, [cart]);

  // Calculer la monnaie à rendre
  useEffect(() => {
    const changeAmount = amountReceived - cartTotal;
    setChange(changeAmount >= 0 ? changeAmount : 0);
  }, [amountReceived, cartTotal]);

  // Effectuer la vente
  const processSale = async () => {
    if (cart.length === 0) {
      alert('Le panier est vide');
      return;
    }

    setIsProcessing(true);
    try {
      const saleData = {
        client_id: selectedClient?.id || null,
        produits: cart.map(item => ({
          produit_id: item.id,
          quantite: item.quantite,
          prix_unitaire: item.prix
        })),
        montant_total: cartTotal,
        mode_paiement: paymentMethod,
        montant_recu: amountReceived,
        monnaie_rendue: change
      };

      const response = await fetch('/api/ventes/boutique', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData),
      });

      if (response.ok) {
        const result = await response.json();
        // Ajouter les produits du panier aux données de vente
        setSaleData({
          ...result,
          produits: cart.map(item => ({
            nom: item.nom,
            quantite: item.quantite,
            prix_unitaire: item.prix
          }))
        });
        setShowReceipt(true);
        
        // Vider le panier et réinitialiser
        setCart([]);
        setSelectedClient(null);
        setAmountReceived(0);
        setChange(0);
      } else {
        throw new Error('Erreur lors de la vente');
      }
    } catch (error) {
      console.error('Erreur lors de la vente:', error);
      alert('Erreur lors de la vente. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Générer le code-barres
  const generateBarcode = (data) => {
    if (barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, data, {
          format: "CODE128",
          width: 2,
          height: 50,
          displayValue: true,
          fontSize: 12,
          margin: 10
        });
      } catch (error) {
        console.error('Erreur génération code-barres:', error);
      }
    }
  };

  // Nouvelle vente
  const newSale = () => {
    setShowReceipt(false);
    setSaleData(null);
    setCart([]);
    setSelectedClient(null);
    setAmountReceived(0);
    setChange(0);
  };

  return (
    <LayoutAdmin>
      {/* Styles pour l'impression */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-print, .receipt-print * {
            visibility: visible;
          }
          .receipt-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm !important;
            margin: 0 !important;
            padding: 10px !important;
            font-size: 12px !important;
            line-height: 1.2 !important;
          }
          .receipt-print canvas {
            max-width: 100% !important;
            height: auto !important;
          }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vente en Boutique</h1>
            <p className="text-gray-600">Interface de vente rapide pour le personnel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Zone de recherche et sélection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recherche de produits */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Recherche de Produits
              </h2>
              
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un produit par nom, code ou marque..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    searchProducts(e.target.value);
                  }}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  </div>
                )}
              </div>

              {/* Résultats de recherche */}
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((produit) => (
                    <div
                      key={produit.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => addToCart(produit)}
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {produit.image_url ? (
                          <Image
                            src={produit.image_url}
                            alt={produit.nom}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{produit.nom}</h3>
                        <p className="text-sm text-gray-600">{produit.marque_nom}</p>
                        <p className="text-sm text-gray-500">Stock: {produit.stock_disponible}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {Math.round(produit.prix).toLocaleString('fr-FR')} FCFA
                        </p>
                        <button className="mt-1 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                          Ajouter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sélection du client */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Client
              </h2>
              
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un client ou laisser vide pour vente anonyme..."
                  value={clientSearchTerm}
                  onChange={(e) => {
                    setClientSearchTerm(e.target.value);
                    searchClients(e.target.value);
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                {isClientSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  </div>
                )}
              </div>

              {/* Client sélectionné */}
              {selectedClient && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-800">
                        {selectedClient.prenom} {selectedClient.nom}
                      </p>
                      <p className="text-sm text-green-600">{selectedClient.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedClient(null)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Résultats de recherche clients */}
              {clientSearchResults.length > 0 && !selectedClient && (
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                  {clientSearchResults.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedClient(client);
                        setClientSearchTerm('');
                        setClientSearchResults([]);
                      }}
                    >
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {client.prenom?.charAt(0) || 'C'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {client.prenom} {client.nom}
                        </p>
                        <p className="text-sm text-gray-600">{client.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Panier et paiement */}
          <div className="space-y-6">
            {/* Panier */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Panier ({cart.length})
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Le panier est vide</p>
                  <p className="text-sm">Recherchez et ajoutez des produits</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.nom}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate text-sm">{item.nom}</h3>
                        <p className="text-xs text-gray-600">{Math.round(item.prix).toLocaleString('fr-FR')} FCFA</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantite - 1)}
                          className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantite}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantite + 1)}
                          className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              {cart.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      {Math.round(cartTotal).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Paiement */}
            {cart.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Paiement
                </h2>

                {/* Mode de paiement */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {paymentMethods.length > 0 ? (
                      paymentMethods.map((method) => (
                        <option key={method.id} value={method.code_paiement.toLowerCase()}>
                          {method.nom}
                        </option>
                      ))
                    ) : (
                      <option value="especes">Chargement...</option>
                    )}
                  </select>
                </div>

                {/* Montant reçu (pour espèces) */}
                {paymentMethod === 'especes' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Montant reçu</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(Number(e.target.value))}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">FCFA</span>
                    </div>
                    {change > 0 && (
                      <div className="mt-2 p-2 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          Monnaie à rendre: <span className="font-semibold">{Math.round(change).toLocaleString('fr-FR')} FCFA</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Bouton de validation */}
                <button
                  onClick={processSale}
                  disabled={isProcessing || (paymentMethod === 'especes' && amountReceived < cartTotal)}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Finaliser la vente
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal de reçu */}
        {showReceipt && saleData && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Vente effectuée</h2>
                  <p className="text-gray-600">Ticket de caisse généré</p>
                </div>

                {/* Reçu de caisse 80mm */}
                <div className="receipt-print bg-white border-2 border-gray-300 rounded-lg p-4 mb-6" style={{ width: '80mm', margin: '0 auto' }}>
                  {/* En-tête */}
                  <div className="text-center mb-4">
                    <h1 className="text-lg font-bold text-gray-900">Garden Concept Store & Wellness</h1>
                    <p className="text-sm text-gray-600">Tél: +221 33 123 45 67</p>
                    <p className="text-sm text-gray-600">Dakar, Sénégal</p>
                    <div className="border-t border-gray-300 my-2"></div>
                  </div>

                  {/* Informations de la vente */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm">
                      <span>N° Commande:</span>
                      <span className="font-semibold">{saleData.numero_commande}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Date:</span>
                      <span>{new Date(saleData.date_commande).toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Client:</span>
                      <span>{saleData.client_nom || 'Anonyme'}</span>
                    </div>
                    <div className="border-t border-gray-300 my-2"></div>
                  </div>

                  {/* Produits */}
                  <div className="mb-4">
                    <div className="text-sm font-semibold mb-2">Articles:</div>
                    {saleData.produits && saleData.produits.map((item, index) => (
                      <div key={index} className="mb-2">
                        <div className="text-sm font-medium">{item.nom}</div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{item.quantite} x {Math.round(item.prix_unitaire).toLocaleString('fr-FR')} FCFA</span>
                          <span className="font-semibold">{Math.round(item.prix_unitaire * item.quantite).toLocaleString('fr-FR')} FCFA</span>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-gray-300 my-2"></div>
                  </div>

                  {/* Total */}
                  <div className="mb-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>TOTAL:</span>
                      <span>{Math.round(saleData.montant_total).toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Paiement:</span>
                      <span>{paymentMethods.find(m => m.code_paiement.toLowerCase() === saleData.mode_paiement)?.nom || saleData.mode_paiement}</span>
                    </div>
                    {saleData.montant_recu > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Reçu:</span>
                          <span>{Math.round(saleData.montant_recu).toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Rendu:</span>
                          <span>{Math.round(saleData.monnaie_rendue).toLocaleString('fr-FR')} FCFA</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Opérateur */}
                  <div className="mb-4">
                    <div className="border-t border-gray-300 my-2"></div>
                    <div className="text-center text-sm">
                      <span>Opérateur: </span>
                      <span className="font-semibold">{user?.nom || 'Admin'}</span>
                    </div>
                  </div>

                  {/* Code-barres */}
                  <div className="text-center">
                    <canvas ref={barcodeRef} className="mx-auto"></canvas>
                    <p className="text-xs text-gray-500 mt-2">Merci pour votre visite!</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      generateBarcode(saleData.numero_commande);
                      setTimeout(() => window.print(), 100);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimer
                  </button>
                  <button
                    onClick={newSale}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Nouvelle vente
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
}
