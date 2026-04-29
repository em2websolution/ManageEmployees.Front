import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskGateway } from '@/core/domain/gateways/task.gateway'
import type { PagedResult } from '@/types/pagedResult'
import type { HttpClient } from '@/core/domain/services/http'

export class TaskGatewayImpl implements TaskGateway {
  constructor(private readonly api: HttpClient) {}

  async getAllTasks(page: number, pageSize: number, search?: string, status?: string, startDate?: string, endDate?: string): Promise<PagedResult<Task>> {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })

    if (search) params.set('search', search)
    if (status) params.set('status', status)
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)

    return this.api.get<PagedResult<Task>>(`Tasks?${params.toString()}`)
  }

  async getTaskById(id: string): Promise<Task> {
    return this.api.get<Task>(`Tasks/${id}`)
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    return this.api.post<Task>('Tasks', data)
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    return this.api.put<Task>(`Tasks/${id}`, data)
  }

  async deleteTask(id: string): Promise<void> {
    await this.api.delete<void>(`Tasks/${id}`)
  }
}
