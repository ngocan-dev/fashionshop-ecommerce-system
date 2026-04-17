import type { Role } from '@/lib/constants/roles';

export type ApiId = string;

export type ApiPageParams = {
  page?: number;
  size?: number;
};

export type AuthUser = {
  id: ApiId;
  email: string;
  fullName: string;
  role: Role;
  phoneNumber?: string;
  avatarUrl?: string;
  isActive?: boolean;
};
