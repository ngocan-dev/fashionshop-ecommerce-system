import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/dashboard/hooks', () => ({
  useDashboardQuery: () => ({
    data: {
      fromDate: '2026-03-01',
      toDate: '2026-04-01',
      userStats: { totalUsers: 10, totalStaff: 2, totalCustomers: 8, activeUsers: 9, inactiveUsers: 1 },
      orderStats: { totalOrders: 4, ordersInRange: 4, pendingOrders: 1, confirmedOrders: 1, completedOrders: 2, cancelledOrders: 0 },
      revenueStats: { totalRevenue: 100, revenueInRange: 100 },
      orderChart: [],
      revenueChart: [],
      recentOrders: [],
      recentUsers: [],
    },
    isLoading: false,
  }),
}));

import AdminDashboardPage from './page';

describe('AdminDashboardPage', () => {
  it('renders dashboard metrics', () => {
    render(<AdminDashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});