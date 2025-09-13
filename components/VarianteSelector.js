import { useState, useEffect } from 'react';

export default function VarianteSelector({ 
  variantes = [], 
  onVarianteChange, 
  selectedVariante = null 
}) {
  const [selectedAttributs, setSelectedAttributs] = useState({});
  const [availableVariantes, setAvailableVariantes] = useState(variantes);
  const [currentVariante, setCurrentVariante] = useState(selectedVariante);

  // Grouper les attributs par type
  const attributsByType = variantes.reduce((acc, variante) => {
    variante.attributs?.forEach(attr => {
      if (!acc[attr.type]) {
        acc[attr.type] = new Set();
      }
      acc[attr.type].add(JSON.stringify({
        id: attr.id,
        nom: attr.nom,
        valeur: attr.valeur,
        code_couleur: attr.code_couleur
      }));
    });
    return acc;
  }, {});

  // Convertir les Sets en Arrays
  Object.keys(attributsByType).forEach(type => {
    attributsByType[type] = Array.from(attributsByType[type]).map(item => JSON.parse(item));
  });

  useEffect(() => {
    // Filtrer les variantes disponibles selon les attributs sélectionnés
    const filtered = variantes.filter(variante => {
      return Object.entries(selectedAttributs).every(([type, selectedValue]) => {
        if (!selectedValue) return true;
        return variante.attributs?.some(attr => 
          attr.type === type && attr.valeur === selectedValue
        );
      });
    });
    setAvailableVariantes(filtered);

    // Trouver la variante correspondante
    const matchingVariante = filtered.find(variante => {
      return Object.entries(selectedAttributs).every(([type, selectedValue]) => {
        if (!selectedValue) return true;
        return variante.attributs?.some(attr => 
          attr.type === type && attr.valeur === selectedValue
        );
      });
    });

    if (matchingVariante && matchingVariante.id !== currentVariante?.id) {
      setCurrentVariante(matchingVariante);
      onVarianteChange?.(matchingVariante);
    }
  }, [selectedAttributs, variantes, onVarianteChange, currentVariante]);

  const handleAttributChange = (type, valeur) => {
    setSelectedAttributs(prev => ({
      ...prev,
      [type]: prev[type] === valeur ? null : valeur
    }));
  };

  const isAttributAvailable = (type, valeur) => {
    return availableVariantes.some(variante => 
      variante.attributs?.some(attr => 
        attr.type === type && attr.valeur === valeur
      )
    );
  };

  const isAttributSelected = (type, valeur) => {
    return selectedAttributs[type] === valeur;
  };

  if (variantes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {Object.entries(attributsByType).map(([type, attributs]) => (
        <div key={type}>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            {type === 'couleur' ? 'Couleur' : 
             type === 'taille' ? 'Taille' : 
             type === 'materiau' ? 'Matière' : 
             type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {attributs.map((attr) => {
              const isAvailable = isAttributAvailable(type, attr.valeur);
              const isSelected = isAttributSelected(type, attr.valeur);
              
              return (
                <button
                  key={attr.id}
                  onClick={() => handleAttributChange(type, attr.valeur)}
                  disabled={!isAvailable}
                  className={`
                    px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                    ${isSelected 
                      ? 'border-gray-900 bg-gray-900 text-white' 
                      : isAvailable 
                        ? 'border-gray-300 bg-white text-gray-700 hover:border-gray-400' 
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                    ${type === 'couleur' && attr.code_couleur ? 'flex items-center space-x-2' : ''}
                  `}
                >
                  {type === 'couleur' && attr.code_couleur && (
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: attr.code_couleur }}
                    />
                  )}
                  <span>{attr.valeur}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Informations de la variante sélectionnée */}
      {currentVariante && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Variante sélectionnée:</p>
              <p className="font-medium text-gray-900">
                {Object.values(selectedAttributs).filter(Boolean).join(' - ') || 'Par défaut'}
              </p>
              {currentVariante.sku && (
                <p className="text-xs text-gray-500">SKU: {currentVariante.sku}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Stock:</p>
              <p className={`font-medium ${currentVariante.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentVariante.stock > 0 ? `${currentVariante.stock} disponibles` : 'Rupture de stock'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

