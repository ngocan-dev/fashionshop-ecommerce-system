import { api, apiRequest } from '@/lib/api/http';
import type { ApiResponse } from '@/lib/api/types';
import type { DashboardPayload } from '@/types/dashboard';

const USE_MOCK = false;

function createMockDashboardData(from: string, to: string): DashboardPayload {
  return {
    fromDate: from,
    toDate: to,
    userStats: { totalUsers: 1300, totalStaff: 16, totalCustomers: 1284, activeUsers: 1250, inactiveUsers: 50 },
    orderStats: { totalOrders: 452, ordersInRange: 120, pendingOrders: 30, confirmedOrders: 40, completedOrders: 300, cancelledOrders: 20 },
    revenueStats: { totalRevenue: 128450, revenueInRange: 42000 },
    orderChart: Array.from({ length: 30 }).map((_, i) => ({
      label: `2026-03-${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 20) + 5,
    })),
    revenueChart: Array.from({ length: 30 }).map((_, i) => ({
      label: `2026-03-${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 5000) + 1000,
    })),
    recentOrders: [],
    recentUsers: [],
  };
}

export async function fetchDashboard(from: string, to: string) {
  if (USE_MOCK) return createMockDashboardData(from, to);
  const response = await api.get<ApiResponse<DashboardPayload>>('/api/dashboard', { params: { from, to } });
  return apiRequest(Promise.resolve(response));
}
