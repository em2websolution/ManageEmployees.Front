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

export interface TaskGateway {
  getAllTasks(): Promise<Task[]>
  getTaskById(id: string): Promise<Task>
  createTask(data: CreateTaskRequest): Promise<Task>
  updateTask(id: string, data: UpdateTaskRequest): Promise<Task>
  deleteTask(id: string): Promise<void>
}
