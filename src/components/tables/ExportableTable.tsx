import React, { forwardRef, useImperativeHandle } from 'react';
import { UniversalExportService } from '../../services/exportService';
import UniversalExportButton from '../common/UniversalExportButton';

interface ExportableTableProps {
  data: any[];
  headers: string[];
  title: string;
  filename?: string;
  showExportButton?: boolean;
  className?: string;
  tableClassName?: string;
  children?: React.ReactNode;
}

export interface ExportableTableRef {
  exportTable: (format: string) => Promise<void>;
  getTableData: () => { headers: string[], data: any[] };
}

const ExportableTable = forwardRef<ExportableTableRef, ExportableTableProps>(({
  data,
  headers,
  title,
  filename = 'table-export',
  showExportButton = true,
  className = '',
  tableClassName = '',
  children
}, ref) => {
  const tableRef = React.useRef<HTMLTableElement>(null);

  useImperativeHandle(ref, () => ({
    exportTable: async (format: string) => {
      const exportData = {
        type: 'table' as const,
        element: tableRef.current,
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
    },
    getTableData: () => ({ headers, data })
  }));

  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      <div className="card-header p-4 border-b border-base-300">
        <div className="flex justify-between items-center">
          <h3 className="card-title">{title}</h3>
          {showExportButton && (
            <UniversalExportButton
              element={tableRef.current}
              data={data}
              headers={headers}
              title={title}
              filename={filename}
              size="sm"
              variant="outline"
              formats={['excel', 'csv', 'pdf']}
            />
          )}
        </div>
      </div>
      
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <table ref={tableRef} className={`table table-zebra w-full ${tableClassName}`}>
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="font-semibold text-base-content">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <td key={colIndex} className="text-base-content/80">
                      {row[header] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {children}
      </div>
    </div>
  );
});

ExportableTable.displayName = 'ExportableTable';

export default ExportableTable;