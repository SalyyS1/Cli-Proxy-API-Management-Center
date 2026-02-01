import React from 'react';
import { Badge } from '@/components/common/Badge/Badge';
import { Spinner } from '@/components/common/Spinner/Spinner';
import styles from './ActivityTable.module.scss';

interface Activity {
  id: string;
  timestamp: string;
  model: string;
  status: number;
  tokensPrompt: number;
  tokensCompletion: number;
  duration: number;
}

interface ActivityTableProps {
  data: Activity[];
  loading?: boolean;
  onRowClick?: (activity: Activity) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  data,
  loading = false,
  onRowClick,
  pagination,
  onPageChange,
}) => {
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return <Badge variant="success">✓ {status}</Badge>;
    }
    return <Badge variant="error">✗ {status}</Badge>;
  };

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <Spinner />
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Model</th>
              <th>Status</th>
              <th>Tokens</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No activity records found
                </td>
              </tr>
            ) : (
              data.map((activity) => (
                <tr
                  key={activity.id}
                  className={styles.row}
                  onClick={() => onRowClick?.(activity)}
                >
                  <td className={styles.time}>{formatTime(activity.timestamp)}</td>
                  <td className={styles.model}>{activity.model}</td>
                  <td className={styles.status}>{getStatusBadge(activity.status)}</td>
                  <td className={styles.tokens}>
                    {(activity.tokensPrompt + activity.tokensCompletion).toLocaleString()}
                  </td>
                  <td className={styles.duration}>{activity.duration.toFixed(2)}s</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            ← Prev
          </button>
          <span className={styles.pageInfo}>
            Page {pagination.page} of {totalPages}
          </span>
          <button
            className={styles.pageButton}
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={pagination.page >= totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
