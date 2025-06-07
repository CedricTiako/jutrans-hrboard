import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
  title?: string;
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, title, height = 300 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
      datalabels: {
        formatter: (value: number, ctx: any) => {
          const sum = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = Math.round((value / sum) * 100) + '%';
          return percentage;
        },
        color: '#fff',
        font: {
          weight: 'bold' as const,
          size: 12,
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;