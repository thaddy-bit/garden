import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LayoutAdmin from "../../components/Admin/Layout_admin";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const COLORS = ["#065f46", "#111827", "#16a34a", "#6b7280"]; // dark green, black, green, gray

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [ventesParMois, setVentesParMois] = useState([]);
  const [ventes30j, setVentes30j] = useState([]);
  const [commandesParStatut, setCommandesParStatut] = useState([]);
  const [categories, setCategories] = useState([]);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/api/dashboard-stats?period=${period}`);
        setStats(res.data.stats);
        setVentesParMois(res.data.ventesParMois);
        setVentes30j(res.data.ventes30j || []);
        setCommandesParStatut(res.data.commandesParStatut || []);
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Erreur lors de la récupération des données du dashboard :", error);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 10000); // actualisation toutes les 10s
    return () => clearInterval(interval);
  }, [period]);

  return (
    <LayoutAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header with period filters */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Période:</span>
            <div className="inline-flex bg-white border border-gray-200 rounded-xl overflow-hidden">
              {['day','week','month'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-2 text-sm font-medium ${period===p ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {p === 'day' ? 'Jour' : p === 'week' ? 'Semaine' : 'Mois'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className={`rounded-2xl shadow-md bg-white border border-gray-100`}>
              <CardContent className="p-5">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className={`mt-1 text-2xl font-bold ${i < 2 ? 'text-green-700' : 'text-gray-900'}`}>
                  {(() => {
                    const title = (stat.title || '').toLowerCase();
                    const val = stat.value;
                    if (typeof val === 'number' && (title.includes('ca') || title.includes('panier'))) {
                      return `${Math.round(val).toLocaleString('fr-FR')} FCFA`;
                    }
                    return typeof val === 'number' ? val.toLocaleString('fr-FR') : String(val || '');
                  })()}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Ventes 30 derniers jours</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ventes30j.length ? ventes30j : ventesParMois}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={ventes30j.length ? 'jour' : 'mois'} />
                  <YAxis tickFormatter={(v)=>Math.round(v).toLocaleString('fr-FR')} />
                  <Tooltip formatter={(v)=>`${Math.round(v).toLocaleString('fr-FR')} FCFA`} />
                  <Line type="monotone" dataKey="ventes" stroke="#065f46" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Replace Pie by horizontal bar chart for readability */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Top sous-catégories (Top 10)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[...categories].sort((a,b)=> (b?.value||0)-(a?.value||0)).slice(0,10)}
                  layout="vertical"
                  margin={{ left: 16, right: 16, top: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v)=>Number(v).toLocaleString('fr-FR')} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v)=>Number(v).toLocaleString('fr-FR')} />
                  <Bar dataKey="value" fill="#16a34a" radius={[6,6,6,6]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Orders by status */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Commandes par statut ({period === 'day' ? 'jour' : period === 'week' ? 'semaine' : 'mois'})</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={commandesParStatut}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="statut" />
                  <YAxis />
                  <Tooltip formatter={(v)=>Number(v).toLocaleString('fr-FR')} />
                  <Bar dataKey="total" fill="#16a34a" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Link 
            href="/Admin/Produits/add-product"
            className="px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            Ajouter un nouveau produit
          </Link>
        </div>
      </div>
    </LayoutAdmin>
  );
}