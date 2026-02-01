/**
 * 配置状态管理
 * 从原项目 src/core/config-service.js 迁移
 */

import { create } from 'zustand';
import type { Config } from '@/types';
import type { RawConfigSection } from '@/types/config';
import { configApi } from '@/services/api/config';
import { CACHE_EXPIRY_MS } from '@/utils/constants';

interface ConfigCache {
  data: any;
  timestamp: number;
}

interface ConfigState {
  config: Config | null;
  cache: Map<string, ConfigCache>;
  loading: boolean;
  error: string | null;

  // 操作
  fetchConfig: (section?: RawConfigSection, forceRefresh?: boolean) => Promise<Config | any>;
  updateConfigValue: (section: RawConfigSection, value: any) => void;
  clearCache: (section?: RawConfigSection) => void;
  isCacheValid: (section?: RawConfigSection) => boolean;
}

let configRequestToken = 0;
let inFlightConfigRequest: { id: number; promise: Promise<Config> } | null = null;

const SECTION_KEYS: RawConfigSection[] = [
  'debug',
  'proxy-url',
  'request-retry',
  'quota-exceeded',
  'usage-statistics-enabled',
  'request-log',
  'logging-to-file',
  'logs-max-total-size-mb',
  'ws-auth',
  'force-model-prefix',
  'routing/strategy',
  'api-keys',
  'ampcode',
  'gemini-api-key',
  'codex-api-key',
  'claude-api-key',
  'vertex-api-key',
  'openai-compatibility',
  'oauth-excluded-models',
  // Server settings
  'host',
  'port',
  'tls-enabled',
  'tls-cert',
  'tls-key',
  'commercial-mode',
  // Management settings
  'allow-remote',
  'disable-control-panel',
  'panel-github-repository',
  // Auth settings
  'auth-dir',
  'incognito-browser',
  // Logging settings
  'error-logs-max-files',
  // Performance settings
  'max-retry-interval',
  'nonstream-keepalive-interval',
  'streaming-keepalive-seconds',
  'streaming-bootstrap-retries',
  // Feature settings
  'codex-instructions-enabled'
];

