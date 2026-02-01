import React from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import { Button } from '@/components/common/Button/Button';
import styles from './RequestDetailsModal.module.scss';

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

interface RequestDetailsModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  activity,
  isOpen,
  onClose,
}) => {
  if (!activity) return null;

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatJSON = (obj?: object): string => {
    if (!obj) return 'N/A';
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return 'Invalid JSON';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Details"
      size="lg"
    >
      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>General</h3>
          <div className={styles.info}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Time:</span>
              <span className={styles.value}>{formatTimestamp(activity.timestamp)}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Model:</span>
              <span className={styles.value}>{activity.model}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Status:</span>
              <span className={styles.value}>{activity.status}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Tokens:</span>
              <span className={styles.value}>
                {activity.tokensPrompt + activity.tokensCompletion} (prompt: {activity.tokensPrompt}, completion: {activity.tokensCompletion})
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Duration:</span>
              <span className={styles.value}>{activity.duration.toFixed(2)}s</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Request</h3>
          <pre className={styles.code}>{formatJSON(activity.request)}</pre>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Response</h3>
          <pre className={styles.code}>{formatJSON(activity.response)}</pre>
        </div>

        <div className={styles.footer}>
          <Button onClick={onClose} variant="primary">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
