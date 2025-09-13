import Layout from '../components/Layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';


  const titre = "Wellness";

export default function Wellness() {

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]); // Store fetched products
    const [operateur, setOperateur] = useState([]);

    useEffect(() => {
          async function fetchData() {
          const response = await fetch('/api/wellness/getAll');
          const data = await response.json();
          setProducts(data);
        }

        fetchData();
      }, []);

      useEffect(() => {
        // afficher les opérateurs
        async function fetchOperateur() {
          const response = await fetch('/api/operateurs/getAll');
          const res = await response.json();
          setOperateur(res);
        }

        fetchOperateur();
      }, []);


    const handleAddToCart = (product) => {
      // redirige vers la page de rendezvous avec l'ID du Service
      router.push("/wellness/reserver/${product.id}");
    // setSelectedProduct(product);
    // setIsModalOpen(true);
    };

    const [formData, setFormData] = useState({
        name: "",
        telephone: "",
        date: "",
        time: "",
      });

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Rendez-vous confirmé pour ${formData.name} le ${formData.date} à ${formData.time}.`);
        closeModal();
      };

      const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        setFormData({ name: "", telephone: "", date: "", time: "" }); // Réinitialiser le formulaire
      };

  return (
    <Layout>
         
        <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className='bg-gray-200 p-2 w-full top-0 z-50'>
                  <h2 className="ml-10">Garden / {titre}</h2> 
                </div>
                <div className="max-w-7xl mx-auto">
                
                    <h2 className="text-justify mb-8 mt-8">
                    Lorem Ipsum is simply dummy text of the printing and typesetting 
                    industry. Lorem Ipsum has been the industrys standard dummy text 
                    ever since the 1500s, when an unknown printer took a galley of type 
                    and scrambled it to make a type specimen book. It has survived not 
                    only five centuries, but also the leap into electronic typesetting, 
                    remaining essentially unchanged. It was popularised in the 1960s with 
                    the release of Letraset sheets containing Lorem Ipsum passages, and 
                    more recently with desktop publishing software like Aldus PageMaker 
                    including versions of Lorem Ipsum.
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:m-15 lg:p-15 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                        <Image
                        src={product.image_url}
                        alt={product.nom}
                        width={3000}
                        height={1000}
                        className="w-full h-64 object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold mb-2">{product.nom}</h3>
                        <p className="font-bold text-gray-900 mb-4">FCFA {product.prix}</p>
                        <Link
                          href={`/wellness/reserver/${product.id}`}
                          className="w-full px-4 py-2 bg-green-900 text-white rounded-lg hover:bg-green-800 transition-colors duration-300"
                          >
                          Prendre rendez-vous
                        </Link>
                    </div>
                    </div>
                     ))}
                    </div>
            </div>
        </div>

        {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 lg:flex items-center justify-center w-full bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-12/12 md:w-1/2 lg:w-3/4 p-2">
          <div className='lg:flex space-x-5'>
          <div className='flex w-full'>
              <div>
                  <Image
                  src={selectedProduct.image_url}
                  alt={selectedProduct.nom}
                  width={3000}
                  height={1000}
                  className="w-500 lg:w-300 h-50 object-cover mb-4"
                  />
              </div>
              <div className='ml-2'>
                  <h2 className="text-xl font-bold mb-4">{selectedProduct.nom}</h2>
                  <p className="text-xs lg:text-gray-700 mb-4">{selectedProduct.description}</p>
                  <p className="font-bold text-gray-900 mb-4">FCFA {selectedProduct.prix}</p>
              </div>
          </div>
            {/* Formulaire de rendez-vous */}
          <div className='w-full flow-root'>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <select id="countries" className="text-sm rounded-lg w-full p-2 dark:bg-green-900 dark:placeholder-green-900 dark:text-white">
                    <option selected>
                      Sélectionner un agent
                    </option>
                    {operateur.map((user) => (
                    <option key={user.id} value={user.nom}>
                    {user.nom}
                    </option>
                    ))}
                  </select>
              </div>
              <div className='flex w-full flow-root space-x-2'>
                <div className='float-left'>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-40 lg:w-53 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className='float-right'>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <input
                    type="telephone"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-40 lg:w-53 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className='flex w-full flow-root space-x-2'>
                <div className='float-left'>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date du rendez-vous
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-40 lg:w-53 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className='float-right'>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Heure du rendez-vous
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-40 lg:w-53 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                  Fermer
                </button>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
                >
                  Confirmer
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-900 text-white rounded-lg hover:bg-green-800 transition-colors duration-300"
                >
                  Confirmer et payé
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      </div>
      )}    

    </Layout>
  );
}



