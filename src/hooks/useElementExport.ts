import { useRef, useCallback } from 'react';
import { UniversalExportService, ExportOptions, ExportData } from '../services/exportService';

interface UseElementExportOptions {
  defaultFilename?: string;
  defaultTitle?: string;
  defaultFormat?: 'pdf' | 'excel' | 'csv' | 'png' | 'jpeg';
}

export const useElementExport = (options: UseElementExportOptions = {}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const exportElement = useCallback(async (
    customOptions: Partial<ExportOptions> = {}
  ) => {
    if (!elementRef.current) {
      throw new Error('Élément de référence non trouvé');
    }

    const exportOptions: ExportOptions = {
      format: options.defaultFormat || 'png',
      filename: options.defaultFilename || 'export',
      title: options.defaultTitle || 'Export HR Analytics',
      includeTimestamp: true,
      quality: 0.95,
      orientation: 'landscape',
      ...customOptions
    };

    const exportData: ExportData = {
      type: 'component',
      element: elementRef.current,
      title: exportOptions.title
    };

    await UniversalExportService.exportElement(exportData, exportOptions);
  }, [options]);

  const exportAsImage = useCallback((format: 'png' | 'jpeg' = 'png') => {
    return exportElement({ format });
  }, [exportElement]);

  const exportAsPDF = useCallback(() => {
    return exportElement({ format: 'pdf' });
  }, [exportElement]);

  return {
    elementRef,
    exportElement,
    exportAsImage,
    exportAsPDF
  };
};

// Hook spécialisé pour les tableaux
export const useTableExport = () => {
  const tableRef = useRef<HTMLTableElement>(null);

  const exportTable = useCallback(async (
    format: 'excel' | 'csv' | 'pdf' = 'excel',
    customOptions: Partial<ExportOptions> = {}
  ) => {
    if (!tableRef.current) {
      throw new Error('Tableau de référence non trouvé');
    }

    const { headers, data } = UniversalExportService.extractTableData(tableRef.current);

    const exportOptions: ExportOptions = {
      format,
      filename: 'tableau-export',
      title: 'Tableau HR Analytics',
      includeTimestamp: true,
      ...customOptions
    };

    const exportData: ExportData = {
      type: 'table',
      element: tableRef.current,
      data,
      headers,
      title: exportOptions.title
    };

    await UniversalExportService.exportElement(exportData, exportOptions);
  }, []);

  return {
    tableRef,
    exportTable
  };
};

// Hook pour l'export de données brutes
export const useDataExport = () => {
  const exportData = useCallback(async (
    data: any[],
    headers: string[],
    options: Partial<ExportOptions> = {}
  ) => {
    const exportOptions: ExportOptions = {
      format: 'excel',
      filename: 'donnees-export',
      title: 'Données HR Analytics',
      includeTimestamp: true,
      ...options
    };

    const exportData: ExportData = {
      type: 'data',
      data,
      headers,
      title: exportOptions.title
    };

    await UniversalExportService.exportElement(exportData, exportOptions);
  }, []);

  const exportAsExcel = useCallback((data: any[], headers: string[], filename?: string) => {
    return exportData(data, headers, { format: 'excel', filename });
  }, [exportData]);

  const exportAsCSV = useCallback((data: any[], headers: string[], filename?: string) => {
    return exportData(data, headers, { format: 'csv', filename });
  }, [exportData]);

  return {
    exportData,
    exportAsExcel,
    exportAsCSV
  };
};