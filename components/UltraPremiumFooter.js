import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Heart,
  ArrowUp,
  CreditCard,
  Truck,
  Shield,
  Globe
} from 'lucide-react';

export default function UltraPremiumFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Pattern de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-800/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-800/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-800/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Colonne 1 - Informations */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4 text-green-400">Garden Concept Store</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Boutique électrique présentant une sélection pointue de créateurs Africains et internationaux.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Adresse</p>
                    <p className="text-sm text-gray-300">Route de NGOR, Face Hôtel BOMA</p>
                    <p className="text-sm text-gray-300">DAKAR - SENEGAL</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Horaires</p>
                    <p className="text-sm text-gray-300">Lun - Sam: 10h - 20h</p>
                    <p className="text-sm text-gray-300">Dimanche: Fermé</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 2 - Contact */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-green-400">Contact</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Téléphone</p>
                    <a href="tel:+221338205000" className="text-sm text-gray-300 hover:text-green-400 transition-colors">
                      +221 33 820 50 00
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Email</p>
                    <a href="mailto:gardendakar@gmail.com" className="text-sm text-gray-300 hover:text-green-400 transition-colors">
                      gardendakar@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 3 - Services */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-green-400">Services</h3>
              
              <div className="space-y-3">
                <Link href="/produits" className="block text-sm text-gray-300 hover:text-green-400 transition-colors">
                  Nos produits
                </Link>
                <Link href="/marques" className="block text-sm text-gray-300 hover:text-green-400 transition-colors">
                  Marques
                </Link>
                <Link href="/wellness" className="block text-sm text-gray-300 hover:text-green-400 transition-colors">
                  Wellness & Spa
                </Link>
                <Link href="/magazine" className="block text-sm text-gray-300 hover:text-green-400 transition-colors">
                  Magazine
                </Link>
                <Link href="/livraison-retour" className="block text-sm text-gray-300 hover:text-green-400 transition-colors font-medium">
                  Livraison & Retour
                </Link>
                <Link href="/contact" className="block text-sm text-gray-300 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            {/* Colonne 4 - Social Media avec images circulaires */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-green-400">Suivez-nous</h3>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-300">
                  Restez connecté avec nous sur les réseaux sociaux pour découvrir nos dernières collections.
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link 
                    href="#" 
                    className="group relative w-14 h-14 rounded-full overflow-hidden shadow-lg hover:shadow-green-800/25 transition-all duration-300 hover:scale-110"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800"></div>
                    <Image 
                      src="/images/facebook.png" 
                      alt="Facebook" 
                      width={56} 
                      height={56} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  </Link>
                  
                  <Link 
                    href="#" 
                    className="group relative w-14 h-14 rounded-full overflow-hidden shadow-lg hover:shadow-green-800/25 transition-all duration-300 hover:scale-110"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600"></div>
                    <Image 
                      src="/images/instagram.png" 
                      alt="Instagram" 
                      width={56} 
                      height={56} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  </Link>
                  
                  <Link 
                    href="#" 
                    className="group relative w-14 h-14 rounded-full overflow-hidden shadow-lg hover:shadow-green-800/25 transition-all duration-300 hover:scale-110"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                    <Image 
                      src="/images/twitter.png" 
                      alt="Twitter" 
                      width={56} 
                      height={56} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modes de paiement et livraison - Version Ultra Premium */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Modes de paiement */}
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center shadow-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-400">Modes de paiement</h3>
                </div>
                <p className="text-gray-300 text-sm max-w-md mx-auto">
                  Paiements sécurisés et cryptés pour votre tranquillité d'esprit
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="group relative w-20 h-12 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                    <Image 
                      src="/images/visa.png" 
                      alt="Visa" 
                      width={80} 
                      height={48} 
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="group relative w-20 h-12 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                    <Image 
                      src="/images/mastercard.png" 
                      alt="Mastercard" 
                      width={80} 
                      height={48} 
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="group relative w-20 h-12 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                    <Image 
                      src="/images/pay-pal.png" 
                      alt="PayPal" 
                      width={80} 
                      height={48} 
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="group relative w-20 h-12 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                    <Image 
                      src="/images/orange.jpg" 
                      alt="Orange Money" 
                      width={80} 
                      height={48} 
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="group relative w-20 h-12 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                    <Image 
                      src="/images/wave.jpg" 
                      alt="Wave" 
                      width={80} 
                      height={48} 
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span>Paiements 100% sécurisés</span>
                </div>
              </div>

              {/* Sociétés d'expédition */}
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center shadow-lg">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-400">Livraison mondiale</h3>
                </div>
                <p className="text-gray-300 text-sm max-w-md mx-auto">
                  Livraison rapide et sécurisée avec nos partenaires internationaux
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="group relative w-24 h-16 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                    <Image 
                      src="/images/dhl.png" 
                      alt="DHL" 
                      width={96} 
                      height={64} 
                      className="w-full h-full object-contain p-3"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="group relative w-24 h-16 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                    <Image 
                      src="/images/fedex.png" 
                      alt="FedEx" 
                      width={96} 
                      height={64} 
                      className="w-full h-full object-contain p-3"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="group relative w-24 h-16 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                    <Image 
                      src="/images/ups.png" 
                      alt="UPS" 
                      width={96} 
                      height={64} 
                      className="w-full h-full object-contain p-3"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Globe className="w-4 h-4" />
                  <span>Livraison dans le monde entier</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-green-400">Newsletter</h3>
              <p className="text-gray-300 text-sm max-w-md mx-auto">
                Abonnez-vous à notre newsletter pour recevoir les dernières nouveautés et offres exclusives.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                />
                <button className="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  S'abonner
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Copyright */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>© 2024 Garden Concept Store. Tous droits réservés.</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </div>
              
              {/* Liens légaux */}
              <div className="flex flex-wrap gap-6 text-sm">
                <Link href="/mentions-legales" className="text-gray-400 hover:text-green-400 transition-colors">
                  Mentions légales
                </Link>
                <Link href="/politique-confidentialite" className="text-gray-400 hover:text-green-400 transition-colors">
                  Politique de confidentialité
                </Link>
                <Link href="/cgv" className="text-gray-400 hover:text-green-400 transition-colors">
                  CGV
                </Link>
              </div>
              
              {/* Bouton retour en haut */}
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg hover:shadow-green-800/25 hover:scale-110"
              >
                <ArrowUp className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