const extractSectionValue = (config: Config | null, section?: RawConfigSection) => {
  if (!config) return undefined;
  switch (section) {
    case 'debug':
      return config.debug;
    case 'proxy-url':
      return config.proxyUrl;
    case 'request-retry':
      return config.requestRetry;
    case 'quota-exceeded':
      return config.quotaExceeded;
    case 'usage-statistics-enabled':
      return config.usageStatisticsEnabled;
    case 'request-log':
      return config.requestLog;
    case 'logging-to-file':
      return config.loggingToFile;
    case 'logs-max-total-size-mb':
      return config.logsMaxTotalSizeMb;
    case 'ws-auth':
      return config.wsAuth;
    case 'force-model-prefix':
      return config.forceModelPrefix;
    case 'routing/strategy':
      return config.routingStrategy;
    case 'api-keys':
      return config.apiKeys;
    case 'ampcode':
      return config.ampcode;
    case 'gemini-api-key':
      return config.geminiApiKeys;
    case 'codex-api-key':
      return config.codexApiKeys;
    case 'claude-api-key':
      return config.claudeApiKeys;
    case 'vertex-api-key':
      return config.vertexApiKeys;
    case 'openai-compatibility':
      return config.openaiCompatibility;
    case 'oauth-excluded-models':
      return config.oauthExcludedModels;
    // Server settings
    case 'host':
      return config.host;
    case 'port':
      return config.port;
    case 'tls-enabled':
      return config.tlsEnabled;
    case 'tls-cert':
      return config.tlsCert;
    case 'tls-key':
      return config.tlsKey;
    case 'commercial-mode':
      return config.commercialMode;
    // Management settings
    case 'allow-remote':
      return config.allowRemote;
    case 'disable-control-panel':
      return config.disableControlPanel;
    case 'panel-github-repository':
      return config.panelGithubRepository;
    // Auth settings
    case 'auth-dir':
      return config.authDir;
    case 'incognito-browser':
      return config.incognitoBrowser;
    // Logging settings
    case 'error-logs-max-files':
      return config.errorLogsMaxFiles;
    // Performance settings
    case 'max-retry-interval':
      return config.maxRetryInterval;
    case 'nonstream-keepalive-interval':
      return config.nonstreamKeepaliveInterval;
    case 'streaming-keepalive-seconds':
      return config.streamingKeepaliveSeconds;
    case 'streaming-bootstrap-retries':
      return config.streamingBootstrapRetries;
    // Feature settings
    case 'codex-instructions-enabled':
      return config.codexInstructionsEnabled;
    default:
      if (!section) return undefined;
      return config.raw?.[section];
  }
};

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: null,
  cache: new Map(),
  loading: false,
  error: null,

  fetchConfig: async (section, forceRefresh = false) => {
    const { cache, isCacheValid } = get();

    // 检查缓存
    const cacheKey = section || '__full__';
    if (!forceRefresh && isCacheValid(section)) {
      const cached = cache.get(cacheKey);
      if (cached) {
        return cached.data;
      }
    }

    // section 缓存未命中但 full 缓存可用时，直接复用已获取到的配置，避免重复 /config 请求
    if (!forceRefresh && section && isCacheValid()) {
      const fullCached = cache.get('__full__');
      if (fullCached?.data) {
        return extractSectionValue(fullCached.data as Config, section);
      }
    }

    // 同一时刻合并多个 /config 请求（如 StrictMode 或多个页面同时触发）
    if (inFlightConfigRequest) {
      const data = await inFlightConfigRequest.promise;
      return section ? extractSectionValue(data, section) : data;
    }

    // 获取新数据
    set({ loading: true, error: null });

    const requestId = (configRequestToken += 1);
    try {
      const requestPromise = configApi.getConfig();
      inFlightConfigRequest = { id: requestId, promise: requestPromise };
      const data = await requestPromise;
      const now = Date.now();

      // 如果在请求过程中连接已被切换/登出，则忽略旧请求的结果，避免覆盖新会话的状态
      if (requestId !== configRequestToken) {
        return section ? extractSectionValue(data, section) : data;
      }

      // 更新缓存
      const newCache = new Map(cache);
      newCache.set('__full__', { data, timestamp: now });
      SECTION_KEYS.forEach((key) => {
        const value = extractSectionValue(data, key);
        if (value !== undefined) {
          newCache.set(key, { data: value, timestamp: now });
        }
      });

      set({
        config: data,
        cache: newCache,
        loading: false
      });

      return section ? extractSectionValue(data, section) : data;
    } catch (error: any) {
      if (requestId === configRequestToken) {
        set({
          error: error.message || 'Failed to fetch config',
          loading: false
        });
      }
      throw error;
    } finally {
      if (inFlightConfigRequest?.id === requestId) {
        inFlightConfigRequest = null;
      }
    }
  },

  updateConfigValue: (section, value) => {
    set((state) => {
      const raw = { ...(state.config?.raw || {}) };
      raw[section] = value;
      const nextConfig: Config = { ...(state.config || {}), raw };

      switch (section) {
        case 'debug':
          nextConfig.debug = value;
          break;
        case 'proxy-url':
          nextConfig.proxyUrl = value;
          break;
        case 'request-retry':
          nextConfig.requestRetry = value;
          break;
        case 'quota-exceeded':
          nextConfig.quotaExceeded = value;
          break;
        case 'usage-statistics-enabled':
          nextConfig.usageStatisticsEnabled = value;
          break;
        case 'request-log':
          nextConfig.requestLog = value;
          break;
        case 'logging-to-file':
          nextConfig.loggingToFile = value;
          break;
        case 'logs-max-total-size-mb':
          nextConfig.logsMaxTotalSizeMb = value;
          break;
        case 'ws-auth':
          nextConfig.wsAuth = value;
          break;
        case 'force-model-prefix':
          nextConfig.forceModelPrefix = value;
          break;
        case 'routing/strategy':
          nextConfig.routingStrategy = value;
          break;
        case 'api-keys':
          nextConfig.apiKeys = value;
          break;
        case 'ampcode':
          nextConfig.ampcode = value;
          break;
        case 'gemini-api-key':
          nextConfig.geminiApiKeys = value;
          break;
        case 'codex-api-key':
          nextConfig.codexApiKeys = value;
          break;
        case 'claude-api-key':
          nextConfig.claudeApiKeys = value;
          break;
        case 'vertex-api-key':
          nextConfig.vertexApiKeys = value;
          break;
        case 'openai-compatibility':
          nextConfig.openaiCompatibility = value;
          break;
        case 'oauth-excluded-models':
          nextConfig.oauthExcludedModels = value;
          break;
        // Server settings
        case 'host':
          nextConfig.host = value;
          break;
        case 'port':
          nextConfig.port = value;
          break;
        case 'tls-enabled':
          nextConfig.tlsEnabled = value;
          break;
        case 'tls-cert':
          nextConfig.tlsCert = value;
          break;
        case 'tls-key':
          nextConfig.tlsKey = value;
          break;
        case 'commercial-mode':
          nextConfig.commercialMode = value;
          break;
        // Management settings
        case 'allow-remote':
          nextConfig.allowRemote = value;
          break;
        case 'disable-control-panel':
          nextConfig.disableControlPanel = value;
          break;
        case 'panel-github-repository':
          nextConfig.panelGithubRepository = value;
          break;
        // Auth settings
        case 'auth-dir':
          nextConfig.authDir = value;
          break;
        case 'incognito-browser':
          nextConfig.incognitoBrowser = value;
          break;
        // Logging settings
        case 'error-logs-max-files':
          nextConfig.errorLogsMaxFiles = value;
          break;
        // Performance settings
        case 'max-retry-interval':
          nextConfig.maxRetryInterval = value;
          break;
        case 'nonstream-keepalive-interval':
          nextConfig.nonstreamKeepaliveInterval = value;
          break;
        case 'streaming-keepalive-seconds':
          nextConfig.streamingKeepaliveSeconds = value;
          break;
        case 'streaming-bootstrap-retries':
          nextConfig.streamingBootstrapRetries = value;
          break;
        // Feature settings
        case 'codex-instructions-enabled':
          nextConfig.codexInstructionsEnabled = value;
          break;
        default:
          break;
      }

      return { config: nextConfig };
    });

    // 清除该 section 的缓存
    get().clearCache(section);
  },

  clearCache: (section) => {
    const { cache } = get();
    const newCache = new Map(cache);

    if (section) {
      newCache.delete(section);
      // 同时清除完整配置缓存
      newCache.delete('__full__');

      set({ cache: newCache });
      return;
    } else {
      newCache.clear();
    }

    // 清除全部缓存一般代表“切换连接/登出/全量刷新”，需要让 in-flight 的旧请求失效
    configRequestToken += 1;
    inFlightConfigRequest = null;

    set({ config: null, cache: newCache, loading: false, error: null });
  },

  isCacheValid: (section) => {
    const { cache } = get();
    const cacheKey = section || '__full__';
    const cached = cache.get(cacheKey);

    if (!cached) return false;

    return Date.now() - cached.timestamp < CACHE_EXPIRY_MS;
  }
}));
