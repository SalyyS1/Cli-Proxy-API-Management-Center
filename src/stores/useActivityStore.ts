import { create } from 'zustand';
import { activityApi } from '@/services/api/activity';

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

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

interface ActivityState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchActivities: (filters: any, page: number) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  loading: false,
  error: null,
  pagination: { page: 1, pageSize: 50, total: 0 },

  fetchActivities: async (filters, page) => {
    set({ loading: true, error: null });
    try {
      const result = await activityApi.getActivities(filters, page);
      set({
        activities: result.data,
        pagination: result.pagination,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
