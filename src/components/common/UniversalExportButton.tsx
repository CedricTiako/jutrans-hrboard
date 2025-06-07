import React, { useState, useRef } from 'react';
import { 
  Download, 
  FileText, 
  Image, 
  FileSpreadsheet, 
  Camera,
  ChevronDown,
  Check,
  Truck
} from 'lucide-react';
import { UniversalExportService, ExportOptions, ExportData } from '../../services/exportService';

interface UniversalExportButtonProps {
  // Sources de données (une seule requise)
  element?: HTMLElement | null;
  data?: any[];
  headers?: string[];
  
  // Configuration
  title?: string;
  filename?: string;
  companyName?: string;
  
  // Apparence
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showCompanyBranding?: boolean;
  
  // Formats disponibles
  formats?: ('pdf' | 'excel' | 'csv' | 'png' | 'jpeg')[];
  
  // Callbacks
  onExportStart?: () => void;
  onExportComplete?: (format: string) => void;
  onExportError?: (error: Error) => void;
}

const UniversalExportButton: React.FC<UniversalExportButtonProps> = ({
  element,
  data,
  headers,
  title = 'Export HR Analytics',
  filename = 'hr-export',
  companyName = 'JUTRANS SARL',
  className = '',
  variant = 'outline',
  size = 'md',
  showLabel = true,
  showCompanyBranding = false,
  formats = ['pdf', 'excel', 'csv', 'png'],
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastExported, setLastExported] = useState<string | null>(null);

  const exportFormats = [
    { 
      key: 'pdf', 
      label: 'PDF', 
      icon: <FileText className="w-4 h-4" />, 
      description: 'Document portable',
      color: 'text-red-600'
    },
    { 
      key: 'excel', 
      label: 'Excel', 
      icon: <FileSpreadsheet className="w-4 h-4" />, 
      description: 'Feuille de calcul',
      color: 'text-green-600'
    },
    { 
      key: 'csv', 
      label: 'CSV', 
      icon: <FileText className="w-4 h-4" />, 
      description: 'Données séparées par virgules',
      color: 'text-blue-600'
    },
    { 
      key: 'png', 
      label: 'PNG', 
      icon: <Image className="w-4 h-4" />, 
      description: 'Image haute qualité',
      color: 'text-purple-600'
    },
    { 
      key: 'jpeg', 
      label: 'JPEG', 
      icon: <Camera className="w-4 h-4" />, 
      description: 'Image compressée',
      color: 'text-orange-600'
    }
  ].filter(format => formats.includes(format.key as any));

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setShowDropdown(false);
    onExportStart?.();

    try {
      const exportTitle = showCompanyBranding ? `${companyName} - ${title}` : title;
      const exportFilename = showCompanyBranding ? `${companyName.toLowerCase().replace(/\s+/g, '-')}-${filename}` : filename;

      const options: ExportOptions = {
        format: format as any,
        filename: exportFilename,
        title: exportTitle,
        includeTimestamp: true,
        quality: 0.95,
        orientation: 'landscape'
      };

      let exportData: ExportData;

      if (element) {
        exportData = {
          type: 'component',
          element,
          title: exportTitle
        };
      } else if (data && headers) {
        exportData = {
          type: 'data',
          data,
          headers,
          title: exportTitle
        };
      } else {
        throw new Error('Aucune donnée ou élément à exporter');
      }

      await UniversalExportService.exportElement(exportData, options);
      setLastExported(format.toUpperCase());
      onExportComplete?.(format);
      
      setTimeout(() => setLastExported(null), 3000);

    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      onExportError?.(error as Error);
    } finally {
      setIsExporting(false);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'btn gap-2 transition-all duration-200';
    
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      white: 'btn-outline btn-white'
    };

    const sizeClasses = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg'
    };

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  };

  const quickExport = () => {
    if (exportFormats.length > 0) {
      handleExport(exportFormats[0].key);
    }
  };

  if (exportFormats.length === 1) {
    return (
      <button
        onClick={quickExport}
        disabled={isExporting}
        className={getButtonClasses()}
      >
        {showCompanyBranding && <Truck className="w-4 h-4" />}
        {isExporting ? (
          <div className="loading loading-spinner loading-sm"></div>
        ) : (
          <Download className="w-4 h-4" />
        )}
        {showLabel && (
          <span>
            {isExporting ? 'Export...' : `Exporter ${exportFormats[0].label}`}
          </span>
        )}
        {lastExported && <Check className="w-4 h-4 text-success" />}
      </button>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className={`${getButtonClasses()} ${showDropdown ? 'dropdown-open' : ''}`}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {showCompanyBranding && <Truck className="w-4 h-4" />}
        {isExporting ? (
          <div className="loading loading-spinner loading-sm"></div>
        ) : (
          <Download className="w-4 h-4" />
        )}
        {showLabel && (
          <span>
            {isExporting ? 'Export...' : 'Exporter'}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        {lastExported && (
          <div className="badge badge-success badge-sm ml-2">
            {lastExported}
          </div>
        )}
      </label>
      
      {showDropdown && (
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-64 border border-base-300 z-50"
        >
          {showCompanyBranding && (
            <>
              <li className="menu-title">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  {companyName} - Exports
                </span>
              </li>
              <div className="divider my-1"></div>
            </>
          )}
          
          <li className="menu-title">
            <span>Formats d'export</span>
          </li>
          
          {exportFormats.map((format) => (
            <li key={format.key}>
              <button
                onClick={() => handleExport(format.key)}
                disabled={isExporting}
                className="flex items-center justify-between p-3 hover:bg-base-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className={format.color}>
                    {format.icon}
                  </span>
                  <div className="text-left">
                    <div className="font-medium">{format.label}</div>
                    <div className="text-xs text-base-content/60">
                      {format.description}
                    </div>
                  </div>
                </div>
                {lastExported === format.label && (
                  <Check className="w-4 h-4 text-success" />
                )}
              </button>
            </li>
          ))}
          
          <div className="divider my-1"></div>
          
          <li>
            <button
              onClick={quickExport}
              className="flex items-center gap-3 p-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg"
            >
              <Download className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium">Export rapide</div>
                <div className="text-xs opacity-70">
                  Format par défaut ({exportFormats[0]?.label})
                </div>
              </div>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UniversalExportButton;