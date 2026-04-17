import { api, apiRequest } from '@/lib/api/http';
import type { ApiResponse } from '@/lib/api/types';
import type { AuthUser } from '@/types/common';
import type { CustomerAccount, StaffAccount, UpdateProfileRequest } from '@/types/user';
import { mockUser, mockOrders, mockCustomers, mockStaff } from '@/data/mock-data';

const USE_MOCK = false;

export async function fetchUserProfile() {
  if (USE_MOCK) return mockUser;
  const response = await api.get<ApiResponse<AuthUser>>('/api/users/profile');
  return apiRequest(Promise.resolve(response));
}

export async function updateUserProfile(request: UpdateProfileRequest) {
  if (USE_MOCK) return { ...mockUser, ...request };
  const response = await api.put<ApiResponse<AuthUser>>('/api/users/profile', request);
  return apiRequest(Promise.resolve(response));
}

export async function fetchMeUser() {
  if (USE_MOCK) return mockUser;
  const response = await api.get<ApiResponse<AuthUser>>('/api/users/me');
  return apiRequest(Promise.resolve(response));
}

export async function fetchMe() {
  if (USE_MOCK) return mockUser;
  const response = await api.get<ApiResponse<AuthUser>>('/api/me');
  return apiRequest(Promise.resolve(response));
}

export async function updateMe(request: UpdateProfileRequest) {
  if (USE_MOCK) return { ...mockUser, ...request };
  const response = await api.put<ApiResponse<AuthUser>>('/api/me', request);
  return apiRequest(Promise.resolve(response));
}

export async function fetchMyOrders() {
  if (USE_MOCK) return mockOrders as unknown[];
  const response = await api.get<ApiResponse<unknown[]>>('/api/me/orders');
  return apiRequest(Promise.resolve(response));
}

export async function createStaffAccount(request: { fullName: string; email: string; password?: string; role?: string }) {
  if (USE_MOCK) {
    const newStaff: StaffAccount = {
      id: Math.random().toString(36).substring(7),
      email: request.email,
      fullName: request.fullName,
      role: (request.role as any) || 'STAFF',
      isActive: true,
    };
    mockStaff.push(newStaff);
    return newStaff;
  }
  const response = await api.post<ApiResponse<StaffAccount>>('/api/admin/users/staff', request);
  return apiRequest(Promise.resolve(response));
}

export async function updateStaffAccount(id: string, request: { fullName: string; email: string; role?: string }) {
  if (USE_MOCK) {
    const staff = mockStaff.find(s => s.id === id);
    if (staff) {
      staff.fullName = request.fullName;
      staff.email = request.email;
      if (request.role) staff.role = request.role as any;
      return staff;
    }
    throw new Error('Staff not found');
  }
  const response = await api.put<ApiResponse<StaffAccount>>(`/api/admin/users/staff/${id}`, request);
  return apiRequest(Promise.resolve(response));
}

export async function fetchStaffAccounts() {
  if (USE_MOCK) return mockStaff;
  const response = await api.get<ApiResponse<StaffAccount[]>>('/api/admin/users/staff');
  return apiRequest(Promise.resolve(response));
}

export async function fetchCustomerAccounts() {
  if (USE_MOCK) return mockCustomers;
  const response = await api.get<ApiResponse<CustomerAccount[]>>('/api/admin/users/customers');
  return apiRequest(Promise.resolve(response));
}

export async function deleteAdminUser(userId: string) {
  if (USE_MOCK) {
    const customer = mockCustomers.find(c => c.id === userId);
    if (customer) customer.isActive = false;
    const staff = mockStaff.find(s => s.id === userId);
    if (staff) staff.isActive = false;
    return null;
  }
  const response = await api.delete<ApiResponse<null>>(`/api/admin/users/${userId}`);
  return apiRequest(Promise.resolve(response));
}

export async function fetchAdminStaffAccounts() {
  if (USE_MOCK) return mockStaff;
  const response = await api.get<ApiResponse<StaffAccount[]>>('/api/admin/staff-accounts');
  return apiRequest(Promise.resolve(response));
}

export async function fetchAdminCustomerAccounts() {
  if (USE_MOCK) return mockCustomers;
  const response = await api.get<ApiResponse<CustomerAccount[]>>('/api/admin/customer-accounts');
  return apiRequest(Promise.resolve(response));
}

export async function activateAdminUser(userId: string) {
  if (USE_MOCK) {
    const customer = mockCustomers.find(c => c.id === userId);
    if (customer) customer.isActive = true;
    const staff = mockStaff.find(s => s.id === userId);
    if (staff) staff.isActive = true;
    return null;
  }
  const response = await api.patch<ApiResponse<null>>(`/api/admin/users/${userId}/activate`);
  return apiRequest(Promise.resolve(response));
}

export async function deleteAdminAccount(id: string) {
  if (USE_MOCK) {
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) customer.isActive = false;
    const staff = mockStaff.find(s => s.id === id);
    if (staff) staff.isActive = false;
    return null;
  }
  const response = await api.delete<ApiResponse<null>>(`/api/admin/accounts/${id}`);
  return apiRequest(Promise.resolve(response));
}

export async function deleteAdminAccountByEmail(email: string) {
  if (USE_MOCK) return null;
  const response = await api.delete<ApiResponse<null>>('/api/admin/accounts/by-email', { params: { email } });
  return apiRequest(Promise.resolve(response));
}
