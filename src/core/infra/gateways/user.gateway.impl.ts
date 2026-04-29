import type { User, SignIn, UserGateway, CreateUserRequest, UpdateUserRequest } from "@/core/domain/gateways/user.gateway";
import type { PagedResult } from '@/types/pagedResult'

import type { HttpClient } from "@/core/domain/services/http"

export class UserGatewayImpl implements UserGateway {
  constructor(
    private readonly api: HttpClient,
  ) { }

  async getAllUsers(page: number, pageSize: number, search?: string, role?: string): Promise<PagedResult<User>> {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })

    if (search) params.set('search', search)
    if (role) params.set('role', role)

    return this.api.get<PagedResult<User>>(`Login/ListAll?${params.toString()}`)
  }

  async signIn(userName: string, password: string): Promise<SignIn> {
    return this.api.post<SignIn>('Login/SignIn', {
      userName,
      password,
    });
  }

  async signOut(): Promise<void> {
    this.api.post<void>('Login/SignOut');
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<void> {
    const endpoint = `Login/${userId}`;

    await this.api.put<void>(endpoint, userData);
  }

  async deleteUser(userId: string): Promise<void> {
    const endpoint = `Login/${userId}`;

    await this.api.delete<void>(endpoint);
  }

  async createUser(userData: CreateUserRequest): Promise<void> {
    await this.api.post<void>('Login/SignUp', userData);
  }
}
