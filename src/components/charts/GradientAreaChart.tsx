import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './GradientAreaChart.module.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface GradientAreaChartProps {
  labels: string[];
  data: number[];
  label?: string;
  height?: number;
}

export const GradientAreaChart: React.FC<GradientAreaChartProps> = ({
  labels,
  data,
  label = 'Requests',
  height = 300,
}) => {
  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label,
        data,
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');  // Emerald
          gradient.addColorStop(0.5, 'rgba(20, 184, 166, 0.2)'); // Teal
          gradient.addColorStop(1, 'rgba(20, 184, 166, 0)');
          return gradient;
        },
        borderColor: '#10b981',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#10b981',
      },
    ],
  }), [labels, data, label, height]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'var(--text-tertiary)' },
      },
      y: {
        grid: { color: 'var(--border-color)' },
        ticks: { color: 'var(--text-tertiary)' },
      },
    },
  }), []);

  return (
    <div className={styles.container} style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};
