import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Filter, 
  X, 
  Search, 
  Calendar, 
  Users, 
  Briefcase, 
  MapPin, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Target,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronUp,
  Save,
  Download,
  RefreshCw
} from 'lucide-react';

export interface AdvancedFilterState {
  // Filtres de base
  search: string;
  gender: string[];
  ageRange: { min: number; max: number };
  tenureRange: { min: number; max: number };
  positions: string[];
  nationalities: string[];
  affectations: string[];
  
  // Filtres temporels
  dateRange: { start: string; end: string };
  hireYearRange: { start: number; end: number };
  
  // Filtres de performance et risque
  retirementRisk: string[];
  performanceLevel: string[];
  salaryRange: { min: number; max: number };
  
  // Filtres organisationnels
  departments: string[];
  managementLevel: string[];
  contractType: string[];
  workLocation: string[];
  
  // Filtres analytiques
  turnoverRisk: string[];
  skillLevel: string[];
  trainingNeeds: string[];
  promotionReadiness: string[];
  
  // Filtres de diversité
  diversityMetrics: string[];
  inclusionScore: { min: number; max: number };
  
  // Filtres prédictifs
  careerPath: string[];
  successorReadiness: string[];
  retentionProbability: { min: number; max: number };
}

interface AdvancedFiltersProps {
  filters: AdvancedFilterState;
  onFiltersChange: (filters: AdvancedFilterState) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onSavePreset: (name: string) => void;
  onLoadPreset: (preset: AdvancedFilterState) => void;
  savedPresets: { name: string; filters: AdvancedFilterState }[];
  isVisible: boolean;
  onToggle: () => void;
  employeeData: any[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  onSavePreset,
  onLoadPreset,
  savedPresets,
  isVisible,
  onToggle,
  employeeData
}) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [presetName, setPresetName] = useState('');
  const [showPresetModal, setShowPresetModal] = useState(false);

  // Sections de filtres
  const filterSections = [
    { id: 'basic', label: 'Filtres de Base', icon: <Users className="w-4 h-4" /> },
    { id: 'temporal', label: 'Filtres Temporels', icon: <Calendar className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance & Risque', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'organizational', label: 'Structure Organisationnelle', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analyses Avancées', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'diversity', label: 'Diversité & Inclusion', icon: <Target className="w-4 h-4" /> },
    { id: 'predictive', label: 'Analyses Prédictives', icon: <AlertTriangle className="w-4 h-4" /> }
  ];

  // Extraire les options uniques des données
  const getUniqueValues = (field: string) => {
    return [...new Set(employeeData.map(emp => emp[field]).filter(Boolean))].sort();
  };

  const updateFilter = (field: string, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const toggleArrayFilter = (field: string, value: string) => {
    const currentArray = filters[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(field, newArray);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.gender.length > 0) count++;
    if (filters.positions.length > 0) count++;
    if (filters.nationalities.length > 0) count++;
    if (filters.affectations.length > 0) count++;
    if (filters.retirementRisk.length > 0) count++;
    if (filters.performanceLevel.length > 0) count++;
    if (filters.departments.length > 0) count++;
    if (filters.managementLevel.length > 0) count++;
    if (filters.turnoverRisk.length > 0) count++;
    if (filters.skillLevel.length > 0) count++;
    if (filters.diversityMetrics.length > 0) count++;
    if (filters.careerPath.length > 0) count++;
    return count;
  };

  if (!isVisible) {
    return (
      <div className="mb-6">
        <button
          onClick={onToggle}
          className="btn btn-outline btn-primary gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtres Avancés RH
          {getActiveFiltersCount() > 0 && (
            <div className="badge badge-secondary">{getActiveFiltersCount()}</div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl mb-6 animate-fade-in">
      <div className="card-header bg-gradient-to-r from-primary to-secondary text-primary-content p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-bold">Système de Filtres RH Avancés</h3>
              <p className="text-sm opacity-90">
                {getActiveFiltersCount()} filtre(s) actif(s) sur {employeeData.length} employés
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPresetModal(true)}
              className="btn btn-sm btn-ghost"
              title="Sauvegarder les filtres"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={onResetFilters}
              className="btn btn-sm btn-ghost"
              title="Réinitialiser"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onToggle}
              className="btn btn-sm btn-ghost"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        {/* Navigation des sections */}
        <div className="tabs tabs-boxed bg-base-200 p-2 m-4 mb-0">
          {filterSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`tab gap-2 ${activeSection === section.id ? 'tab-active' : ''}`}
            >
              {section.icon}
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* Section Filtres de Base */}
          {activeSection === 'basic' && (
            <div className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Recherche globale */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Recherche globale</span>
                  </label>
                  <div className="input-group">
                    <span className="bg-base-200">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Nom, poste, compétences..."
                      className="input input-bordered flex-1"
                      value={filters.search}
                      onChange={(e) => updateFilter('search', e.target.value)}
                    />
                  </div>
                </div>

                {/* Genre */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Genre</span>
                  </label>
                  <div className="flex gap-2">
                    {['M', 'F'].map((gender) => (
                      <label key={gender} className="label cursor-pointer">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={filters.gender.includes(gender)}
                          onChange={() => toggleArrayFilter('gender', gender)}
                        />
                        <span className="label-text ml-2">
                          {gender === 'M' ? 'Homme' : 'Femme'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tranche d'âge */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Âge</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="input input-bordered input-sm flex-1"
                      value={filters.ageRange.min || ''}
                      onChange={(e) => updateFilter('ageRange', {
                        ...filters.ageRange,
                        min: parseInt(e.target.value) || 0
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="input input-bordered input-sm flex-1"
                      value={filters.ageRange.max || ''}
                      onChange={(e) => updateFilter('ageRange', {
                        ...filters.ageRange,
                        max: parseInt(e.target.value) || 100
                      })}
                    />
                  </div>
                </div>

                {/* Ancienneté */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Ancienneté (années)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="input input-bordered input-sm flex-1"
                      value={filters.tenureRange.min || ''}
                      onChange={(e) => updateFilter('tenureRange', {
                        ...filters.tenureRange,
                        min: parseInt(e.target.value) || 0
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="input input-bordered input-sm flex-1"
                      value={filters.tenureRange.max || ''}
                      onChange={(e) => updateFilter('tenureRange', {
                        ...filters.tenureRange,
                        max: parseInt(e.target.value) || 50
                      })}
                    />
                  </div>
                </div>

                {/* Postes */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Postes</span>
                  </label>
                  <select
                    multiple
                    className="select select-bordered h-24"
                    value={filters.positions}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      updateFilter('positions', values);
                    }}
                  >
                    {getUniqueValues('POSTE').map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nationalités */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Nationalités</span>
                  </label>
                  <select
                    multiple
                    className="select select-bordered h-24"
                    value={filters.nationalities}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      updateFilter('nationalities', values);
                    }}
                  >
                    {getUniqueValues('NATIONALITE').map((nationality) => (
                      <option key={nationality} value={nationality}>
                        {nationality}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section Filtres Temporels */}
          {activeSection === 'temporal' && (
            <div className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Période d'analyse */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Période d'analyse</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="input input-bordered input-sm flex-1"
                      value={filters.dateRange.start}
                      onChange={(e) => updateFilter('dateRange', {
                        ...filters.dateRange,
                        start: e.target.value
                      })}
                    />
                    <input
                      type="date"
                      className="input input-bordered input-sm flex-1"
                      value={filters.dateRange.end}
                      onChange={(e) => updateFilter('dateRange', {
                        ...filters.dateRange,
                        end: e.target.value
                      })}
                    />
                  </div>
                </div>

                {/* Année d'embauche */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Année d'embauche</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="De"
                      className="input input-bordered input-sm flex-1"
                      value={filters.hireYearRange.start || ''}
                      onChange={(e) => updateFilter('hireYearRange', {
                        ...filters.hireYearRange,
                        start: parseInt(e.target.value) || 2000
                      })}
                    />
                    <input
                      type="number"
                      placeholder="À"
                      className="input input-bordered input-sm flex-1"
                      value={filters.hireYearRange.end || ''}
                      onChange={(e) => updateFilter('hireYearRange', {
                        ...filters.hireYearRange,
                        end: parseInt(e.target.value) || 2025
                      })}
                    />
                  </div>
                </div>

                {/* Filtres saisonniers */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Analyse saisonnière</span>
                  </label>
                  <select className="select select-bordered">
                    <option value="">Toute l'année</option>
                    <option value="Q1">T1 (Jan-Mar)</option>
                    <option value="Q2">T2 (Avr-Juin)</option>
                    <option value="Q3">T3 (Juil-Sep)</option>
                    <option value="Q4">T4 (Oct-Déc)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section Performance & Risque */}
          {activeSection === 'performance' && (
            <div className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Risque de départ en retraite */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Risque retraite</span>
                  </label>
                  <div className="space-y-2">
                    {['Faible', 'Modéré', 'Élevé', 'Critique'].map((risk) => (
                      <label key={risk} className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-warning"
                          checked={filters.retirementRisk.includes(risk)}
                          onChange={() => toggleArrayFilter('retirementRisk', risk)}
                        />
                        <span className="label-text ml-2">{risk}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Niveau de performance */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Performance</span>
                  </label>
                  <div className="space-y-2">
                    {['Excellent', 'Bon', 'Satisfaisant', 'À améliorer', 'Insuffisant'].map((level) => (
                      <label key={level} className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-success"
                          checked={filters.performanceLevel.includes(level)}
                          onChange={() => toggleArrayFilter('performanceLevel', level)}
                        />
                        <span className="label-text ml-2">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fourchette salariale */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Salaire (€)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="input input-bordered input-sm flex-1"
                      value={filters.salaryRange.min || ''}
                      onChange={(e) => updateFilter('salaryRange', {
                        ...filters.salaryRange,
                        min: parseInt(e.target.value) || 0
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="input input-bordered input-sm flex-1"
                      value={filters.salaryRange.max || ''}
                      onChange={(e) => updateFilter('salaryRange', {
                        ...filters.salaryRange,
                        max: parseInt(e.target.value) || 200000
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Structure Organisationnelle */}
          {activeSection === 'organizational' && (
            <div className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Départements */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Départements</span>
                  </label>
                  <div className="space-y-2">
                    {['Direction', 'RH', 'Finance', 'IT', 'Commercial', 'Production', 'Logistique'].map((dept) => (
                      <label key={dept} className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-info"
                          checked={filters.departments.includes(dept)}
                          onChange={() => toggleArrayFilter('departments', dept)}
                        />
                        <span className="label-text ml-2">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Niveau de management */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Niveau management</span>
                  </label>
                  <div className="space-y-2">
                    {['Direction générale', 'Direction', 'Management', 'Supervision', 'Opérationnel'].map((level) => (
                      <label key={level} className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-secondary"
                          checked={filters.managementLevel.includes(level)}
                          onChange={() => toggleArrayFilter('managementLevel', level)}
                        />
                        <span className="label-text ml-2">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type de contrat */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Type de contrat</span>
                  </label>
                  <div className="space-y-2">
                    {['CDI', 'CDD', 'Stage', 'Freelance', 'Temps partiel'].map((contract) => (
                      <label key={contract} className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-accent"
                          checked={filters.contractType.includes(contract)}
                          onChange={() => toggleArrayFilter('contractType', contract)}
                        />
                        <span className="label-text ml-2">{contract}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Analyses Avancées */}
          {activeSection === 'analytics' && (
            <div className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Risque de turnover */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Risque de départ</span>
                  </label>
                  <div className="space-y-2">
                    {['Très faible', 'Faible', 'Modéré', 'Élevé', 'Critique'].map((risk) => (
                      <label key={risk} className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-error"
                          checked={filters.turnoverRisk.includes(risk)}
                          onChange={() => toggleArrayFilter('turnoverRisk', risk)}
                        />
                        <span className="label-text ml-2">{risk}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Niveau de compétences */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Niveau compétences</span>
                  </label>
                  <div className="space-y-2">
                    {['Expert', 'Avancé', 'Intermédiaire', 'Débutant', 'En formation'].map((skill) => (
                      <label key={skill} className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={filters.skillLevel.includes(skill)}
                          onChange={() => toggleArrayFilter('skillLevel', skill)}
                        />
                        <span className="label-text ml-2">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Besoins de formation */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Besoins formation</span>
                  </label>
                  <div className="space-y-2">
                    {['Urgent', 'Prioritaire', 'Souhaitable', 'Optionnel', 'Aucun'].map((need) => (
                      <label key={need} className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-warning"
                          checked={filters.trainingNeeds.includes(need)}
                          onChange={() => toggleArrayFilter('trainingNeeds', need)}
                        />
                        <span className="label-text ml-2">{need}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Diversité & Inclusion */}
          {activeSection === 'diversity' && (
            <div className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Métriques de diversité */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Métriques diversité</span>
                  </label>
                  <div className="space-y-2">
                    {['Parité H/F', 'Diversité culturelle', 'Inclusion handicap', 'Équité salariale', 'Mixité générationnelle'].map((metric) => (
                      <label key={metric} className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-success"
                          checked={filters.diversityMetrics.includes(metric)}
                          onChange={() => toggleArrayFilter('diversityMetrics', metric)}
                        />
                        <span className="label-text ml-2">{metric}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Score d'inclusion */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Score inclusion (%)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="input input-bordered input-sm flex-1"
                      min="0"
                      max="100"
                      value={filters.inclusionScore.min || ''}
                      onChange={(e) => updateFilter('inclusionScore', {
                        ...filters.inclusionScore,
                        min: parseInt(e.target.value) || 0
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="input input-bordered input-sm flex-1"
                      min="0"
                      max="100"
                      value={filters.inclusionScore.max || ''}
                      onChange={(e) => updateFilter('inclusionScore', {
                        ...filters.inclusionScore,
                        max: parseInt(e.target.value) || 100
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Analyses Prédictives */}
          {activeSection === 'predictive' && (
            <div className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Parcours de carrière */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Parcours carrière</span>
                  </label>
                  <div className="space-y-2">
                    {['Ascendant', 'Stable', 'Plateau', 'Transition', 'Déclin'].map((path) => (
                      <label key={path} className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-info"
                          checked={filters.careerPath.includes(path)}
                          onChange={() => toggleArrayFilter('careerPath', path)}
                        />
                        <span className="label-text ml-2">{path}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Préparation succession */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Succession</span>
                  </label>
                  <div className="space-y-2">
                    {['Prêt maintenant', 'Prêt dans 1 an', 'Prêt dans 2-3 ans', 'Développement requis', 'Non identifié'].map((readiness) => (
                      <label key={readiness} className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-secondary"
                          checked={filters.successorReadiness.includes(readiness)}
                          onChange={() => toggleArrayFilter('successorReadiness', readiness)}
                        />
                        <span className="label-text ml-2">{readiness}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Probabilité de rétention */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Rétention (%)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="input input-bordered input-sm flex-1"
                      min="0"
                      max="100"
                      value={filters.retentionProbability.min || ''}
                      onChange={(e) => updateFilter('retentionProbability', {
                        ...filters.retentionProbability,
                        min: parseInt(e.target.value) || 0
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="input input-bordered input-sm flex-1"
                      min="0"
                      max="100"
                      value={filters.retentionProbability.max || ''}
                      onChange={(e) => updateFilter('retentionProbability', {
                        ...filters.retentionProbability,
                        max: parseInt(e.target.value) || 100
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-base-300">
            <button
              onClick={onApplyFilters}
              className="btn btn-primary gap-2"
            >
              <Filter className="w-4 h-4" />
              Appliquer les filtres
            </button>
            
            <button
              onClick={onResetFilters}
              className="btn btn-outline gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Réinitialiser
            </button>
            
            <button
              onClick={() => setShowPresetModal(true)}
              className="btn btn-outline btn-secondary gap-2"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
            
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-outline gap-2">
                <Download className="w-4 h-4" />
                Presets
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                {savedPresets.map((preset, index) => (
                  <li key={index}>
                    <a onClick={() => onLoadPreset(preset.filters)}>
                      {preset.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour sauvegarder un preset */}
      {showPresetModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Sauvegarder les filtres</h3>
            <div className="py-4">
              <input
                type="text"
                placeholder="Nom du preset"
                className="input input-bordered w-full"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (presetName.trim()) {
                    onSavePreset(presetName.trim());
                    setPresetName('');
                    setShowPresetModal(false);
                  }
                }}
              >
                Sauvegarder
              </button>
              <button
                className="btn"
                onClick={() => {
                  setPresetName('');
                  setShowPresetModal(false);
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;