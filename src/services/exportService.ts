import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export interface ExportOptions {
  filename?: string;
  format: 'pdf' | 'excel' | 'csv' | 'png' | 'jpeg' | 'svg';
  title?: string;
  includeTimestamp?: boolean;
  quality?: number; // Pour les images (0.1 à 1.0)
  orientation?: 'portrait' | 'landscape'; // Pour PDF
}

export interface ExportData {
  type: 'chart' | 'table' | 'component' | 'data';
  element?: HTMLElement;
  data?: any[];
  headers?: string[];
  chartData?: any;
  title?: string;
}

export class UniversalExportService {
  
  /**
   * 🎯 EXPORT UNIVERSEL - Point d'entrée principal
   */
  static async exportElement(exportData: ExportData, options: ExportOptions): Promise<void> {
    const timestamp = options.includeTimestamp ? `_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}` : '';
    const filename = `${options.filename || 'export'}${timestamp}`;

    try {
      switch (options.format) {
        case 'pdf':
          await this.exportToPDF(exportData, { ...options, filename });
          break;
        case 'excel':
          await this.exportToExcel(exportData, { ...options, filename });
          break;
        case 'csv':
          await this.exportToCSV(exportData, { ...options, filename });
          break;
        case 'png':
        case 'jpeg':
          await this.exportToImage(exportData, { ...options, filename });
          break;
        case 'svg':
          await this.exportToSVG(exportData, { ...options, filename });
          break;
        default:
          throw new Error(`Format d'export non supporté: ${options.format}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      throw new Error(`Échec de l'export: ${error.message}`);
    }
  }

  /**
   * 📊 EXPORT PDF - Graphiques et composants
   */
  private static async exportToPDF(exportData: ExportData, options: ExportOptions): Promise<void> {
    const pdf = new jsPDF({
      orientation: options.orientation || 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // En-tête du document
    pdf.setFontSize(20);
    pdf.text(exportData.title || 'Export HR Analytics', 20, 20);
    
    pdf.setFontSize(12);
    pdf.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 20, 30);

    if (exportData.element) {
      // Capture du composant visuel
      const canvas = await html2canvas(exportData.element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 250;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 20, 40, imgWidth, imgHeight);
    }

    if (exportData.data && exportData.headers) {
      // Ajout des données tabulaires
      const startY = exportData.element ? 200 : 50;
      this.addTableToPDF(pdf, exportData.data, exportData.headers, startY);
    }

    pdf.save(`${options.filename}.pdf`);
  }

  /**
   * 📈 EXPORT EXCEL - Données structurées
   */
  private static async exportToExcel(exportData: ExportData, options: ExportOptions): Promise<void> {
    const workbook = XLSX.utils.book_new();
    
    if (exportData.data && exportData.headers) {
      // Feuille de données principales
      const worksheet = XLSX.utils.aoa_to_sheet([
        exportData.headers,
        ...exportData.data.map(row => 
          exportData.headers!.map(header => row[header] || '')
        )
      ]);

      // Style de l'en-tête
      const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "366092" } }
        };
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
    }

    // Feuille de métadonnées
    const metaData = [
      ['Titre', exportData.title || 'Export HR Analytics'],
      ['Date d\'export', new Date().toLocaleDateString('fr-FR')],
      ['Heure d\'export', new Date().toLocaleTimeString('fr-FR')],
      ['Nombre d\'enregistrements', exportData.data?.length || 0],
      ['Format', 'Excel (.xlsx)']
    ];
    
    const metaWorksheet = XLSX.utils.aoa_to_sheet(metaData);
    XLSX.utils.book_append_sheet(workbook, metaWorksheet, 'Métadonnées');

    // Sauvegarde
    XLSX.writeFile(workbook, `${options.filename}.xlsx`);
  }

