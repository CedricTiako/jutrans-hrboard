import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TenureDistributionProps {
  data: Record<string, number>;
  loading: boolean;
}

export const TenureDistribution: React.FC<TenureDistributionProps> = ({ data, loading }) => {
  const { t } = useTranslation();

  // Trier les tranches d'ancienneté dans l'ordre croissant
  const sortedLabels = Object.keys(data).sort((a, b) => {
    const getMinYear = (range: string) => {
      const match = range.match(/(\d+)/);
      return match ? parseInt(match[0], 10) : 0;
    };
    return getMinYear(a) - getMinYear(b);
  });

  const chartData = {
    labels: sortedLabels,
    datasets: [
      {
        label: t('dashboard.charts.numberOfEmployees'),
        data: sortedLabels.map(label => data[label] || 0),
        borderColor: 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointHoverBorderColor: '#fff',
        pointHitRadius: 10,
        pointBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw as number;
            const total = Object.values(data).reduce((sum, count) => sum + count, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: t('dashboard.charts.tenureGroups'),
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t('dashboard.charts.numberOfEmployees'),
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const totalEmployees = Object.values(data).reduce((sum, count) => sum + count, 0);
  const averageTenure = Object.entries(data).reduce((sum, [range, count]) => {
    const midPoint = range.split(' - ').reduce((a, b) => (parseInt(a) + parseInt(b)) / 2, 0);
    return sum + (midPoint * count);
  }, 0) / totalEmployees;

  return (
    <div className="bg-white p-6 rounded-lg shadow h-[400px]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{t('dashboard.charts.tenureDistribution')}</h3>
          <p className="text-sm text-gray-500">Distribution des employés par années d'expérience</p>
        </div>
        <div className="bg-blue-50 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-blue-700">
            {t('common.average')}: {averageTenure.toFixed(1)} ans
          </span>
        </div>
      </div>
      
      <div className="h-[calc(100%-5rem)]">
        <Line data={chartData} options={options} />
      </div>
      
      <div className="mt-2 text-right">
        <p className="text-xs text-gray-500">
          {t('common.total')}: {totalEmployees} {t('common.employees')}
        </p>
      </div>
    </div>
  );
};