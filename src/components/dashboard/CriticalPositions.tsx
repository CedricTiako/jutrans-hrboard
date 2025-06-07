import React from 'react';
import { AlertTriangle, Users, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CriticalPositionsProps {
  data: Array<{
    position: string;
    count: number;
    avgAge: number;
    avgTenure: number;
    nearRetirement: number;
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
  }>;
  loading: boolean;
}

export const CriticalPositions: React.FC<CriticalPositionsProps> = ({ data, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const highRiskPositions = data.filter(pos => pos.riskLevel === 'high');
  const mediumRiskPositions = data.filter(pos => pos.riskLevel === 'medium');
  const lowRiskPositions = data.filter(pos => pos.riskLevel === 'low');

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      default: return 'border-green-200 bg-green-50';
    }
  };

  const getRiskTextColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-700';
      case 'medium': return 'text-orange-700';
      default: return 'text-green-700';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <Users className="w-5 h-5 text-orange-500" />;
      default: return <Shield className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
          Postes Critiques
        </h3>
        <div className="flex space-x-2">
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            {highRiskPositions.length} Élevé
          </span>
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
            {mediumRiskPositions.length} Modéré
          </span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {/* Postes à risque élevé */}
        {highRiskPositions.map((position) => (
          <div key={position.position} className={`p-4 rounded-lg border-2 ${getRiskColor(position.riskLevel)}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                {getRiskIcon(position.riskLevel)}
                <h4 className="ml-2 font-medium text-gray-900">{position.position}</h4>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskTextColor(position.riskLevel)}`}>
                Risque {position.riskLevel === 'high' ? 'Élevé' : position.riskLevel === 'medium' ? 'Modéré' : 'Faible'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
              <div>
                <span className="text-gray-500">Effectif:</span>
                <span className="ml-1 font-medium">{position.count}</span>
              </div>
              <div>
                <span className="text-gray-500">Âge moyen:</span>
                <span className="ml-1 font-medium">{position.avgAge} ans</span>
              </div>
              <div>
                <span className="text-gray-500">Ancienneté:</span>
                <span className="ml-1 font-medium">{position.avgTenure} ans</span>
              </div>
              <div>
                <span className="text-gray-500">Proche retraite:</span>
                <span className="ml-1 font-medium">{position.nearRetirement}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {position.riskFactors.map((factor, index) => (
                <span key={index} className="bg-white bg-opacity-70 text-gray-700 px-2 py-1 rounded text-xs">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Postes à risque modéré */}
        {mediumRiskPositions.slice(0, 3).map((position) => (
          <div key={position.position} className={`p-4 rounded-lg border ${getRiskColor(position.riskLevel)}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                {getRiskIcon(position.riskLevel)}
                <h4 className="ml-2 font-medium text-gray-900">{position.position}</h4>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskTextColor(position.riskLevel)}`}>
                Risque Modéré
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
              <div>
                <span className="text-gray-500">Effectif:</span>
                <span className="ml-1 font-medium">{position.count}</span>
              </div>
              <div>
                <span className="text-gray-500">Âge moyen:</span>
                <span className="ml-1 font-medium">{position.avgAge} ans</span>
              </div>
              <div>
                <span className="text-gray-500">Ancienneté:</span>
                <span className="ml-1 font-medium">{position.avgTenure} ans</span>
              </div>
              <div>
                <span className="text-gray-500">Proche retraite:</span>
                <span className="ml-1 font-medium">{position.nearRetirement}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {position.riskFactors.map((factor, index) => (
                <span key={index} className="bg-white bg-opacity-70 text-gray-700 px-2 py-1 rounded text-xs">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8">
          <Shield className="mx-auto h-12 w-12 text-green-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun poste critique</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tous les postes présentent un niveau de risque acceptable.
          </p>
        </div>
      )}

      {mediumRiskPositions.length > 3 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            ... et {mediumRiskPositions.length - 3} autre(s) poste(s) à risque modéré
          </p>
        </div>
      )}
    </div>
  );
};