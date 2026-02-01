/**
 * GitHub Copilot OAuth Device Flow Types
 */

export interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export interface PollStatusResponse {
  status: 'pending' | 'authorized' | 'denied' | 'expired' | 'error';
  username?: string;
  error?: string;
}

export type CopilotAuthStatus =
  | 'idle'
  | 'requesting'
  | 'pending'
  | 'authorized'
  | 'denied'
  | 'expired'
  | 'error';
