import React from 'react';
import { UserPlus, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RecruitmentNeedsProps {
  data: {
    byPosition: Record<string, {
      immediate: number;
      shortTerm: number;
      mediumTerm: number;
      priority: 'high' | 'medium' | 'low';
      reasons: string[];
    }>;
    summary: {
      immediate: number;
      shortTerm: number;
      mediumTerm: number;
      highPriority: number;
    };
  };
  loading: boolean;
}

export const RecruitmentNeeds: React.FC<RecruitmentNeedsProps> = ({ data, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const sortedPositions = Object.entries(data.byPosition)
    .sort(([,a], [,b]) => {
      // Trier par priorité puis par besoins immédiats
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return (b.immediate + b.shortTerm) - (a.immediate + a.shortTerm);
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700';
      case 'medium': return 'text-orange-700';
      default: return 'text-blue-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <UserPlus className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <UserPlus className="w-5 h-5 text-blue-500 mr-2" />
          Besoins de Recrutement
        </h3>
      </div>

      {/* Résumé des besoins */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
            <div>
              <p className="text-sm text-red-600">Immédiat</p>
              <p className="text-xl font-bold text-red-700">{data.summary.immediate}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-6 h-6 text-orange-500 mr-2" />
            <div>
              <p className="text-sm text-orange-600">Court terme</p>
              <p className="text-xl font-bold text-orange-700">{data.summary.shortTerm}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-blue-600">Moyen terme</p>
              <p className="text-xl font-bold text-blue-700">{data.summary.mediumTerm}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-purple-500 mr-2" />
            <div>
              <p className="text-sm text-purple-600">Priorité haute</p>
              <p className="text-xl font-bold text-purple-700">{data.summary.highPriority}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Détail par poste */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedPositions.map(([position, needs]) => {
          const totalNeeds = needs.immediate + needs.shortTerm + needs.mediumTerm;
          if (totalNeeds === 0) return null;

          return (
            <div key={position} className={`p-4 rounded-lg border ${getPriorityColor(needs.priority)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {getPriorityIcon(needs.priority)}
                  <h4 className="ml-2 font-medium text-gray-900">{position}</h4>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityTextColor(needs.priority)}`}>
                  Priorité {needs.priority === 'high' ? 'Haute' : needs.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                {needs.immediate > 0 && (
                  <div className="bg-white bg-opacity-70 p-2 rounded">
                    <span className="text-gray-600">Immédiat:</span>
                    <span className="ml-1 font-bold text-red-600">{needs.immediate}</span>
                  </div>
                )}
                {needs.shortTerm > 0 && (
                  <div className="bg-white bg-opacity-70 p-2 rounded">
                    <span className="text-gray-600">1-2 ans:</span>
                    <span className="ml-1 font-bold text-orange-600">{needs.shortTerm}</span>
                  </div>
                )}
                {needs.mediumTerm > 0 && (
                  <div className="bg-white bg-opacity-70 p-2 rounded">
                    <span className="text-gray-600">3-5 ans:</span>
                    <span className="ml-1 font-bold text-blue-600">{needs.mediumTerm}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Raisons:</p>
                <div className="flex flex-wrap gap-1">
                  {needs.reasons.map((reason, index) => (
                    <span key={index} className="bg-white bg-opacity-70 text-gray-700 px-2 py-1 rounded text-xs">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedPositions.length === 0 && (
        <div className="text-center py-8">
          <UserPlus className="mx-auto h-12 w-12 text-green-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun besoin identifié</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun besoin de recrutement urgent n'a été identifié.
          </p>
        </div>
      )}
    </div>
  );
};