import React, { useState } from 'react';
import { Menu, Bell, Settings, User, Truck, Globe, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import YearSelector from '../YearSelector';
import LanguageSelector from '../LanguageSelector';
import UniversalExportButton from '../common/UniversalExportButton';

type JutransHeaderProps = {
  onMenuClick: () => void;
  currentData?: any[];
  currentHeaders?: string[];
  currentTitle?: string;
};

const JutransHeader: React.FC<JutransHeaderProps> = ({ 
  onMenuClick, 
  currentData, 
  currentHeaders, 
  currentTitle 
}) => {
  const { t, i18n } = useTranslation();
  const [showLanguageTooltip, setShowLanguageTooltip] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-2 sm:px-4 md:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Section gauche - Logo et titre */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              type="button"
              className="p-1 sm:p-2 rounded-md lg:hidden hover:bg-gray-100 transition-colors"
              onClick={onMenuClick}
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Truck className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-xl font-bold text-blue-800">JUTRANS SARL</h1>
                <p className="text-xs sm:text-sm text-blue-600">Système d'Analyse RH</p>
              </div>
            </div>
          </div>
          
          {/* Section droite - Contrôles */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Notifications */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                <div className="indicator">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>
              </label>
              <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
                <div className="card-body">
                  <span className="font-bold text-lg">Notifications</span>
                  <span className="text-info">Nouveau rapport disponible</span>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-block btn-sm">Voir tout</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de langue avec tooltip amélioré */}
            <div 
              className="relative"
              onMouseEnter={() => setShowLanguageTooltip(true)}
              onMouseLeave={() => setShowLanguageTooltip(false)}
            >
              <LanguageSelector />
              
              {showLanguageTooltip && (
                <div className="absolute right-0 top-full mt-1 sm:mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap animate-fade-in-up">
                  {i18n.language === 'fr' ? 'Changer la langue' : 'Change language'}
                </div>
              )}
            </div>
            
            <YearSelector />
            
            {/* Export universel avec données actuelles */}
            {currentData && currentHeaders && (
              <UniversalExportButton
                data={currentData}
                headers={currentHeaders}
                title={currentTitle || 'Export JUTRANS SARL'}
                filename="jutrans-export-global"
                companyName="JUTRANS SARL"
                showCompanyBranding={true}
                variant="primary"
                size="sm"
                className="hidden sm:flex"
                formats={['excel', 'pdf', 'csv']}
              />
            )}

            {/* Menu utilisateur */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle avatar">
                <div className="w-6 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span>JUTRANS SARL</span>
                </li>
                <li><a><User className="w-4 h-4" />Profil</a></li>
                <li><a><Settings className="w-4 h-4" />Paramètres</a></li>
                <li>
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>{i18n.language === 'fr' ? 'Langue' : 'Language'}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {i18n.language === 'fr' ? 'FR' : 'EN'}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default JutransHeader;