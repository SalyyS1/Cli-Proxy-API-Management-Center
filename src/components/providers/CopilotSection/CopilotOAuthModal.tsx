import { useEffect, useState, useCallback } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import { Button } from '@/components/common/Button/Button';
import { Spinner } from '@/components/common/Spinner/Spinner';
import { Badge } from '@/components/common/Badge/Badge';
import { useCopilotAuthStore } from '@/stores/useCopilotAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import styles from './CopilotOAuthModal.module.scss';

interface CopilotOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export function CopilotOAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: CopilotOAuthModalProps) {
  const {
    userCode,
    verificationUri,
    status,
    error,
    username,
    expiresAt,
    startDeviceFlow,
    stopPolling,
    reset,
  } = useCopilotAuthStore();

  const { showNotification } = useNotificationStore();
  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  // Start flow when modal opens
  useEffect(() => {
    if (isOpen && status === 'idle') {
      startDeviceFlow();
    }
  }, [isOpen, status, startDeviceFlow]);

  // Handle success
  useEffect(() => {
    if (status === 'authorized' && username) {
      showNotification(`Successfully connected as ${username}`, 'success');
      onSuccess(username);
    }
  }, [status, username, onSuccess, showNotification]);

  // Update expiry countdown
  useEffect(() => {
    if (!expiresAt || status !== 'pending') {
      setRemainingTime(null);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, expiresAt - Date.now());
      if (remaining === 0) {
        setRemainingTime('Expired');
        return;
      }
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, status]);

  const handleClose = useCallback(() => {
    stopPolling();
    reset();
    onClose();
  }, [stopPolling, reset, onClose]);

  const handleCopyCode = useCallback(() => {
    if (userCode) {
      navigator.clipboard.writeText(userCode);
      showNotification('Code copied to clipboard', 'info');
    }
  }, [userCode, showNotification]);

  const handleOpenBrowser = useCallback(() => {
    if (verificationUri) {
      window.open(verificationUri, '_blank', 'noopener,noreferrer');
    }
  }, [verificationUri]);

  const handleRetry = useCallback(() => {
    reset();
    startDeviceFlow();
  }, [reset, startDeviceFlow]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Connect GitHub Copilot" size="md">
      <div className={styles.content}>
        {/* Requesting state */}
        {status === 'requesting' && (
          <div className={styles.loading}>
            <Spinner size="lg" />
            <p>Requesting device code...</p>
          </div>
        )}

        {/* Pending state - show code */}
        {status === 'pending' && userCode && (
          <>
            <div className={styles.instructions}>
              <p>Enter this code on GitHub to authorize:</p>
            </div>

            <div className={styles.codeDisplay}>
              <span className={styles.code}>{userCode}</span>
              <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                Copy
              </Button>
            </div>

            <div className={styles.verification}>
              <p className={styles.verificationLabel}>Go to:</p>
              <a
                href={verificationUri || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.verificationLink}
              >
                {verificationUri}
              </a>
            </div>

            <Button
              variant="primary"
              onClick={handleOpenBrowser}
              className={styles.openButton}
            >
              Open GitHub in Browser
            </Button>

            <div className={styles.polling}>
              <Spinner size="sm" />
              <span>Waiting for authorization...</span>
              {remainingTime && (
                <Badge variant="neutral" size="sm">
                  Expires in {remainingTime}
                </Badge>
              )}
            </div>
          </>
        )}

        {/* Error states */}
        {(status === 'error' || status === 'denied' || status === 'expired') && (
          <div className={styles.error}>
            <div className={styles.errorIcon}>⚠️</div>
            <p className={styles.errorMessage}>
              {error || 'Authorization failed. Please try again.'}
            </p>
            <Button variant="primary" onClick={handleRetry}>
              {status === 'expired' ? 'Request New Code' : 'Try Again'}
            </Button>
          </div>
        )}

        {/* Success state (brief, before modal closes) */}
        {status === 'authorized' && (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <p>Successfully connected as <strong>{username}</strong></p>
          </div>
        )}
      </div>
    </Modal>
  );
}
