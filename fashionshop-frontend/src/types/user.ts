import type { AuthUser } from './common';

export type UpdateProfileRequest = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
  bio?: string;
};

export type StaffAccount = AuthUser & {
  department?: string;
};

export type CustomerAccount = AuthUser & {
  loyaltyPoints?: number;
};
