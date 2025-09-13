import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  BarChart3
} from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color = 'green',
  subtitle 
}) => {
  const getColorClasses = () => {
    const colors = {
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200',
        iconBg: 'bg-green-100'
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        border: 'border-orange-200',
        iconBg: 'bg-orange-100'
      },
      red: {
        bg: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-200',
        iconBg: 'bg-red-100'
      }
    };
    return colors[color] || colors.green;
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return <TrendingUp className="w-4 h-4" />;
    if (changeType === 'negative') return <TrendingDown className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-600';
    if (changeType === 'negative') return 'text-red-600';
    return 'text-gray-600';
  };

  const colorClasses = getColorClasses();

  return (
    <div className={`${colorClasses.bg} ${colorClasses.border} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorClasses.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${colorClasses.text}`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${getChangeColor()}`}>
            {getChangeIcon()}
            <span>{change}%</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

const StatsGrid = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return Math.round(amount || 0).toLocaleString('fr-FR');
  };

  const formatNumber = (number) => {
    return (number || 0).toLocaleString('fr-FR');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Commandes"
        value={formatNumber(stats.total_commandes)}
        change={stats.total_commandes > 0 ? 12 : 0}
        changeType="positive"
        icon={Package}
        color="blue"
        subtitle="Toutes les commandes"
      />
      
      <StatCard
        title="Chiffre d'Affaires"
        value={`${formatCurrency(stats.chiffre_affaires_total)} FCFA`}
        change={stats.chiffre_affaires_total > 0 ? 8 : 0}
        changeType="positive"
        icon={DollarSign}
        color="green"
        subtitle="Revenus totaux"
      />
      
      <StatCard
        title="Panier Moyen"
        value={`${formatCurrency(stats.panier_moyen)} FCFA`}
        change={stats.panier_moyen > 0 ? 5 : 0}
        changeType="positive"
        icon={BarChart3}
        color="purple"
        subtitle="Montant moyen par commande"
      />
      
      <StatCard
        title="En Attente"
        value={formatNumber(stats.en_attente)}
        change={stats.en_attente > 0 ? -2 : 0}
        changeType={stats.en_attente > 0 ? "negative" : "positive"}
        icon={Clock}
        color="orange"
        subtitle="Commandes à traiter"
      />
    </div>
  );
};

const DetailedStats = ({ stats, isLoading = false }) => {
  const formatNumber = (number) => {
    return (number || 0).toLocaleString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-lg mb-2"></div>
            <div className="w-12 h-6 bg-gray-200 rounded mb-1"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    { key: 'confirmees', label: 'Confirmées', icon: CheckCircle, color: 'blue' },
    { key: 'en_preparation', label: 'En Préparation', icon: Package, color: 'orange' },
    { key: 'prete', label: 'Prêtes', icon: CheckCircle, color: 'purple' },
    { key: 'en_livraison', label: 'En Livraison', icon: Package, color: 'indigo' },
    { key: 'livrees', label: 'Livrées', icon: CheckCircle, color: 'green' },
    { key: 'annulees', label: 'Annulées', icon: AlertCircle, color: 'red' },
    { key: 'retournees', label: 'Retournées', icon: AlertCircle, color: 'gray' },
    { key: 'refusees', label: 'Refusées', icon: AlertCircle, color: 'red' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map(({ key, label, icon: Icon, color }) => (
        <div key={key} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
              <Icon className={`w-4 h-4 text-${color}-600`} />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {formatNumber(stats[key])}
              </div>
              <div className="text-xs text-gray-600">{label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { StatCard, StatsGrid, DetailedStats };
