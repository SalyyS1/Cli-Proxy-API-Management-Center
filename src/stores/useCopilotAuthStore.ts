/**
 * GitHub Copilot OAuth Device Flow Store
 * Manages device authorization flow state and polling
 */

import { create } from 'zustand';
import { copilotApi } from '@/services/api/github-copilot-oauth-api';
import type { CopilotAuthStatus } from '@/types/github-copilot-oauth';

interface CopilotAuthState {
  // Device code info
  deviceCode: string | null;
  userCode: string | null;
  verificationUri: string | null;
  expiresAt: number | null;
  pollInterval: number;

  // Status
  status: CopilotAuthStatus;
  error: string | null;
  username: string | null;

  // Polling
  isPolling: boolean;

  // Actions
  startDeviceFlow: () => Promise<void>;
  stopPolling: () => void;
  reset: () => void;
  checkStatus: () => Promise<void>;
  disconnect: () => Promise<void>;
}

// Private polling state (not in store to avoid render loops)
let pollTimeoutId: ReturnType<typeof setTimeout> | null = null;
let pollStartTime: number | null = null;

const MAX_POLL_DURATION = 15 * 60 * 1000; // 15 minutes
const DEFAULT_POLL_INTERVAL = 5000; // 5 seconds

export const useCopilotAuthStore = create<CopilotAuthState>((set, get) => ({
  // Initial state
  deviceCode: null,
  userCode: null,
  verificationUri: null,
  expiresAt: null,
  pollInterval: DEFAULT_POLL_INTERVAL,
  status: 'idle',
  error: null,
  username: null,
  isPolling: false,

  startDeviceFlow: async () => {
    // Reset any existing state
    get().stopPolling();

    set({
      status: 'requesting',
      error: null,
      deviceCode: null,
      userCode: null,
    });

    try {
      const response = await copilotApi.startDeviceFlow();

      const expiresAt = Date.now() + response.expires_in * 1000;
      pollStartTime = Date.now();

      set({
        deviceCode: response.device_code,
        userCode: response.user_code,
        verificationUri: response.verification_uri,
        expiresAt,
        pollInterval: (response.interval || 5) * 1000,
        status: 'pending',
        isPolling: true,
      });

      // Start polling
      startPolling(get, set);
    } catch (err: any) {
      set({
        status: 'error',
        error: err.response?.data?.message || err.message || 'Failed to start device flow',
      });
    }
  },

  stopPolling: () => {
    if (pollTimeoutId) {
      clearTimeout(pollTimeoutId);
      pollTimeoutId = null;
    }
    pollStartTime = null;
    set({ isPolling: false });
  },

  reset: () => {
    get().stopPolling();
    set({
      deviceCode: null,
      userCode: null,
      verificationUri: null,
      expiresAt: null,
      pollInterval: DEFAULT_POLL_INTERVAL,
      status: 'idle',
      error: null,
      username: null,
      isPolling: false,
    });
  },

  checkStatus: async () => {
    try {
      const status = await copilotApi.getStatus();
      if (status.connected) {
        set({
          status: 'authorized',
          username: status.username || null,
        });
      } else {
        set({ status: 'idle', username: null });
      }
    } catch {
      // Ignore errors on status check
    }
  },

  disconnect: async () => {
    try {
      await copilotApi.disconnect();
      get().reset();
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to disconnect',
      });
    }
  },
}));

/**
 * Polling function (private)
 */
async function startPolling(
  get: () => CopilotAuthState,
  set: (state: Partial<CopilotAuthState>) => void
) {
  const poll = async () => {
    const state = get();

    // Check timeout
    if (pollStartTime && Date.now() - pollStartTime > MAX_POLL_DURATION) {
      set({ status: 'expired', isPolling: false, error: 'Authorization timeout' });
      return;
    }

    // Check expiry
    if (state.expiresAt && Date.now() > state.expiresAt) {
      set({ status: 'expired', isPolling: false, error: 'Code expired' });
      return;
    }

    if (!state.deviceCode || state.status !== 'pending') {
      return;
    }

    try {
      const response = await copilotApi.pollStatus(state.deviceCode);

      switch (response.status) {
        case 'authorized':
          set({
            status: 'authorized',
            username: response.username || null,
            isPolling: false,
          });
          pollTimeoutId = null;
          return;

        case 'denied':
          set({
            status: 'denied',
            error: 'Authorization was denied',
            isPolling: false,
          });
          pollTimeoutId = null;
          return;

        case 'expired':
          set({
            status: 'expired',
            error: 'Code expired',
            isPolling: false,
          });
          pollTimeoutId = null;
          return;

        case 'error':
          set({
            status: 'error',
            error: response.error || 'An error occurred',
            isPolling: false,
          });
          pollTimeoutId = null;
          return;

        case 'pending':
        default:
          // Continue polling
          pollTimeoutId = setTimeout(poll, state.pollInterval);
          break;
      }
    } catch (err: any) {
      // Network error - retry after interval
      console.error('Copilot poll error:', err);
      pollTimeoutId = setTimeout(poll, state.pollInterval);
    }
  };

  // Start first poll
  pollTimeoutId = setTimeout(poll, get().pollInterval);
}
