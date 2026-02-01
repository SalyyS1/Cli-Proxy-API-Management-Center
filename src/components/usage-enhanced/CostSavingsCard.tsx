import React from 'react';
import { GlassCard } from '@/components/common/GlassCard/GlassCard';
import styles from './CostSavingsCard.module.scss';

interface CostSavingsCardProps {
  savings24h: number;
  savings7d: number;
  savingsTotal: number;
  loading?: boolean;
}

export const CostSavingsCard: React.FC<CostSavingsCardProps> = ({
  savings24h,
  savings7d,
  savingsTotal,
  loading = false,
}) => {
  const formatCurrency = (value: number): string => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <GlassCard className={styles.card}>
      <h3 className={styles.title}>Cost Savings</h3>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.label}>24h</span>
            <span className={styles.value}>{formatCurrency(savings24h)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>7d</span>
            <span className={styles.value}>{formatCurrency(savings7d)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Total</span>
            <span className={styles.value}>{formatCurrency(savingsTotal)}</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
