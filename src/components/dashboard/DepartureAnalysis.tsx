import React from 'react';
import { TrendingDown, Users, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DepartureAnalysisProps {
  data: {
    total: number;
    byPosition: Record<string, number>;
    byAge: {
      retirement: number;
      young: number;
      midCareer: number;
    };
  };
  loading: boolean;
}

export const DepartureAnalysis: React.FC<DepartureAnalysisProps> = ({ data, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const topDeparturePositions = Object.entries(data.byPosition)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
          Analyse des Départs
        </h3>
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          {data.total} départs
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-red-600">Départs retraite</p>
              <p className="text-2xl font-bold text-red-700">{data.byAge.retirement}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-orange-500 mr-3" />
            <div>
              <p className="text-sm text-orange-600">Départs jeunes</p>
              <p className="text-2xl font-bold text-orange-700">{data.byAge.young}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-yellow-600">Autres départs</p>
              <p className="text-2xl font-bold text-yellow-700">{data.byAge.midCareer}</p>
            </div>
          </div>
        </div>
      </div>

      {topDeparturePositions.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Postes les plus touchés</h4>
          <div className="space-y-2">
            {topDeparturePositions.map(([position, count]) => (
              <div key={position} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{position}</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  {count} départ{count > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.total === 0 && (
        <div className="text-center py-8">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun départ enregistré</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun départ n'a été identifié pour cette période.
          </p>
        </div>
      )}
    </div>
  );
};