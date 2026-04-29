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
│   └── (dashboard)/           → Protected pages (Home, Tasks)
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
| `/home` | Dashboard | Employee list with CRUD |
| `/tasks` | Dashboard | Task list with CRUD |

---

## Features

### Authentication
- JWT token stored in `localStorage`
- Auto-injected via Axios request interceptor
- Login/logout with redirect
- Role and userId persisted for UI display

### User Management (`/home`)
- List all users with role column
- Create user via drawer (firstName, lastName, email, password, role, phoneNumber, docNumber)
- Edit/delete users
- Roles: Administrator, Employee

### Task Management (`/tasks`)
- List all tasks in table
- Create task via drawer (title, description, status, dueDate)
- Edit/delete tasks
- UserId automatically set from JWT (not sent by frontend)
- Status values: Pending, InProgress, Completed

---

## Provider Hierarchy

```tsx
<AuthProvider>
  <UsersProvider>
    <TasksProvider>
      <Providers> {/* Theme, Settings, Navigation */}
        {children}
      </Providers>
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

| Gateway | Method | Backend Route |
|---------|--------|---------------|
| UserGateway | signIn | POST `/Login/SignIn` |
| UserGateway | signUp | POST `/Login/SignUp` |
| UserGateway | getAllUsers | GET `/Login/ListAll` |
| UserGateway | updateUser | PUT `/Login/{userId}` |
| UserGateway | deleteUser | DELETE `/Login/{userId}` |
| TaskGateway | getAllTasks | GET `/Tasks` |
| TaskGateway | getTaskById | GET `/Tasks/{id}` |
| TaskGateway | createTask | POST `/Tasks` |
| TaskGateway | updateTask | PUT `/Tasks/{id}` |
| TaskGateway | deleteTask | DELETE `/Tasks/{id}` |

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