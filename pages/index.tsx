import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import BrandsSlider from '../components/BrandsSlider';
import TrendingProductsSlider from '../components/TrendingProductsSlider';
import TestimonialsSlider from '../components/TestimonialsSlider';
import PhysicalStoreSection from '../components/PhysicalStoreSection';
import NewsletterForm from '../components/NewsletterForm';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout> 
      {/* Hero Slider Principal */}
      <HeroSection/>
      
      {/* Slider des Marques Partenaires */}
      <BrandsSlider/>
      
      {/* Slider des Produits Tendance */}
      <TrendingProductsSlider/>
      
      {/* Slider des Témoignages */}
      <TestimonialsSlider/>
    
      {/* Section À Propos */}
      <div className="bg-white lg:p-8">
        <section className="my-8">
          <h1 className="text-3xl text-center md:text-5xl font-bold mb-8 mt-8 pt-8 pb-8 text-black">A Propos de Nous</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
            <div className="p-4">
              <h1 className="text-3xl md:text-2xl pb-5 font-bold text-black">Garden Concept Store</h1>
              <h1 className="text-justify text-black">
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
                src="/images/kya.jpg"
                alt="Hero Image 1"
                width={3000}
                height={1000}
                className="w-full h-full object-cover rounded-lg border border-black"
              />
            </div>
          </div>
        </section>
      </div>
      
      {/* Section Boutique Physique */}
      <PhysicalStoreSection/>
      
      {/* Newsletter */}
      <NewsletterForm/>
          
    </Layout>
  )
}