import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Heart,
  ArrowUp
} from 'lucide-react';

export default function PremiumFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Pattern de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-800/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-800/10 rounded-full blur-3xl"></div>
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

            {/* Colonne 3 - Liens rapides */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-green-400">Liens rapides</h3>
              
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
                <Link href="/contact" className="block text-sm text-gray-300 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            {/* Colonne 4 - Social Media */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-green-400">Suivez-nous</h3>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-300">
                  Restez connecté avec nous sur les réseaux sociaux pour découvrir nos dernières collections.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="#" 
                    className="group w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-800 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-green-800/25"
                  >
                    <Facebook className="w-5 h-5 text-white group-hover:text-white" />
                  </Link>
                  
                  <Link 
                    href="#" 
                    className="group w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-800 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-green-800/25"
                  >
                    <Instagram className="w-5 h-5 text-white group-hover:text-white" />
                  </Link>
                  
                  <Link 
                    href="#" 
                    className="group w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-800 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-green-800/25"
                  >
                    <Twitter className="w-5 h-5 text-white group-hover:text-white" />
                  </Link>
                  
                  <Link 
                    href="#" 
                    className="group w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-800 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-green-800/25"
                  >
                    <Youtube className="w-5 h-5 text-white group-hover:text-white" />
                  </Link>
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



