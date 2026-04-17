'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, logout, register, fetchMe } from './services';
import { queryKeys } from '@/lib/api/query-keys';
import { useAuthStore } from './store';
import { redirectForRole } from '@/lib/auth/permissions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useMeQuery() {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    enabled: Boolean(token),
  });
}

export function useLoginMutation() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session);
      toast.success('Welcome back');
      router.replace(redirectForRole(session.user.role));
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Invalid email or password');
    },
  });
}

export function useRegisterMutation() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({
    mutationFn: register,
    onSuccess: (session) => {
      setSession(session);
      toast.success('Account created');
      router.replace(redirectForRole(session.user.role));
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);
  const router = useRouter();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.replace('/login');
      toast.success('Logged out');
    },
  });
}
