import { 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';

const StatusWorkflowVisualizer = ({ currentStatus, availableStatuses = [] }) => {
  const statusSteps = [
    { key: 'en_attente', label: 'En attente', icon: Clock, color: 'yellow' },
    { key: 'confirmee', label: 'Confirmée', icon: CheckCircle, color: 'blue' },
    { key: 'en_preparation', label: 'En préparation', icon: Package, color: 'orange' },
    { key: 'prete', label: 'Prête', icon: CheckCircle, color: 'purple' },
    { key: 'en_livraison', label: 'En livraison', icon: Truck, color: 'indigo' },
    { key: 'livree', label: 'Livrée', icon: CheckCircle, color: 'green' }
  ];

  const getStepIndex = (status) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow de la commande</h3>
      
      <div className="flex items-center justify-between relative">
        {/* Ligne de progression */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
          <div 
            className="h-0.5 bg-green-600 transition-all duration-500"
            style={{ 
              width: `${currentIndex >= 0 ? ((currentIndex + 1) / statusSteps.length) * 100 : 0}%` 
            }}
          />
        </div>

        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === currentStatus;
          const isCompleted = index < currentIndex;
          const isAvailable = availableStatuses.some(s => s.value === step.key);
          
          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${isActive 
                  ? `bg-${step.color}-100 border-${step.color}-500 text-${step.color}-600` 
                  : isCompleted 
                    ? 'bg-green-100 border-green-500 text-green-600' 
                    : isAvailable
                      ? `bg-gray-100 border-gray-300 text-gray-600 hover:bg-${step.color}-50`
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                }
              `}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium ${
                  isActive ? `text-${step.color}-600` : 
                  isCompleted ? 'text-green-600' : 
                  isAvailable ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
                {isActive && (
                  <div className="w-2 h-2 bg-green-600 rounded-full mx-auto mt-1 animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Statuts spéciaux */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center gap-6">
          {availableStatuses.some(s => s.value === 'annulee') && (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Annulation possible</span>
            </div>
          )}
          {availableStatuses.some(s => s.value === 'retournee') && (
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Retour possible</span>
            </div>
          )}
        </div>
      </div>

      {/* Informations sur le statut actuel */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Statut actuel :</strong> {statusSteps.find(s => s.key === currentStatus)?.label || currentStatus}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {availableStatuses.length > 0 
            ? `${availableStatuses.length} transition${availableStatuses.length > 1 ? 's' : ''} possible${availableStatuses.length > 1 ? 's' : ''}`
            : 'Aucune transition possible'
          }
        </p>
      </div>
    </div>
  );
};

export default StatusWorkflowVisualizer;
