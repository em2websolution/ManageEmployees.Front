export interface User {
  userId: string
  firstName: string
  lastName: string
  email: string
  docNumber: string
  phoneNumber: string
  role: string
}

export interface SignIn {
  accessToken: string
  refreshToken: string
  role: string
  firstName: string
  userId: string
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  docNumber: string;
  role: string;
  phoneNumber: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  docNumber: string;
  role: string;
  phoneNumber: string;
}

import type { PagedResult } from '@/types/pagedResult'

export interface UserGateway {
  getAllUsers(page: number, pageSize: number, search?: string, role?: string): Promise<PagedResult<User>>;
  signIn(userName: string, password: string): Promise<SignIn>;
  signOut(): Promise<void>;
  updateUser(userId: string, userData: UpdateUserRequest): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  createUser(userData: CreateUserRequest): Promise<void>;
}
