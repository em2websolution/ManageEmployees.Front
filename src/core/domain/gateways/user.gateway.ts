export interface User {
  userId: string
  firstName: string
  lastName: string
  email: string
  docNumber: string
  managerId: string
  managerName: string
  phoneNumbers: string[]
  role: string
}

export interface SignIn {
  accessToken: string
  refreshToken: string
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  docNumber: string;
  managerId: string;
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
  managerId: string;
  role: string;
  phoneNumber: string;
}

export interface UserGateway {
  getAllUsers(): Promise<User[]>;
  signIn(userName: string, password: string): Promise<SignIn>;
  signOut(): Promise<void>;
  updateUser(userId: string, userData: UpdateUserRequest): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  createUser(userData: CreateUserRequest): Promise<void>;
}
