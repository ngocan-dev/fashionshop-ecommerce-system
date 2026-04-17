import { api, apiRequest } from '@/lib/api/http';
import type { ApiResponse } from '@/lib/api/types';
import type { AuthSession } from '@/types/auth';
import type { LoginRequest, RegisterRequest } from '@/types/auth';
import type { Role } from '@/lib/constants/roles';

type AuthResponseRaw = {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: Role;
};

function mapAuthResponse(raw: AuthResponseRaw): AuthSession {
  return {
    accessToken: raw.token,
    user: {
      id: String(raw.userId),
      email: raw.email,
      fullName: raw.fullName,
      role: raw.role,
    },
  };
}

export async function login(request: LoginRequest): Promise<AuthSession> {
  const response = await api.post<ApiResponse<AuthResponseRaw>>('/api/auth/login', request);
  const raw = await apiRequest(Promise.resolve(response));
  return mapAuthResponse(raw);
}

export async function register(request: RegisterRequest): Promise<AuthSession> {
  const payload = { fullName: request.fullName, email: request.email, password: request.password, verifiedPassword: request.confirmPassword };
  const response = await api.post<ApiResponse<AuthResponseRaw>>('/api/auth/register', payload);
  const raw = await apiRequest(Promise.resolve(response));
  return mapAuthResponse(raw);
}

export async function logout() {
  const response = await api.post<ApiResponse<null>>('/api/auth/logout');
  return apiRequest(Promise.resolve(response));
}

export async function fetchMe() {
  const response = await api.get<ApiResponse<AuthSession['user']>>('/api/me');
  return apiRequest(Promise.resolve(response));
}
