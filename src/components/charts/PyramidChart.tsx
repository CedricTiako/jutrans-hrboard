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

interface PyramidChartProps {
  maleData: number[];
  femaleData: number[];
  labels: string[];
  title?: string;
  height?: number;
}

const PyramidChart: React.FC<PyramidChartProps> = ({
  maleData,
  femaleData,
  labels,
  title,
  height = 400,
}) => {
  // Convert male data to negative values for the pyramid effect
  const negMaleData = maleData.map(value => -value);

  const data = {
    labels,
    datasets: [
      {
        label: 'Male',
        data: negMaleData,
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
      },
      {
        label: 'Female',
        data: femaleData,
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      x: {
        ticks: {
          callback: function(value: number) {
            return Math.abs(value);
          },
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
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.x < 0) {
              label += Math.abs(context.parsed.x);
            } else {
              label += context.parsed.x;
            }
            return label;
          },
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

export default PyramidChart;