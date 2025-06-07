import React, { useState } from 'react';
import { DashboardKPI, HRInsight } from '../../types/hr';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Award,
  ArrowRight,
  Calendar,
  BarChart3,
  Lightbulb
} from 'lucide-react';

interface DecisionSupportPanelProps {
  insights: HRInsight[];
  kpis: DashboardKPI;
  loading?: boolean;
}

const DecisionSupportPanel: React.FC<DecisionSupportPanelProps> = ({ insights, kpis, loading = false }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'immediate' | 'short' | 'medium' | 'long'>('immediate');

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body animate-pulse">
          <div className="h-8 bg-base-300 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 bg-base-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getActionsByTimeframe = () => {
    const actions = {
      immediate: {
        title: 'Actions Immédiates (0-3 mois)',
        icon: <AlertTriangle className="w-5 h-5 text-error" />,
        color: 'border-error/20 bg-error/5',
        items: [
          {
            title: 'Plan de succession urgent',
            description: `${kpis.nearRetirement} employés proches de la retraite`,
            impact: 'Critique',
            effort: 'Élevé',
            cost: '€€€',
            timeline: '1-2 mois'
          },
          {
            title: 'Rétention des talents clés',
            description: 'Entretiens de rétention pour employés à risque',
            impact: 'Élevé',
            effort: 'Moyen',
            cost: '€€',
            timeline: '2-4 semaines'
          },
          {
            title: 'Transfert de connaissances',
            description: 'Documentation des processus critiques',
            impact: 'Élevé',
            effort: 'Élevé',
            cost: '€€',
            timeline: '6-8 semaines'
          }
        ]
      },
      short: {
        title: 'Court Terme (3-12 mois)',
        icon: <Clock className="w-5 h-5 text-warning" />,
        color: 'border-warning/20 bg-warning/5',
        items: [
          {
            title: 'Programme de développement',
            description: 'Formation des successeurs identifiés',
            impact: 'Élevé',
            effort: 'Moyen',
            cost: '€€€',
            timeline: '6-9 mois'
          },
          {
            title: 'Recrutement stratégique',
            description: 'Embauche pour postes critiques',
            impact: 'Moyen',
            effort: 'Élevé',
            cost: '€€€€',
            timeline: '3-6 mois'
          },
          {
            title: 'Amélioration performance',
            description: 'Plans de développement individuels',
            impact: 'Moyen',
            effort: 'Moyen',
            cost: '€€',
            timeline: '4-8 mois'
          }
        ]
      },
      medium: {
        title: 'Moyen Terme (1-2 ans)',
        icon: <TrendingUp className="w-5 h-5 text-info" />,
        color: 'border-info/20 bg-info/5',
        items: [
          {
            title: 'Stratégie diversité',
            description: 'Amélioration de l\'indice de diversité',
            impact: 'Moyen',
            effort: 'Moyen',
            cost: '€€',
            timeline: '12-18 mois'
          },
          {
            title: 'Culture d\'entreprise',
            description: 'Renforcement de l\'engagement',
            impact: 'Élevé',
            effort: 'Élevé',
            cost: '€€€',
            timeline: '18-24 mois'
          },
          {
            title: 'Digitalisation RH',
            description: 'Modernisation des processus',
            impact: 'Moyen',
            effort: 'Élevé',
            cost: '€€€€',
            timeline: '12-24 mois'
          }
        ]
      },
      long: {
        title: 'Long Terme (2+ ans)',
        icon: <Target className="w-5 h-5 text-success" />,
        color: 'border-success/20 bg-success/5',
        items: [
          {
            title: 'Transformation organisationnelle',
            description: 'Restructuration pour l\'avenir',
            impact: 'Très élevé',
            effort: 'Très élevé',
            cost: '€€€€€',
            timeline: '2-3 ans'
          },
          {
            title: 'Leadership pipeline',
            description: 'Programme de développement leadership',
            impact: 'Élevé',
            effort: 'Élevé',
            cost: '€€€',
            timeline: '2-4 ans'
          },
          {
            title: 'Innovation RH',
            description: 'Nouvelles pratiques et technologies',
            impact: 'Moyen',
            effort: 'Moyen',
            cost: '€€€',
            timeline: '3-5 ans'
          }
        ]
      }
    };

    return actions[selectedTimeframe];
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Très élevé': return 'badge-error';
      case 'Critique': return 'badge-error';
      case 'Élevé': return 'badge-warning';
      case 'Moyen': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'Très élevé': return 'text-error';
      case 'Élevé': return 'text-warning';
      case 'Moyen': return 'text-info';
      default: return 'text-success';
    }
  };

  const currentActions = getActionsByTimeframe();

  const priorityInsights = insights
    .filter(i => i.priority === 'critical' || i.priority === 'high')
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* En-tête du support décisionnel */}
      <div className="card bg-gradient-to-r from-accent to-accent-focus text-accent-content shadow-xl">
        <div className="card-body p-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Support à la Décision</h2>
              <p className="opacity-90">Plans d'action stratégiques basés sur l'analyse IA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur de période */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-6">
          <h3 className="card-title mb-4">Planification Stratégique</h3>
          <div className="tabs tabs-boxed bg-base-200 p-1">
            <button
              onClick={() => setSelectedTimeframe('immediate')}
              className={`tab gap-2 ${selectedTimeframe === 'immediate' ? 'tab-active' : ''}`}
            >
              <AlertTriangle className="w-4 h-4" />
              Immédiat
            </button>
            <button
              onClick={() => setSelectedTimeframe('short')}
              className={`tab gap-2 ${selectedTimeframe === 'short' ? 'tab-active' : ''}`}
            >
              <Clock className="w-4 h-4" />
              Court terme
            </button>
            <button
              onClick={() => setSelectedTimeframe('medium')}
              className={`tab gap-2 ${selectedTimeframe === 'medium' ? 'tab-active' : ''}`}
            >
              <TrendingUp className="w-4 h-4" />
              Moyen terme
            </button>
            <button
              onClick={() => setSelectedTimeframe('long')}
              className={`tab gap-2 ${selectedTimeframe === 'long' ? 'tab-active' : ''}`}
            >
              <Target className="w-4 h-4" />
              Long terme
            </button>
          </div>
        </div>
      </div>

      {/* Plan d'action pour la période sélectionnée */}
      <div className={`card shadow-xl border-2 ${currentActions.color}`}>
        <div className="card-body p-6">
          <div className="flex items-center gap-3 mb-6">
            {currentActions.icon}
            <h3 className="text-xl font-bold">{currentActions.title}</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currentActions.items.map((action, index) => (
              <div key={index} className="card bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-4">
                  <h4 className="font-semibold text-base-content mb-2">{action.title}</h4>
                  <p className="text-sm text-base-content/70 mb-4">{action.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-base-content/60">Impact:</span>
                      <span className={`badge badge-sm ${getImpactColor(action.impact)}`}>
                        {action.impact}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-base-content/60">Effort:</span>
                      <span className={`text-xs font-medium ${getEffortColor(action.effort)}`}>
                        {action.effort}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-base-content/60">Coût:</span>
                      <span className="text-xs font-medium text-warning">
                        {action.cost}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-base-content/60">Délai:</span>
                      <span className="text-xs font-medium text-info">
                        {action.timeline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Matrice de priorisation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI estimé */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">
              <DollarSign className="w-5 h-5 text-success" />
              ROI Estimé des Actions
            </h3>
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                <span className="font-medium">Rétention talents</span>
                <span className="text-success font-bold">+250%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-info/10 rounded-lg">
                <span className="font-medium">Formation succession</span>
                <span className="text-info font-bold">+180%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                <span className="font-medium">Amélioration performance</span>
                <span className="text-warning font-bold">+120%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risques si inaction */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">
              <AlertTriangle className="w-5 h-5 text-error" />
              Risques si Inaction
            </h3>
            <div className="space-y-4 mt-4">
              <div className="alert alert-error">
                <AlertTriangle className="w-4 h-4" />
                <div>
                  <h4 className="font-medium">Perte de connaissances</h4>
                  <p className="text-sm">Départs en retraite non anticipés</p>
                </div>
              </div>
              <div className="alert alert-warning">
                <Clock className="w-4 h-4" />
                <div>
                  <h4 className="font-medium">Baisse de performance</h4>
                  <p className="text-sm">Manque de développement des talents</p>
                </div>
              </div>
              <div className="alert alert-info">
                <Users className="w-4 h-4" />
                <div>
                  <h4 className="font-medium">Turnover accru</h4>
                  <p className="text-sm">Insatisfaction et départs volontaires</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommandations prioritaires basées sur l'IA */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">
            <BarChart3 className="w-5 h-5 text-primary" />
            Recommandations IA Prioritaires
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            {priorityInsights.map((insight, index) => (
              <div key={index} className="card bg-base-200 shadow">
                <div className="card-body p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-1" />
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                  </div>
                  <p className="text-xs text-base-content/70 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`badge badge-sm ${insight.priority === 'critical' ? 'badge-error' : 'badge-warning'}`}>
                      {insight.priority === 'critical' ? 'Critique' : 'Élevé'}
                    </span>
                    <span className="text-xs text-base-content/60">{insight.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionSupportPanel;