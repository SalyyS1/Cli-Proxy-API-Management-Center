/**
 * GitHub Copilot OAuth Device Flow API Service
 * Backend endpoints for Copilot authentication
 */

import { apiClient } from './client';
import type { DeviceCodeResponse, PollStatusResponse } from '@/types/github-copilot-oauth';

const COPILOT_BASE = '/oauth/copilot';

export const copilotApi = {
  /**
   * Start device flow - request device code
   */
  async startDeviceFlow(): Promise<DeviceCodeResponse> {
    const response = await apiClient.post<DeviceCodeResponse>(
      `${COPILOT_BASE}/start`
    );
    return response;
  },

  /**
   * Poll for authorization status
   */
  async pollStatus(deviceCode: string): Promise<PollStatusResponse> {
    const response = await apiClient.get<PollStatusResponse>(
      `${COPILOT_BASE}/poll`,
      { params: { device_code: deviceCode } }
    );
    return response;
  },

  /**
   * Disconnect/revoke Copilot auth
   */
  async disconnect(): Promise<void> {
    await apiClient.delete(`${COPILOT_BASE}/revoke`);
  },

  /**
   * Refresh Copilot token
   */
  async refreshToken(): Promise<void> {
    await apiClient.post(`${COPILOT_BASE}/refresh`);
  },

  /**
   * Get current Copilot auth status
   */
  async getStatus(): Promise<{ connected: boolean; username?: string }> {
    const response = await apiClient.get<{ connected: boolean; username?: string }>(
      `${COPILOT_BASE}/status`
    );
    return response;
  },
};
