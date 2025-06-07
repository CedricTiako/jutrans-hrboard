import React from 'react';
import { HRInsight } from '../../types/hr';
import { 
  AlertTriangle, 
  TrendingUp, 
  Lightbulb, 
  Bell,
  Clock,
  Target,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface HRInsightsPanelProps {
  insights: HRInsight[];
  loading?: boolean;
}

const HRInsightsPanel: React.FC<HRInsightsPanelProps> = ({ insights, loading = false }) => {
  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-base-300 rounded animate-pulse"></div>
            <div className="h-6 bg-base-300 rounded w-48 animate-pulse"></div>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border border-base-300 rounded-lg mb-4 animate-pulse">
              <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-base-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-base-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'risk': return <AlertTriangle className="w-5 h-5 text-error" />;
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-success" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-warning" />;
      case 'alert': return <Bell className="w-5 h-5 text-info" />;
      default: return <Target className="w-5 h-5 text-primary" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      critical: 'badge-error',
      high: 'badge-warning',
      medium: 'badge-info',
      low: 'badge-success'
    };
    return badges[priority] || 'badge-neutral';
  };

  const getPriorityText = (priority: string) => {
    const texts = {
      critical: 'Critique',
      high: 'Élevée',
      medium: 'Moyenne',
      low: 'Faible'
    };
    return texts[priority] || priority;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-header bg-gradient-to-r from-primary to-secondary text-primary-content p-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6" />
          <div>
            <h3 className="text-xl font-bold">Insights IA & Recommandations</h3>
            <p className="text-sm opacity-90">
              {insights.length} insight(s) identifié(s) par l'analyse intelligente
            </p>
          </div>
        </div>
      </div>

      <div className="card-body p-6">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-success mb-4" />
            <h3 className="text-lg font-medium text-base-content mb-2">
              Aucun problème critique détecté
            </h3>
            <p className="text-base-content/70">
              Votre organisation présente un profil RH équilibré selon nos analyses.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="border border-base-300 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {/* En-tête de l'insight */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div>
                      <h4 className="font-semibold text-base-content mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-base-content/70">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`badge ${getPriorityBadge(insight.priority)}`}>
                      Priorité {getPriorityText(insight.priority)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-base-content/60">
                      <Clock className="w-3 h-3" />
                      {insight.timeline}
                    </div>
                  </div>
                </div>

                {/* Impact */}
                <div className="mb-4 p-3 bg-base-200 rounded-lg">
                  <h5 className="font-medium text-sm text-base-content mb-1">
                    Impact potentiel:
                  </h5>
                  <p className="text-sm text-base-content/80">
                    {insight.impact}
                  </p>
                </div>

                {/* Actions recommandées */}
                <div className="mb-4">
                  <h5 className="font-medium text-sm text-base-content mb-2">
                    Actions recommandées:
                  </h5>
                  <ul className="space-y-2">
                    {insight.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-base-content/80">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* KPIs de suivi */}
                <div className="border-t border-base-300 pt-3">
                  <h5 className="font-medium text-sm text-base-content mb-2">
                    KPIs de suivi:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {insight.kpis.map((kpi, kpiIndex) => (
                      <span
                        key={kpiIndex}
                        className="badge badge-outline badge-sm"
                      >
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRInsightsPanel;