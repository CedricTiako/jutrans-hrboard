import React from 'react';
import { Clock, AlertTriangle, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RetirementRiskProps {
  data: {
    nearRetirement: number;
    veryNearRetirement: number;
    riskByPosition: Record<string, {
      total: number;
      nearRetirement: number;
      veryNearRetirement: number;
      riskLevel: 'low' | 'medium' | 'high';
    }>;
  };
  loading: boolean;
}

export const RetirementRisk: React.FC<RetirementRiskProps> = ({ data, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const highRiskPositions = Object.entries(data.riskByPosition)
    .filter(([, risk]) => risk.riskLevel === 'high')
    .sort(([,a], [,b]) => b.nearRetirement - a.nearRetirement);

  const mediumRiskPositions = Object.entries(data.riskByPosition)
    .filter(([, risk]) => risk.riskLevel === 'medium')
    .sort(([,a], [,b]) => b.nearRetirement - a.nearRetirement);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Clock className="w-5 h-5 text-orange-500 mr-2" />
          Risque de Départ en Retraite
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-500 mr-3" />
            <div>
              <p className="text-sm text-orange-600">Proches retraite (55+)</p>
              <p className="text-2xl font-bold text-orange-700">{data.nearRetirement}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-red-600">Très proches (60+)</p>
              <p className="text-2xl font-bold text-red-700">{data.veryNearRetirement}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {highRiskPositions.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-red-700 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Postes à Risque Élevé
            </h4>
            <div className="space-y-2">
              {highRiskPositions.map(([position, risk]) => (
                <div key={position} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{position}</span>
                    <p className="text-xs text-gray-500">
                      {risk.nearRetirement}/{risk.total} employés proches de la retraite
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getRiskColor(risk.riskLevel)}`}>
                      {getRiskIcon(risk.riskLevel)}
                      <span className="ml-1">{Math.round((risk.nearRetirement / risk.total) * 100)}%</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mediumRiskPositions.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-orange-700 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Postes à Risque Modéré
            </h4>
            <div className="space-y-2">
              {mediumRiskPositions.slice(0, 3).map(([position, risk]) => (
                <div key={position} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{position}</span>
                    <p className="text-xs text-gray-500">
                      {risk.nearRetirement}/{risk.total} employés proches de la retraite
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getRiskColor(risk.riskLevel)}`}>
                      {getRiskIcon(risk.riskLevel)}
                      <span className="ml-1">{Math.round((risk.nearRetirement / risk.total) * 100)}%</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {highRiskPositions.length === 0 && mediumRiskPositions.length === 0 && (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Risque faible</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun poste ne présente de risque élevé de départ en retraite.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};