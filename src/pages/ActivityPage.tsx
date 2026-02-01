import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/common/GlassCard/GlassCard';
import { Button } from '@/components/common/Button/Button';
import { ActivityTable } from '@/components/activity/ActivityTable';
import { ActivityFilters } from '@/components/activity/ActivityFilters';
import { RequestDetailsModal } from '@/components/activity/RequestDetailsModal';
import { useActivityStore } from '@/stores/useActivityStore';
import styles from './ActivityPage.module.scss';

interface Activity {
  id: string;
  timestamp: string;
  model: string;
  status: number;
  tokensPrompt: number;
  tokensCompletion: number;
  duration: number;
  request?: object;
  response?: object;
}

interface ActivityFiltersState {
  model: string;
  status: 'all' | 'success' | 'failure';
  timeRange: '1h' | '24h' | '7d' | '30d';
}

export const ActivityPage: React.FC = () => {
  const {
    activities,
    loading,
    pagination,
    fetchActivities,
  } = useActivityStore();

  const [filters, setFilters] = useState<ActivityFiltersState>({
    model: 'all',
    status: 'all',
    timeRange: '24h',
  });

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    fetchActivities(filters, 1);
  }, [filters, fetchActivities]);

  const handlePageChange = (page: number) => {
    fetchActivities(filters, page);
  };

  const handleRowClick = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleRefresh = () => {
    fetchActivities(filters, pagination.page);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Activity Log</h1>
        <Button variant="secondary" onClick={handleRefresh} loading={loading}>
          Refresh
        </Button>
      </div>

      <GlassCard className={styles.filtersCard}>
        <ActivityFilters
          filters={filters}
          onChange={setFilters}
        />
      </GlassCard>

      <GlassCard className={styles.tableCard}>
        <ActivityTable
          data={activities}
          loading={loading}
          onRowClick={handleRowClick}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </GlassCard>

      <RequestDetailsModal
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};
