import { useState, useEffect } from "react";
import axios from "axios";

export default function RendezvousPage() {
  const [date, setDate] = useState("");
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [heure, setHeure] = useState("");
  const [message, setMessage] = useState("");

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
        agent_id: selectedAgent,
        heure,
      });
      setMessage("✅ Rendez-vous confirmé !");
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de la réservation.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-2xl rounded-2xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">Réserver un Rendez-vous</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
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
  );
}