import React, { forwardRef, useImperativeHandle } from 'react';
import { UniversalExportService } from '../../services/exportService';
import UniversalExportButton from '../common/UniversalExportButton';

interface ExportableChartProps {
  children: React.ReactNode;
  title: string;
  filename?: string;
  data?: any[];
  headers?: string[];
  showExportButton?: boolean;
  exportButtonPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

export interface ExportableChartRef {
  exportChart: (format: string) => Promise<void>;
  getChartData: () => { headers: string[], data: any[] };
}

const ExportableChart = forwardRef<ExportableChartRef, ExportableChartProps>(({
  children,
  title,
  filename = 'chart-export',
  data,
  headers,
  showExportButton = true,
  exportButtonPosition = 'top-right',
  className = ''
}, ref) => {
  const chartRef = React.useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    exportChart: async (format: string) => {
      if (chartRef.current) {
        const exportData = {
          type: 'component' as const,
          element: chartRef.current,
          data,
          headers,
          title
        };

        await UniversalExportService.exportElement(exportData, {
          format: format as any,
          filename,
          title,
          includeTimestamp: true
        });
      }
    },
    getChartData: () => ({ headers: headers || [], data: data || [] })
  }));

  const getPositionClasses = () => {
    switch (exportButtonPosition) {
      case 'top-left': return 'top-2 left-2';
      case 'top-right': return 'top-2 right-2';
      case 'bottom-left': return 'bottom-2 left-2';
      case 'bottom-right': return 'bottom-2 right-2';
      default: return 'top-2 right-2';
    }
  };

  return (
    <div className={`relative ${className}`} ref={chartRef}>
      {showExportButton && (
        <div className={`absolute ${getPositionClasses()} z-10`}>
          <UniversalExportButton
            element={chartRef.current}
            data={data}
            headers={headers}
            title={title}
            filename={filename}
            size="sm"
            variant="ghost"
            showLabel={false}
            className="bg-base-100/80 backdrop-blur-sm hover:bg-base-100"
          />
        </div>
      )}
      {children}
    </div>
  );
});

ExportableChart.displayName = 'ExportableChart';

export default ExportableChart;