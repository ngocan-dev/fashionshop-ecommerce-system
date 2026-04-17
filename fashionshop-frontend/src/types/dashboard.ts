export type DashboardUserStats = {
  totalUsers: number;
  totalStaff: number;
  totalCustomers: number;
  activeUsers: number;
  inactiveUsers: number;
};

export type DashboardOrderStats = {
  totalOrders: number;
  ordersInRange: number;
  pendingOrders: number;
  confirmedOrders: number;
  completedOrders: number;
  cancelledOrders: number;
};

export type DashboardRevenueStats = {
  totalRevenue: number;
  revenueInRange: number;
};

export type ChartPoint = {
  label: string;
  value: number;
};

export type RecentOrder = {
  id: number;
  status: string;
  totalPrice: number;
  createdAt: string;
};

export type DashboardPayload = {
  fromDate: string;
  toDate: string;
  userStats: DashboardUserStats;
  orderStats: DashboardOrderStats;
  revenueStats: DashboardRevenueStats;
  orderChart: ChartPoint[];
  revenueChart: ChartPoint[];
  recentOrders: RecentOrder[];
  recentUsers: unknown[];
};

/** @deprecated Use DashboardPayload */
export type DashboardSummary = {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  from: string;
  to: string;
};
