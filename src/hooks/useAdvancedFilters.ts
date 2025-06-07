import { useState, useEffect, useMemo } from 'react';
import { Employee } from '../types/hr';
import { AdvancedFilterState } from '../components/filters/AdvancedFilters';

const defaultFilters: AdvancedFilterState = {
  // Filtres de base
  search: '',
  gender: [],
  ageRange: { min: 0, max: 100 },
  tenureRange: { min: 0, max: 50 },
  positions: [],
  nationalities: [],
  affectations: [],
  
  // Filtres temporels
  dateRange: { start: '', end: '' },
  hireYearRange: { start: 2000, end: 2025 },
  
  // Filtres de performance et risque
  retirementRisk: [],
  performanceLevel: [],
  salaryRange: { min: 0, max: 200000 },
  
  // Filtres organisationnels
  departments: [],
  managementLevel: [],
  contractType: [],
  workLocation: [],
  
  // Filtres analytiques
  turnoverRisk: [],
  skillLevel: [],
  trainingNeeds: [],
  promotionReadiness: [],
  
  // Filtres de diversité
  diversityMetrics: [],
  inclusionScore: { min: 0, max: 100 },
  
  // Filtres prédictifs
  careerPath: [],
  successorReadiness: [],
  retentionProbability: { min: 0, max: 100 },
};

