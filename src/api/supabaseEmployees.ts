import { Employee, EmployeeFormData } from '../types/hr';
import { SupabaseEmployeeService } from '../services/supabaseEmployeeService';

// Simuler un délai de chargement pour une expérience utilisateur cohérente
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchEmployees = async (year?: number): Promise<Employee[]> => {
  await delay(300);
  return SupabaseEmployeeService.getAllEmployees(year);
};

export const fetchEmployee = async (id: string): Promise<Employee | null> => {
  await delay(200);
  return SupabaseEmployeeService.getEmployeeById(id);
};

export const createEmployee = async (data: EmployeeFormData, year: number): Promise<{ success: boolean; employee?: Employee; error?: string }> => {
  await delay(500);
  
  try {
    const result = await SupabaseEmployeeService.createEmployee(data, year);
    if (result.success && result.employee) {
      return { success: true, employee: result.employee };
    } else {
      return { success: false, error: 'Erreur de validation des données' };
    }
  } catch (error) {
    console.error('Erreur lors de la création:', error);
    return { success: false, error: 'Erreur lors de la création de l\'employé' };
  }
};

export const updateEmployee = async (id: string, data: EmployeeFormData): Promise<{ success: boolean; employee?: Employee; error?: string }> => {
  await delay(500);
  
  try {
    const result = await SupabaseEmployeeService.updateEmployee(id, data);
    if (result.success && result.employee) {
      return { success: true, employee: result.employee };
    } else {
      return { success: false, error: 'Erreur de validation des données' };
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return { success: false, error: 'Erreur lors de la mise à jour de l\'employé' };
  }
};

export const deleteEmployee = async (id: string): Promise<{ success: boolean; message: string }> => {
  await delay(500);
  
  try {
    const result = await SupabaseEmployeeService.deleteEmployee(id);
    return result;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return { success: false, message: 'Erreur lors de la suppression de l\'employé' };
  }
};

export const searchEmployees = async (query: string, year?: number): Promise<Employee[]> => {
  await delay(300);
  return SupabaseEmployeeService.searchEmployees(query, year);
};

// Fonctions d'analyse basées sur les données Supabase
export const fetchGenderDistribution = async (year: number) => {
  const employees = await fetchEmployees(year);
  const male = employees.filter(emp => emp.SEXE === 'M').length;
  const female = employees.filter(emp => emp.SEXE === 'F').length;
  return { male, female, total: employees.length };
};

export const fetchAgeDistribution = async (year: number) => {
  const employees = await fetchEmployees(year);
  const ageGroups: Record<string, number> = {
    '21 - 30': 0,
    '31 - 35': 0,
    '36 - 40': 0,
    '41 - 45': 0,
    '46 - 50': 0,
    '51 - 55': 0,
    '56 - 60': 0,
    '> 60': 0
  };

  employees.forEach(emp => {
    if (emp.AGE <= 30) ageGroups['21 - 30']++;
    else if (emp.AGE <= 35) ageGroups['31 - 35']++;
    else if (emp.AGE <= 40) ageGroups['36 - 40']++;
    else if (emp.AGE <= 45) ageGroups['41 - 45']++;
    else if (emp.AGE <= 50) ageGroups['46 - 50']++;
    else if (emp.AGE <= 55) ageGroups['51 - 55']++;
    else if (emp.AGE <= 60) ageGroups['56 - 60']++;
    else ageGroups['> 60']++;
  });

  return ageGroups;
};

export const fetchTenureDistribution = async (year: number) => {
  const employees = await fetchEmployees(year);
  const tenureGroups: Record<string, number> = {
    '0 - 5': 0,
    '6 - 10': 0,
    '11 - 15': 0,
    '16 - 20': 0,
    '21+': 0
  };

  employees.forEach(emp => {
    if (emp.ANCIENNETE <= 5) tenureGroups['0 - 5']++;
    else if (emp.ANCIENNETE <= 10) tenureGroups['6 - 10']++;
    else if (emp.ANCIENNETE <= 15) tenureGroups['11 - 15']++;
    else if (emp.ANCIENNETE <= 20) tenureGroups['16 - 20']++;
    else tenureGroups['21+']++;
  });

  return tenureGroups;
};

export const fetchPositionDistribution = async (year: number) => {
  const employees = await fetchEmployees(year);
  const positionMap = new Map<string, number>();
  
  employees.forEach(emp => {
    const count = positionMap.get(emp.POSTE) || 0;
    positionMap.set(emp.POSTE, count + 1);
  });

  return Array.from(positionMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const fetchDashboardStats = async (year: number) => {
  const employees = await fetchEmployees(year);
  const contractStats = await SupabaseEmployeeService.getContractStats(year);
  
  const totalEmployees = employees.length;
  const avgAge = employees.reduce((sum, emp) => sum + emp.AGE, 0) / totalEmployees;
  const avgTenure = employees.reduce((sum, emp) => sum + emp.ANCIENNETE, 0) / totalEmployees;
  
  const newHires = employees.filter(emp => emp.ANCIENNETE <= 1).length;
  const nearRetirement = employees.filter(emp => emp.AGE >= 55).length;

  return {
    totalEmployees,
    avgAge: parseFloat(avgAge.toFixed(1)),
    avgTenure: parseFloat(avgTenure.toFixed(1)),
    newHires,
    nearRetirement,
    temporaryContracts: contractStats.temporary,
    expiredContracts: contractStats.expired
  };
};

export const fetchHiringsByYear = async () => {
  const years = [2023, 2024, 2025];
  const hiringsByYear: Record<string, number> = {};
  
  for (const year of years) {
    const employees = await fetchEmployees(year);
    const newHires = employees.filter(emp => emp.ANNEE_EMBAUCHE === year).length;
    hiringsByYear[year.toString()] = newHires;
  }
  
  return hiringsByYear;
};

export const fetchYearOverYearData = async () => {
  const years = [2023, 2024, 2025];
  const data = {
    years,
    headcount: [] as number[],
    avgAge: [] as number[],
    avgTenure: [] as number[],
    newHires: [] as number[],
    temporaryContracts: [] as number[],
    expiredContracts: [] as number[],
    maleHeadcount: [] as number[],
    femaleHeadcount: [] as number[]
  };

  for (const year of years) {
    const stats = await fetchDashboardStats(year);
    const genderData = await fetchGenderDistribution(year);
    
    data.headcount.push(stats.totalEmployees);
    data.avgAge.push(stats.avgAge);
    data.avgTenure.push(stats.avgTenure);
    data.newHires.push(stats.newHires);
    data.temporaryContracts.push(stats.temporaryContracts);
    data.expiredContracts.push(stats.expiredContracts);
    data.maleHeadcount.push(genderData.male);
    data.femaleHeadcount.push(genderData.female);
  }

  return data;
};

// Fonctions d'analyse des risques
export const fetchDepartures = async (year: number) => {
  const currentYearEmployees = await fetchEmployees(year);
  const previousYearEmployees = await fetchEmployees(year - 1);
  
  const currentIds = new Set(currentYearEmployees.map(emp => emp.ID));
  const departures = previousYearEmployees.filter(emp => !currentIds.has(emp.ID));
  
  return {
    total: departures.length,
    byPosition: departures.reduce((acc, emp) => {
      acc[emp.POSTE] = (acc[emp.POSTE] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byAge: departures.reduce((acc, emp) => {
      if (emp.AGE >= 55) acc.retirement++;
      else if (emp.AGE <= 35) acc.young++;
      else acc.midCareer++;
      return acc;
    }, { retirement: 0, young: 0, midCareer: 0 }),
    employees: departures
  };
};

export const fetchRetirementRisk = async (year: number) => {
  const employees = await fetchEmployees(year);
  
  const nearRetirement = employees.filter(emp => emp.AGE >= 55);
  const veryNearRetirement = employees.filter(emp => emp.AGE >= 60);
  
  const riskByPosition = nearRetirement.reduce((acc, emp) => {
    if (!acc[emp.POSTE]) {
      acc[emp.POSTE] = {
        total: 0,
        nearRetirement: 0,
        veryNearRetirement: 0,
        riskLevel: 'low'
      };
    }
    acc[emp.POSTE].nearRetirement++;
    if (emp.AGE >= 60) acc[emp.POSTE].veryNearRetirement++;
    return acc;
  }, {} as Record<string, any>);
  
  Object.keys(riskByPosition).forEach(position => {
    const totalInPosition = employees.filter(emp => emp.POSTE === position).length;
    riskByPosition[position].total = totalInPosition;
    const riskPercentage = (riskByPosition[position].nearRetirement / totalInPosition) * 100;
    
    if (riskPercentage >= 50) riskByPosition[position].riskLevel = 'high';
    else if (riskPercentage >= 25) riskByPosition[position].riskLevel = 'medium';
    else riskByPosition[position].riskLevel = 'low';
  });
  
  return {
    nearRetirement: nearRetirement.length,
    veryNearRetirement: veryNearRetirement.length,
    riskByPosition,
    employees: nearRetirement
  };
};

export const fetchCriticalPositions = async (year: number) => {
  const employees = await fetchEmployees(year);
  
  const positionGroups = employees.reduce((acc, emp) => {
    if (!acc[emp.POSTE]) {
      acc[emp.POSTE] = [];
    }
    acc[emp.POSTE].push(emp);
    return acc;
  }, {} as Record<string, Employee[]>);
  
  const criticalPositions = Object.entries(positionGroups).map(([position, positionEmployees]) => {
    const count = positionEmployees.length;
    const avgAge = positionEmployees.reduce((sum, emp) => sum + emp.AGE, 0) / count;
    const avgTenure = positionEmployees.reduce((sum, emp) => sum + emp.ANCIENNETE, 0) / count;
    const nearRetirement = positionEmployees.filter(emp => emp.AGE >= 55).length;
    
    const riskFactors: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    
    if (count <= 2) riskFactors.push('Effectif réduit');
    if (avgAge >= 50) riskFactors.push('Âge moyen élevé');
    
    const retirementRiskPercentage = (nearRetirement / count) * 100;
    if (retirementRiskPercentage >= 30) riskFactors.push('Risque de départ à la retraite');
    if (avgTenure >= 15) riskFactors.push('Ancienneté élevée');
    
    if (riskFactors.length >= 3) riskLevel = 'high';
    else if (riskFactors.length >= 2) riskLevel = 'medium';
    
    return {
      position,
      count,
      avgAge: parseFloat(avgAge.toFixed(1)),
      avgTenure: parseFloat(avgTenure.toFixed(1)),
      nearRetirement,
      riskLevel,
      riskFactors,
      employees: positionEmployees
    };
  });
  
  return criticalPositions.sort((a, b) => {
    const riskOrder = { high: 3, medium: 2, low: 1 };
    if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) {
      return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
    }
    return b.riskFactors.length - a.riskFactors.length;
  });
};

export const fetchRecruitmentNeeds = async (year: number) => {
  const criticalPositions = await fetchCriticalPositions(year);
  
  const byPosition: Record<string, any> = {};
  let immediate = 0;
  let shortTerm = 0;
  let mediumTerm = 0;
  let highPriority = 0;
  
  criticalPositions.forEach(position => {
    const needsAnalysis = {
      currentCount: position.count,
      nearRetirement: position.nearRetirement,
      recommendedHires: 0,
      priority: 'low' as 'low' | 'medium' | 'high',
      timeframe: 'medium-term' as 'immediate' | 'short-term' | 'medium-term',
      reasons: [] as string[]
    };
    
    if (position.riskLevel === 'high') {
      needsAnalysis.recommendedHires = Math.max(1, Math.ceil(position.nearRetirement * 0.8));
      needsAnalysis.priority = 'high';
      needsAnalysis.timeframe = 'immediate';
      needsAnalysis.reasons.push('Risque élevé de départ');
      immediate += needsAnalysis.recommendedHires;
      highPriority += needsAnalysis.recommendedHires;
    } else if (position.riskLevel === 'medium') {
      needsAnalysis.recommendedHires = Math.max(1, Math.ceil(position.nearRetirement * 0.5));
      needsAnalysis.priority = 'medium';
      needsAnalysis.timeframe = 'short-term';
      needsAnalysis.reasons.push('Risque modéré de départ');
      shortTerm += needsAnalysis.recommendedHires;
    } else if (position.nearRetirement > 0) {
      needsAnalysis.recommendedHires = Math.ceil(position.nearRetirement * 0.3);
      needsAnalysis.priority = 'low';
      needsAnalysis.timeframe = 'medium-term';
      needsAnalysis.reasons.push('Préparation aux départs futurs');
      mediumTerm += needsAnalysis.recommendedHires;
    }
    
    if (position.count <= 2) needsAnalysis.reasons.push('Effectif critique');
    if (position.avgAge >= 50) needsAnalysis.reasons.push('Âge moyen élevé');
    
    byPosition[position.position] = needsAnalysis;
  });
  
  return {
    byPosition,
    summary: {
      immediate,
      shortTerm,
      mediumTerm,
      highPriority
    }
  };
};

export const fetchContractStats = async (year: number) => {
  return SupabaseEmployeeService.getContractStats(year);
};

// Fonction de migration des données existantes
export const migrateToSupabase = async (existingEmployees: Employee[]) => {
  return SupabaseEmployeeService.migrateExistingData(existingEmployees);
};