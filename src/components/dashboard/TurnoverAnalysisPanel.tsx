import React from 'react';
import { TurnoverAnalysis } from '../../types/hr';
import { 
  TrendingDown, 
  AlertCircle, 
  Users, 
  BarChart3, 
  Building, 
  Calendar, 
  Clock,
  CheckCircle,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

interface TurnoverAnalysisPanelProps {
  data: TurnoverAnalysis;
  loading?: boolean;
}

const TurnoverAnalysisPanel: React.FC<TurnoverAnalysisPanelProps> = ({ data, loading = false }) => {
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

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'text-error';
    if (risk >= 50) return 'text-warning';
    if (risk >= 30) return 'text-info';
    return 'text-success';
  };

  const getRiskBgColor = (risk: number) => {
    if (risk >= 70) return 'bg-error/10';
    if (risk >= 50) return 'bg-warning/10';
    if (risk >= 30) return 'bg-info/10';
    return 'bg-success/10';
  };

  const getTopRiskDepartments = () => {
    return Object.entries(data.departmentRisks)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  const getTopRiskAgeGroups = () => {
    return Object.entries(data.ageGroupRisks)
      .filter(([, value]) => value > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  return (
    <div className="space-y-6">
      {/* En-tête du panel */}
      <div className="card bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-xl">
        <div className="card-body p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Analyse du Turnover</h2>
                <p className="opacity-90">Analyse prédictive des risques de départ</p>
              </div>
            </div>
            <div className="text-center">
              <div className="radial-progress text-white bg-white/20" 
                   style={{"--value": data.turnoverRiskIndex, "--size": "5rem", "--thickness": "8px"} as React.CSSProperties}>
                <span className="text-xl font-bold">{data.turnoverRiskIndex}%</span>
              </div>
              <div className="mt-1 text-sm">Indice de risque</div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateurs clés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-error/20">
                <TrendingDown className="w-6 h-6 text-error" />
              </div>
              <div>
                <div className="text-sm text-base-content/70">Taux de turnover estimé</div>
                <div className="text-2xl font-bold">{data.turnoverRate}%</div>
                <div className="text-xs text-base-content/60">
                  {data.turnoverRate < 10 ? 'Faible' : 
                   data.turnoverRate < 15 ? 'Modéré' : 
                   data.turnoverRate < 20 ? 'Élevé' : 'Critique'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-warning/20">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-sm text-base-content/70">Employés à risque élevé</div>
                <div className="text-2xl font-bold">{data.highRiskEmployees}</div>
                <div className="text-xs text-base-content/60">
                  {Math.round((data.highRiskEmployees / (data.highRiskEmployees + 1)) * 100)}% de l'effectif
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-info/20">
                <Building className="w-6 h-6 text-info" />
              </div>
              <div>
                <div className="text-sm text-base-content/70">Département à plus haut risque</div>
                <div className="text-2xl font-bold">
                  {getTopRiskDepartments()[0]?.[0] || 'N/A'}
                </div>
                <div className="text-xs text-base-content/60">
                  Indice: {Math.round(getTopRiskDepartments()[0]?.[1] || 0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analyse détaillée */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risques par département */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6">
            <h3 className="card-title flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Risques par Département
            </h3>
            <div className="space-y-4 mt-4">
              {Object.entries(data.departmentRisks)
                .sort(([, a], [, b]) => b - a)
                .map(([dept, risk], index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{dept}</span>
                      <span className={`text-sm font-medium ${getRiskColor(risk)}`}>
                        {Math.round(risk)}%
                      </span>
                    </div>
                    <div className="w-full bg-base-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getRiskBgColor(risk)}`} 
                        style={{ width: `${risk}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Risques par tranche d'âge */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6">
            <h3 className="card-title flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              Risques par Tranche d'Âge
            </h3>
            <div className="space-y-4 mt-4">
              {Object.entries(data.ageGroupRisks)
                .filter(([, value]) => value > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([ageGroup, risk], index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{ageGroup} ans</span>
                      <span className={`text-sm font-medium ${getRiskColor(risk)}`}>
                        {Math.round(risk)}%
                      </span>
                    </div>
                    <div className="w-full bg-base-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getRiskBgColor(risk)}`} 
                        style={{ width: `${risk}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Facteurs de risque et recommandations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facteurs de risque */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6">
            <h3 className="card-title flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-error" />
              Facteurs de Risque Identifiés
            </h3>
            <div className="space-y-3 mt-4">
              {data.riskFactors.length > 0 ? (
                data.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-error/5 rounded-lg border border-error/20">
                    <AlertCircle className="w-5 h-5 text-error mt-0.5" />
                    <span>{factor}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                    <p className="text-base-content/70">Aucun facteur de risque majeur identifié</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommandations */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6">
            <h3 className="card-title flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" />
              Recommandations
            </h3>
            <div className="space-y-3 mt-4">
              {data.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-primary mt-0.5" />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Risques par ancienneté */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6">
          <h3 className="card-title flex items-center gap-2">
            <Clock className="w-5 h-5 text-info" />
            Risques par Ancienneté
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            {Object.entries(data.tenureGroupRisks)
              .filter(([, value]) => value > 0)
              .map(([tenureGroup, risk], index) => (
                <div key={index} className={`card ${getRiskBgColor(risk)} border border-base-300`}>
                  <div className="card-body p-4">
                    <h4 className="text-center font-medium">{tenureGroup} ans</h4>
                    <div className="text-center text-2xl font-bold mt-2 mb-1">
                      <span className={getRiskColor(risk)}>{Math.round(risk)}%</span>
                    </div>
                    <div className="text-center text-xs">
                      {risk >= 70 ? 'Risque critique' : 
                       risk >= 50 ? 'Risque élevé' : 
                       risk >= 30 ? 'Risque modéré' : 'Risque faible'}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6">
          <h3 className="card-title flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Conclusion et Impact Financier
          </h3>
          <div className="mt-4">
            <p className="mb-4">
              L'analyse du turnover révèle un indice de risque global de <span className={`font-bold ${getRiskColor(data.turnoverRiskIndex)}`}>{data.turnoverRiskIndex}%</span>, 
              ce qui indique un niveau de risque {data.turnoverRiskIndex >= 70 ? 'critique' : data.turnoverRiskIndex >= 50 ? 'élevé' : data.turnoverRiskIndex >= 30 ? 'modéré' : 'faible'}.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card bg-base-200 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Impact Financier Estimé</h4>
                <p className="text-sm mb-2">
                  Le coût moyen de remplacement d'un employé est estimé entre 50% et 200% de son salaire annuel, incluant:
                </p>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Coûts de recrutement et sélection</li>
                  <li>Formation et intégration</li>
                  <li>Perte de productivité pendant la transition</li>
                  <li>Impact sur le moral et la charge de travail des équipes</li>
                </ul>
              </div>
              
              <div className="card bg-base-200 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Prochaines Étapes Recommandées</h4>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Réaliser une enquête d'engagement auprès des employés</li>
                  <li>Analyser les entretiens de départ des 12 derniers mois</li>
                  <li>Mettre en place un plan d'action ciblé pour les départements à risque</li>
                  <li>Revoir la politique de rémunération et d'avantages sociaux</li>
                  <li>Développer des parcours de carrière clairs et attractifs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnoverAnalysisPanel;