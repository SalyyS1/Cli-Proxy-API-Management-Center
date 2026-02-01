import React from 'react';
import styles from './ActivityFilters.module.scss';

interface ActivityFiltersProps {
  filters: {
    model: string;
    status: 'all' | 'success' | 'failure';
    timeRange: '1h' | '24h' | '7d' | '30d';
  };
  onChange: (filters: any) => void;
  availableModels?: string[];
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  filters,
  onChange,
  availableModels = [],
}) => {
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, model: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, status: e.target.value as any });
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, timeRange: e.target.value as any });
  };

  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <label className={styles.label}>Model</label>
        <select
          className={styles.select}
          value={filters.model}
          onChange={handleModelChange}
        >
          <option value="all">All Models</option>
          {availableModels.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Status</label>
        <select
          className={styles.select}
          value={filters.status}
          onChange={handleStatusChange}
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="failure">Failure</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Time Range</label>
        <select
          className={styles.select}
          value={filters.timeRange}
          onChange={handleTimeRangeChange}
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>
    </div>
  );
};
