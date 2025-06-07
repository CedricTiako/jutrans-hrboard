import React, { useState, useEffect } from 'react';
import { useSupabaseAppContext } from '../context/SupabaseAppContext';
import { HRAnalyticsEngine } from '../services/hrAnalyticsEngine';
import TurnoverAnalysisPanel from '../components/dashboard/TurnoverAnalysisPanel';
import { TurnoverAnalysis as TurnoverAnalysisType } from '../types/hr';
import { 
  TrendingDown, 
  RefreshCw, 
  Calendar, 
  Download, 
  Filter,
  Users,
  Building,
  Clock,
  Truck,
  Database
} from 'lucide-react';
import UniversalExportButton from '../components/common/UniversalExportButton';
import { FluidCard, FluidButton } from '../components/common/FluidComponents';
import { FadeInView } from '../components/common/JutransAnimations';

const TurnoverAnalysis: React.FC = () => {
  const { year, employees, loading, refreshData } = useSupabaseAppContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [turnoverData, setTurnoverData] = useState<TurnoverAnalysisType | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('');
  const [tenureGroupFilter, setTenureGroupFilter] = useState<string>('');

  // Calculer les données de turnover
  useEffect(() => {
    if (!loading && employees.length > 0) {
      // Filtrer les employés selon les critères sélectionnés
      let filteredEmployees = [...employees];
      
      if (departmentFilter) {
        const metrics = filteredEmployees.map(emp => HRAnalyticsEngine.calculateEmployeeMetrics(emp));
        filteredEmployees = filteredEmployees.filter((_, index) => 
          metrics[index].department === departmentFilter
        );
      }
      
      if (ageGroupFilter) {
        filteredEmployees = filteredEmployees.filter(emp => 
          emp.TRANCHE_AGE === ageGroupFilter
        );
      }
      
      if (tenureGroupFilter) {
        filteredEmployees = filteredEmployees.filter(emp => 
          emp.TRANCHE_ANCIENNETE === tenureGroupFilter
        );
      }
      
      // Calculer l'analyse de turnover
      const analysis = HRAnalyticsEngine.analyzeTurnover(filteredEmployees);
      setTurnoverData(analysis);
    }
  }, [loading, employees, departmentFilter, ageGroupFilter, tenureGroupFilter]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Extraire les options uniques pour les filtres
  const getDepartments = () => {
    const metrics = employees.map(emp => HRAnalyticsEngine.calculateEmployeeMetrics(emp));
    return [...new Set(metrics.map(m => m.department))].sort();
  };

  const getAgeGroups = () => {
    return [...new Set(employees.map(emp => emp.TRANCHE_AGE))].sort((a, b) => {
      // Tri personnalisé pour les tranches d'âge
      const getMinAge = (range: string) => {
        if (range === '> 60') return 61;
        const match = range.match(/(\d+)/);
        return match ? parseInt(match[0], 10) : 0;
      };
      return getMinAge(a) - getMinAge(b);
    });
  };

  const getTenureGroups = () => {
    return [...new Set(employees.map(emp => emp.TRANCHE_ANCIENNETE))].sort((a, b) => {
      // Tri personnalisé pour les tranches d'ancienneté
      const getMinTenure = (range: string) => {
        if (range === '21+') return 21;
        const match = range.match(/(\d+)/);
        return match ? parseInt(match[0], 10) : 0;
      };
      return getMinTenure(a) - getMinTenure(b);
    });
  };

  const clearFilters = () => {
    setDepartmentFilter('');
    setAgeGroupFilter('');
    setTenureGroupFilter('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* En-tête JUTRANS */}
      <FluidCard variant="gradient" className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="card-body p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">JUTRANS SARL</h1>
                <h2 className="text-xl opacity-90">Analyse du Turnover</h2>
                <p className="opacity-80">
                  Analyse prédictive des risques de départ pour {year}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <FluidButton
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="btn-white"
                icon={<Filter className="w-4 h-4" />}
              >
                Filtrer
              </FluidButton>
              
              <FluidButton
                onClick={handleRefresh}
                variant="outline"
                className="btn-white"
                icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
                loading={isRefreshing}
              >
                Actualiser
              </FluidButton>
              
              {turnoverData && (
                <UniversalExportButton
                  data={[
                    {
                      'Indicateur': 'Taux de turnover',
                      'Valeur': `${turnoverData.turnoverRate}%`
                    },
                    {
                      'Indicateur': 'Indice de risque',
                      'Valeur': `${turnoverData.turnoverRiskIndex}%`
                    },
                    {
                      'Indicateur': 'Employés à risque élevé',
                      'Valeur': turnoverData.highRiskEmployees
                    },
                    ...Object.entries(turnoverData.departmentRisks).map(([dept, risk]) => ({
                      'Indicateur': `Risque département ${dept}`,
                      'Valeur': `${Math.round(risk)}%`
                    })),
                    ...turnoverData.riskFactors.map((factor, index) => ({
                      'Indicateur': `Facteur de risque ${index + 1}`,
                      'Valeur': factor
                    }))
                  ]}
                  headers={['Indicateur', 'Valeur']}
                  title={`JUTRANS SARL - Analyse du Turnover - ${year}`}
                  filename={`jutrans-analyse-turnover-${year}`}
                  companyName="JUTRANS SARL"
                  showCompanyBranding={true}
                  variant="outline"
                  className="btn-white"
                  formats={['excel', 'pdf']}
                />
              )}
            </div>
          </div>
        </div>
      </FluidCard>

      {/* Filtres */}
      {showFilters && (
        <FadeInView direction="down">
          <FluidCard className="border-2 border-red-200">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filtres d'analyse</h3>
                <button
                  onClick={clearFilters}
                  className="btn btn-sm btn-outline btn-error"
                >
                  Effacer les filtres
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtre par département */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Département</span>
                  </label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="select select-bordered"
                  >
                    <option value="">Tous les départements</option>
                    {getDepartments().map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Filtre par tranche d'âge */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Tranche d'âge</span>
                  </label>
                  <select
                    value={ageGroupFilter}
                    onChange={(e) => setAgeGroupFilter(e.target.value)}
                    className="select select-bordered"
                  >
                    <option value="">Toutes les tranches d'âge</option>
                    {getAgeGroups().map(group => (
                      <option key={group} value={group}>{group} ans</option>
                    ))}
                  </select>
                </div>

                {/* Filtre par ancienneté */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Ancienneté</span>
                  </label>
                  <select
                    value={tenureGroupFilter}
                    onChange={(e) => setTenureGroupFilter(e.target.value)}
                    className="select select-bordered"
                  >
                    <option value="">Toutes les anciennetés</option>
                    {getTenureGroups().map(group => (
                      <option key={group} value={group}>{group} ans</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </FluidCard>
        </FadeInView>
      )}

      {/* Indicateurs de risque */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <TrendingDown className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">Taux de turnover</p>
                <p className="text-2xl font-bold">{turnoverData?.turnoverRate || 0}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">Employés à risque</p>
                <p className="text-2xl font-bold">{turnoverData?.highRiskEmployees || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <Building className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">Département à risque</p>
                <p className="text-2xl font-bold">
                  {Object.entries(turnoverData?.departmentRisks || {})
                    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <Database className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">Source de données</p>
                <p className="text-2xl font-bold">Supabase</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel d'analyse du turnover */}
      {turnoverData && (
        <TurnoverAnalysisPanel data={turnoverData} loading={loading} />
      )}

      {/* Footer JUTRANS */}
      <FluidCard variant="gradient" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="card-body p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Truck className="w-5 h-5" />
            <Database className="w-5 h-5" />
            <span className="font-bold">JUTRANS SARL</span>
          </div>
          <p className="text-sm opacity-90">
            Solutions Transport & Logistique - Analyse RH Prédictive avec Supabase
          </p>
        </div>
      </FluidCard>
    </div>
  );
};

export default TurnoverAnalysis;