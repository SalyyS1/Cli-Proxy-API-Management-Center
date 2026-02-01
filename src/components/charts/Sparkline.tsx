import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import styles from './Sparkline.module.scss';

interface SparklineProps {
  data: number[];
  color?: 'emerald' | 'teal' | 'cyan';
  width?: number;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = 'emerald',
  width = 80,
  height = 24,
}) => {
  const colors = {
    emerald: '#10b981',
    teal: '#14b8a6',
    cyan: '#06b6d4',
  };

  const chartData = useMemo(() => ({
    labels: data.map((_, i) => i.toString()),
    datasets: [{
      data,
      borderColor: colors[color],
      borderWidth: 1.5,
      tension: 0.4,
      pointRadius: 0,
      fill: false,
    }],
  }), [data, color]);

  const options = useMemo(() => ({
    responsive: false,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  }), []);

  return (
    <div className={styles.sparkline} style={{ width, height }}>
      <Line data={chartData} options={options} width={width} height={height} />
    </div>
  );
};