export const useAdvancedFilters = (employees: Employee[]) => {
  const [filters, setFilters] = useState<AdvancedFilterState>(defaultFilters);
  const [savedPresets, setSavedPresets] = useState<{ name: string; filters: AdvancedFilterState }[]>([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // Charger les presets sauvegardés
  useEffect(() => {
    const saved = localStorage.getItem('hr-filter-presets');
    if (saved) {
      try {
        setSavedPresets(JSON.parse(saved));
      } catch (error) {
        console.error('Erreur lors du chargement des presets:', error);
      }
    }
  }, []);

  // 🎯 CALCULS BASÉS EXCLUSIVEMENT SUR VOS DONNÉES RÉELLES
  const calculateAdvancedMetrics = (employee: Employee) => {
    // ✅ RISQUE RETRAITE → Calculé depuis AGE (votre champ)
    const retirementRisk = employee.AGE >= 60 ? 'Critique' :
                          employee.AGE >= 55 ? 'Élevé' :
                          employee.AGE >= 50 ? 'Modéré' : 'Faible';

    // ✅ PERFORMANCE → Calculé depuis ANCIENNETE + AGE (vos champs)
    const performanceScore = (employee.ANCIENNETE * 2) + (employee.AGE * 0.5);
    const performanceLevel = performanceScore > 50 ? 'Excellent' :
                            performanceScore > 35 ? 'Bon' :
                            performanceScore > 25 ? 'Satisfaisant' :
                            performanceScore > 15 ? 'À améliorer' : 'Insuffisant';

    // ✅ RISQUE TURNOVER → Calculé depuis ANCIENNETE (votre champ)
    const turnoverRisk = employee.ANCIENNETE < 1 ? 'Critique' :
                        employee.ANCIENNETE < 2 ? 'Élevé' :
                        employee.ANCIENNETE < 5 ? 'Modéré' :
                        employee.ANCIENNETE > 20 ? 'Faible' : 'Très faible';

    // ✅ NIVEAU COMPÉTENCES → Calculé depuis ANCIENNETE (votre champ)
    const skillLevel = employee.ANCIENNETE > 15 ? 'Expert' :
                      employee.ANCIENNETE > 10 ? 'Avancé' :
                      employee.ANCIENNETE > 5 ? 'Intermédiaire' :
                      employee.ANCIENNETE > 2 ? 'Débutant' : 'En formation';

    // ✅ BESOINS FORMATION → Calculé depuis AGE + ANCIENNETE (vos champs)
    const trainingScore = (60 - employee.AGE) + (20 - employee.ANCIENNETE);
    const trainingNeeds = trainingScore > 40 ? 'Urgent' :
                         trainingScore > 25 ? 'Prioritaire' :
                         trainingScore > 15 ? 'Souhaitable' :
                         trainingScore > 5 ? 'Optionnel' : 'Aucun';

    // ✅ PARCOURS CARRIÈRE → Calculé depuis AGE + ANCIENNETE (vos champs)
    const careerPath = employee.AGE < 30 && employee.ANCIENNETE < 5 ? 'Ascendant' :
                      employee.AGE > 55 || employee.ANCIENNETE > 20 ? 'Stable' :
                      employee.AGE > 50 ? 'Plateau' : 'Transition';

    // ✅ SUCCESSION → Calculé depuis performance + ANCIENNETE (vos champs)
    const successorReadiness = performanceLevel === 'Excellent' && employee.ANCIENNETE > 10 ? 'Prêt maintenant' :
                              performanceLevel === 'Bon' && employee.ANCIENNETE > 5 ? 'Prêt dans 1 an' :
                              performanceLevel === 'Satisfaisant' ? 'Prêt dans 2-3 ans' :
                              'Développement requis';

    // ✅ RÉTENTION → Calculé depuis ANCIENNETE (votre champ)
    const retentionProbability = employee.ANCIENNETE > 15 ? 95 :
                                employee.ANCIENNETE > 10 ? 85 :
                                employee.ANCIENNETE > 5 ? 75 :
                                employee.ANCIENNETE > 2 ? 60 : 40;

    // ✅ DÉPARTEMENT → Calculé depuis POSTE (votre champ)
    const department = employee.POSTE.toLowerCase().includes('directeur') ? 'Direction' :
                      employee.POSTE.toLowerCase().includes('admin') ? 'RH' :
                      employee.POSTE.toLowerCase().includes('chauffeur') ? 'Logistique' :
                      employee.POSTE.toLowerCase().includes('motor') ? 'Production' :
                      employee.POSTE.toLowerCase().includes('resp') ? 'Management' : 'Opérationnel';

    // ✅ NIVEAU MANAGEMENT → Calculé depuis POSTE (votre champ)
    const managementLevel = employee.POSTE.toLowerCase().includes('directeur') ? 'Direction générale' :
                           employee.POSTE.toLowerCase().includes('resp') ? 'Management' :
                           employee.POSTE.toLowerCase().includes('chef') ? 'Supervision' : 'Opérationnel';

    // 🎯 SALAIRE INTELLIGENT → Calculé depuis POSTE + ANCIENNETE + AGE (vos champs)
    const baseSalaryByPosition = {
      'directeur': 80000,
      'resp': 50000,
      'admin': 35000,
      'chauffeur': 28000,
      'motor': 32000,
      'default': 30000
    };

    let baseSalary = baseSalaryByPosition.default;
    const positionLower = employee.POSTE.toLowerCase();
    
    if (positionLower.includes('directeur')) baseSalary = baseSalaryByPosition.directeur;
    else if (positionLower.includes('resp')) baseSalary = baseSalaryByPosition.resp;
    else if (positionLower.includes('admin')) baseSalary = baseSalaryByPosition.admin;
    else if (positionLower.includes('chauffeur')) baseSalary = baseSalaryByPosition.chauffeur;
    else if (positionLower.includes('motor')) baseSalary = baseSalaryByPosition.motor;

    // Bonus basés sur vos données réelles
    const tenureBonus = employee.ANCIENNETE * 1000;  // ✅ ANCIENNETE
    const experienceBonus = Math.max(0, (employee.AGE - 25) * 500);  // ✅ AGE
    const performanceBonus = performanceLevel === 'Excellent' ? 10000 :
                            performanceLevel === 'Bon' ? 5000 :
                            performanceLevel === 'Satisfaisant' ? 2000 : 0;

    const calculatedSalary = baseSalary + tenureBonus + experienceBonus + performanceBonus;

    // ✅ SCORE INCLUSION → Calculé depuis NATIONALITE + AGE + ANCIENNETE (vos champs)
    let inclusionScore = 70; // Base
    
    if (employee.NATIONALITE !== 'Française') inclusionScore += 10;  // ✅ NATIONALITE
    if (employee.AGE >= 25 && employee.AGE <= 55) inclusionScore += 10;  // ✅ AGE
    if (employee.ANCIENNETE > 5) inclusionScore += 10;  // ✅ ANCIENNETE

    return {
      retirementRisk,
      performanceLevel,
      turnoverRisk,
      skillLevel,
      trainingNeeds,
      careerPath,
      successorReadiness,
      retentionProbability,
      department,
      managementLevel,
      salary: calculatedSalary,
      contractType: 'CDI', // Simulé car non disponible
      inclusionScore: Math.min(100, inclusionScore),
    };
  };

  // Filtrer les employés selon les critères avancés
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const metrics = calculateAdvancedMetrics(employee);

      // ✅ Filtre de recherche → NOMS, POSTE, NATIONALITE, AFFECTATION (vos champs)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = `${employee.NOMS} ${employee.POSTE} ${employee.NATIONALITE} ${employee.AFFECTATION}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) return false;
      }

      // ✅ Filtres de base → SEXE, AGE, ANCIENNETE, POSTE, NATIONALITE, AFFECTATION (vos champs)
      if (filters.gender.length > 0 && !filters.gender.includes(employee.SEXE)) return false;
      if (employee.AGE < filters.ageRange.min || employee.AGE > filters.ageRange.max) return false;
      if (employee.ANCIENNETE < filters.tenureRange.min || employee.ANCIENNETE > filters.tenureRange.max) return false;
      if (filters.positions.length > 0 && !filters.positions.includes(employee.POSTE)) return false;
      if (filters.nationalities.length > 0 && !filters.nationalities.includes(employee.NATIONALITE)) return false;
      if (filters.affectations.length > 0 && !filters.affectations.includes(employee.AFFECTATION)) return false;

      // ✅ Filtres temporels → ANNEE_EMBAUCHE (votre champ)
      if (filters.hireYearRange.start && employee.ANNEE_EMBAUCHE < filters.hireYearRange.start) return false;
      if (filters.hireYearRange.end && employee.ANNEE_EMBAUCHE > filters.hireYearRange.end) return false;

      // ✅ Filtres calculés → basés sur vos données
      if (filters.retirementRisk.length > 0 && !filters.retirementRisk.includes(metrics.retirementRisk)) return false;
      if (filters.performanceLevel.length > 0 && !filters.performanceLevel.includes(metrics.performanceLevel)) return false;
      if (metrics.salary < filters.salaryRange.min || metrics.salary > filters.salaryRange.max) return false;
      if (filters.departments.length > 0 && !filters.departments.includes(metrics.department)) return false;
      if (filters.managementLevel.length > 0 && !filters.managementLevel.includes(metrics.managementLevel)) return false;
      if (filters.contractType.length > 0 && !filters.contractType.includes(metrics.contractType)) return false;
      if (filters.turnoverRisk.length > 0 && !filters.turnoverRisk.includes(metrics.turnoverRisk)) return false;
      if (filters.skillLevel.length > 0 && !filters.skillLevel.includes(metrics.skillLevel)) return false;
      if (filters.trainingNeeds.length > 0 && !filters.trainingNeeds.includes(metrics.trainingNeeds)) return false;
      if (metrics.inclusionScore < filters.inclusionScore.min || metrics.inclusionScore > filters.inclusionScore.max) return false;
      if (filters.careerPath.length > 0 && !filters.careerPath.includes(metrics.careerPath)) return false;
      if (filters.successorReadiness.length > 0 && !filters.successorReadiness.includes(metrics.successorReadiness)) return false;
      if (metrics.retentionProbability < filters.retentionProbability.min || metrics.retentionProbability > filters.retentionProbability.max) return false;

      return true;
    });
  }, [employees, filters]);

  // ✅ Statistiques calculées depuis vos données filtrées
  const advancedStats = useMemo(() => {
    const stats = {
      totalFiltered: filteredEmployees.length,
      totalOriginal: employees.length,
      filterEfficiency: ((filteredEmployees.length / employees.length) * 100).toFixed(1),
      
      // Compteurs de risque
      highRetirementRisk: 0,
      highTurnoverRisk: 0,
      lowPerformance: 0,
      
      // Compteurs de talent
      highPerformers: 0,
      readyForPromotion: 0,
      expertLevel: 0,
      
      // Métriques de diversité
      genderBalance: { male: 0, female: 0 },
      avgInclusionScore: 0,
      
      // Métriques financières
      avgSalary: 0,
      salaryRange: { min: Infinity, max: 0 },
      
      // Métriques prédictives
      avgRetentionProbability: 0,
      successorsPipeline: 0,
    };

    filteredEmployees.forEach(employee => {
      const metrics = calculateAdvancedMetrics(employee);
      
      // Comptage basé sur les métriques calculées
      if (metrics.retirementRisk === 'Élevé' || metrics.retirementRisk === 'Critique') stats.highRetirementRisk++;
      if (metrics.turnoverRisk === 'Élevé' || metrics.turnoverRisk === 'Critique') stats.highTurnoverRisk++;
      if (metrics.performanceLevel === 'À améliorer' || metrics.performanceLevel === 'Insuffisant') stats.lowPerformance++;
      if (metrics.performanceLevel === 'Excellent' || metrics.performanceLevel === 'Bon') stats.highPerformers++;
      if (metrics.successorReadiness === 'Prêt maintenant' || metrics.successorReadiness === 'Prêt dans 1 an') stats.readyForPromotion++;
      if (metrics.skillLevel === 'Expert' || metrics.skillLevel === 'Avancé') stats.expertLevel++;
      
      // ✅ Comptage depuis vos champs réels
      if (employee.SEXE === 'M') stats.genderBalance.male++;
      else stats.genderBalance.female++;
      
      // Accumulation pour moyennes
      stats.avgInclusionScore += metrics.inclusionScore;
      stats.avgSalary += metrics.salary;
      stats.salaryRange.min = Math.min(stats.salaryRange.min, metrics.salary);
      stats.salaryRange.max = Math.max(stats.salaryRange.max, metrics.salary);
      stats.avgRetentionProbability += metrics.retentionProbability;
      if (metrics.successorReadiness !== 'Non identifié') stats.successorsPipeline++;
    });

    // Calcul des moyennes
    if (filteredEmployees.length > 0) {
      stats.avgInclusionScore = Math.round(stats.avgInclusionScore / filteredEmployees.length);
      stats.avgSalary = Math.round(stats.avgSalary / filteredEmployees.length);
      stats.avgRetentionProbability = Math.round(stats.avgRetentionProbability / filteredEmployees.length);
    }

    if (stats.salaryRange.min === Infinity) stats.salaryRange.min = 0;

    return stats;
  }, [filteredEmployees, employees]);

  const handleFiltersChange = (newFilters: AdvancedFilterState) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    console.log('Filtres appliqués:', filters);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const handleSavePreset = (name: string) => {
    const newPreset = { name, filters };
    const updatedPresets = [...savedPresets, newPreset];
    setSavedPresets(updatedPresets);
    localStorage.setItem('hr-filter-presets', JSON.stringify(updatedPresets));
  };

  const handleLoadPreset = (presetFilters: AdvancedFilterState) => {
    setFilters(presetFilters);
  };

  const toggleFiltersVisibility = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  return {
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
    calculateAdvancedMetrics,
  };
};