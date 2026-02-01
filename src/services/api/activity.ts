// import { apiClient } from './client';

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

interface ActivityFilters {
  model: string;
  status: 'all' | 'success' | 'failure';
  timeRange: '1h' | '24h' | '7d' | '30d';
}

interface ActivityResponse {
  data: Activity[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export const activityApi = {
  async getActivities(_filters: ActivityFilters, page: number = 1): Promise<ActivityResponse> {
    // Mock implementation - replace with actual API call when backend is ready
    // When implementing real API: const result = await apiClient.get('/activity', { params: { ...filters, page } });
    const mockData: Activity[] = Array.from({ length: 50 }, (_, i) => ({
      id: `activity-${page}-${i}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      model: ['gpt-4o', 'claude-3-opus', 'gemini-2.5-pro', 'gpt-4-turbo'][i % 4],
      status: i % 10 === 0 ? 429 : 200,
      tokensPrompt: Math.floor(Math.random() * 1000) + 100,
      tokensCompletion: Math.floor(Math.random() * 500) + 50,
      duration: Math.random() * 3 + 0.5,
      request: { messages: [{ role: 'user', content: 'Sample request' }] },
      response: { choices: [{ message: { content: 'Sample response' } }] },
    }));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      data: mockData,
      pagination: {
        page,
        pageSize: 50,
        total: 1000,
      },
    };
  },
};
