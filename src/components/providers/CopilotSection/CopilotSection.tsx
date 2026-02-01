import { useState } from 'react';
import { GlassCard } from '@/components/common/GlassCard/GlassCard';
import { Button } from '@/components/common/Button/Button';
import { Badge } from '@/components/common/Badge/Badge';
import { CopilotOAuthModal } from './CopilotOAuthModal';
import { useCopilotAuthStore } from '@/stores/useCopilotAuthStore';
import styles from './CopilotSection.module.scss';

// GitHub Copilot icon SVG
const CopilotIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

interface CopilotSectionProps {
  onAuthSuccess?: () => void;
}

export function CopilotSection({ onAuthSuccess }: CopilotSectionProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const { status, username, disconnect, checkStatus } = useCopilotAuthStore();

  const isAuthenticated = status === 'authorized';

  const handleSuccess = () => {
    setModalOpen(false);
    onAuthSuccess?.();
  };

  const handleDisconnect = async () => {
    await disconnect();
    onAuthSuccess?.();
  };

  const handleRefresh = async () => {
    await checkStatus();
  };

  return (
    <>
      <GlassCard variant="interactive" className={styles.section}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <CopilotIcon />
          </div>
          <div className={styles.info}>
            <h3 className={styles.title}>GitHub Copilot</h3>
            <p className={styles.description}>
              Connect your GitHub Copilot account for AI assistance
            </p>
          </div>
          <div className={styles.status}>
            {isAuthenticated ? (
              <Badge variant="success">Connected</Badge>
            ) : (
              <Badge variant="neutral">Not Connected</Badge>
            )}
          </div>
        </div>

        {isAuthenticated && username && (
          <div className={styles.account}>
            <span className={styles.accountLabel}>Account:</span>
            <span className={styles.accountName}>{username}</span>
          </div>
        )}

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <Button variant="secondary" size="sm" onClick={handleRefresh}>
                Refresh Token
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={() => setModalOpen(true)}
            >
              Connect GitHub Copilot
            </Button>
          )}
        </div>
      </GlassCard>

      <CopilotOAuthModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