  /**
   * 📄 EXPORT CSV - Données simples
   */
  private static async exportToCSV(exportData: ExportData, options: ExportOptions): Promise<void> {
    if (!exportData.data || !exportData.headers) {
      throw new Error('Données ou en-têtes manquants pour l\'export CSV');
    }

    const csvContent = [
      // En-tête avec métadonnées
      `# ${exportData.title || 'Export HR Analytics'}`,
      `# Généré le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
      `# Nombre d'enregistrements: ${exportData.data.length}`,
      '',
      // En-têtes des colonnes
      exportData.headers.join(','),
      // Données
      ...exportData.data.map(row => 
        exportData.headers!.map(header => {
          const value = row[header] || '';
          // Échapper les guillemets et virgules
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, `${options.filename}.csv`);
  }

  /**
   * 🖼️ EXPORT IMAGE - PNG/JPEG
   */
  private static async exportToImage(exportData: ExportData, options: ExportOptions): Promise<void> {
    if (!exportData.element) {
      throw new Error('Élément DOM requis pour l\'export image');
    }

    const canvas = await html2canvas(exportData.element, {
      scale: 3, // Haute résolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: exportData.element.scrollWidth,
      height: exportData.element.scrollHeight
    });

    const format = options.format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const quality = options.quality || 0.95;
    
    canvas.toBlob((blob) => {
      if (blob) {
        this.downloadBlob(blob, `${options.filename}.${options.format}`);
      }
    }, format, quality);
  }

  /**
   * 🎨 EXPORT SVG - Graphiques vectoriels
   */
  private static async exportToSVG(exportData: ExportData, options: ExportOptions): Promise<void> {
    if (!exportData.element) {
      throw new Error('Élément DOM requis pour l\'export SVG');
    }

    // Recherche d'éléments SVG dans le composant
    const svgElements = exportData.element.querySelectorAll('svg');
    
    if (svgElements.length === 0) {
      throw new Error('Aucun élément SVG trouvé dans le composant');
    }

    // Export du premier SVG trouvé
    const svgElement = svgElements[0];
    const svgData = new XMLSerializer().serializeToString(svgElement);
    
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    this.downloadBlob(blob, `${options.filename}.svg`);
  }

  /**
   * 📋 AJOUT DE TABLEAU AU PDF
   */
  private static addTableToPDF(pdf: any, data: any[], headers: string[], startY: number): void {
    const pageHeight = pdf.internal.pageSize.height;
    let currentY = startY;
    const rowHeight = 8;
    const margin = 20;

    // En-têtes
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    
    headers.forEach((header, index) => {
      pdf.text(header, margin + (index * 40), currentY);
    });
    
    currentY += rowHeight;
    pdf.setFont(undefined, 'normal');

    // Données
    data.forEach((row, rowIndex) => {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = 20;
      }

      headers.forEach((header, colIndex) => {
        const value = row[header] || '';
        pdf.text(String(value).substring(0, 15), margin + (colIndex * 40), currentY);
      });
      
      currentY += rowHeight;
    });
  }

  /**
   * 💾 TÉLÉCHARGEMENT DE BLOB
   */
  private static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * 🎯 MÉTHODES UTILITAIRES POUR EXTRACTION DE DONNÉES
   */
  
  /**
   * Extrait les données d'un tableau HTML
   */
  static extractTableData(tableElement: HTMLTableElement): { headers: string[], data: any[] } {
    const headers: string[] = [];
    const data: any[] = [];

    // Extraction des en-têtes
    const headerRow = tableElement.querySelector('thead tr') || tableElement.querySelector('tr');
    if (headerRow) {
      headerRow.querySelectorAll('th, td').forEach(cell => {
        headers.push(cell.textContent?.trim() || '');
      });
    }

    // Extraction des données
    const bodyRows = tableElement.querySelectorAll('tbody tr') || 
                    Array.from(tableElement.querySelectorAll('tr')).slice(1);
    
    bodyRows.forEach(row => {
      const rowData: any = {};
      row.querySelectorAll('td').forEach((cell, index) => {
        if (headers[index]) {
          rowData[headers[index]] = cell.textContent?.trim() || '';
        }
      });
      data.push(rowData);
    });

    return { headers, data };
  }

  /**
   * Extrait les données d'un graphique Chart.js
   */
  static extractChartData(chartInstance: any): { headers: string[], data: any[] } {
    const headers = ['Label', 'Valeur'];
    const data: any[] = [];

    if (chartInstance && chartInstance.data) {
      const labels = chartInstance.data.labels || [];
      const datasets = chartInstance.data.datasets || [];

      if (datasets.length > 0) {
        const dataset = datasets[0];
        labels.forEach((label: string, index: number) => {
          data.push({
            'Label': label,
            'Valeur': dataset.data[index] || 0
          });
        });
      }
    }

    return { headers, data };
  }

  /**
   * Convertit un objet en format tableau
   */
  static objectToTableData(obj: any, title: string = 'Données'): { headers: string[], data: any[] } {
    if (Array.isArray(obj)) {
      if (obj.length === 0) return { headers: [], data: [] };
      
      const headers = Object.keys(obj[0]);
      return { headers, data: obj };
    }

    // Objet simple
    const headers = ['Propriété', 'Valeur'];
    const data = Object.entries(obj).map(([key, value]) => ({
      'Propriété': key,
      'Valeur': value
    }));

    return { headers, data };
  }
}

// Types pour l'intégration avec les composants
export interface ExportableComponent {
  getExportData(): ExportData;
  getExportOptions(): Partial<ExportOptions>;
}

// Hook personnalisé pour l'export
export const useExport = () => {
  const exportComponent = async (
    element: HTMLElement | null,
    options: Partial<ExportOptions> = {}
  ) => {
    if (!element) {
      throw new Error('Élément à exporter non trouvé');
    }

    const defaultOptions: ExportOptions = {
      format: 'png',
      includeTimestamp: true,
      quality: 0.95,
      orientation: 'landscape',
      ...options
    };

    const exportData: ExportData = {
      type: 'component',
      element,
      title: options.title || 'Export HR Analytics'
    };

    await UniversalExportService.exportElement(exportData, defaultOptions);
  };

  const exportData = async (
    data: any[],
    headers: string[],
    options: Partial<ExportOptions> = {}
  ) => {
    const defaultOptions: ExportOptions = {
      format: 'excel',
      includeTimestamp: true,
      ...options
    };

    const exportData: ExportData = {
      type: 'data',
      data,
      headers,
      title: options.title || 'Données HR Analytics'
    };

    await UniversalExportService.exportElement(exportData, defaultOptions);
  };

  const exportTable = async (
    tableElement: HTMLTableElement,
    options: Partial<ExportOptions> = {}
  ) => {
    const { headers, data } = UniversalExportService.extractTableData(tableElement);
    
    const defaultOptions: ExportOptions = {
      format: 'excel',
      includeTimestamp: true,
      ...options
    };

    const exportData: ExportData = {
      type: 'table',
      element: tableElement,
      data,
      headers,
      title: options.title || 'Tableau HR Analytics'
    };

    await UniversalExportService.exportElement(exportData, defaultOptions);
  };

  return {
    exportComponent,
    exportData,
    exportTable
  };
};