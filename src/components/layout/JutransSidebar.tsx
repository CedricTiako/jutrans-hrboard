import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Building2, 
  UserPlus, 
  BarChart4, 
  List,
  AlertTriangle,
  X,
  Truck,
  Database,
  TrendingDown
} from 'lucide-react';

type JutransSidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const JutransSidebar: React.FC<JutransSidebarProps> = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: 'Dashboard Supabase', icon: <Database className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-blue-600' },
    { path: '/employees', label: 'Liste des Employés', icon: <List className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-green-600' },
    { path: '/risks', label: 'Analyse des Risques', icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-red-600' },
    { path: '/turnover', label: 'Analyse du Turnover', icon: <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-orange-600' },
    { path: '/demographics', label: t('navigation.demographics'), icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-purple-600' },
    { path: '/tenure', label: t('navigation.tenure'), icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-orange-600' },
    { path: '/organization', label: t('navigation.organization'), icon: <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-indigo-600' },
    { path: '/recruitment', label: t('navigation.recruitment'), icon: <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-cyan-600' },
    { path: '/comparison', label: t('navigation.comparison'), icon: <BarChart4 className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-pink-600' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-56 sm:w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header avec logo JUTRANS unifié */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <Truck className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-sm sm:text-lg font-bold text-blue-800">JUTRANS SARL</h1>
                <p className="text-xs text-blue-600">HR Analytics Pro</p>
              </div>
            </div>
            <button 
              className="p-1 rounded-md lg:hidden hover:bg-blue-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </button>
          </div>

          {/* Navigation avec couleurs unifiées */}
          <nav className="flex-1 space-y-1 px-2 py-3 sm:py-4 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                end={item.path === '/'}
              >
                {({ isActive }) => (
                  <>
                    <span className={`${isActive ? item.color : 'text-gray-400 group-hover:text-gray-600'} transition-colors`}>
                      {item.icon}
                    </span>
                    <span className="ml-2 sm:ml-3 text-xs sm:text-sm">{item.label}</span>
                    {item.path === '/' && (
                      <span className="ml-auto badge badge-primary badge-xs sm:badge-sm">Supabase</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer avec informations JUTRANS unifiées */}
          <div className="border-t border-gray-200 p-3 sm:p-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-2 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1 bg-blue-600 rounded">
                  <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-blue-800">JUTRANS SARL</span>
                  <p className="text-xs text-blue-600">Solutions Transport & Logistique</p>
                </div>
              </div>
              <div className="text-xs text-blue-500 space-y-1">
                <p>• Système d'Analyse RH v2.0</p>
                <p>• IA Prédictive & Analytics</p>
                <p>• Base de données Supabase</p>
                <p>• Conforme aux standards d'audit</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default JutransSidebar;