# ManageEmployees — Frontend (Next.js 15)

## Overview

Single-page application for employee and task management built with **Next.js 15** (App Router, Turbopack), **MUI v6**, **TanStack React Table**, **TypeScript**, and **Axios**.

---

## Getting Started

```bash
cd ManageEmployees.Front

# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build
```

### Environment Variables

Create `.env.local` in the project root:

```dotenv
NEXT_PUBLIC_BASE_URL=https://localhost:64715/
```

---

## Default Credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@company.com` | `Admin123!` | Administrator |

---

## Architecture

```
src/
├── app/                    → Routes (App Router)
│   ├── (blank-layout-pages)/  → Login page (no sidebar)
│   └── (app)/                → Protected pages (Employees, Tasks)
├── components/             → Providers, Layout components
├── configs/                → Theme, auth config
├── contexts/               → AuthContext, UsersContext, TasksContext
├── core/                   → Clean Architecture (Gateway pattern)
│   ├── domain/gateways/    → Interfaces (UserGateway, TaskGateway, HttpClient)
│   └── infra/              → Implementations (Axios, Gateway impls)
├── data/navigation/        → Menu definitions
├── hooks/                  → useAuth, useUsers, useTasks
├── types/                  → TypeScript types
├── utils/                  → Utility functions
└── views/                  → UI components
    ├── Login.tsx
    ├── list/               → UserListTable, UserDrawer
    └── tasks/              → TaskListTable, TaskDrawer
```

### Key Patterns

- **Gateway Pattern**: Interface-based data access (`UserGateway`, `TaskGateway`) with Axios implementations
- **Context API**: State management for auth, users, and tasks
- **Singleton HTTP Client**: Axios instance with JWT interceptor
- **Auth Guard**: Pages check `accessToken` in localStorage before rendering
- **RFC 7807 Error Handling**: `getApiErrorMessage` utility parses standard error responses

---

## Pages

| Route | Layout | Description |
|-------|--------|-------------|
| `/login` | Blank | Authentication form |
| `/employees` | App | Employee list with CRUD |
| `/tasks` | App | Task list with CRUD |

---

## Features

### Authentication
- JWT token stored in `localStorage`
- Auto-injected via Axios request interceptor
- Login/logout with redirect
- Role and userId persisted in `localStorage` for UI display
- Login button shows `CircularProgress` spinner during authentication

### Loading Indicators
- **Route navigation**: `RouteLoading` component renders `LinearProgress` fixed at the top of the page when the pathname changes
- **Grid tables**: `LinearProgress` below the `CardHeader` while data is being fetched (driven by context `loading` state)
- **Form submission**: Submit buttons show `CircularProgress` and are `disabled` while submitting (prevents double-submit)
- **Toast notifications**: Sonner library (`toast.success` / `toast.error`) for success and error feedback

### User Management (`/employees`)
- List all users with role column
- **Server-side pagination** with page/pageSize controls
- **Debounced search** (min 3 characters) — searches FirstName, LastName, Email, DocNumber, PhoneNumber
- **Role filter** — select dropdown (All, Administrator, Employee) — default: All
- Create user via drawer (firstName, lastName, email, password, role, phoneNumber, docNumber)
- Edit/delete users
- Roles: Administrator, Employee

### Task Management (`/tasks`)
- List all tasks in table
- **Server-side pagination** with page/pageSize controls
- **Debounced search** (min 3 characters) — searches Title and Description
- **Status filter** — select dropdown (All, Pending, InProgress, Completed) — default: All
- **Date range filter** — Start Date and End Date date pickers (inclusive end date)
- Dynamic sort: DueDate ASC when date filters active, CreatedAt DESC otherwise
- Create task via drawer (title, description, status, dueDate)
- Edit/delete tasks
- UserId automatically set from JWT (not sent by frontend)
- Status values: Pending, InProgress, Completed
- **Responsive filter layout** — full-width on mobile, inline on desktop

---

## Provider Hierarchy

```tsx
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
- Token: Read from `localStorage('accessToken')` and injected in `Authorization: Bearer` header

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

### Pagination Response Model

All list endpoints return `PagedResult<T>`:

```typescript
interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}
```

### Filter Behavior

| Feature | Users Table | Tasks Table |
|---------|-------------|-------------|
| Search | Min 3 chars, debounced 500ms | Min 3 chars, debounced 500ms |
| Select Filter | Role (All / Administrator / Employee) | Status (All / Pending / InProgress / Completed) |
| Date Range | — | Start Date + End Date (inclusive) |
| Default Select | "All" (no filter sent to API) | "All" (no filter sent to API) |
| Responsive | Full-width mobile, inline desktop | Full-width mobile, inline desktop |

---

## Scripts

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start"
}
```

---

## Stack

- **Next.js** 15 (App Router, Turbopack)
- **React** 19
- **MUI** v6
- **TanStack React Table** v8
- **Axios** 1.6
- **Tailwind CSS** 3
- **TypeScript** 5
- **Sonner** — Toast notifications
- **CryptoJS** — AES encryption for passwords
- **React Hook Form** — Form state management