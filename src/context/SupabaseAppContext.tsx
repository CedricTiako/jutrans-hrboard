import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee } from '../types/hr';
import { 
  fetchEmployees, 
  fetchGenderDistribution, 
  fetchAgeDistribution, 
  fetchTenureDistribution, 
  fetchPositionDistribution,
  fetchDashboardStats,
  fetchYearOverYearData,
  fetchDepartures,
  fetchRetirementRisk,
  fetchCriticalPositions,
  fetchRecruitmentNeeds,
  fetchContractStats,
  fetchHiringsByYear,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  migrateToSupabase
} from '../api/supabaseEmployees';

interface SupabaseAppContextType {
  year: number;
  setYear: (year: number) => void;
  employees: Employee[];
  loading: boolean;
  error: string | null;
  genderDistribution: { male: number; female: number; total: number };
  ageDistribution: Record<string, number>;
  tenureDistribution: Record<string, number>;
  positionDistribution: Array<{ name: string; count: number }>;
  dashboardStats: {
    totalEmployees: number;
    avgAge: number;
    avgTenure: number;
    newHires: number;
    nearRetirement: number;
    temporaryContracts: number;
    expiredContracts: number;
  };
  yearOverYearData: {
    years: number[];
    headcount: number[];
    avgAge: number[];
    avgTenure: number[];
    newHires: number[];
    temporaryContracts: number[];
    expiredContracts: number[];
    maleHeadcount: number[];
    femaleHeadcount: number[];
  };
  hiringsByYear: Record<string, number>;
  departures: {
    total: number;
    byPosition: Record<string, number>;
    byAge: { retirement: number; young: number; midCareer: number };
    employees: Employee[];
  };
  retirementRisk: {
    nearRetirement: number;
    veryNearRetirement: number;
    riskByPosition: Record<string, any>;
    employees: Employee[];
  };
  criticalPositions: Array<{
    position: string;
    count: number;
    avgAge: number;
    avgTenure: number;
    nearRetirement: number;
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    employees: Employee[];
  }>;
  recruitmentNeeds: {
    byPosition: Record<string, any>;
    summary: {
      immediate: number;
      shortTerm: number;
      mediumTerm: number;
      highPriority: number;
    };
  };
  contractStats: {
    total: number;
    permanent: number;
    temporary: number;
    expired: number;
    expiringSoon: number;
  };
  refreshData: () => Promise<void>;
  createNewEmployee: (data: any) => Promise<{ success: boolean; employee?: Employee; error?: string }>;
  updateExistingEmployee: (id: string, data: any) => Promise<{ success: boolean; employee?: Employee; error?: string }>;
  removeEmployee: (id: string) => Promise<{ success: boolean; message: string }>;
  migrateData: (existingEmployees: Employee[]) => Promise<{ success: boolean; message: string; migrated: number }>;
}

const SupabaseAppContext = createContext<SupabaseAppContextType | undefined>(undefined);

