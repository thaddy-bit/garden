import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { 
  ShoppingCart, 
  Ticket, 
  CreditCard, 
  Delete, 
  Plus, 
  Minus, 
  Truck, 
  Shield, 
  RefreshCw,
  Heart,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

export default function Panier() {
  const { setCartCount } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [panier, setPanier] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const router = useRouter();
  
  // États pour les codes promo et paiement
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [livraison, setLivraison] = useState(0);
  const [adresse, setAdresse] = useState('');
  const [message, setMessage] = useState('');
  const [modesPaiement, setModesPaiement] = useState([]);
  const [loadingModesPaiement, setLoadingModesPaiement] = useState(true);
  
  // États pour les informations de contact
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [fraisTransaction, setFraisTransaction] = useState(0);
  const [montantNet, setMontantNet] = useState(0);
  
  // États pour les options de livraison
  const [typeLivraison, setTypeLivraison] = useState('standard');
  const [villeLivraison, setVilleLivraison] = useState('');
  const [codePostalLivraison, setCodePostalLivraison] = useState('');
  const [instructionsLivraison, setInstructionsLivraison] = useState('');
  const [memeAdresseFacturation, setMemeAdresseFacturation] = useState(true);
  const [adresseFacturation, setAdresseFacturation] = useState('');
  
  // États pour les détails de paiement spécifiques
  const [numeroPortefeuille, setNumeroPortefeuille] = useState('');
  const [numeroCarte, setNumeroCarte] = useState('');
  const [nomCarte, setNomCarte] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [referenceVirement, setReferenceVirement] = useState('');
  const [numeroCheque, setNumeroCheque] = useState('');
  const [emailPaypal, setEmailPaypal] = useState('');
  const [emailStripe, setEmailStripe] = useState('');
  
  // États pour la validation
  const [erreursValidation, setErreursValidation] = useState({});
  const [modeSelectionne, setModeSelectionne] = useState(null);
  
  // Calculs
  const subtotal = panier.length > 0 ? panier.reduce((total, item) => {
    const prix = item.prix_reduction || item.prix;
    return total + (prix * item.quantite);
  }, 0) : 0;
  
  const totalAvantFrais = subtotal + livraison - discount;
  const totalFinal = totalAvantFrais + fraisTransaction;
  

  const applyCoupon = () => {
    const validCoupons = {
      'REDUC10': 0.1,
      'SOLDES20': 0.2,
      'WELCOME15': 0.15,
      'FIRST5': 0.05
    };
    
    if (validCoupons[couponCode]) {
      const discountAmount = validCoupons[couponCode] * subtotal;
      setDiscount(discountAmount);
      toast.success(`Code promo appliqué ! Économie: ${discountAmount.toLocaleString('fr-FR')} FCFA`);
    } else {
      toast.error('Code promo invalide');
    }
  };

  // Valider les champs spécifiques selon le mode de paiement
  const validerChampsSpecifiques = () => {
    const erreurs = {};
    
    if (!modeSelectionne) return erreurs;
    
    switch (modeSelectionne.type) {
      case 'orange_money':
      case 'wave':
      case 'autre': // Free Money
        if (!numeroPortefeuille.trim()) {
          erreurs.numeroPortefeuille = 'Numéro de portefeuille requis';
        } else if (!/^[0-9]{9}$/.test(numeroPortefeuille.replace(/\s/g, ''))) {
          erreurs.numeroPortefeuille = 'Numéro de portefeuille invalide (9 chiffres)';
        }
        break;
        
      case 'carte_bancaire':
        if (!numeroCarte.trim()) {
          erreurs.numeroCarte = 'Numéro de carte requis';
        } else if (!/^[0-9]{16}$/.test(numeroCarte.replace(/\s/g, ''))) {
          erreurs.numeroCarte = 'Numéro de carte invalide (16 chiffres)';
        }
        if (!nomCarte.trim()) {
          erreurs.nomCarte = 'Nom sur la carte requis';
        }
        if (!dateExpiration.trim()) {
          erreurs.dateExpiration = 'Date d\'expiration requise';
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(dateExpiration)) {
          erreurs.dateExpiration = 'Format invalide (MM/AA)';
        }
        if (!cvv.trim()) {
          erreurs.cvv = 'CVV requis';
        } else if (!/^[0-9]{3,4}$/.test(cvv)) {
          erreurs.cvv = 'CVV invalide (3-4 chiffres)';
        }
        break;
        
      case 'virement':
        if (!referenceVirement.trim()) {
          erreurs.referenceVirement = 'Référence de virement requise';
        }
        break;
        
      case 'cheque':
        if (!numeroCheque.trim()) {
          erreurs.numeroCheque = 'Numéro de chèque requis';
        }
        break;
        
      case 'paypal':
        if (!emailPaypal.trim()) {
          erreurs.emailPaypal = 'Email PayPal requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPaypal)) {
          erreurs.emailPaypal = 'Format email invalide';
        }
        break;
        
      case 'stripe':
        if (!emailStripe.trim()) {
          erreurs.emailStripe = 'Email de facturation requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStripe)) {
          erreurs.emailStripe = 'Format email invalide';
        }
        break;
        
      case 'especes':
        // Aucune validation requise pour les espèces
        break;
    }
    
    return erreurs;
  };

  // Charger les modes de paiement
  useEffect(() => {
    const fetchModesPaiement = async () => {
      try {
        const res = await fetch("/api/modes-paiement");
        if (res.ok) {
          const data = await res.json();
          setModesPaiement(data.data || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des modes de paiement:', error);
      } finally {
        setLoadingModesPaiement(false);
      }
    };

    fetchModesPaiement();
  }, []);

  // Calculer les frais de transaction quand le mode de paiement change
  useEffect(() => {
    if (paymentMethod && modesPaiement.length > 0) {
      const selectedMode = modesPaiement.find(mode => mode.code_paiement === paymentMethod);
      
      if (selectedMode) {
        // Si calculerFrais existe, l'utiliser, sinon calculer manuellement
        if (selectedMode.calculerFrais) {
          const frais = selectedMode.calculerFrais(totalAvantFrais);
          setFraisTransaction(frais.frais_calcules);
          setMontantNet(frais.montant_net);
        } else {
          // Calcul manuel des frais
          const fraisFixes = parseFloat(selectedMode.frais_fixes) || 0;
          const fraisPourcentage = parseFloat(selectedMode.frais_pourcentage) || 0;
          const fraisMin = parseFloat(selectedMode.frais_minimum) || 0;
          const fraisMax = parseFloat(selectedMode.frais_maximum) || Infinity;
          
          const fraisPourcentageMontant = (totalAvantFrais * fraisPourcentage) / 100;
          let fraisTotaux = fraisFixes + fraisPourcentageMontant;
          
          fraisTotaux = Math.max(fraisTotaux, fraisMin);
          fraisTotaux = Math.min(fraisTotaux, fraisMax);
          
          setFraisTransaction(fraisTotaux);
          setMontantNet(totalAvantFrais - fraisTotaux);
        }
        
        setModeSelectionne(selectedMode);
        
        // Valider les contraintes de montant
        const montantMin = parseFloat(selectedMode.montant_minimum) || 0;
        const montantMax = parseFloat(selectedMode.montant_maximum) || Infinity;
        
        const nouvellesErreurs = { ...erreursValidation };
        
        if (totalAvantFrais < montantMin) {
          nouvellesErreurs.montant = `Montant minimum requis : ${montantMin.toLocaleString('fr-FR')} FCFA`;
        } else if (totalAvantFrais > montantMax) {
          nouvellesErreurs.montant = `Montant maximum autorisé : ${montantMax.toLocaleString('fr-FR')} FCFA`;
        } else {
          delete nouvellesErreurs.montant;
        }
        
        setErreursValidation(nouvellesErreurs);
      }
    } else {
      setFraisTransaction(0);
      setMontantNet(totalAvantFrais);
      setModeSelectionne(null);
    }
  }, [paymentMethod, totalAvantFrais, modesPaiement]);

  // Réinitialiser les champs spécifiques quand le mode de paiement change
  useEffect(() => {
    // Réinitialiser tous les champs spécifiques
    setNumeroPortefeuille('');
    setNumeroCarte('');
    setNomCarte('');
    setDateExpiration('');
    setCvv('');
    setReferenceVirement('');
    setNumeroCheque('');
    setEmailPaypal('');
    setEmailStripe('');
    
    // Réinitialiser les erreurs de validation spécifiques
    setErreursValidation(prev => {
      const { numeroPortefeuille, numeroCarte, nomCarte, dateExpiration, cvv, referenceVirement, numeroCheque, emailPaypal, emailStripe, ...rest } = prev;
      return rest;
    });
  }, [paymentMethod]);

  // Vérifie si l'utilisateur est connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return router.push("/login");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  const rafraichirPanier = async () => {
    try {
      const res = await fetch("/api/panier/count");
      const data = await res.json();
      setCartCount(data.total || 0);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du panier :", error);
    }
  };

  // Récupérer le panier du client connecté
  useEffect(() => {
    if (!user) return;

    const fetchPanier = async () => {
      try {
        const res = await fetch(`/api/panier?client_id=${user.id}`);
        const data = await res.json();
        setPanier(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erreur:', error);
        setPanier([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPanier();
  }, [user]);

  // Mettre à jour la quantité d'un produit
  const updateQuantity = async (produitId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(produitId);
      return;
    }

    setUpdating(prev => ({ ...prev, [produitId]: true }));

    try {
      const res = await fetch(`/api/panier`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          client_id: user.id, 
          produitId, 
          quantite: newQuantity 
        }),
      });

      if (res.ok) {
        // Mise à jour instantanée du panier et du compteur
        setPanier(prev => prev.map(item => 
          item.produit_id === produitId 
            ? { ...item, quantite: newQuantity }
            : item
        ));
        
        // Mise à jour instantanée du compteur global
        setCartCount(prevCount => {
          const oldQuantity = panier.find(item => item.produit_id === produitId)?.quantite || 0;
          return prevCount - oldQuantity + newQuantity;
        });
        
        toast.success('Quantité mise à jour');
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(prev => ({ ...prev, [produitId]: false }));
    }
  };

  // Supprimer un produit du panier
  const removeFromCart = async (produitId) => {
    try {
      const res = await fetch(`/api/panier`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: user.id, produitId }),
      });

      if (res.ok) {
        // Récupérer la quantité avant suppression pour mettre à jour le compteur
        const itemToRemove = panier.find(item => item.produit_id === produitId);
        const quantityToRemove = itemToRemove?.quantite || 0;
        
        // Mise à jour instantanée du panier et du compteur
        setPanier(prev => prev.filter(item => item.produit_id !== produitId));
        setCartCount(prevCount => prevCount - quantityToRemove);
        
        toast.success('Produit retiré du panier');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Vider le panier
  const clearCart = async () => {
    try {
      for (const item of panier) {
        await fetch(`/api/panier`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_id: user.id, produitId: item.produit_id }),
        });
      }
      setPanier([]);
      rafraichirPanier();
      toast.success('Panier vidé');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du vidage du panier');
    }
  };

  // Fonction pour passer la commande
  const handleCommande = async () => {
    if (panier.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    if (!paymentMethod) {
      toast.error('Veuillez sélectionner une méthode de paiement');
      return;
    }

    if (!telephone.trim()) {
      toast.error('Veuillez saisir votre numéro de téléphone');
      return;
    }

    if (!email.trim()) {
      toast.error('Veuillez saisir votre adresse email');
      return;
    }

    if (!adresse.trim()) {
      toast.error('Veuillez saisir votre adresse de livraison');
      return;
    }

    // Validation des informations de livraison
    if (typeLivraison === 'standard' && !villeLivraison.trim()) {
      toast.error('Veuillez saisir votre ville de livraison');
      return;
    }

    if (!memeAdresseFacturation && !adresseFacturation.trim()) {
      toast.error('Veuillez saisir votre adresse de facturation');
      return;
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }

    // Validation du format téléphone (Sénégal)
    const phoneRegex = /^(\+221|221)?[0-9]{9}$/;
    const cleanPhone = telephone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('Veuillez saisir un numéro de téléphone valide (ex: +221 XX XXX XX XX)');
      return;
    }

    // Valider les champs spécifiques selon le mode de paiement
    const erreursSpecifiques = validerChampsSpecifiques();
    if (Object.keys(erreursSpecifiques).length > 0) {
      const premiereErreur = Object.values(erreursSpecifiques)[0];
      toast.error(premiereErreur);
      setErreursValidation(erreursSpecifiques);
      return;
    }

    // Valider les contraintes de montant
    if (erreursValidation.montant) {
      toast.error(erreursValidation.montant);
      return;
    }

    try {
      // Préparer les détails de paiement spécifiques
      const detailsPaiement = {};
      
      if (modeSelectionne) {
        switch (modeSelectionne.type) {
          case 'orange_money':
          case 'wave':
          case 'autre':
            detailsPaiement.numeroPortefeuille = numeroPortefeuille;
            break;
          case 'carte_bancaire':
            detailsPaiement.numeroCarte = numeroCarte;
            detailsPaiement.nomCarte = nomCarte;
            detailsPaiement.dateExpiration = dateExpiration;
            detailsPaiement.cvv = cvv;
            break;
          case 'virement':
            detailsPaiement.referenceVirement = referenceVirement;
            break;
          case 'cheque':
            detailsPaiement.numeroCheque = numeroCheque;
            break;
          case 'paypal':
            detailsPaiement.emailPaypal = emailPaypal;
            break;
          case 'stripe':
            detailsPaiement.emailStripe = emailStripe;
            break;
          case 'especes':
            // Aucun détail spécifique pour les espèces
            break;
        }
      }

      const res = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: user.id,
          livraison,
          panier,
          total: totalFinal,
          adresse,
          mode_paiement: paymentMethod,
          telephone,
          email,
          details_paiement: detailsPaiement,
          frais_transaction: fraisTransaction,
          montant_net: montantNet,
          // Nouvelles informations de livraison
          type_livraison: typeLivraison,
          ville_livraison: villeLivraison,
          code_postal_livraison: codePostalLivraison,
          instructions_livraison: instructionsLivraison,
          adresse_facturation: memeAdresseFacturation ? adresse : adresseFacturation,
          // Informations pour la facture
          discount: discount
        }),
      });

      if (res.ok) {
        setPanier([]);
        rafraichirPanier();
        toast.success('Commande enregistrée avec succès !');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        toast.error('Erreur lors de la commande');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la commande');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Chargement du panier...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
            <p className="text-gray-600 mt-2">
              {panier.length} {panier.length > 1 ? 'articles' : 'article'} dans votre panier
            </p>
          </div>

          {panier.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Votre panier est vide</h2>
              <p className="text-gray-600 mb-8">Découvrez nos produits et ajoutez-les à votre panier</p>
              <Link
                href="/marques/liste"
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Commencer mes achats
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Liste des articles */}
              <div className="xl:col-span-2 space-y-4">
                {panier.map((item) => {
                  const prix = item.prix_reduction || item.prix;
                  const prixTotal = prix * item.quantite;
                  
                  return (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start space-x-4">
                        
                        {/* Image du produit */}
                        <div className="flex-shrink-0">
                          <Link href={`/produit/${item.slug}`}>
                            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                              {item.image_url ? (
                                <Image
                                  src={item.image_url}
                                  alt={item.nom}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ShoppingCart className="h-8 w-8" />
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>

                        {/* Informations du produit */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Link href={`/produit/${item.slug}`}>
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                                  {item.nom}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-500 mt-1">{item.marque_nom}</p>
                              <p className="text-sm text-gray-500">{item.sous_categorie_nom}</p>
                              
                              {/* Prix */}
                              <div className="mt-2 flex items-center space-x-2">
                                <span className="text-xl font-bold text-gray-900">
                                  {prix.toLocaleString('fr-FR')} FCFA
                                </span>
                                {item.prix_reduction && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {item.prix.toLocaleString('fr-FR')} FCFA
                                  </span>
                                )}
                                {item.prix_reduction && (
                                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                                    -{item.pourcentage_reduction}%
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-4">
                              
                              {/* Sélecteur de quantité */}
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.produit_id, item.quantite - 1)}
                                  disabled={updating[item.produit_id] || item.quantite <= 1}
                                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                                  {updating[item.produit_id] ? (
                                    <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                                  ) : (
                                    item.quantite
                                  )}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.produit_id, item.quantite + 1)}
                                  disabled={updating[item.produit_id] || item.quantite >= item.stock}
                                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Prix total */}
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  {prixTotal.toLocaleString('fr-FR')} FCFA
                                </p>
                              </div>

                              {/* Bouton supprimer */}
                              <button
                                onClick={() => removeFromCart(item.produit_id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Supprimer du panier"
                              >
                                <Delete className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Actions du panier */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={clearCart}
                    className="text-gray-500 hover:text-red-600 transition-colors flex items-center"
                  >
                    <Delete className="h-4 w-4 mr-2" />
                    Vider le panier
                  </button>
                  
                  <Link
                    href="/marques/liste"
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Continuer mes achats
                  </Link>
                </div>
              </div>

              {/* Récapitulatif */}
              <div className="space-y-6">
                
                {/* Code promo */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Ticket className="h-5 w-5 mr-2 text-purple-600" />
                    Code promo
                  </h3>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="Entrez votre code"
                      />
                      <button
                        onClick={applyCoupon}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Appliquer
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Codes valides: REDUC10, SOLDES20, WELCOME15, FIRST5
                    </p>
                  </div>
                </div>

                {/* Informations de contact */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Informations de contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="+221 XX XXX XX XX"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-blue-600" />
                    Adresse de livraison
                  </h3>
                  <textarea
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    rows={3}
                    placeholder="Saisissez votre adresse complète..."
                  />
                </div>

                {/* Options de livraison */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Lieu de réception
                  </h3>
                  
                  {/* Type de livraison */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Comment souhaitez-vous recevoir votre commande ?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          value: 'standard',
                          label: 'À domicile',
                          description: 'Livraison standard à votre adresse',
                          icon: '🏠',
                          color: 'blue'
                        },
                        {
                          value: 'point_relais',
                          label: 'Point relais',
                          description: 'Retrait dans un point relais partenaire',
                          icon: '📦',
                          color: 'green'
                        },
                        {
                          value: 'retrait_magasin',
                          label: 'Boutique',
                          description: 'Retrait en magasin Garden',
                          icon: '🏪',
                          color: 'purple'
                        },
                        {
                          value: 'express',
                          label: 'Express',
                          description: 'Livraison express (24h)',
                          icon: '⚡',
                          color: 'orange'
                        }
                      ].map((option) => (
                        <div
                          key={option.value}
                          onClick={() => setTypeLivraison(option.value)}
                          className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            typeLivraison === option.value
                              ? `border-${option.color}-500 bg-${option.color}-50`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">{option.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{option.label}</h4>
                              <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                            </div>
                            {typeLivraison === option.value && (
                              <div className={`w-5 h-5 rounded-full bg-${option.color}-500 flex items-center justify-center`}>
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Informations complémentaires selon le type */}
                  {typeLivraison === 'standard' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ville *
                          </label>
                          <input
                            type="text"
                            value={villeLivraison}
                            onChange={(e) => setVilleLivraison(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Dakar"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code postal
                          </label>
                          <input
                            type="text"
                            value={codePostalLivraison}
                            onChange={(e) => setCodePostalLivraison(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="10000"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {typeLivraison === 'point_relais' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Point relais :</strong> Vous recevrez un SMS avec l'adresse du point relais le plus proche de chez vous.
                      </p>
                    </div>
                  )}

                  {typeLivraison === 'retrait_magasin' && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm text-purple-800">
                        <strong>Retrait en magasin :</strong> Votre commande sera préparée et vous pourrez la retirer dans notre boutique Garden.
                      </p>
                    </div>
                  )}

                  {typeLivraison === 'express' && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800">
                        <strong>Livraison express :</strong> Votre commande sera livrée dans les 24h. Frais de livraison supplémentaires applicables.
                      </p>
                    </div>
                  )}

                  {/* Instructions de livraison */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructions spéciales (optionnel)
                    </label>
                    <textarea
                      value={instructionsLivraison}
                      onChange={(e) => setInstructionsLivraison(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Ex: Sonner à la porte, laisser chez le voisin, etc."
                    />
                  </div>
                </div>

                {/* Adresse de facturation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Adresse de facturation
                  </h3>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="memeAdresse"
                      checked={memeAdresseFacturation}
                      onChange={(e) => setMemeAdresseFacturation(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="memeAdresse" className="ml-2 text-sm text-gray-700">
                      Même adresse que la livraison
                    </label>
                  </div>

                  {!memeAdresseFacturation && (
                    <textarea
                      value={adresseFacturation}
                      onChange={(e) => setAdresseFacturation(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={3}
                      placeholder="Saisissez votre adresse de facturation..."
                    />
                  )}
                </div>

                {/* Méthode de paiement */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                    Paiement
                  </h3>
                  
                  {loadingModesPaiement ? (
                    <div className="flex items-center justify-center py-4">
                      <RefreshCw className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                      <span className="text-gray-500">Chargement des modes de paiement...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {modesPaiement.length > 0 ? (
                        <div className="relative">
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
                          >
                            <option value="">Choisissez un mode de paiement</option>
                            {modesPaiement.map((mode) => (
                              <option key={mode.id} value={mode.code_paiement}>
                                {mode.icone && mode.icone.startsWith('/') ? '💳' : mode.icone || '💳'} {mode.nom}
                              </option>
                            ))}
                          </select>
                          
                          {/* Icône de la flèche */}
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          Aucun mode de paiement disponible
                        </div>
                      )}
                      
                      {/* Affichage du mode sélectionné avec détails */}
                      {paymentMethod && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          {(() => {
                            const selectedMode = modesPaiement.find(mode => mode.code_paiement === paymentMethod);
                            return selectedMode ? (
                              <div className="flex items-center space-x-3">
                                {selectedMode.icone && (
                                  <div className="w-8 h-8 flex items-center justify-center">
                                    {selectedMode.icone.startsWith('/') ? (
                                      <Image
                                        src={selectedMode.icone}
                                        alt={selectedMode.nom}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 object-contain"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'block';
                                        }}
                                      />
                                    ) : (
                                      <span className="text-2xl">{selectedMode.icone}</span>
                                    )}
                                    <span className="text-2xl hidden">{selectedMode.nom.charAt(0)}</span>
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {selectedMode.nom}
                                  </div>
                                  {selectedMode.description && (
                                    <div className="text-sm text-gray-500">
                                      {selectedMode.description}
                                    </div>
                                  )}
                                </div>
                                <div className="text-sm text-gray-400 capitalize">
                                  {selectedMode.categorie}
                                </div>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}

                      {/* Champs spécifiques selon le mode de paiement */}
                      {paymentMethod && modeSelectionne && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
                          <h4 className="text-sm font-medium text-blue-900 mb-3">
                            Informations de paiement spécifiques
                          </h4>
                          
                          <div className="space-y-4">
                            {/* Orange Money / Wave / Free Money */}
                            {(modeSelectionne.type === 'orange_money' || modeSelectionne.type === 'wave' || modeSelectionne.type === 'autre' || modeSelectionne.code_paiement === 'FREE_MONEY') && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Numéro de portefeuille *
                                </label>
                                <input
                                  type="tel"
                                  value={numeroPortefeuille}
                                  onChange={(e) => setNumeroPortefeuille(e.target.value)}
                                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    erreursValidation.numeroPortefeuille ? 'border-red-300' : 'border-gray-300'
                                  }`}
                                  placeholder="77 123 45 67"
                                  maxLength="11"
                                />
                                {erreursValidation.numeroPortefeuille && (
                                  <p className="text-red-500 text-xs mt-1">{erreursValidation.numeroPortefeuille}</p>
                                )}
                              </div>
                            )}

                            {/* Carte bancaire */}
                            {modeSelectionne.type === 'carte_bancaire' && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Numéro de carte *
                                  </label>
                                  <input
                                    type="text"
                                    value={numeroCarte}
                                    onChange={(e) => setNumeroCarte(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                      erreursValidation.numeroCarte ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                  />
                                  {erreursValidation.numeroCarte && (
                                    <p className="text-red-500 text-xs mt-1">{erreursValidation.numeroCarte}</p>
                                  )}
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom sur la carte *
                                  </label>
                                  <input
                                    type="text"
                                    value={nomCarte}
                                    onChange={(e) => setNomCarte(e.target.value.toUpperCase())}
                                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                      erreursValidation.nomCarte ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="JEAN DUPONT"
                                  />
                                  {erreursValidation.nomCarte && (
                                    <p className="text-red-500 text-xs mt-1">{erreursValidation.nomCarte}</p>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Date d'expiration *
                                    </label>
                                    <input
                                      type="text"
                                      value={dateExpiration}
                                      onChange={(e) => setDateExpiration(e.target.value.replace(/\D/g, '').replace(/(.{2})/, '$1/').substring(0, 5))}
                                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        erreursValidation.dateExpiration ? 'border-red-300' : 'border-gray-300'
                                      }`}
                                      placeholder="MM/AA"
                                      maxLength="5"
                                    />
                                    {erreursValidation.dateExpiration && (
                                      <p className="text-red-500 text-xs mt-1">{erreursValidation.dateExpiration}</p>
                                    )}
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      CVV *
                                    </label>
                                    <input
                                      type="text"
                                      value={cvv}
                                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        erreursValidation.cvv ? 'border-red-300' : 'border-gray-300'
                                      }`}
                                      placeholder="123"
                                      maxLength="4"
                                    />
                                    {erreursValidation.cvv && (
                                      <p className="text-red-500 text-xs mt-1">{erreursValidation.cvv}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Virement bancaire */}
                            {(modeSelectionne.type === 'virement' || modeSelectionne.code_paiement === 'VIREMENT_BANCAIRE') && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Référence de virement *
                                </label>
                                <input
                                  type="text"
                                  value={referenceVirement}
                                  onChange={(e) => setReferenceVirement(e.target.value)}
                                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    erreursValidation.referenceVirement ? 'border-red-300' : 'border-gray-300'
                                  }`}
                                  placeholder="VIR-2025-001"
                                />
                                {erreursValidation.referenceVirement && (
                                  <p className="text-red-500 text-xs mt-1">{erreursValidation.referenceVirement}</p>
                                )}
                              </div>
                            )}

                            {/* Chèque */}
                            {modeSelectionne.type === 'cheque' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Numéro de chèque *
                                </label>
                                <input
                                  type="text"
                                  value={numeroCheque}
                                  onChange={(e) => setNumeroCheque(e.target.value)}
                                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    erreursValidation.numeroCheque ? 'border-red-300' : 'border-gray-300'
                                  }`}
                                  placeholder="000123456"
                                />
                                {erreursValidation.numeroCheque && (
                                  <p className="text-red-500 text-xs mt-1">{erreursValidation.numeroCheque}</p>
                                )}
                              </div>
                            )}

                            {/* PayPal */}
                            {modeSelectionne.type === 'paypal' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Email PayPal *
                                </label>
                                <input
                                  type="email"
                                  value={emailPaypal}
                                  onChange={(e) => setEmailPaypal(e.target.value)}
                                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    erreursValidation.emailPaypal ? 'border-red-300' : 'border-gray-300'
                                  }`}
                                  placeholder="votre@email.com"
                                />
                                {erreursValidation.emailPaypal && (
                                  <p className="text-red-500 text-xs mt-1">{erreursValidation.emailPaypal}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  Vous serez redirigé vers PayPal pour finaliser le paiement
                                </p>
                              </div>
                            )}

                            {/* Stripe */}
                            {modeSelectionne.type === 'stripe' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Email de facturation *
                                </label>
                                <input
                                  type="email"
                                  value={emailStripe}
                                  onChange={(e) => setEmailStripe(e.target.value)}
                                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    erreursValidation.emailStripe ? 'border-red-300' : 'border-gray-300'
                                  }`}
                                  placeholder="votre@email.com"
                                />
                                {erreursValidation.emailStripe && (
                                  <p className="text-red-500 text-xs mt-1">{erreursValidation.emailStripe}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  Vous serez redirigé vers Stripe pour finaliser le paiement
                                </p>
                              </div>
                            )}

                            {/* Espèces */}
                            {modeSelectionne.type === 'especes' && (
                              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                                <div className="flex items-start space-x-3">
                                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-600 text-xl">💰</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-green-900 text-base mb-2">
                                      Paiement en espèces à la livraison
                                    </h5>
                                    <p className="text-green-700 mb-3 text-sm">
                                      Vous paierez en espèces lors de la livraison de votre commande. 
                                      Aucune information supplémentaire n'est requise.
                                    </p>
                                    <div className="flex flex-wrap gap-3 text-xs text-green-600">
                                      <div className="flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Paiement sécurisé
                                      </div>
                                      <div className="flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Aucun frais
                                      </div>
                                      <div className="flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Livraison rapide
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Instructions spécifiques */}
                            {modeSelectionne.instructions && (
                              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800 break-words">
                                  <strong>Instructions :</strong> {modeSelectionne.instructions}
                                </p>
                              </div>
                            )}

                            {/* Support */}
                            {(modeSelectionne.support_telephone || modeSelectionne.support_email) && (
                              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800 break-words">
                                  <strong>Support :</strong>
                                  {modeSelectionne.support_telephone && (
                                    <span> Tél: {modeSelectionne.support_telephone}</span>
                                  )}
                                  {modeSelectionne.support_email && (
                                    <span> Email: {modeSelectionne.support_email}</span>
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Récapitulatif des prix */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total ({panier.length} articles)</span>
                      <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Livraison</span>
                      <span>{livraison === 0 ? 'Gratuite' : `${livraison.toLocaleString('fr-FR')} FCFA`}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Remise</span>
                        <span>-{discount.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}
                    
                    {fraisTransaction > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Frais de transaction</span>
                        <span>{fraisTransaction.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}
                    
                    {/* Affichage des erreurs de contraintes */}
                    {erreursValidation.montant && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm font-medium">
                          ⚠️ {erreursValidation.montant}
                        </p>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>{totalFinal.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCommande}
                    disabled={
                      !paymentMethod || 
                      !adresse.trim() || 
                      !telephone.trim() || 
                      !email.trim() ||
                      (typeLivraison === 'standard' && !villeLivraison.trim()) ||
                      (!memeAdresseFacturation && !adresseFacturation.trim()) ||
                      Object.keys(erreursValidation).length > 0 ||
                      Object.keys(validerChampsSpecifiques()).length > 0
                    }
                    className="w-full mt-6 bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Passer la commande
                  </button>
                </div>

                {/* Garanties */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Garanties
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Livraison gratuite</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Retour gratuit sous 14 jours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}