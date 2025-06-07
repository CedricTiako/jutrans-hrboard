import { Employee, HRMetrics, HRInsight, DashboardKPI } from '../types/hr';

/**
 * 🎯 MOTEUR D'ANALYSE RH INTELLIGENT
 * Calculs basés exclusivement sur vos données réelles
 */
export class HRAnalyticsEngine {
  
  /**
   * ✅ CALCUL DES MÉTRIQUES RH AVANCÉES
   * Basé sur vos 8 champs : ID, NOMS, SEXE, NATIONALITE, AGE, ANCIENNETE, POSTE, AFFECTATION, ANNEE_EMBAUCHE
   */
  static calculateEmployeeMetrics(employee: Employee): HRMetrics {
    // 🎯 RISQUE RETRAITE → Calculé depuis AGE
    const retirementRisk = employee.AGE >= 62 ? 'Critique' :
                          employee.AGE >= 58 ? 'Élevé' :
                          employee.AGE >= 55 ? 'Modéré' : 'Faible';

    // 🎯 PERFORMANCE → Calculé depuis ANCIENNETE + AGE + POSTE
    const basePerformance = (employee.ANCIENNETE * 3) + (employee.AGE * 0.8);
    const positionBonus = employee.POSTE.toLowerCase().includes('directeur') ? 20 :
                         employee.POSTE.toLowerCase().includes('resp') ? 15 :
                         employee.POSTE.toLowerCase().includes('admin') ? 10 : 5;
    
    const performanceScore = basePerformance + positionBonus;
    const performanceLevel = performanceScore > 80 ? 'Excellent' :
                            performanceScore > 60 ? 'Bon' :
                            performanceScore > 40 ? 'Satisfaisant' :
                            performanceScore > 25 ? 'À améliorer' : 'Insuffisant';

    // 🎯 RISQUE TURNOVER → Calculé depuis ANCIENNETE + AGE + DATE_FIN_CONTRAT
    const turnoverScore = (employee.ANCIENNETE < 1 ? 40 : 0) +
                         (employee.ANCIENNETE < 3 ? 20 : 0) +
                         (employee.AGE < 25 ? 15 : 0) +
                         (employee.AGE > 55 ? 10 : 0) +
                         (employee.DATE_FIN_CONTRAT ? 25 : 0);
    
    const turnoverRisk = turnoverScore > 50 ? 'Critique' :
                        turnoverScore > 35 ? 'Élevé' :
                        turnoverScore > 20 ? 'Modéré' :
                        turnoverScore > 10 ? 'Faible' : 'Très faible';

    // 🎯 NIVEAU COMPÉTENCES → Calculé depuis ANCIENNETE + POSTE
    const skillScore = employee.ANCIENNETE + 
                      (employee.POSTE.toLowerCase().includes('directeur') ? 10 : 0) +
                      (employee.POSTE.toLowerCase().includes('resp') ? 5 : 0);
    
    const skillLevel = skillScore > 20 ? 'Expert' :
                      skillScore > 15 ? 'Avancé' :
                      skillScore > 8 ? 'Intermédiaire' :
                      skillScore > 3 ? 'Débutant' : 'En formation';

    // 🎯 BESOINS FORMATION → Calculé depuis AGE + ANCIENNETE + POSTE
    const trainingScore = Math.max(0, 25 - employee.ANCIENNETE) + 
                         (employee.AGE < 35 ? 10 : 0) +
                         (skillLevel === 'Débutant' ? 15 : 0);
    
    const trainingNeeds = trainingScore > 30 ? 'Urgent' :
                         trainingScore > 20 ? 'Prioritaire' :
                         trainingScore > 10 ? 'Souhaitable' :
                         trainingScore > 5 ? 'Optionnel' : 'Aucun';

    // 🎯 PARCOURS CARRIÈRE → Calculé depuis AGE + ANCIENNETE + PERFORMANCE
    const careerPath = employee.AGE < 30 && performanceLevel === 'Excellent' ? 'Ascendant' :
                      employee.AGE > 55 && employee.ANCIENNETE > 20 ? 'Stable' :
                      employee.AGE > 50 && performanceLevel !== 'Excellent' ? 'Plateau' :
                      performanceLevel === 'À améliorer' ? 'Transition' : 'Stable';

    // 🎯 SUCCESSION → Calculé depuis PERFORMANCE + ANCIENNETE + AGE
    const successorReadiness = performanceLevel === 'Excellent' && employee.ANCIENNETE > 8 && employee.AGE < 50 ? 'Prêt maintenant' :
                              performanceLevel === 'Bon' && employee.ANCIENNETE > 5 ? 'Prêt dans 1 an' :
                              performanceLevel === 'Satisfaisant' && employee.ANCIENNETE > 3 ? 'Prêt dans 2-3 ans' :
                              performanceLevel !== 'Insuffisant' ? 'Développement requis' : 'Non identifié';

    // 🎯 RÉTENTION → Calculé depuis ANCIENNETE + PERFORMANCE + AGE + TURNOVER RISK
    let retentionBase = 50;
    if (employee.ANCIENNETE > 15) retentionBase += 30;
    else if (employee.ANCIENNETE > 10) retentionBase += 25;
    else if (employee.ANCIENNETE > 5) retentionBase += 15;
    else if (employee.ANCIENNETE > 2) retentionBase += 10;
    
    if (performanceLevel === 'Excellent') retentionBase += 15;
    else if (performanceLevel === 'Bon') retentionBase += 10;
    else if (performanceLevel === 'À améliorer') retentionBase -= 10;
    else if (performanceLevel === 'Insuffisant') retentionBase -= 20;
    
    if (employee.AGE > 55) retentionBase -= 15;
    else if (employee.AGE < 25) retentionBase -= 10;
    
    // Ajustement basé sur le risque de turnover
    if (turnoverRisk === 'Critique') retentionBase -= 25;
    else if (turnoverRisk === 'Élevé') retentionBase -= 15;
    else if (turnoverRisk === 'Modéré') retentionBase -= 5;
    else if (turnoverRisk === 'Très faible') retentionBase += 10;
    
    const retentionProbability = Math.min(95, Math.max(20, retentionBase));

    // 🎯 DÉPARTEMENT → Calculé depuis POSTE
    const department = this.extractDepartment(employee.POSTE);

    // 🎯 NIVEAU MANAGEMENT → Calculé depuis POSTE
    const managementLevel = this.extractManagementLevel(employee.POSTE);

    // 🎯 SALAIRE INTELLIGENT → Calculé depuis POSTE + ANCIENNETE + AGE + PERFORMANCE
    const salary = this.calculateSalary(employee, performanceLevel);

    // 🎯 SCORE INCLUSION → Calculé depuis NATIONALITE + AGE + ANCIENNETE + SEXE
    const inclusionScore = this.calculateInclusionScore(employee);

    // 🎯 INDICE DE TURNOVER → Calculé depuis ANCIENNETE + AGE + PERFORMANCE + CONTRAT
    const turnoverIndex = this.calculateTurnoverIndex(employee, performanceLevel, turnoverRisk);

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
      salary,
      inclusionScore,
      turnoverIndex,
    };
  }

  /**
   * 🎯 EXTRACTION DU DÉPARTEMENT DEPUIS LE POSTE
   */
  private static extractDepartment(poste: string): string {
    const posteLower = poste.toLowerCase();
    
    if (posteLower.includes('directeur')) return 'Direction';
    if (posteLower.includes('admin') || posteLower.includes('rh')) return 'Administration';
    if (posteLower.includes('chauffeur') || posteLower.includes('transport')) return 'Logistique';
    if (posteLower.includes('motor') || posteLower.includes('production')) return 'Production';
    if (posteLower.includes('commercial') || posteLower.includes('vente')) return 'Commercial';
    if (posteLower.includes('finance') || posteLower.includes('compta')) return 'Finance';
    if (posteLower.includes('it') || posteLower.includes('informatique')) return 'IT';
    if (posteLower.includes('maintenance') || posteLower.includes('technique')) return 'Technique';
    
    return 'Support';
  }

  /**
   * 🎯 EXTRACTION DU NIVEAU DE MANAGEMENT DEPUIS LE POSTE
   */
  private static extractManagementLevel(poste: string): string {
    const posteLower = poste.toLowerCase();
    
    if (posteLower.includes('directeur général') || posteLower.includes('pdg')) return 'Direction générale';
    if (posteLower.includes('directeur')) return 'Direction';
    if (posteLower.includes('resp') || posteLower.includes('manager')) return 'Management';
    if (posteLower.includes('chef') || posteLower.includes('superviseur')) return 'Supervision';
    if (posteLower.includes('senior') || posteLower.includes('principal')) return 'Senior';
    
    return 'Opérationnel';
  }

  /**
   * 🎯 CALCUL INTELLIGENT DU SALAIRE
   */
  private static calculateSalary(employee: Employee, performanceLevel: string): number {
    // Base salariale par poste
    const salaryBase = {
      'directeur général': 120000,
      'directeur': 85000,
      'resp': 55000,
      'manager': 50000,
      'admin': 38000,
      'chauffeur': 32000,
      'motor': 35000,
      'technique': 40000,
      'commercial': 45000,
      'default': 35000
    };

    let baseSalary = salaryBase.default;
    const posteLower = employee.POSTE.toLowerCase();
    
    // Détermination du salaire de base
    if (posteLower.includes('directeur général')) baseSalary = salaryBase['directeur général'];
    else if (posteLower.includes('directeur')) baseSalary = salaryBase.directeur;
    else if (posteLower.includes('resp')) baseSalary = salaryBase.resp;
    else if (posteLower.includes('manager')) baseSalary = salaryBase.manager;
    else if (posteLower.includes('admin')) baseSalary = salaryBase.admin;
    else if (posteLower.includes('chauffeur')) baseSalary = salaryBase.chauffeur;
    else if (posteLower.includes('motor')) baseSalary = salaryBase.motor;
    else if (posteLower.includes('technique')) baseSalary = salaryBase.technique;
    else if (posteLower.includes('commercial')) baseSalary = salaryBase.commercial;

    // Bonus d'ancienneté (1.5% par année)
    const tenureBonus = baseSalary * (employee.ANCIENNETE * 0.015);
    
    // Bonus d'expérience (âge - 22) * 800€
    const experienceBonus = Math.max(0, (employee.AGE - 22) * 800);
    
    // Bonus de performance
    const performanceMultiplier = {
      'Excellent': 1.25,
      'Bon': 1.15,
      'Satisfaisant': 1.05,
      'À améliorer': 0.95,
      'Insuffisant': 0.85
    };
    
    const performanceBonus = baseSalary * (performanceMultiplier[performanceLevel] - 1);
    
    return Math.round(baseSalary + tenureBonus + experienceBonus + performanceBonus);
  }

  /**
   * 🎯 CALCUL DU SCORE D'INCLUSION
   */
  private static calculateInclusionScore(employee: Employee): number {
    let score = 70; // Base
    
    // Bonus diversité culturelle
    if (employee.NATIONALITE !== 'Française') score += 12;
    
    // Bonus équilibre générationnel
    if (employee.AGE >= 25 && employee.AGE <= 55) score += 8;
    else if (employee.AGE < 25 || employee.AGE > 55) score += 5;
    
    // Bonus stabilité
    if (employee.ANCIENNETE > 10) score += 10;
    else if (employee.ANCIENNETE > 5) score += 6;
    else if (employee.ANCIENNETE > 2) score += 3;
    
    // Bonus intégration
    if (employee.ANCIENNETE > 1) score += 5;
    
    return Math.min(100, score);
  }

  /**
   * 🎯 CALCUL DE L'INDICE DE TURNOVER
   * Nouvel indicateur spécifique pour l'analyse du turnover
   */
  private static calculateTurnoverIndex(employee: Employee, performanceLevel: string, turnoverRisk: string): number {
    // Base de calcul
    let index = 50; // Point de départ neutre
    
    // Facteurs d'ancienneté (impact majeur)
    if (employee.ANCIENNETE < 1) index += 30;
    else if (employee.ANCIENNETE < 2) index += 20;
    else if (employee.ANCIENNETE < 3) index += 15;
    else if (employee.ANCIENNETE < 5) index += 10;
    else if (employee.ANCIENNETE > 10) index -= 15;
    else if (employee.ANCIENNETE > 5) index -= 10;
    
    // Facteurs d'âge
    if (employee.AGE < 25) index += 15;
    else if (employee.AGE < 30) index += 10;
    else if (employee.AGE > 55) index += 5; // Risque de départ en retraite
    else if (employee.AGE >= 35 && employee.AGE <= 45) index -= 5; // Âge de stabilité
    
    // Facteurs de performance
    if (performanceLevel === 'Excellent') index -= 15; // Moins susceptible de partir
    else if (performanceLevel === 'Bon') index -= 10;
    else if (performanceLevel === 'À améliorer') index += 15;
    else if (performanceLevel === 'Insuffisant') index += 25;
    
    // Facteur de contrat
    if (employee.DATE_FIN_CONTRAT) {
      const endDate = new Date(employee.DATE_FIN_CONTRAT);
      const currentDate = new Date();
      const monthsUntilEnd = (endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsUntilEnd <= 3) index += 25; // Fin de contrat imminente
      else if (monthsUntilEnd <= 6) index += 15;
      else if (monthsUntilEnd <= 12) index += 10;
    }
    
    // Facteur de poste
    const posteLower = employee.POSTE.toLowerCase();
    if (posteLower.includes('directeur') || posteLower.includes('resp')) {
      index -= 10; // Postes à responsabilité = plus stable
    }
    
    // Normalisation entre 0 et 100
    return Math.min(100, Math.max(0, index));
  }

  /**
   * 🎯 GÉNÉRATION D'INSIGHTS IA
   */
  static generateHRInsights(employees: Employee[]): HRInsight[] {
    const insights: HRInsight[] = [];
    const metrics = employees.map(emp => this.calculateEmployeeMetrics(emp));
    
    // Analyse des risques de retraite
    const criticalRetirement = metrics.filter(m => m.retirementRisk === 'Critique').length;
    const highRetirement = metrics.filter(m => m.retirementRisk === 'Élevé').length;
    
    if (criticalRetirement > 0) {
      insights.push({
        type: 'risk',
        priority: 'critical',
        title: `${criticalRetirement} employé(s) en risque critique de départ en retraite`,
        description: `Des départs imminents nécessitent une action urgente pour assurer la continuité opérationnelle.`,
        impact: 'Perte de connaissances critiques et disruption opérationnelle',
        actions: [
          'Lancer immédiatement un plan de succession',
          'Organiser le transfert de connaissances',
          'Identifier et former les remplaçants',
          'Documenter les processus critiques'
        ],
        timeline: 'Immédiat (0-3 mois)',
        kpis: ['Taux de couverture succession', 'Temps de transfert connaissances']
      });
    }

    // Analyse des performances
    const lowPerformers = metrics.filter(m => m.performanceLevel === 'À améliorer' || m.performanceLevel === 'Insuffisant').length;
    const highPerformers = metrics.filter(m => m.performanceLevel === 'Excellent').length;
    
    if (lowPerformers > employees.length * 0.15) {
      insights.push({
        type: 'recommendation',
        priority: 'high',
        title: `${lowPerformers} employé(s) nécessitent un accompagnement performance`,
        description: `Un pourcentage élevé d'employés sous-performants impacte la productivité globale.`,
        impact: 'Baisse de productivité et risque de contagion',
        actions: [
          'Mettre en place des plans de développement individuels',
          'Organiser des formations ciblées',
          'Assigner des mentors aux employés en difficulté',
          'Revoir les processus et outils de travail'
        ],
        timeline: 'Court terme (3-6 mois)',
        kpis: ['Évolution scores performance', 'Taux de réussite plans développement']
      });
    }

    // Analyse du turnover
    const highTurnoverRisk = metrics.filter(m => m.turnoverRisk === 'Élevé' || m.turnoverRisk === 'Critique').length;
    
    if (highTurnoverRisk > 0) {
      insights.push({
        type: 'alert',
        priority: 'high',
        title: `${highTurnoverRisk} employé(s) à risque élevé de départ`,
        description: `Des employés clés pourraient quitter l'organisation prochainement.`,
        impact: 'Coûts de recrutement et perte de talents',
        actions: [
          'Conduire des entretiens de rétention',
          'Revoir les packages de rémunération',
          'Améliorer les conditions de travail',
          'Proposer des opportunités de développement'
        ],
        timeline: 'Urgent (0-2 mois)',
        kpis: ['Taux de rétention', 'Satisfaction employés', 'Coût du turnover']
      });
    }

    // Analyse spécifique du turnover (nouveau)
    const turnoverIndexes = metrics.map(m => m.turnoverIndex);
    const avgTurnoverIndex = turnoverIndexes.reduce((sum, val) => sum + val, 0) / turnoverIndexes.length;
    const highTurnoverIndexEmployees = metrics.filter(m => m.turnoverIndex > 70).length;
    
    if (avgTurnoverIndex > 50 || highTurnoverIndexEmployees > employees.length * 0.1) {
      insights.push({
        type: 'risk',
        priority: avgTurnoverIndex > 60 ? 'critical' : 'high',
        title: `Indice de turnover élevé: ${Math.round(avgTurnoverIndex)}/100`,
        description: `L'analyse prédictive indique un risque de turnover supérieur à la normale dans l'organisation.`,
        impact: 'Instabilité des équipes, coûts de recrutement élevés et perte de productivité',
        actions: [
          'Réaliser une enquête de satisfaction et d\'engagement',
          'Analyser les causes profondes des départs récents',
          'Mettre en place un programme de fidélisation ciblé',
          'Revoir la politique salariale et les avantages sociaux',
          'Améliorer les parcours de carrière internes'
        ],
        timeline: 'Prioritaire (1-3 mois)',
        kpis: ['Taux de turnover', 'Coût par recrutement', 'Durée moyenne en poste']
      });
    }

    // Opportunités de succession
    const readySuccessors = metrics.filter(m => m.successorReadiness === 'Prêt maintenant' || m.successorReadiness === 'Prêt dans 1 an').length;
    
    if (readySuccessors > 0) {
      insights.push({
        type: 'opportunity',
        priority: 'medium',
        title: `${readySuccessors} candidat(s) prêt(s) pour une promotion`,
        description: `Des talents internes sont identifiés pour des évolutions de carrière.`,
        impact: 'Motivation accrue et rétention des talents',
        actions: [
          'Planifier des promotions internes',
          'Créer des parcours de développement',
          'Organiser des formations leadership',
          'Mettre en place du mentoring'
        ],
        timeline: 'Moyen terme (6-12 mois)',
        kpis: ['Taux promotion interne', 'Satisfaction carrière', 'Rétention talents']
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * 🎯 CALCUL DES KPI DASHBOARD
   */
  static calculateDashboardKPIs(employees: Employee[]): DashboardKPI {
    if (employees.length === 0) {
      return {
        totalEmployees: 0,
        avgAge: 0,
        avgTenure: 0,
        newHires: 0,
        nearRetirement: 0,
        genderRatio: { male: 0, female: 0 },
        diversityIndex: 0,
        retentionRate: 0,
        performanceIndex: 0,
        turnoverRate: 0,
        turnoverRiskIndex: 0
      };
    }
    
    const metrics = employees.map(emp => this.calculateEmployeeMetrics(emp));
    
    const totalEmployees = employees.length;
    const avgAge = employees.reduce((sum, emp) => sum + emp.AGE, 0) / totalEmployees;
    const avgTenure = employees.reduce((sum, emp) => sum + emp.ANCIENNETE, 0) / totalEmployees;
    const newHires = employees.filter(emp => emp.ANCIENNETE <= 1).length;
    const nearRetirement = employees.filter(emp => emp.AGE >= 55).length;
    
    const genderRatio = {
      male: employees.filter(emp => emp.SEXE === 'M').length,
      female: employees.filter(emp => emp.SEXE === 'F').length
    };
    
    // Calcul de l'indice de diversité (basé sur nationalités)
    const nationalities = new Set(employees.map(emp => emp.NATIONALITE));
    const diversityIndex = Math.min(100, (nationalities.size / totalEmployees) * 100 * 10);
    
    // Taux de rétention moyen
    const retentionRate = metrics.reduce((sum, m) => sum + m.retentionProbability, 0) / metrics.length;
    
    // Indice de performance global
    const performanceScores = metrics.map(m => {
      switch (m.performanceLevel) {
        case 'Excellent': return 5;
        case 'Bon': return 4;
        case 'Satisfaisant': return 3;
        case 'À améliorer': return 2;
        case 'Insuffisant': return 1;
        default: return 3;
      }
    });
    const performanceIndex = (performanceScores.reduce((sum, score) => sum + score, 0) / performanceScores.length) * 20;
    
    // Calcul du taux de turnover (nouveau)
    // Formule: (Nombre de départs sur la période / Effectif moyen sur la période) * 100
    // Ici, nous utilisons une estimation basée sur les employés à risque élevé de turnover
    const highTurnoverRiskCount = metrics.filter(m => m.turnoverRisk === 'Élevé' || m.turnoverRisk === 'Critique').length;
    const turnoverRate = (highTurnoverRiskCount / totalEmployees) * 100;
    
    // Indice de risque de turnover global (nouveau)
    const turnoverRiskIndex = metrics.reduce((sum, m) => sum + m.turnoverIndex, 0) / metrics.length;
    
    return {
      totalEmployees,
      avgAge: Math.round(avgAge * 10) / 10,
      avgTenure: Math.round(avgTenure * 10) / 10,
      newHires,
      nearRetirement,
      genderRatio,
      diversityIndex: Math.round(diversityIndex),
      retentionRate: Math.round(retentionRate),
      performanceIndex: Math.round(performanceIndex),
      turnoverRate: Math.round(turnoverRate * 10) / 10,
      turnoverRiskIndex: Math.round(turnoverRiskIndex)
    };
  }

  /**
   * 🎯 ANALYSE DÉTAILLÉE DU TURNOVER
   * Nouvelle méthode spécifique pour l'analyse du turnover
   */
  static analyzeTurnover(employees: Employee[]): {
    turnoverRate: number;
    turnoverRiskIndex: number;
    highRiskEmployees: number;
    departmentRisks: Record<string, number>;
    ageGroupRisks: Record<string, number>;
    tenureGroupRisks: Record<string, number>;
    riskFactors: string[];
    recommendations: string[];
  } {
    const metrics = employees.map(emp => this.calculateEmployeeMetrics(emp));
    
    // Taux de turnover estimé
    const highTurnoverRiskCount = metrics.filter(m => m.turnoverRisk === 'Élevé' || m.turnoverRisk === 'Critique').length;
    const turnoverRate = (highTurnoverRiskCount / employees.length) * 100;
    
    // Indice de risque moyen
    const turnoverRiskIndex = metrics.reduce((sum, m) => sum + m.turnoverIndex, 0) / metrics.length;
    
    // Analyse par département
    const departmentRisks: Record<string, number> = {};
    const departments = [...new Set(metrics.map(m => m.department))];
    
    departments.forEach(dept => {
      const deptMetrics = metrics.filter(m => m.department === dept);
      departmentRisks[dept] = deptMetrics.reduce((sum, m) => sum + m.turnoverIndex, 0) / deptMetrics.length;
    });
    
    // Analyse par tranche d'âge
    const ageGroupRisks: Record<string, number> = {
      '21 - 30': 0,
      '31 - 35': 0,
      '36 - 40': 0,
      '41 - 45': 0,
      '46 - 50': 0,
      '51 - 55': 0,
      '56 - 60': 0,
      '> 60': 0
    };
    
    Object.keys(ageGroupRisks).forEach(ageGroup => {
      const groupEmployees = employees.filter(emp => emp.TRANCHE_AGE === ageGroup);
      if (groupEmployees.length > 0) {
        const groupMetrics = metrics.filter((_, i) => employees[i].TRANCHE_AGE === ageGroup);
        ageGroupRisks[ageGroup] = groupMetrics.reduce((sum, m) => sum + m.turnoverIndex, 0) / groupMetrics.length;
      }
    });
    
    // Analyse par ancienneté
    const tenureGroupRisks: Record<string, number> = {
      '0 - 5': 0,
      '6 - 10': 0,
      '11 - 15': 0,
      '16 - 20': 0,
      '21+': 0
    };
    
    Object.keys(tenureGroupRisks).forEach(tenureGroup => {
      const groupEmployees = employees.filter(emp => emp.TRANCHE_ANCIENNETE === tenureGroup);
      if (groupEmployees.length > 0) {
        const groupMetrics = metrics.filter((_, i) => employees[i].TRANCHE_ANCIENNETE === tenureGroup);
        tenureGroupRisks[tenureGroup] = groupMetrics.reduce((sum, m) => sum + m.turnoverIndex, 0) / groupMetrics.length;
      }
    });
    
    // Identification des facteurs de risque
    const riskFactors: string[] = [];
    
    // Facteurs liés à l'âge
    const youngEmployeesRisk = ageGroupRisks['21 - 30'];
    if (youngEmployeesRisk > 60) {
      riskFactors.push('Forte proportion de jeunes employés à risque de départ');
    }
    
    // Facteurs liés à l'ancienneté
    const newEmployeesRisk = tenureGroupRisks['0 - 5'];
    if (newEmployeesRisk > 60) {
      riskFactors.push('Employés récents présentant un risque élevé de départ');
    }
    
    // Facteurs liés aux départements
    const highRiskDepartments = Object.entries(departmentRisks)
      .filter(([_, risk]) => risk > 60)
      .map(([dept, _]) => dept);
    
    if (highRiskDepartments.length > 0) {
      riskFactors.push(`Départements à risque: ${highRiskDepartments.join(', ')}`);
    }
    
    // Facteurs liés aux contrats
    const temporaryContractsCount = employees.filter(emp => emp.DATE_FIN_CONTRAT !== null).length;
    const temporaryContractsPercentage = (temporaryContractsCount / employees.length) * 100;
    
    if (temporaryContractsPercentage > 20) {
      riskFactors.push(`Proportion élevée de contrats temporaires (${Math.round(temporaryContractsPercentage)}%)`);
    }
    
    // Recommandations basées sur l'analyse
    const recommendations: string[] = [];
    
    if (turnoverRate > 15) {
      recommendations.push('Mettre en place un programme de rétention des talents');
    }
    
    if (highRiskDepartments.length > 0) {
      recommendations.push(`Analyser les causes de turnover dans les départements: ${highRiskDepartments.join(', ')}`);
    }
    
    if (newEmployeesRisk > 60) {
      recommendations.push('Améliorer le processus d\'onboarding et d\'intégration des nouveaux employés');
    }
    
    if (youngEmployeesRisk > 60) {
      recommendations.push('Développer des parcours de carrière attractifs pour les jeunes talents');
    }
    
    if (temporaryContractsPercentage > 20) {
      recommendations.push('Évaluer la possibilité de convertir certains CDD en CDI pour les talents clés');
    }
    
    recommendations.push('Réaliser des entretiens de départ pour comprendre les motifs de turnover');
    recommendations.push('Mettre en place une enquête de satisfaction et d\'engagement régulière');
    
    return {
      turnoverRate: Math.round(turnoverRate * 10) / 10,
      turnoverRiskIndex: Math.round(turnoverRiskIndex),
      highRiskEmployees: highTurnoverRiskCount,
      departmentRisks,
      ageGroupRisks,
      tenureGroupRisks,
      riskFactors,
      recommendations
    };
  }
}