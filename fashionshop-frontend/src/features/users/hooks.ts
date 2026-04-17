'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { activateAdminUser, createStaffAccount, updateStaffAccount, deleteAdminAccount, deleteAdminAccountByEmail, deleteAdminUser, fetchAdminCustomerAccounts, fetchAdminStaffAccounts, fetchCustomerAccounts, fetchMe, fetchMeUser, fetchMyOrders, fetchStaffAccounts, fetchUserProfile, updateMe, updateUserProfile } from './services';
import { queryKeys } from '@/lib/api/query-keys';

export function useUserProfileQuery() {
  return useQuery({ queryKey: [...queryKeys.me, 'profile'], queryFn: fetchUserProfile });
}

export function useMeUserQuery() {
  return useQuery({ queryKey: [...queryKeys.me, 'user'], queryFn: fetchMeUser });
}

export function useMeQuery() {
  return useQuery({ queryKey: queryKeys.me, queryFn: fetchMe });
}

export function useMyOrdersQuery() {
  return useQuery({ queryKey: [...queryKeys.orders, 'my-account'], queryFn: fetchMyOrders });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function useStaffAccountsQuery() {
  return useQuery({ queryKey: queryKeys.staffAccounts, queryFn: fetchStaffAccounts });
}

export function useCustomerAccountsQuery() {
  return useQuery({ queryKey: queryKeys.customerAccounts, queryFn: fetchCustomerAccounts });
}

export function useAdminStaffAccountsQuery() {
  return useQuery({ queryKey: ['admin', 'staff-accounts'], queryFn: fetchAdminStaffAccounts });
}

export function useAdminCustomerAccountsQuery() {
  return useQuery({ queryKey: ['admin', 'customer-accounts'], queryFn: fetchAdminCustomerAccounts });
}

export function useCreateStaffAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaffAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'staff-accounts'] });
    },
  });
}

export function useUpdateStaffAccountMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof updateStaffAccount>[1]) => updateStaffAccount(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'staff-accounts'] });
    },
  });
}

export function useDeleteAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'staff-accounts'] });
      await queryClient.invalidateQueries({ queryKey: ['admin', 'customer-accounts'] });
    },
  });
}

export function useActivateAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateAdminUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'staff-accounts'] });
      await queryClient.invalidateQueries({ queryKey: ['admin', 'customer-accounts'] });
    },
  });
}

export function useDeleteAdminAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'staff-accounts'] });
      await queryClient.invalidateQueries({ queryKey: ['admin', 'customer-accounts'] });
    },
  });
}

export function useDeleteAdminAccountByEmailMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminAccountByEmail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'staff-accounts'] });
      await queryClient.invalidateQueries({ queryKey: ['admin', 'customer-accounts'] });
    },
  });
}
