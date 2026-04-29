export interface Task {
  id: string
  title: string
  description: string
  status: string
  dueDate: string
  userId: string
  createdAt: string
}

export interface CreateTaskRequest {
  title: string
  description: string
  status: string
  dueDate: string
}

export interface UpdateTaskRequest {
  title: string
  description: string
  status: string
  dueDate: string
}

import type { PagedResult } from '@/types/pagedResult'

export interface TaskGateway {
  getAllTasks(page: number, pageSize: number, search?: string, status?: string, startDate?: string, endDate?: string): Promise<PagedResult<Task>>
  getTaskById(id: string): Promise<Task>
  createTask(data: CreateTaskRequest): Promise<Task>
  updateTask(id: string, data: UpdateTaskRequest): Promise<Task>
  deleteTask(id: string): Promise<void>
}
