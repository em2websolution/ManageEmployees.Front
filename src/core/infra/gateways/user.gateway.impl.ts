import type { User, SignIn, UserGateway, CreateUserRequest, UpdateUserRequest } from "@/core/domain/gateways/user.gateway";

import type { HttpClient } from "@/core/domain/services/http"

export class UserGatewayImpl implements UserGateway {
  constructor(
    private readonly api: HttpClient,
  ) { }

  async getAllUsers(): Promise<User[]> {
    return this.api.get<User[]>('Login/ListAll')
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
