import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import InfoSection from '../components/InfoSection';
import NewsletterForm from '../components/NewsletterForm';
import Image from 'next/image';
import Link from 'next/link';

export default function Kya() {
  return (
    <Layout>
        
        <HeroSection/>

        <div className="bg-gray-100 lg:p-8">
              <section className="my-8">
                <h1 className="text-3xl text-center md:text-5xl font-bold mb-8 mt-8 pt-8 pb-8">A Propos de Nous</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                  <div className="p-4">
                  <h1 className="text-3xl md:text-2xl pb-5 font-bold">Garden Concept Store</h1>
                    <h1 className="text-justify">
                      est une Boutique Electrique qui présente une sélection pointue de créateurs Africains et internationaux.
                      Nous concoctons une sélection simple et harmonieuse de designers, afin de combler les besoins et les désirs de nos clients.
                      la plupart d entre eux sont distribués de façon exclusive dans des concepts store reputes dans le monde : ils représentent lavant-garde de la mode, et nous souhaitons leur offrir un espace dexpression plus important.
                      Nous privilégions surtout les créateurs ayant un historique humain, positif et tendance.
                      La mise en avant des designers africains est une priorité pour le Garden Concept Store, par le biais de collaborations et déchanges culturels.
                      Notre objectif reste de fidéliser notre clientèle en leur proposant des produits exclusifs et authentiques.
                      Mais aussi construire et agrandir notre communauté en leur présentant du contenu moderne et de qualité.
                      Une superficie globale exploitée de 800 m2, repartie sur (04) niveaux, respectant lintimité de chaque client.
                      Une équipe de plus de 20 personnes font tourner votre petite bulle, ceci tous les jours à partir de 10h.
                      Nous souhaitons bâtir avec vous une relation de confiance.
                      Lharmonie intérieure et le ressourcement vont bien plus loin que vous ne limaginez.
                      Notre satisfaction est votre sourire.
                    </h1>
                  </div>
                  <div className="p-4 h-96 md:h-[600px]">
                  <Image
                  src="/images/kya2.jpg"
                  alt="Hero Image 1"
                  width={3000}
                  height={1000}
                  className="w-full h-full object-cover"
                  />
                  </div>
                </div>
              </section>
        </div>
        <InfoSection/>

        <NewsletterForm/>

        <footer className="bg-black text-white py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Colonne 1 - Informations */}
            <div>
              <h3 className="text-lg text-center font-bold mb-3">ADRESSE</h3>
              <p className="text-sm text-center text-gray-400">
              Route de NGOR, Face Hôtel BOMA
              </p>
              <p className="text-sm text-center text-gray-400 pt-8">
              DAKAR - SENEGAL
              </p>
            </div>
            
            {/* Colonne 2 - Liens rapides */}
            <div>
              <h3 className="text-lg text-center font-bold mb-3">CONTACT</h3>
              <p className="text-sm text-center text-gray-400">
              +221 33 820 50 00
              </p>
              <p className="text-sm text-center text-gray-400 pt-8">
              gardendakar@gmail.com
              </p>
            </div>

            {/* Colonne 2 - Liens rapides */}
            <div>
              <h3 className="text-lg text-center font-bold mb-3">COLLABORATION</h3>
              <p className="text-sm text-center text-gray-400">
              .
              </p>
              <p className="text-sm text-center text-gray-400 pt-8">
              .
              </p>
            </div>
            
            {/* Colonne 3 - Modes de paiement et livraison */}
            <div>
              <h3 className="text-lg text-center font-bold mb-3">SOCIAL MEDIA</h3>
              <div className="flex space-x-2 justify-center mb-4">
                <Link href="#">
                <Image src="/images/facebook.png" width={30} height={30} alt="facebook" />
                </Link>

                <Link href="#">
                <Image src="/images/instagram.png" width={30} height={30} alt="instagram" />
                </Link>

                <Link href="#">
                <Image src="/images/twitter.png" width={30} height={30} alt="twitter" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        </footer>
      
    </Layout>
  );
}