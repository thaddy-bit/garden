// pages/reserver.js
import axios from "axios";
import Layout from '@/components/Layout';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Reserver() {
  const router = useRouter();
  const { id } = router.query; // correction ici

  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [heure, setHeure] = useState("");
  const [message, setMessage] = useState("");


  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/wellness/${id}`);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        setService(data);
      } catch (err) {
        console.error("Erreur lors de la récupération du service :", err);
      }
    };

    fetchService();
  }, [id]);

  // Charger les agents disponibles quand la date change
  useEffect(() => {
    if (date) {
      axios.get(`/api/agents/disponibles?date=${date}`)
        .then(res => setAgents(res.data))
        .catch(err => console.error(err));
    } else {
      setAgents([]);
    }
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !selectedAgent || !heure) {
      setMessage("Tous les champs sont obligatoires.");
      return;
    }

    try {
      const res = await axios.post("/api/rendezvous", {
        date,
        telephone,
        nom,
        agent_id: selectedAgent,
        heure,
        wellness_id:service.id,
      });
      setMessage("✅ Rendez-vous confirmé !");

    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de la réservation.");
    }
  };

  if (!service) {
    return (
      <Layout>
        <div className="text-center py-10">Chargement du service...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Réserver : {service.nom}</h1>
        <div className="lg:flex space-x-8">
          {/* Image + Description */}
          <div className="lg:w-1/2">
            <Image
              src={service.image_url}
              alt={service.nom}
              width={800}
              height={400}
              className="rounded-lg object-cover"
            />
            <p className="mt-4 text-gray-700">{service.description}</p>
            <p className="mt-2 font-semibold text-green-800">Prix : {service.prix} FCFA</p>
          </div>

          {/* Formulaire */}
          <div className="lg:w-1/2 mt-8 lg:mt-0">
          <form onSubmit={handleSubmit} className="space-y-5">
          <div>
          <label className="block text-gray-600 font-medium mb-1">Nom du client</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Téléphone du client</label>
          <input
            type="text"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {/* Date */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Agent */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Agent disponible</label>
          <select
            value={selectedAgent || ""}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">-- Choisir un agent --</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.nom} ({agent.métier})
              </option>
            ))}
          </select>
        </div>

        {/* Heure */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Heure</label>
          <input
            type="time"
            value={heure}
            onChange={(e) => setHeure(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-lg font-semibold transition duration-300"
        >
          Réserver
        </button>
          </form>
          {/* Message */}
          {message && (
            <p className="text-center mt-4 font-medium text-gray-700">{message}</p>
          )}
          </div>
        </div>
      </div>
    </Layout>
  );
}