# Copilot Instructions - ManageEmployees Frontend

## Architecture

**Next.js 15** (App Router, Turbopack) SPA for employee and task management with **MUI v6**, **TanStack React Table**, **TypeScript**, **Tailwind CSS 3**, and **Context API**.

### Folder Structure

```
src/
├── @core/              # DO NOT MODIFY — Materio template core
├── @layouts/           # DO NOT MODIFY — Layouts (Vertical, Horizontal, Blank)
├── @menu/              # DO NOT MODIFY — Navigation components
├── app/                # Routes (App Router)
│   ├── (blank-layout-pages)/  # Pages without sidebar (login)
│   └── (app)/                 # Pages with sidebar (employees, tasks)
├── components/         # Reusable components (Providers, RouteLoading, layout)
├── configs/            # Configuration (theme, colors, auth)
├── contexts/           # Context Providers (AuthContext, UsersContext, TasksContext)
├── core/               # Clean Architecture frontend
│   ├── domain/gateways/   # Interfaces (UserGateway, TaskGateway, HttpClient)
│   └── infra/             # Implementations (AxiosHttpClient, Gateway impls)
├── data/navigation/    # Menu definitions
├── hooks/              # Custom hooks (useAuth, useUsers, useTasks)
├── types/              # TypeScript types
├── utils/              # Utilities (getApiErrorMessage, encryption)
└── views/              # View components
    ├── Login.tsx
    ├── list/           # UserListTable, UserDrawer
    └── tasks/          # TaskListTable, TaskDrawer
```

### Routes

| Route | Layout | Description |
|-------|--------|-------------|
| `/login` | Blank | Authentication form |
| `/employees` | App | Employee list with CRUD |
| `/tasks` | App | Task list with CRUD |

---

## Key Patterns

### State Management: Context API (NOT Redux)
```typescript
const { users, fetchUsers, loading } = useUsers()
const { user, login, logout, loading } = useAuth()
const { tasks, fetchTasks, loading } = useTasks()
```

### API Calls: Gateway Pattern (NOT direct Axios)
```typescript
import { userGateway } from '@/core/infra/gateways/user.gateway.impl.singleton'
const users = await userGateway.getAllUsers()
```

### Forms: React Hook Form (NO Zod)
```tsx
const { control, handleSubmit } = useForm({
  defaultValues: { firstName: '', email: '' }
})
```

### Route Protection: localStorage check
```tsx
useEffect(() => {
  const userDataJson = window.localStorage.getItem('userData')
  if (!userDataJson) router.push('/login')
})
```

### Password Encryption: CryptoJS AES before sending
```typescript
import CryptoJS from 'crypto-js'
const key = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_SECRET_ENCRYPT_KEY!)
const encrypted = CryptoJS.AES.encrypt(password, key, { iv, mode: CryptoJS.mode.CBC })
```

---

## Context Signatures

```typescript
// AuthContext — login, logout, token in localStorage
login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
logout: () => void
loading: boolean  // true during login only

// UsersContext — fetchUsers(page, pageSize, search?, role?), deleteUser
fetchUsers: (page?: number, pageSize?: number, search?: string, role?: string) => Promise<void>
loading: boolean  // true during fetch

// TasksContext — fetchTasks(page, pageSize, search?, status?, startDate?, endDate?), deleteTask
fetchTasks: (page?: number, pageSize?: number, search?: string, status?: string, startDate?: string, endDate?: string) => Promise<void>
loading: boolean  // true during fetch
```

---

## Server-Side Filtering (UI)

- **Debounced search**: Min 3 characters, 500ms debounce
- **Select filters**: Default value `'All'` (not sent to API)
  - Users: Role (All / Administrator / Employee)
  - Tasks: Status (All / Pending / InProgress / Completed)
- **Date range**: Tasks support Start Date and End Date (date pickers)
- **Responsive**: Filters `is-full` on mobile, `md:is-auto` on desktop
- **Pagination**: `TablePagination` connected to `PagedResult<T>` from backend

---

## Loading Indicators

- **Grid loading**: `LinearProgress` below CardHeader (from context `loading` state)
- **Route navigation**: `RouteLoading` component — `LinearProgress` fixed at top (detects pathname change via `useRef`)
- **Form submission**: `CircularProgress` in submit button + `disabled` state (`submitting` local state)
- **Login button**: Uses `auth.loading` for disabled + `CircularProgress`

---

## Provider Hierarchy

```tsx
// src/app/layout.tsx
<AuthProvider>
  <UsersProvider>
    <TasksProvider>
      <RouteLoading />
      {children}
    </TasksProvider>
  </UsersProvider>
</AuthProvider>
```

---

## API Integration

All API calls go through `AxiosHttpClient` singleton:
- Base URL: `NEXT_PUBLIC_BASE_URL`
- Token: Read from `localStorage('accessToken')`, injected in `Authorization: Bearer` header

### Endpoints Consumed

| Gateway | Method | Backend Route | Query Params |
|---------|--------|---------------|--------------|
| UserGateway | signIn | POST `/Login/SignIn` | — |
| UserGateway | signUp | POST `/Login/SignUp` | — |
| UserGateway | getAllUsers | GET `/Login/ListAll` | page, pageSize, search, role |
| UserGateway | updateUser | PUT `/Login/{userId}` | — |
| UserGateway | deleteUser | DELETE `/Login/{userId}` | — |
| TaskGateway | getAllTasks | GET `/Tasks` | page, pageSize, search, status, startDate, endDate |
| TaskGateway | getTaskById | GET `/Tasks/{id}` | — |
| TaskGateway | createTask | POST `/Tasks` | — |
| TaskGateway | updateTask | PUT `/Tasks/{id}` | — |
| TaskGateway | deleteTask | DELETE `/Tasks/{id}` | — |

---

## Import Aliases

| Alias | Path |
|-------|------|
| `@/` | `./src/` |
| `@core/` | `./src/@core/` |
| `@components/` | `./src/components/` |
| `@views/` | `./src/views/` |
| `@configs/` | `./src/configs/` |
| `@assets/` | `./src/assets/` |
| `@layouts/` | `./src/@layouts/` |
| `@menu/` | `./src/@menu/` |

---

## Commands

```bash
cd ManageEmployees.Front
npm install
npm run dev      # Dev server http://localhost:3000 (Turbopack)
npm run build    # Production build
```

### Default Credentials
- **Email:** `admin@company.com`
- **Password:** `Admin123!`

---

## Language

- **Technical code:** English
- **UI and messages:** English
- **Comments:** English
