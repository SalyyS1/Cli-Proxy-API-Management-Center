/**
 * 配置相关类型定义
 * 与基线 /config 返回结构保持一致（内部使用驼峰形式）
 */

import type { GeminiKeyConfig, ProviderKeyConfig, OpenAIProviderConfig } from './provider';
import type { AmpcodeConfig } from './ampcode';

export interface QuotaExceededConfig {
  switchProject?: boolean;
  switchPreviewModel?: boolean;
}

export interface Config {
  // Existing settings
  debug?: boolean;
  proxyUrl?: string;
  requestRetry?: number;
  quotaExceeded?: QuotaExceededConfig;
  usageStatisticsEnabled?: boolean;
  requestLog?: boolean;
  loggingToFile?: boolean;
  logsMaxTotalSizeMb?: number;
  wsAuth?: boolean;
  forceModelPrefix?: boolean;
  routingStrategy?: string;
  apiKeys?: string[];
  ampcode?: AmpcodeConfig;
  geminiApiKeys?: GeminiKeyConfig[];
  codexApiKeys?: ProviderKeyConfig[];
  claudeApiKeys?: ProviderKeyConfig[];
  vertexApiKeys?: ProviderKeyConfig[];
  openaiCompatibility?: OpenAIProviderConfig[];
  oauthExcludedModels?: Record<string, string[]>;

  // NEW: Server settings
  host?: string;
  port?: number;
  tlsEnabled?: boolean;
  tlsCert?: string;
  tlsKey?: string;
  commercialMode?: boolean;

  // NEW: Management settings
  allowRemote?: boolean;
  disableControlPanel?: boolean;
  panelGithubRepository?: string;

  // NEW: Auth settings
  authDir?: string;
  incognitoBrowser?: boolean;

  // NEW: Logging settings (errorLogsMaxFiles new)
  errorLogsMaxFiles?: number;

  // NEW: Performance settings
  maxRetryInterval?: number;
  nonstreamKeepaliveInterval?: number;
  streamingKeepaliveSeconds?: number;
  streamingBootstrapRetries?: number;

  // NEW: Feature settings
  codexInstructionsEnabled?: boolean;

  raw?: Record<string, any>;
}

export type RawConfigSection =
  | 'debug'
  | 'proxy-url'
  | 'request-retry'
  | 'quota-exceeded'
  | 'usage-statistics-enabled'
  | 'request-log'
  | 'logging-to-file'
  | 'logs-max-total-size-mb'
  | 'ws-auth'
  | 'force-model-prefix'
  | 'routing/strategy'
  | 'api-keys'
  | 'ampcode'
  | 'gemini-api-key'
  | 'codex-api-key'
  | 'claude-api-key'
  | 'vertex-api-key'
  | 'openai-compatibility'
  | 'oauth-excluded-models'
  // NEW: Server settings
  | 'host'
  | 'port'
  | 'tls-enabled'
  | 'tls-cert'
  | 'tls-key'
  | 'commercial-mode'
  // NEW: Management settings
  | 'allow-remote'
  | 'disable-control-panel'
  | 'panel-github-repository'
  // NEW: Auth settings
  | 'auth-dir'
  | 'incognito-browser'
  // NEW: Logging settings
  | 'error-logs-max-files'
  // NEW: Performance settings
  | 'max-retry-interval'
  | 'nonstream-keepalive-interval'
  | 'streaming-keepalive-seconds'
  | 'streaming-bootstrap-retries'
  // NEW: Feature settings
  | 'codex-instructions-enabled';

export interface ConfigCache {
  data: Config;
  timestamp: number;
}
