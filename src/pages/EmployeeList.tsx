import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSupabaseAppContext } from '../context/SupabaseAppContext';
import { SupabaseEmployeeService } from '../services/supabaseEmployeeService';
import EmployeeModal from '../components/employees/EmployeeModal';
import { 
  Search, 
  Filter, 
  Download, 
  Users, 
  Calendar, 
  Briefcase, 
  MapPin, 
  Truck, 
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Clock,
  FileText,
  RefreshCw,
  CheckCircle,
  XCircle,
  Database
} from 'lucide-react';
import { Employee } from '../types/hr';
import UniversalExportButton from '../components/common/UniversalExportButton';
import { FluidCard, FluidButton, FluidInput, FluidModal, FluidTable } from '../components/common/FluidComponents';
import { FadeInView } from '../components/common/JutransAnimations';

interface FilterState {
  search: string;
  gender: string;
  ageGroup: string;
  tenureGroup: string;
  position: string;
  nationality: string;
  affectation: string;
  minAge: string;
  maxAge: string;
  minTenure: string;
  maxTenure: string;
  contractType: string; // CDI, CDD, Tous
  contractStatus: string; // Actif, Expiré, Tous
}

const EmployeeList: React.FC = () => {
  const { t } = useTranslation();
  const { employees, loading, year, refreshData } = useSupabaseAppContext();
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    gender: '',
    ageGroup: '',
    tenureGroup: '',
    position: '',
    nationality: '',
    affectation: '',
    minAge: '',
    maxAge: '',
    minTenure: '',
    maxTenure: '',
    contractType: '',
    contractStatus: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof Employee>('NOMS');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 20;

  // États pour le CRUD
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [actionSuccess, setActionSuccess] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const positions = [...new Set(employees.map(emp => emp.POSTE))].sort();
    const nationalities = [...new Set(employees.map(emp => emp.NATIONALITE))].sort();
    const affectations = [...new Set(employees.map(emp => emp.AFFECTATION).filter(Boolean))].sort();
    
    return { positions, nationalities, affectations };
  }, [employees]);

  // Statistiques des contrats
  const contractStats = useMemo(() => {
    return {
      total: employees.length,
      permanent: employees.filter(emp => emp.DATE_FIN_CONTRAT === null).length,
      temporary: employees.filter(emp => emp.DATE_FIN_CONTRAT !== null).length,
      expired: employees.filter(emp => 
        emp.DATE_FIN_CONTRAT !== null && new Date(emp.DATE_FIN_CONTRAT) < new Date()
      ).length,
      expiringSoon: employees.filter(emp => {
        if (!emp.DATE_FIN_CONTRAT) return false;
        const endDate = new Date(emp.DATE_FIN_CONTRAT);
        const today = new Date();
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(today.getMonth() + 3);
        return endDate >= today && endDate <= threeMonthsLater;
      }).length
    };
  }, [employees]);

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          employee.NOMS.toLowerCase().includes(searchTerm) ||
          employee.POSTE.toLowerCase().includes(searchTerm) ||
          employee.NATIONALITE.toLowerCase().includes(searchTerm) ||
          (employee.AFFECTATION && employee.AFFECTATION.toLowerCase().includes(searchTerm));
        if (!matchesSearch) return false;
      }

      // Gender filter
      if (filters.gender && employee.SEXE !== filters.gender) return false;

      // Age group filter
      if (filters.ageGroup && employee.TRANCHE_AGE !== filters.ageGroup) return false;

      // Tenure group filter
      if (filters.tenureGroup && employee.TRANCHE_ANCIENNETE !== filters.tenureGroup) return false;

      // Position filter
      if (filters.position && employee.POSTE !== filters.position) return false;

      // Nationality filter
      if (filters.nationality && employee.NATIONALITE !== filters.nationality) return false;

      // Affectation filter
      if (filters.affectation && employee.AFFECTATION !== filters.affectation) return false;

      // Age range filter
      if (filters.minAge && employee.AGE < parseInt(filters.minAge)) return false;
      if (filters.maxAge && employee.AGE > parseInt(filters.maxAge)) return false;

      // Tenure range filter
      if (filters.minTenure && employee.ANCIENNETE < parseInt(filters.minTenure)) return false;
      if (filters.maxTenure && employee.ANCIENNETE > parseInt(filters.maxTenure)) return false;

      // Contract type filter
      if (filters.contractType === 'CDI' && employee.DATE_FIN_CONTRAT !== null) return false;
      if (filters.contractType === 'CDD' && employee.DATE_FIN_CONTRAT === null) return false;

      // Contract status filter
      const isExpired = employee.DATE_FIN_CONTRAT && new Date(employee.DATE_FIN_CONTRAT) < new Date();
      if (filters.contractStatus === 'Actif' && isExpired) return false;
      if (filters.contractStatus === 'Expiré' && (!employee.DATE_FIN_CONTRAT || !isExpired)) return false;

      return true;
    });

    // Sort employees
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [employees, filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      gender: '',
      ageGroup: '',
      tenureGroup: '',
      position: '',
      nationality: '',
      affectation: '',
      minAge: '',
      maxAge: '',
      minTenure: '',
      maxTenure: '',
      contractType: '',
      contractStatus: ''
    });
    setCurrentPage(1);
  };

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshData();
      setActionSuccess({
        message: t('employees.crud.refreshSuccess'),
        type: 'success'
      });
    } catch (error) {
      setActionSuccess({
        message: t('employees.crud.error'),
        type: 'error'
      });
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  // Handlers pour le CRUD
  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (employeeToDelete) {
      try {
        // Convertir l'ID numérique en UUID pour Supabase
        const id = employeeToDelete.ID.toString();
        const result = await SupabaseEmployeeService.deleteEmployee(id);
        
        if (result.success) {
          setActionSuccess({
            message: t('employees.crud.deleteSuccess'),
            type: 'success'
          });
          refreshData();
        } else {
          setActionSuccess({
            message: result.message,
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setActionSuccess({
          message: 'Erreur lors de la suppression de l\'employé',
          type: 'error'
        });
      }
      
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleSaveEmployee = (employee: Employee) => {
    refreshData();
    setActionSuccess({
      message: modalMode === 'create' 
        ? t('employees.crud.createSuccess')
        : t('employees.crud.updateSuccess'),
      type: 'success'
    });
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Préparer les données pour l'export
  const employeeTableData = filteredEmployees.map(emp => ({
    [t('employees.table.name')]: emp.NOMS,
    [t('employees.table.gender')]: emp.SEXE === 'M' ? t('gender.male') : t('gender.female'),
    [t('employees.table.age')]: emp.AGE,
    [t('employees.table.tenure')]: emp.ANCIENNETE,
    [t('employees.table.position')]: emp.POSTE,
    [t('employees.table.nationality')]: emp.NATIONALITE,
    [t('employees.table.affectation')]: emp.AFFECTATION,
    [t('employees.table.hireDate')]: emp.DATE_EMBAUCHE,
    [t('employees.table.endDate')]: emp.DATE_FIN_CONTRAT || t('contracts.permanent'),
    [t('employees.table.status')]: emp.DATE_FIN_CONTRAT && new Date(emp.DATE_FIN_CONTRAT) < new Date() ? t('contracts.expired') : t('contracts.active')
  }));

  const employeeTableHeaders = [
    t('employees.table.name'), 
    t('employees.table.gender'), 
    t('employees.table.age'), 
    t('employees.table.tenure'), 
    t('employees.table.position'), 
    t('employees.table.nationality'), 
    t('employees.table.affectation'), 
    t('employees.table.hireDate'), 
    t('employees.table.endDate'), 
    t('employees.table.status')
  ];

  // Effet pour masquer le message de succès après un délai
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* En-tête JUTRANS */}
      <FluidCard variant="gradient" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="card-body p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">JUTRANS SARL</h1>
                <h2 className="text-xl opacity-90">{t('employees.title')}</h2>
                <p className="opacity-80">
                  {filteredEmployees.length} {filteredEmployees.length > 1 ? t('common.employees') : t('common.employee')} 
                  {filteredEmployees.length !== employees.length && ` ${t('common.total')} ${employees.length}`} {t('common.year')} {year}
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
                {t('common.filter')}
                {Object.values(filters).filter(Boolean).length > 0 && (
                  <div className="badge badge-primary badge-sm">
                    {Object.values(filters).filter(Boolean).length}
                  </div>
                )}
              </FluidButton>
              
              <FluidButton
                onClick={handleCreateEmployee}
                variant="outline"
                className="btn-white"
                icon={<Plus className="w-4 h-4" />}
              >
                {t('employees.crud.newEmployee')}
              </FluidButton>
              
              <UniversalExportButton
                data={employeeTableData}
                headers={employeeTableHeaders}
                title={`JUTRANS SARL - ${t('employees.title')} - ${year}`}
                filename={`jutrans-employes-${year}`}
                className="btn-white"
                formats={['excel', 'csv', 'pdf']}
              />
            </div>
          </div>
        </div>
      </FluidCard>

      {/* Message de succès/erreur */}
      {actionSuccess && (
        <FadeInView direction="down" className={`alert ${actionSuccess.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`}>
          <div className="flex items-center gap-2">
            {actionSuccess.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{actionSuccess.message}</span>
          </div>
        </FadeInView>
      )}

      {/* Search Bar */}
      <FluidCard>
        <div className="card-body p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </FluidCard>

      {/* Advanced Filters */}
      {showFilters && (
        <FluidCard className="border-2 border-blue-200">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{t('common.filter')}</h3>
              <button
                onClick={clearFilters}
                className="btn btn-sm btn-outline btn-error"
              >
                {t('employees.filters.clearAll')}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Gender Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{t('employees.filters.gender')}</span>
                </label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="select select-bordered"
                >
                  <option value="">{t('contracts.all')}</option>
                  <option value="M">{t('gender.male')}</option>
                  <option value="F">{t('gender.female')}</option>
                </select>
              </div>

              {/* Age Group Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{t('employees.filters.ageGroup')}</span>
                </label>
                <select
                  value={filters.ageGroup}
                  onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                  className="select select-bordered"
                >
                  <option value="">{t('contracts.all')}</option>
                  <option value="21 - 30">21 - 30 {t('common.year')}s</option>
                  <option value="31 - 35">31 - 35 {t('common.year')}s</option>
                  <option value="36 - 40">36 - 40 {t('common.year')}s</option>
                  <option value="41 - 45">41 - 45 {t('common.year')}s</option>
                  <option value="46 - 50">46 - 50 {t('common.year')}s</option>
                  <option value="51 - 55">51 - 55 {t('common.year')}s</option>
                  <option value="56 - 60">56 - 60 {t('common.year')}s</option>
                  <option value="> 60">{"> 60 " + t('common.year')}s</option>
                </select>
              </div>

              {/* Position Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{t('employees.filters.position')}</span>
                </label>
                <select
                  value={filters.position}
                  onChange={(e) => handleFilterChange('position', e.target.value)}
                  className="select select-bordered"
                >
                  <option value="">{t('contracts.all')}</option>
                  {filterOptions.positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>

              {/* Nationality Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{t('employees.filters.nationality')}</span>
                </label>
                <select
                  value={filters.nationality}
                  onChange={(e) => handleFilterChange('nationality', e.target.value)}
                  className="select select-bordered"
                >
                  <option value="">{t('contracts.all')}</option>
                  {filterOptions.nationalities.map(nationality => (
                    <option key={nationality} value={nationality}>{nationality}</option>
                  ))}
                </select>
              </div>

              {/* Contract Type Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{t('employees.filters.contractType')}</span>
                </label>
                <select
                  value={filters.contractType}
                  onChange={(e) => handleFilterChange('contractType', e.target.value)}
                  className="select select-bordered"
                >
                  <option value="">{t('contracts.all')}</option>
                  <option value="CDI">{t('contracts.permanent')}</option>
                  <option value="CDD">{t('contracts.temporary')}</option>
                </select>
              </div>

              {/* Contract Status Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{t('employees.filters.contractStatus')}</span>
                </label>
                <select
                  value={filters.contractStatus}
                  onChange={(e) => handleFilterChange('contractStatus', e.target.value)}
                  className="select select-bordered"
                >
                  <option value="">{t('contracts.all')}</option>
                  <option value="Actif">{t('contracts.active')}</option>
                  <option value="Expiré">{t('contracts.expired')}</option>
                </select>
              </div>
            </div>
          </div>
        </FluidCard>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <Database className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">Source</p>
                <p className="text-2xl font-bold">
                  Supabase
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">{t('contracts.permanent')}</p>
                <p className="text-2xl font-bold">
                  {contractStats.permanent}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">{t('contracts.temporary')}</p>
                <p className="text-2xl font-bold">
                  {contractStats.temporary}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">{t('contracts.expired')}</p>
                <p className="text-2xl font-bold">
                  {contractStats.expired}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center">
              <Briefcase className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm opacity-90">{t('employees.stats.uniquePositions')}</p>
                <p className="text-2xl font-bold">
                  {new Set(filteredEmployees.map(emp => emp.POSTE)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <FluidCard>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th 
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort('NOMS')}
                  >
                    <div className="flex items-center gap-2">
                      {t('employees.table.name')}
                      {sortField === 'NOMS' && (
                        <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort('SEXE')}
                  >
                    <div className="flex items-center gap-2">
                      {t('employees.table.gender')}
                      {sortField === 'SEXE' && (
                        <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort('AGE')}
                  >
                    <div className="flex items-center gap-2">
                      {t('employees.table.age')}
                      {sortField === 'AGE' && (
                        <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort('POSTE')}
                  >
                    <div className="flex items-center gap-2">
                      {t('employees.table.position')}
                      {sortField === 'POSTE' && (
                        <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort('DATE_EMBAUCHE')}
                  >
                    <div className="flex items-center gap-2">
                      {t('employees.table.hireDate')}
                      {sortField === 'DATE_EMBAUCHE' && (
                        <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort('DATE_FIN_CONTRAT')}
                  >
                    <div className="flex items-center gap-2">
                      {t('employees.table.endDate')}
                      {sortField === 'DATE_FIN_CONTRAT' && (
                        <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th>{t('employees.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee) => {
                  const isExpired = employee.DATE_FIN_CONTRAT && new Date(employee.DATE_FIN_CONTRAT) < new Date();
                  return (
                    <tr 
                      key={employee.ID} 
                      className={`hover:bg-blue-50 transition-colors ${isExpired ? 'bg-red-50 hover:bg-red-100' : ''}`}
                    >
                      <td className="font-medium text-gray-900">
                        {employee.NOMS}
                      </td>
                      <td>
                        <span className={`badge ${
                          employee.SEXE === 'M' 
                            ? 'badge-info' 
                            : 'badge-secondary'
                        }`}>
                          {employee.SEXE === 'M' ? t('gender.male') : t('gender.female')}
                        </span>
                      </td>
                      <td>{employee.AGE} {t('common.year')}s</td>
                      <td className="max-w-xs truncate">{employee.POSTE}</td>
                      <td>{new Date(employee.DATE_EMBAUCHE).toLocaleDateString()}</td>
                      <td>
                        {employee.DATE_FIN_CONTRAT ? (
                          <div className="flex flex-col">
                            <span>{new Date(employee.DATE_FIN_CONTRAT).toLocaleDateString()}</span>
                            {isExpired && (
                              <span className="badge badge-error badge-sm gap-1 mt-1">
                                <AlertTriangle className="w-3 h-3" />
                                {t('contracts.expired')}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="badge badge-success badge-sm">{t('contracts.permanent')}</span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewEmployee(employee)}
                            className="btn btn-xs btn-ghost btn-square text-blue-600"
                            title={t('common.view')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditEmployee(employee)}
                            className="btn btn-xs btn-ghost btn-square text-amber-600"
                            title={t('common.edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(employee)}
                            className="btn btn-xs btn-ghost btn-square text-red-600"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center p-4">
              <div className="join">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="join-item btn btn-outline"
                >
                  «
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`join-item btn ${
                        currentPage === pageNum ? 'btn-active btn-primary' : 'btn-outline'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="join-item btn btn-outline"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </FluidCard>

      {/* No results message */}
      {filteredEmployees.length === 0 && (
        <FluidCard>
          <div className="card-body text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('noResults')}
            </h3>
            <p className="text-gray-500 mb-6">
              {t('tryChangingFilters')}
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              {t('employees.filters.clearAll')}
            </button>
          </div>
        </FluidCard>
      )}

      {/* Refresh button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleRefresh}
          className="btn btn-circle btn-primary shadow-lg"
          disabled={isRefreshing}
          title={t('common.refresh')}
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
        year={year}
        onSave={handleSaveEmployee}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <FluidModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title={t('employees.crud.deleteEmployee')}
        size="sm"
      >
        <div className="p-4">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <p className="text-center mb-6">
            {t('employees.crud.deleteConfirmation', { name: employeeToDelete?.NOMS })}
            <br />
            <span className="text-sm text-red-500">{t('employees.crud.deleteWarning')}</span>
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setDeleteConfirmOpen(false)}
              className="btn btn-outline"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="btn btn-error"
            >
              {t('common.delete')}
            </button>
          </div>
        </div>
      </FluidModal>

      {/* Footer JUTRANS */}
      <FluidCard variant="gradient" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="card-body p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Truck className="w-5 h-5" />
            <Database className="w-5 h-5" />
            <span className="font-bold">JUTRANS SARL</span>
          </div>
          <p className="text-sm opacity-90">
            Solutions Transport & Logistique - Système de Gestion RH avec Supabase
          </p>
        </div>
      </FluidCard>
    </div>
  );
};

export default EmployeeList;