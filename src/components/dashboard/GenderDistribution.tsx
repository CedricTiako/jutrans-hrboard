import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GenderDistributionProps {
  male: number;
  female: number;
  loading: boolean;
}

export const GenderDistribution: React.FC<GenderDistributionProps> = ({ male, female, loading }) => {
  const { t } = useTranslation();

  const data = {
    labels: [t('dashboard.charts.male'), t('dashboard.charts.female')],
    datasets: [
      {
        data: [male, female],
        backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = male + female;
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const total = male + female;
  const malePercentage = total > 0 ? ((male / total) * 100).toFixed(1) : 0;
  const femalePercentage = total > 0 ? ((female / total) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <h3 className="text-lg font-semibold mb-4">{t('dashboard.charts.genderDistribution')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="h-64">
          <Doughnut data={data} options={options} />
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-blue-700">{t('dashboard.charts.male')}</span>
              <span className="text-sm font-medium text-blue-700">{malePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${malePercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{male} {t('common.employees')}</p>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-pink-700">{t('dashboard.charts.female')}</span>
              <span className="text-sm font-medium text-pink-700">{femalePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-pink-600 h-2.5 rounded-full" 
                style={{ width: `${femalePercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{female} {t('common.employees')}</p>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">{t('common.total')} des {t('common.employees')}</p>
            <p className="text-2xl font-bold text-gray-800">{total}</p>
          </div>
        </div>
      </div>
    </div>
  );
};