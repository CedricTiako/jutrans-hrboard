import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PositionDistributionProps {
  data: Array<{ name: string; count: number }>;
  loading: boolean;
}

export const PositionDistribution: React.FC<PositionDistributionProps> = ({ data, loading }) => {
  const { t } = useTranslation();

  // Limiter à 10 postes principaux
  const topPositions = [...data].sort((a, b) => b.count - a.count).slice(0, 10);
  
  const chartData = {
    labels: topPositions.map(item => item.name),
    datasets: [
      {
        label: t('dashboard.charts.numberOfEmployees'),
        data: topPositions.map(item => item.count),
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: t('dashboard.charts.numberOfEmployees'),
        },
      },
      y: {
        ticks: {
          autoSkip: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = data.reduce((sum, item) => sum + item.count, 0);
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} ${t('common.employees')} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const totalEmployees = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t('dashboard.charts.positionDistribution')}</h3>
        <span className="text-sm text-gray-500">
          {t('dashboard.charts.topPositions', { count: topPositions.length, total: data.length })}
        </span>
      </div>
      
      <div className="flex-1 min-h-0">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          {t('common.total')} des {t('common.employees')}: <span className="font-medium text-gray-900">{totalEmployees}</span>
        </p>
        {data.length > 10 && (
          <p className="text-xs text-gray-400 mt-1">
            {t('dashboard.charts.showingTop', { count: 10 })}
          </p>
        )}
      </div>
    </div>
  );
};