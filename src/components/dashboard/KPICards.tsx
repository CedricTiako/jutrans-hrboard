import React from 'react';
import { Users, UserPlus, Clock, UserCheck, UserX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface KPICardsProps {
  loading: boolean;
  stats: {
    totalEmployees: number;
    avgAge: number;
    avgTenure: number;
    newHires: number;
    nearRetirement: number;
  };
}

export const KPICards: React.FC<KPICardsProps> = ({ loading, stats }) => {
  const { t } = useTranslation();

  const kpiData = [
    {
      title: t('dashboard.kpis.totalEmployees'),
      value: stats.totalEmployees,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      description: t('dashboard.kpis.totalEmployeesDesc'),
    },
    {
      title: t('dashboard.kpis.avgAge'),
      value: `${stats.avgAge} ${t('common.year')}s`,
      icon: <Clock className="h-6 w-6 text-green-500" />,
      description: t('dashboard.kpis.avgAgeDesc'),
    },
    {
      title: t('dashboard.kpis.avgTenure'),
      value: `${stats.avgTenure} ${t('common.year')}s`,
      icon: <UserCheck className="h-6 w-6 text-purple-500" />,
      description: t('dashboard.kpis.avgTenureDesc'),
    },
    {
      title: t('dashboard.kpis.newHires'),
      value: stats.newHires,
      icon: <UserPlus className="h-6 w-6 text-yellow-500" />,
      description: t('dashboard.kpis.newHiresDesc'),
    },
    {
      title: t('dashboard.kpis.nearRetirement'),
      value: stats.nearRetirement,
      icon: <UserX className="h-6 w-6 text-red-500" />,
      description: t('dashboard.kpis.nearRetirementDesc'),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {kpiData.map((kpi, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              {kpi.title}
            </h3>
            <div className="p-2 rounded-full bg-opacity-10 bg-blue-500">
              {kpi.icon}
            </div>
          </div>
          <div className="mt-2">
            {loading ? (
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {kpi.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};