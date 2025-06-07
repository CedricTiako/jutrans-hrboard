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
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../api/supabaseEmployees';

interface AppContextType {
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
  };
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
    temporaryContracts: Employee[];
    expiredContracts: Employee[];
    expiringContracts: Employee[];
  };
  refreshData: () => Promise<void>;
  createNewEmployee: (data: any) => Promise<{ success: boolean; employee?: Employee; error?: string }>;
  updateExistingEmployee: (id: number, data: any) => Promise<{ success: boolean; employee?: Employee; error?: string }>;
  removeEmployee: (id: number) => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
    expiredContracts: []
  });
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
    expiringSoon: 0,
    temporaryContracts: [],
    expiredContracts: [],
    expiringContracts: []
  });

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les données pour l'année sélectionnée
      const [
        employeesData,
        genderData,
        ageData,
        tenureData,
        positionData,
        statsData,
        yoyData,
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
        fetchDepartures(year),
        fetchRetirementRisk(year),
        fetchCriticalPositions(year),
        fetchRecruitmentNeeds(year),
        fetchContractStats(year)
      ]);

      setEmployees(employeesData);
      setGenderDistribution(genderData);
      setAgeDistribution(ageData);
      setTenureDistribution(tenureData);
      setPositionDistribution(positionData);
      setDashboardStats(statsData);
      setYearOverYearData(yoyData);
      setDepartures(departuresData);
      setRetirementRisk(retirementRiskData);
      setCriticalPositions(criticalPositionsData);
      setRecruitmentNeeds(recruitmentNeedsData);
      setContractStats(contractStatsData);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [year]);

  // Fonctions CRUD
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

  const updateExistingEmployee = async (id: number, data: any) => {
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

  const removeEmployee = async (id: number) => {
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

  return (
    <AppContext.Provider
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
        departures,
        retirementRisk,
        criticalPositions,
        recruitmentNeeds,
        contractStats,
        refreshData: loadData,
        createNewEmployee,
        updateExistingEmployee,
        removeEmployee
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};