export const SupabaseAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [year, setYear] = useState<number>(2023);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genderDistribution, setGenderDistribution] = useState({ male: 0, female: 0, total: 0 });
  const [ageDistribution, setAgeDistribution] = useState<Record<string, number>>({});
  const [tenureDistribution, setTenureDistribution] = useState<Record<string, number>>({});
  const [positionDistribution, setPositionDistribution] = useState<Array<{ name: string; count: number }>>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    avgAge: 0,
    avgTenure: 0,
    newHires: 0,
    nearRetirement: 0,
    temporaryContracts: 0,
    expiredContracts: 0
  });
  const [yearOverYearData, setYearOverYearData] = useState({
    years: [],
    headcount: [],
    avgAge: [],
    avgTenure: [],
    newHires: [],
    temporaryContracts: [],
    expiredContracts: [],
    maleHeadcount: [],
    femaleHeadcount: []
  });
  const [hiringsByYear, setHiringsByYear] = useState<Record<string, number>>({});
  const [departures, setDepartures] = useState({
    total: 0,
    byPosition: {},
    byAge: { retirement: 0, young: 0, midCareer: 0 },
    employees: []
  });
  const [retirementRisk, setRetirementRisk] = useState({
    nearRetirement: 0,
    veryNearRetirement: 0,
    riskByPosition: {},
    employees: []
  });
  const [criticalPositions, setCriticalPositions] = useState([]);
  const [recruitmentNeeds, setRecruitmentNeeds] = useState({
    byPosition: {},
    summary: { immediate: 0, shortTerm: 0, mediumTerm: 0, highPriority: 0 }
  });
  const [contractStats, setContractStats] = useState({
    total: 0,
    permanent: 0,
    temporary: 0,
    expired: 0,
    expiringSoon: 0
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des données depuis Supabase...');
      
      const [
        employeesData,
        genderData,
        ageData,
        tenureData,
        positionData,
        statsData,
        yoyData,
        hiringData,
        departuresData,
        retirementRiskData,
        criticalPositionsData,
        recruitmentNeedsData,
        contractStatsData
      ] = await Promise.all([
        fetchEmployees(year),
        fetchGenderDistribution(year),
        fetchAgeDistribution(year),
        fetchTenureDistribution(year),
        fetchPositionDistribution(year),
        fetchDashboardStats(year),
        fetchYearOverYearData(),
        fetchHiringsByYear(),
        fetchDepartures(year),
        fetchRetirementRisk(year),
        fetchCriticalPositions(year),
        fetchRecruitmentNeeds(year),
        fetchContractStats(year)
      ]);

      console.log(`✅ Données chargées: ${employeesData.length} employés pour ${year}`);

      setEmployees(employeesData);
      setGenderDistribution(genderData);
      setAgeDistribution(ageData);
      setTenureDistribution(tenureData);
      setPositionDistribution(positionData);
      setDashboardStats(statsData);
      setYearOverYearData(yoyData);
      setHiringsByYear(hiringData);
      setDepartures(departuresData);
      setRetirementRisk(retirementRiskData);
      setCriticalPositions(criticalPositionsData);
      setRecruitmentNeeds(recruitmentNeedsData);
      setContractStats(contractStatsData);
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement des données Supabase:', err);
      setError('Erreur lors du chargement des données depuis Supabase. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [year]);

  // Fonctions CRUD avec Supabase
  const createNewEmployee = async (data: any) => {
    try {
      const result = await createEmployee(data, year);
      if (result.success) {
        await loadData(); // Recharger les données après la création
      }
      return result;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      return { success: false, error: 'Erreur lors de la création de l\'employé' };
    }
  };

  const updateExistingEmployee = async (id: string, data: any) => {
    try {
      const result = await updateEmployee(id, data);
      if (result.success) {
        await loadData(); // Recharger les données après la mise à jour
      }
      return result;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return { success: false, error: 'Erreur lors de la mise à jour de l\'employé' };
    }
  };

  const removeEmployee = async (id: string) => {
    try {
      const result = await deleteEmployee(id);
      if (result.success) {
        await loadData(); // Recharger les données après la suppression
      }
      return result;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return { success: false, message: 'Erreur lors de la suppression de l\'employé' };
    }
  };

  const migrateData = async (existingEmployees: Employee[]) => {
    try {
      const result = await migrateToSupabase(existingEmployees);
      if (result.success) {
        await loadData(); // Recharger les données après la migration
      }
      return result;
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
      return { success: false, message: 'Erreur lors de la migration des données', migrated: 0 };
    }
  };

  return (
    <SupabaseAppContext.Provider
      value={{
        year,
        setYear,
        employees,
        loading,
        error,
        genderDistribution,
        ageDistribution,
        tenureDistribution,
        positionDistribution,
        dashboardStats,
        yearOverYearData,
        hiringsByYear,
        departures,
        retirementRisk,
        criticalPositions,
        recruitmentNeeds,
        contractStats,
        refreshData: loadData,
        createNewEmployee,
        updateExistingEmployee,
        removeEmployee,
        migrateData
      }}
    >
      {children}
    </SupabaseAppContext.Provider>
  );
};

export const useSupabaseAppContext = () => {
  const context = useContext(SupabaseAppContext);
  if (context === undefined) {
    throw new Error('useSupabaseAppContext must be used within a SupabaseAppProvider');
  }
  return context;
};