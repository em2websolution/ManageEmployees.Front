---
applyTo: "**/*.{ts,tsx,js,jsx,css}"
---

# Next.js Instructions - ManageEmployees Frontend

## Version and Stack
- Next.js 15 (App Router)
- React 19
- TypeScript 5.x
- MUI v6 (Material UI)
- Tailwind CSS 3.x
- Turbopack (dev server)
- Sonner (toast notifications)

## Protected Folders (DO NOT MODIFY)
```
src/
├── @core/      # Materio template core
├── @layouts/   # Pre-configured layouts
├── @menu/      # Navigation system
```

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Component | PascalCase | `UserDrawer.tsx` |
| Hook | camelCase + use | `useAuth.ts` |
| Gateway | PascalCase + Gateway | `UserGateway`, `UserGatewayImpl` |
| Type/Interface | PascalCase | `UsersType`, `UserDataType` |
| Context | PascalCase + Context | `AuthContext`, `UsersContext` |

## Components

### Client Components (predominant in this project)
```tsx
'use client'

export default function Page() {
  const { users } = useUsers()
  const router = useRouter()

  useEffect(() => {
    const userDataJson = window.localStorage.getItem('userData')
    if (!userDataJson) router.push('/login')
  })

  return <UserList userData={users} />
}
```

## State Management — Context API

### AuthContext
```typescript
type AuthValuesType = {
  user: UserDataType | null
  loading: boolean
  setUser: (value: UserDataType | null) => void
  setLoading: (value: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  logout: () => void
}
// loading: true during login only (not during logout)
// logout clears localStorage + redirects to /login
```

### UsersContext
```typescript
type UsersContextType = {
  users: UsersType[]
  totalCount: number
  totalPages: number
  loading: boolean
  fetchUsers: (page?: number, pageSize?: number, search?: string, role?: string) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
}
```

### TasksContext
```typescript
type TasksContextType = {
  tasks: TaskItem[]
  totalCount: number
  totalPages: number
  loading: boolean
  fetchTasks: (page?: number, pageSize?: number, search?: string, status?: string, startDate?: string, endDate?: string) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
}
```

### Custom Hooks
```typescript
export const useAuth = () => useContext(AuthContext)
export const useUsers = () => useContext(UsersContext)
export const useTasks = () => useContext(TasksContext)
```

## Gateway Pattern (`src/core/`)

### Domain Layer — Interfaces
```typescript
export interface UserGateway {
  getAllUsers(page?: number, pageSize?: number, search?: string, role?: string): Promise<PagedResult<User>>
  signIn(userName: string, password: string): Promise<SignIn>
  signOut(): Promise<void>
  updateUser(userId: string, userData: UpdateUserRequest): Promise<void>
  deleteUser(userId: string): Promise<void>
  createUser(userData: CreateUserRequest): Promise<void>
}

export interface HttpClient {
  setAuthorizationHeader(token: string): void
  get<TResponse = any>(url: string, config?: RequestConfig): Promise<TResponse>
  post<TResponse = any, TData = any>(url: string, data?: TData, config?: RequestConfig): Promise<TResponse>
  put<TResponse = any, TData = any>(url: string, data?: TData, config?: RequestConfig): Promise<TResponse>
  delete<TResponse = any>(url: string, config?: RequestConfig): Promise<TResponse>
}
```

### Infrastructure Layer — Implementations
```typescript
export class UserGatewayImpl implements UserGateway {
  constructor(private readonly api: HttpClient) {}

  async signIn(userName: string, password: string): Promise<SignIn> {
    return this.api.post<SignIn>('Login/SignIn', { userName, password })
  }

  async getAllUsers(page?: number, pageSize?: number, search?: string, role?: string): Promise<PagedResult<User>> {
    const params = new URLSearchParams()
    if (page) params.append('page', page.toString())
    // ...
    return this.api.get<PagedResult<User>>(`Login/ListAll?${params}`)
  }
}

// Singleton pattern
export const userGateway = UserGatewaySingleton.getInstance()
```

### HTTP Client
```typescript
export class AxiosHttpClient implements HttpClient {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL
    })
    this.client.interceptors.request.use(this.addAuthToken)
  }
}
```

## Loading Indicators

| Location | Component | Trigger |
|----------|-----------|---------|
| Grid (table) | `LinearProgress` below CardHeader | `loading` from context |
| Route navigation | `RouteLoading` (fixed top) | Pathname change (useRef) |
| Login button | `CircularProgress` in button | `auth.loading` |
| Form submit | `CircularProgress` in button | Local `submitting` state |

## MUI Custom Components
- `CustomTextField` — Styled text field
- `CustomAvatar` — Avatar with theme colors
- `CustomChip` — Styled chip/tag
- `CustomIconButton` — Icon button

## Table: TanStack React Table
```tsx
import { createColumnHelper, useReactTable } from '@tanstack/react-table'
const columnHelper = createColumnHelper<UsersType>()
```
