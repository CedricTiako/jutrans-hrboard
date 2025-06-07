import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSupabaseAppContext } from '../context/SupabaseAppContext';
import { DepartureAnalysis } from '../components/dashboard/DepartureAnalysis';
import { RetirementRisk } from '../components/dashboard/RetirementRisk';
import { CriticalPositions } from '../components/dashboard/CriticalPositions';
import { RecruitmentNeeds } from '../components/dashboard/RecruitmentNeeds';
import ExportableChart from '../components/charts/ExportableChart';
import ExportableTable from '../components/tables/ExportableTable';
import { AlertTriangle, TrendingDown, Clock, UserPlus, Truck } from 'lucide-react';

const RiskAnalysis: React.FC = () => {
  const { t } = useTranslation();
  const { 
    year,
    loading,
    departures,
    retirementRisk,
    criticalPositions,
    recruitmentNeeds
  } = useSupabaseAppContext();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* En-tête JUTRANS */}
      <div className="card bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-xl">
        <div className="card-body p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">JUTRANS SARL</h1>
                <h2 className="text-xl opacity-90">Analyse des Risques RH</h2>
                <p className="opacity-80">
                  Identification des risques et opportunités de recrutement pour {year}
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="stat">
                <div className="stat-title text-white/80">Niveau de Risque Global</div>
                <div className="stat-value text-2xl">
                  {departures.total > 5 ? 'ÉLEVÉ' : departures.total > 2 ? 'MODÉRÉ' : 'FAIBLE'}
                </div>
                <div className="stat-desc text-white/70">Basé sur les analyses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateurs de risque */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <TrendingDown className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">Départs totaux</p>
                <p className="text-2xl font-bold">{departures.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">Proches retraite</p>
                <p className="text-2xl font-bold">{retirementRisk.nearRetirement}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">Postes critiques</p>
                <p className="text-2xl font-bold">
                  {criticalPositions.filter(p => p.riskLevel === 'high').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <UserPlus className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">Besoins immédiats</p>
                <p className="text-2xl font-bold">{recruitmentNeeds.summary.immediate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analyse des départs et risques de retraite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExportableChart
          title={`JUTRANS SARL - Analyse des Départs - ${year}`}
          filename={`jutrans-analyse-departs-${year}`}
          data={Object.entries(departures.byPosition).map(([poste, nombre]) => ({
            'Poste': poste,
            'Départs': nombre
          }))}
          headers={['Poste', 'Départs']}
        >
          <DepartureAnalysis 
            data={departures} 
            loading={loading} 
          />
        </ExportableChart>

        <ExportableChart
          title={`JUTRANS SARL - Risques de Retraite - ${year}`}
          filename={`jutrans-risques-retraite-${year}`}
          data={Object.entries(retirementRisk.riskByPosition).map(([poste, risk]: [string, any]) => ({
            'Poste': poste,
            'Employés proches retraite': risk.nearRetirement,
            'Niveau de risque': risk.riskLevel
          }))}
          headers={['Poste', 'Employés proches retraite', 'Niveau de risque']}
        >
          <RetirementRisk 
            data={retirementRisk} 
            loading={loading} 
          />
        </ExportableChart>
      </div>

      {/* Postes critiques */}
      <ExportableChart
        title={`JUTRANS SARL - Postes Critiques - ${year}`}
        filename={`jutrans-postes-critiques-${year}`}
        data={criticalPositions.map(pos => ({
          'Poste': pos.position,
          'Effectif': pos.count,
          'Âge moyen': pos.avgAge,
          'Ancienneté moyenne': pos.avgTenure,
          'Proches retraite': pos.nearRetirement,
          'Niveau de risque': pos.riskLevel,
          'Facteurs de risque': pos.riskFactors.join(', ')
        }))}
        headers={['Poste', 'Effectif', 'Âge moyen', 'Ancienneté moyenne', 'Proches retraite', 'Niveau de risque', 'Facteurs de risque']}
      >
        <CriticalPositions 
          data={criticalPositions} 
          loading={loading} 
        />
      </ExportableChart>

      {/* Besoins de recrutement */}
      <ExportableChart
        title={`JUTRANS SARL - Besoins de Recrutement - ${year}`}
        filename={`jutrans-besoins-recrutement-${year}`}
        data={Object.entries(recruitmentNeeds.byPosition).map(([poste, besoins]: [string, any]) => ({
          'Poste': poste,
          'Besoins immédiats': besoins.immediate,
          'Court terme': besoins.shortTerm,
          'Moyen terme': besoins.mediumTerm,
          'Priorité': besoins.priority,
          'Raisons': besoins.reasons.join(', ')
        }))}
        headers={['Poste', 'Besoins immédiats', 'Court terme', 'Moyen terme', 'Priorité', 'Raisons']}
      >
        <RecruitmentNeeds 
          data={recruitmentNeeds} 
          loading={loading} 
        />
      </ExportableChart>

      {/* Recommandations stratégiques */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
            Recommandations Stratégiques JUTRANS
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Actions Immédiates</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Lancer le recrutement pour {recruitmentNeeds.summary.immediate} postes identifiés comme besoins immédiats
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Mettre en place un plan de succession pour les postes critiques à risque élevé
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Organiser le transfert de connaissances pour les employés proches de la retraite
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Anticiper les besoins spécifiques du secteur transport et logistique
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Planification à Moyen Terme</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Préparer {recruitmentNeeds.summary.shortTerm} recrutements pour les 1-2 prochaines années
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Développer des programmes de formation interne pour réduire la dépendance externe
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Mettre en place des mesures de rétention pour les postes à risque modéré
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Adapter les stratégies aux évolutions du secteur transport
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer JUTRANS */}
      <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl">
        <div className="card-body p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Truck className="w-5 h-5" />
            <span className="font-bold">JUTRANS SARL</span>
          </div>
          <p className="text-sm opacity-90">
            Solutions Transport & Logistique - Analyse des Risques RH
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;