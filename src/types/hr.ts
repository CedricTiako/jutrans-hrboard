// Types centralisés pour tout le système HR
export interface Employee {
  ID: string;
  NOMS: string;
  SEXE: 'M' | 'F';
  NATIONALITE: string;
  DATE_NAISSANCE: string;
  DATE_EMBAUCHE: string;
  DATE_FIN_CONTRAT: string | null; // Nouveau champ pour la date de fin de contrat
  ANNEE_NAISSANCE: number;
  ANNEE_EMBAUCHE: number;
  AGE: number;
  ANCIENNETE: number;
  TRANCHE_AGE: string;
  TRANCHE_ANCIENNETE: string;
  POSTE: string;
  PERSONNE_CONTACTER: string;
  AFFECTATION: string;
  SALAIRE: string;
  YEAR: number;
}

export interface HRMetrics {
  retirementRisk: 'Faible' | 'Modéré' | 'Élevé' | 'Critique';
  performanceLevel: 'Excellent' | 'Bon' | 'Satisfaisant' | 'À améliorer' | 'Insuffisant';
  turnoverRisk: 'Très faible' | 'Faible' | 'Modéré' | 'Élevé' | 'Critique';
  skillLevel: 'Expert' | 'Avancé' | 'Intermédiaire' | 'Débutant' | 'En formation';
  trainingNeeds: 'Urgent' | 'Prioritaire' | 'Souhaitable' | 'Optionnel' | 'Aucun';
  careerPath: 'Ascendant' | 'Stable' | 'Plateau' | 'Transition' | 'Déclin';
  successorReadiness: 'Prêt maintenant' | 'Prêt dans 1 an' | 'Prêt dans 2-3 ans' | 'Développement requis' | 'Non identifié';
  retentionProbability: number;
  department: string;
  managementLevel: string;
  salary: number;
  inclusionScore: number;
  turnoverIndex: number; // Nouvel indice de turnover
}

export interface DashboardKPI {
  totalEmployees: number;
  avgAge: number;
  avgTenure: number;
  newHires: number;
  nearRetirement: number;
  genderRatio: { male: number; female: number };
  diversityIndex: number;
  retentionRate: number;
  performanceIndex: number;
  turnoverRate: number; // Nouveau KPI de taux de turnover
  turnoverRiskIndex: number; // Nouvel indice de risque de turnover
}

export interface RiskAnalysis {
  criticalPositions: CriticalPosition[];
  retirementRisk: RetirementRisk;
  turnoverRisk: TurnoverRisk;
  successionGaps: SuccessionGap[];
}

export interface CriticalPosition {
  position: string;
  count: number;
  avgAge: number;
  avgTenure: number;
  nearRetirement: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  employees: Employee[];
}

export interface RetirementRisk {
  nearRetirement: number;
  veryNearRetirement: number;
  riskByPosition: Record<string, any>;
  employees: Employee[];
}

export interface TurnoverRisk {
  highRisk: Employee[];
  mediumRisk: Employee[];
  lowRisk: Employee[];
  factors: string[];
  departmentRisks: Record<string, number>;
  ageGroupRisks: Record<string, number>;
  tenureGroupRisks: Record<string, number>;
  recommendations: string[];
}

export interface SuccessionGap {
  position: string;
  currentHolder: Employee;
  successors: Employee[];
  readinessLevel: string;
  urgency: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
}

export interface RecruitmentPlan {
  immediate: RecruitmentNeed[];
  shortTerm: RecruitmentNeed[];
  mediumTerm: RecruitmentNeed[];
  longTerm: RecruitmentNeed[];
}

export interface RecruitmentNeed {
  position: string;
  quantity: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reasons: string[];
  timeline: string;
  budget: number;
  skills: string[];
}

export interface HRInsight {
  type: 'risk' | 'opportunity' | 'recommendation' | 'alert';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  actions: string[];
  timeline: string;
  kpis: string[];
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: any;
  createdAt: Date;
  lastUsed: Date;
  category: 'demographic' | 'performance' | 'risk' | 'custom';
}

// Nouveaux types pour le CRUD
export interface EmployeeFormData {
  NOMS: string;
  SEXE: 'M' | 'F';
  NATIONALITE: string;
  DATE_NAISSANCE: string;
  DATE_EMBAUCHE: string;
  DATE_FIN_CONTRAT: string | null;
  POSTE: string;
  PERSONNE_CONTACTER: string;
  AFFECTATION: string;
  SALAIRE: string;
}

export interface EmployeeValidationErrors {
  NOMS?: string;
  SEXE?: string;
  NATIONALITE?: string;
  DATE_NAISSANCE?: string;
  DATE_EMBAUCHE?: string;
  DATE_FIN_CONTRAT?: string;
  POSTE?: string;
  PERSONNE_CONTACTER?: string;
  AFFECTATION?: string;
  SALAIRE?: string;
}

// Nouveau type pour l'analyse détaillée du turnover
export interface TurnoverAnalysis {
  turnoverRate: number;
  turnoverRiskIndex: number;
  highRiskEmployees: number;
  departmentRisks: Record<string, number>;
  ageGroupRisks: Record<string, number>;
  tenureGroupRisks: Record<string, number>;
  riskFactors: string[];
  recommendations: string[];
  historicalTrends?: {
    years: number[];
    rates: number[];
  };
}