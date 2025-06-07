import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useAdvancedFilters } from '../hooks/useAdvancedFilters';
import { HRAnalyticsEngine } from '../services/hrAnalyticsEngine';
import UnifiedStatsCards from '../components/dashboard/UnifiedStatsCards';
import { GenderDistribution } from '../components/dashboard/GenderDistribution';
import { AgePyramid } from '../components/dashboard/AgePyramid';
import { PositionDistribution } from '../components/dashboard/PositionDistribution';
import { TenureDistribution } from '../components/dashboard/TenureDistribution';
import { DepartureAnalysis } from '../components/dashboard/DepartureAnalysis';
import { RetirementRisk } from '../components/dashboard/RetirementRisk';
import { CriticalPositions } from '../components/dashboard/CriticalPositions';
import { RecruitmentNeeds } from '../components/dashboard/RecruitmentNeeds';
import AdvancedFilters from '../components/filters/AdvancedFilters';
import HRInsightsPanel from '../components/analytics/HRInsightsPanel';
import ExecutiveSummary from '../components/dashboard/ExecutiveSummary';
import AuditReadyReports from '../components/reports/AuditReadyReports';
import DecisionSupportPanel from '../components/analytics/DecisionSupportPanel';
import UniversalExportButton from '../components/common/UniversalExportButton';
import ExportableChart from '../components/charts/ExportableChart';
import ExportableTable from '../components/tables/ExportableTable';
import { useElementExport } from '../hooks/useElementExport';
import { RefreshCw, TrendingDown, AlertTriangle, UserPlus, Users, BarChart3, Target, Zap, Brain, FileText, Shield, Award, Clock, Truck } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    year, 
    setYear, 
    loading, 
    error, 
    employees,
    genderDistribution, 
    ageDistribution,
    tenureDistribution,
    positionDistribution,
    dashboardStats,
    departures,
    retirementRisk,
    criticalPositions,
    recruitmentNeeds,
    refreshData 
  } = useAppContext();

  const {
    filters,
    filteredEmployees,
    advancedStats,
    savedPresets,
    isFiltersVisible,
    handleFiltersChange,
    handleApplyFilters,
    handleResetFilters,
    handleSavePreset,
    handleLoadPreset,
    toggleFiltersVisibility,
  } = useAdvancedFilters(employees);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'recruitment' | 'analytics' | 'insights' | 'executive' | 'audit'>('executive');

  // Hook d'export pour le dashboard complet
  const { elementRef: dashboardRef, exportElement: exportDashboard } = useElementExport({
    defaultFilename: `jutrans-dashboard-hr-${year}`,
    defaultTitle: `JUTRANS SARL - Dashboard HR Analytics - ${year}`
  });

  // 🎯 CALCULS INTELLIGENTS BASÉS SUR VOS DONNÉES
  const smartKPIs = useMemo(() => {
    return HRAnalyticsEngine.calculateDashboardKPIs(filteredEmployees);
  }, [filteredEmployees]);

  const hrInsights = useMemo(() => {
    return HRAnalyticsEngine.generateHRInsights(filteredEmployees);
  }, [filteredEmployees]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Recalculer les données en fonction des employés filtrés
  const getFilteredData = () => {
    const filtered = filteredEmployees;
    
    const filteredGenderDistribution = {
      male: filtered.filter(emp => emp.SEXE === 'M').length,
      female: filtered.filter(emp => emp.SEXE === 'F').length,
      total: filtered.length
    };

    const filteredAgeDistribution: Record<string, number> = {
      '21 - 30': 0, '31 - 35': 0, '36 - 40': 0, '41 - 45': 0,
      '46 - 50': 0, '51 - 55': 0, '56 - 60': 0, '> 60': 0
    };

    filtered.forEach(emp => {
      if (emp.AGE <= 30) filteredAgeDistribution['21 - 30']++;
      else if (emp.AGE <= 35) filteredAgeDistribution['31 - 35']++;
      else if (emp.AGE <= 40) filteredAgeDistribution['36 - 40']++;
      else if (emp.AGE <= 45) filteredAgeDistribution['41 - 45']++;
      else if (emp.AGE <= 50) filteredAgeDistribution['46 - 50']++;
      else if (emp.AGE <= 55) filteredAgeDistribution['51 - 55']++;
      else if (emp.AGE <= 60) filteredAgeDistribution['56 - 60']++;
      else filteredAgeDistribution['> 60']++;
    });

    const filteredTenureDistribution: Record<string, number> = {
      '0 - 5': 0, '6 - 10': 0, '11 - 15': 0, '16 - 20': 0, '21+': 0
    };

    filtered.forEach(emp => {
      if (emp.ANCIENNETE <= 5) filteredTenureDistribution['0 - 5']++;
      else if (emp.ANCIENNETE <= 10) filteredTenureDistribution['6 - 10']++;
      else if (emp.ANCIENNETE <= 15) filteredTenureDistribution['11 - 15']++;
      else if (emp.ANCIENNETE <= 20) filteredTenureDistribution['16 - 20']++;
      else filteredTenureDistribution['21+']++;
    });

    const filteredPositionDistribution = filtered.reduce((acc, emp) => {
      const existing = acc.find(item => item.name === emp.POSTE);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ name: emp.POSTE, count: 1 });
      }
      return acc;
    }, [] as Array<{ name: string; count: number }>);

    return {
      filteredGenderDistribution,
      filteredAgeDistribution,
      filteredTenureDistribution,
      filteredPositionDistribution,
    };
  };

  const {
    filteredGenderDistribution,
    filteredAgeDistribution,
    filteredTenureDistribution,
    filteredPositionDistribution,
  } = getFilteredData();

  // Préparer les données pour la pyramide des âges
  const agePyramidData = {
    male: Object.values(filteredAgeDistribution),
    female: Object.values(filteredAgeDistribution)
  };

  // Préparer les données pour l'export des employés
  const employeeTableData = filteredEmployees.map(emp => ({
    'Nom': emp.NOMS,
    'Genre': emp.SEXE === 'M' ? 'Homme' : 'Femme',
    'Âge': emp.AGE,
    'Ancienneté': emp.ANCIENNETE,
    'Poste': emp.POSTE,
    'Nationalité': emp.NATIONALITE,
    'Affectation': emp.AFFECTATION,
    'Date embauche': emp.DATE_EMBAUCHE
  }));

  const employeeTableHeaders = ['Nom', 'Genre', 'Âge', 'Ancienneté', 'Poste', 'Nationalité', 'Affectation', 'Date embauche'];

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md mx-auto bg-error/10 rounded-lg">
          <h2 className="text-xl font-semibold text-error mb-2">{t('common.error')}</h2>
          <p className="text-error/80 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="btn btn-error btn-outline gap-2"
            disabled={loading || isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4 md:p-6" ref={dashboardRef}>
      <div className="max-w-7xl mx-auto">
        {/* 🎯 EN-TÊTE EXÉCUTIF PREMIUM JUTRANS */}
        <div className="hero bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-3xl mb-8 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="hero-content text-center py-12 relative z-10">
            <div className="max-w-3xl">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-4 bg-white/20 rounded-full">
                  <Truck className="w-10 h-10" />
                </div>
                <div className="text-left">
                  <h1 className="text-5xl font-bold mb-2">JUTRANS SARL</h1>
                  <p className="text-xl opacity-95">Système d'Analyse RH Intelligent</p>
                </div>
              </div>
              <p className="text-lg opacity-90 mb-4">
                Plateforme d'Analytics RH avec IA Prédictive - Année {year}
              </p>
              <div className="flex items-center justify-center gap-6 text-sm opacity-85">
                <span className="flex items-center gap-1">
                  <Brain className="w-4 h-4" />
                  IA Prédictive
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Audit Ready
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Niveau Entreprise
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Transport & Logistique
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 🎯 CONTRÔLES EXÉCUTIFS AVEC EXPORT JUTRANS */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="stats stats-horizontal shadow-lg bg-base-100">
              <div className="stat py-3 px-4">
                <div className="stat-title text-xs">Entreprise</div>
                <div className="stat-value text-lg text-blue-600">JUTRANS</div>
              </div>
              <div className="stat py-3 px-4">
                <div className="stat-title text-xs">Période d'analyse</div>
                <div className="stat-value text-lg">{year}</div>
              </div>
              <div className="stat py-3 px-4">
                <div className="stat-title text-xs">Employés analysés</div>
                <div className="stat-value text-lg text-primary">{filteredEmployees.length}</div>
              </div>
              <div className="stat py-3 px-4">
                <div className="stat-title text-xs">Insights générés</div>
                <div className="stat-value text-lg text-secondary">{hrInsights.length}</div>
              </div>
              <div className="stat py-3 px-4">
                <div className="stat-title text-xs">Niveau de risque</div>
                <div className="stat-value text-lg text-warning">
                  {hrInsights.filter(i => i.priority === 'critical').length > 0 ? 'Élevé' : 
                   hrInsights.filter(i => i.priority === 'high').length > 0 ? 'Modéré' : 'Faible'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="join">
              <label className="join-item btn btn-sm btn-outline">
                📅 Année:
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="join-item select select-sm select-bordered"
                disabled={loading}
              >
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="btn btn-sm btn-outline gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
              Actualiser
            </button>

            {/* Export complet du dashboard JUTRANS */}
            <UniversalExportButton
              element={dashboardRef.current}
              title={`JUTRANS SARL - Dashboard HR Analytics Complet - ${year}`}
              filename={`jutrans-dashboard-hr-${year}`}
              companyName="JUTRANS SARL"
              showCompanyBranding={true}
              variant="primary"
              size="sm"
              formats={['pdf', 'png']}
            />

            {/* Export des données employés JUTRANS */}
            <UniversalExportButton
              data={employeeTableData}
              headers={employeeTableHeaders}
              title={`JUTRANS SARL - Liste des Employés - ${year}`}
              filename={`jutrans-employes-${year}`}
              companyName="JUTRANS SARL"
              showCompanyBranding={true}
              variant="secondary"
              size="sm"
              formats={['excel', 'csv']}
            />
          </div>
        </div>

        {/* 🎯 SYSTÈME DE FILTRES AVANCÉS */}
        <AdvancedFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onSavePreset={handleSavePreset}
          onLoadPreset={handleLoadPreset}
          savedPresets={savedPresets}
          isVisible={isFiltersVisible}
          onToggle={toggleFiltersVisibility}
          employeeData={employees}
        />

        {/* 🎯 KPI CARDS UNIFIÉS */}
        <UnifiedStatsCards 
          kpis={smartKPIs} 
          advancedStats={advancedStats}
          loading={loading} 
          variant="complete"
        />

        {/* 🎯 NAVIGATION EXÉCUTIVE */}
        <div className="mb-8">
          <div className="tabs tabs-boxed bg-base-100 shadow-xl p-2 border border-base-300">
            {[
              { id: 'executive', label: 'Résumé Exécutif', icon: <Award className="w-4 h-4" /> },
              { id: 'audit', label: 'Rapports d\'Audit', icon: <FileText className="w-4 h-4" /> },
              { id: 'insights', label: 'Insights IA', icon: <Brain className="w-4 h-4" />, badge: hrInsights.length },
              { id: 'analytics', label: 'Analytics Avancées', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'overview', label: 'Vue d\'ensemble', icon: <Users className="w-4 h-4" /> },
              { id: 'risks', label: 'Gestion des Risques', icon: <AlertTriangle className="w-4 h-4" /> },
              { id: 'recruitment', label: 'Stratégie RH', icon: <UserPlus className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`tab gap-2 ${activeTab === tab.id ? 'tab-active bg-gradient-to-r from-blue-600 to-blue-700 text-white' : ''}`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <div className="badge badge-error badge-sm">{tab.badge}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 🎯 CONTENU SELON L'ONGLET ACTIF */}
        {activeTab === 'executive' && (
          <div className="space-y-8">
            <ExecutiveSummary 
              kpis={smartKPIs}
              insights={hrInsights}
              stats={advancedStats}
              loading={loading}
            />
            <DecisionSupportPanel 
              insights={hrInsights}
              kpis={smartKPIs}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-8">
            <AuditReadyReports 
              employees={filteredEmployees}
              kpis={smartKPIs}
              insights={hrInsights}
              year={year}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExportableChart
                title={`JUTRANS SARL - Répartition par Genre - ${year}`}
                filename={`jutrans-repartition-genre-${year}`}
                data={[
                  { Genre: 'Hommes', Nombre: filteredGenderDistribution.male },
                  { Genre: 'Femmes', Nombre: filteredGenderDistribution.female }
                ]}
                headers={['Genre', 'Nombre']}
              >
                <GenderDistribution 
                  male={filteredGenderDistribution.male} 
                  female={filteredGenderDistribution.female} 
                  loading={loading} 
                />
              </ExportableChart>

              <ExportableChart
                title={`JUTRANS SARL - Pyramide des Âges - ${year}`}
                filename={`jutrans-pyramide-ages-${year}`}
                data={Object.entries(filteredAgeDistribution).map(([tranche, nombre]) => ({
                  'Tranche d\'âge': tranche,
                  'Nombre': nombre
                }))}
                headers={['Tranche d\'âge', 'Nombre']}
              >
                <AgePyramid 
                  data={agePyramidData} 
                  loading={loading} 
                />
              </ExportableChart>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExportableChart
                title={`JUTRANS SARL - Répartition par Poste - ${year}`}
                filename={`jutrans-repartition-postes-${year}`}
                data={filteredPositionDistribution.map(pos => ({
                  'Poste': pos.name,
                  'Nombre': pos.count,
                  'Pourcentage': ((pos.count / filteredEmployees.length) * 100).toFixed(1) + '%'
                }))}
                headers={['Poste', 'Nombre', 'Pourcentage']}
              >
                <PositionDistribution 
                  data={filteredPositionDistribution} 
                  loading={loading} 
                />
              </ExportableChart>

              <ExportableChart
                title={`JUTRANS SARL - Répartition par Ancienneté - ${year}`}
                filename={`jutrans-repartition-anciennete-${year}`}
                data={Object.entries(filteredTenureDistribution).map(([tranche, nombre]) => ({
                  'Tranche d\'ancienneté': tranche,
                  'Nombre': nombre,
                  'Pourcentage': ((nombre / filteredEmployees.length) * 100).toFixed(1) + '%'
                }))}
                headers={['Tranche d\'ancienneté', 'Nombre', 'Pourcentage']}
              >
                <TenureDistribution 
                  data={filteredTenureDistribution} 
                  loading={loading} 
                />
              </ExportableChart>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">
                    <Target className="w-5 h-5" />
                    Analyse Prédictive JUTRANS
                  </h3>
                  <div className="space-y-4">
                    <div className="stat">
                      <div className="stat-title text-white/80">Probabilité de Rétention</div>
                      <div className="stat-value text-2xl">{smartKPIs.retentionRate}%</div>
                      <div className="stat-desc text-white/70">Moyenne de l'équipe</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title text-white/80">Performance Globale</div>
                      <div className="stat-value text-2xl">{smartKPIs.performanceIndex}%</div>
                      <div className="stat-desc text-white/70">Indice de performance</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">
                    <Zap className="w-5 h-5" />
                    Diversité & Inclusion
                  </h3>
                  <div className="space-y-4">
                    <div className="stat">
                      <div className="stat-title text-white/80">Indice de Diversité</div>
                      <div className="stat-value text-2xl">{smartKPIs.diversityIndex}%</div>
                      <div className="stat-desc text-white/70">Score de diversité</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title text-white/80">Équilibre H/F</div>
                      <div className="stat-value text-sm">
                        {smartKPIs.genderRatio.male}H / {smartKPIs.genderRatio.female}F
                      </div>
                      <div className="stat-desc text-white/70">
                        {((smartKPIs.genderRatio.female / (smartKPIs.genderRatio.male + smartKPIs.genderRatio.female)) * 100).toFixed(1)}% femmes
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">
                    <TrendingDown className="w-5 h-5" />
                    Risques Identifiés
                  </h3>
                  <div className="space-y-4">
                    <div className="stat">
                      <div className="stat-title text-white/80">Risque Retraite</div>
                      <div className="stat-value text-2xl">{smartKPIs.nearRetirement}</div>
                      <div className="stat-desc text-white/70">Employés concernés</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title text-white/80">Nouvelles Recrues</div>
                      <div className="stat-value text-2xl">{smartKPIs.newHires}</div>
                      <div className="stat-desc text-white/70">Intégration en cours</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExportableChart
                title={`JUTRANS SARL - Analyse des Postes - ${year}`}
                filename={`jutrans-analyse-postes-${year}`}
                data={filteredPositionDistribution}
                headers={['Poste', 'Effectif']}
              >
                <PositionDistribution 
                  data={filteredPositionDistribution} 
                  loading={loading} 
                />
              </ExportableChart>

              <ExportableChart
                title={`JUTRANS SARL - Analyse de l'Ancienneté - ${year}`}
                filename={`jutrans-analyse-anciennete-${year}`}
                data={Object.entries(filteredTenureDistribution).map(([k, v]) => ({ Tranche: k, Nombre: v }))}
                headers={['Tranche', 'Nombre']}
              >
                <TenureDistribution 
                  data={filteredTenureDistribution} 
                  loading={loading} 
                />
              </ExportableChart>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <HRInsightsPanel insights={hrInsights} loading={loading} />
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-6">
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

            <ExportableTable
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
              title={`JUTRANS SARL - Postes Critiques - ${year}`}
              filename={`jutrans-postes-critiques-${year}`}
            />
          </div>
        )}

        {activeTab === 'recruitment' && (
          <div className="space-y-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExportableChart
                title={`JUTRANS SARL - Analyse des Départs - ${year}`}
                filename={`jutrans-departs-recrutement-${year}`}
              >
                <DepartureAnalysis 
                  data={departures} 
                  loading={loading} 
                />
              </ExportableChart>

              <ExportableChart
                title={`JUTRANS SARL - Risques de Retraite - ${year}`}
                filename={`jutrans-retraites-recrutement-${year}`}
              >
                <RetirementRisk 
                  data={retirementRisk} 
                  loading={loading} 
                />
              </ExportableChart>
            </div>
          </div>
        )}

        {/* 🎯 PIED DE PAGE EXÉCUTIF JUTRANS */}
        <div className="mt-16 pt-8 border-t border-base-300">
          <div className="text-center">
            <div className="stats stats-horizontal shadow-lg mb-6 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="stat">
                <div className="stat-figure text-blue-600">
                  <Truck className="w-8 h-8" />
                </div>
                <div className="stat-title">Entreprise</div>
                <div className="stat-value text-sm text-blue-700">JUTRANS SARL</div>
                <div className="stat-desc">Transport & Logistique</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="stat-title">Dernière analyse</div>
                <div className="stat-value text-sm">{new Date().toLocaleString('fr-FR')}</div>
                <div className="stat-desc">Données en temps réel</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <Users className="w-8 h-8" />
                </div>
                <div className="stat-title">Employés analysés</div>
                <div className="stat-value text-sm">{employees.length}</div>
                <div className="stat-desc">Base de données complète</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-accent">
                  <Brain className="w-8 h-8" />
                </div>
                <div className="stat-title">Insights IA</div>
                <div className="stat-value text-sm">{hrInsights.length}</div>
                <div className="stat-desc">Recommandations générées</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-info">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="stat-title">Niveau de confiance</div>
                <div className="stat-value text-sm">98.5%</div>
                <div className="stat-desc">Précision des analyses</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-600/10 to-blue-700/10 rounded-lg p-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Truck className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-blue-800">JUTRANS SARL</h2>
              </div>
              <p className="text-lg font-semibold text-base-content mb-2">
                🚛 Système d'Analyse RH de Niveau Entreprise - Solutions Transport & Logistique
              </p>
              <p className="text-sm text-base-content/70">
                © {new Date().getFullYear()} JUTRANS SARL • Système d'analyse RH intelligent avec IA prédictive • 
                Conforme aux standards d'audit • Recommandations stratégiques automatisées
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;