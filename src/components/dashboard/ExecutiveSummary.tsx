import React from 'react';
import { DashboardKPI, HRInsight } from '../../types/hr';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Users,
  Award,
  Shield,
  Clock,
  Zap
} from 'lucide-react';

interface ExecutiveSummaryProps {
  kpis: DashboardKPI;
  insights: HRInsight[];
  stats: any;
  loading?: boolean;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ kpis, insights, stats, loading = false }) => {
  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body animate-pulse">
          <div className="h-8 bg-base-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-base-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const criticalInsights = insights.filter(i => i.priority === 'critical');
  const highInsights = insights.filter(i => i.priority === 'high');
  
  const getOverallHealthScore = () => {
    let score = 100;
    
    // Pénalités basées sur les insights critiques
    score -= criticalInsights.length * 15;
    score -= highInsights.length * 8;
    
    // Bonus basés sur les KPIs
    if (kpis.retentionRate >= 85) score += 5;
    if (kpis.performanceIndex >= 80) score += 5;
    if (kpis.diversityIndex >= 70) score += 3;
    
    return Math.max(0, Math.min(100, score));
  };

  const healthScore = getOverallHealthScore();
  
  const getHealthStatus = () => {
    if (healthScore >= 85) return { status: 'Excellent', color: 'text-success', icon: <CheckCircle className="w-5 h-5" /> };
    if (healthScore >= 70) return { status: 'Bon', color: 'text-info', icon: <Target className="w-5 h-5" /> };
    if (healthScore >= 55) return { status: 'Moyen', color: 'text-warning', icon: <AlertTriangle className="w-5 h-5" /> };
    return { status: 'Critique', color: 'text-error', icon: <AlertTriangle className="w-5 h-5" /> };
  };

  const health = getHealthStatus();

  const keyMetrics = [
    {
      title: 'Effectif & Structure',
      metrics: [
        { label: 'Effectif total', value: kpis.totalEmployees, trend: 'stable' },
        { label: 'Âge moyen', value: `${kpis.avgAge} ans`, trend: 'stable' },
        { label: 'Ancienneté moyenne', value: `${kpis.avgTenure} ans`, trend: 'up' },
      ],
      icon: <Users className="w-6 h-6 text-primary" />,
      color: 'border-primary/20 bg-primary/5'
    },
    {
      title: 'Performance & Talent',
      metrics: [
        { label: 'Performance globale', value: `${kpis.performanceIndex}%`, trend: kpis.performanceIndex >= 75 ? 'up' : 'down' },
        { label: 'Taux de rétention', value: `${kpis.retentionRate}%`, trend: kpis.retentionRate >= 80 ? 'up' : 'down' },
        { label: 'Hauts performeurs', value: `${stats.highPerformers}`, trend: 'up' },
      ],
      icon: <Award className="w-6 h-6 text-success" />,
      color: 'border-success/20 bg-success/5'
    },
    {
      title: 'Diversité & Inclusion',
      metrics: [
        { label: 'Indice diversité', value: `${kpis.diversityIndex}%`, trend: kpis.diversityIndex >= 70 ? 'up' : 'stable' },
        { label: 'Équilibre H/F', value: `${Math.round((kpis.genderRatio.female / (kpis.genderRatio.male + kpis.genderRatio.female)) * 100)}%F`, trend: 'stable' },
        { label: 'Score inclusion', value: `${stats.avgInclusionScore}%`, trend: 'up' },
      ],
      icon: <Zap className="w-6 h-6 text-secondary" />,
      color: 'border-secondary/20 bg-secondary/5'
    },
    {
      title: 'Risques & Alertes',
      metrics: [
        { label: 'Risque retraite', value: kpis.nearRetirement, trend: kpis.nearRetirement > 5 ? 'down' : 'stable' },
        { label: 'Risque turnover', value: stats.highTurnoverRisk, trend: stats.highTurnoverRisk > 3 ? 'down' : 'up' },
        { label: 'Postes critiques', value: stats.highRetirementRisk, trend: 'stable' },
      ],
      icon: <Shield className="w-6 h-6 text-warning" />,
      color: 'border-warning/20 bg-warning/5'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-error" />;
      default: return <div className="w-4 h-4 rounded-full bg-base-300"></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête du résumé exécutif */}
      <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-2xl">
        <div className="card-body p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Résumé Exécutif RH</h2>
              <p className="text-lg opacity-90">
                Vue d'ensemble stratégique de votre capital humain
              </p>
            </div>
            <div className="text-center">
              <div className="radial-progress text-primary-content bg-primary-content/20" 
                   style={{"--value": healthScore, "--size": "6rem", "--thickness": "8px"} as React.CSSProperties}>
                <span className="text-xl font-bold">{healthScore}%</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                {health.icon}
                <span className="font-medium">{health.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {keyMetrics.map((section, index) => (
          <div key={index} className={`card shadow-lg border-2 ${section.color}`}>
            <div className="card-body p-6">
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h3 className="font-semibold text-base-content">{section.title}</h3>
              </div>
              <div className="space-y-3">
                {section.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="flex items-center justify-between">
                    <span className="text-sm text-base-content/70">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{metric.value}</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alertes et recommandations prioritaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes critiques */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-error">
              <AlertTriangle className="w-5 h-5" />
              Alertes Critiques
            </h3>
            {criticalInsights.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                <p className="text-success font-medium">Aucune alerte critique</p>
                <p className="text-sm text-base-content/60">Situation RH stable</p>
              </div>
            ) : (
              <div className="space-y-3">
                {criticalInsights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="alert alert-error">
                    <AlertTriangle className="w-4 h-4" />
                    <div>
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm opacity-80">{insight.timeline}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Opportunités */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-success">
              <TrendingUp className="w-5 h-5" />
              Opportunités Identifiées
            </h3>
            <div className="space-y-3">
              <div className="stat">
                <div className="stat-title">Candidats prêts pour promotion</div>
                <div className="stat-value text-2xl text-success">{stats.readyForPromotion}</div>
                <div className="stat-desc">Talents internes identifiés</div>
              </div>
              <div className="stat">
                <div className="stat-title">Experts disponibles</div>
                <div className="stat-value text-2xl text-info">{stats.expertLevel}</div>
                <div className="stat-desc">Niveau expert/avancé</div>
              </div>
              <div className="stat">
                <div className="stat-title">Pipeline succession</div>
                <div className="stat-value text-2xl text-secondary">{stats.successorsPipeline}</div>
                <div className="stat-desc">Successeurs identifiés</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Synthèse stratégique */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">
            <Target className="w-5 h-5 text-primary" />
            Synthèse Stratégique
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="text-center">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="stat-title">Actions Immédiates</div>
                <div className="stat-value text-primary">{criticalInsights.length}</div>
                <div className="stat-desc">Priorité critique</div>
              </div>
            </div>
            <div className="text-center">
              <div className="stat">
                <div className="stat-figure text-warning">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="stat-title">Actions Importantes</div>
                <div className="stat-value text-warning">{highInsights.length}</div>
                <div className="stat-desc">Priorité élevée</div>
              </div>
            </div>
            <div className="text-center">
              <div className="stat">
                <div className="stat-figure text-success">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div className="stat-title">Opportunités</div>
                <div className="stat-value text-success">{insights.filter(i => i.type === 'opportunity').length}</div>
                <div className="stat-desc">À saisir</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;