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

// Enregistrer les composants nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AgePyramidProps {
  data: {
    male: number[];
    female: number[];
  };
  loading: boolean;
}

export const AgePyramid: React.FC<AgePyramidProps> = ({ data, loading }) => {
  const { t } = useTranslation();

  // Inverser les données pour afficher la pyramide correctement
  const labels = ['> 60', '56 - 60', '51 - 55', '46 - 50', '41 - 45', '36 - 40', '31 - 35', '21 - 30'];
  
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: t('dashboard.charts.male'),
        data: [...data.male].reverse(),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        barThickness: 20,
      },
      {
        label: t('dashboard.charts.female'),
        data: data.female.map(value => -value).reverse(), // Négatif pour l'affichage à gauche
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        barThickness: 20,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: (value) => Math.abs(Number(value)), // Afficher la valeur absolue
        },
        title: {
          display: true,
          text: t('dashboard.charts.numberOfEmployees'),
        },
      },
      y: {
        stacked: true,
        ticks: {
          display: true,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = Math.abs(Number(context.raw));
            return `${label}: ${value}`;
          },
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

  return (
    <div className="bg-white p-6 rounded-lg shadow h-[400px]">
      <h3 className="text-lg font-semibold mb-4">{t('dashboard.charts.agePyramid')}</h3>
      <div className="h-[calc(100%-2rem)]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};