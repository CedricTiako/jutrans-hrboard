import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  title?: string;
  vertical?: boolean;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  vertical = true,
  height = 300 
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: vertical ? 'x' as const : 'y' as const,
    scales: {
      x: {
        ticks: {
          maxRotation: vertical ? 45 : 0,
          minRotation: vertical ? 45 : 0,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;