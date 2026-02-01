import React from 'react';
import { GlassCard } from '@/components/common/GlassCard/GlassCard';
import styles from './ModelLeaderboard.module.scss';

interface ModelStats {
  model: string;
  requests: number;
  percentage: number;
}

interface ModelLeaderboardProps {
  models: ModelStats[];
  maxItems?: number;
}

const getMedal = (rank: number): string => {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return String(rank);
  }
};

export const ModelLeaderboard: React.FC<ModelLeaderboardProps> = ({
  models,
  maxItems = 10,
}) => {
  const topModels = models.slice(0, maxItems);

  return (
    <GlassCard className={styles.leaderboard}>
      <h3 className={styles.title}>Model Leaderboard</h3>
      <div className={styles.table}>
        <div className={styles.header}>
          <span className={styles.rank}>Rank</span>
          <span className={styles.model}>Model</span>
          <span className={styles.requests}>Requests</span>
          <span className={styles.percent}>%</span>
        </div>
        {topModels.map((item, index) => (
          <div key={item.model} className={styles.row}>
            <span className={styles.rank}>{getMedal(index + 1)}</span>
            <span className={styles.model}>{item.model}</span>
            <span className={styles.requests}>{item.requests.toLocaleString()}</span>
            <span className={styles.percent}>{item.percentage}%</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
