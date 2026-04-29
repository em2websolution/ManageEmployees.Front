import type { ThemeColor } from '@core/types'

export type TaskType = {
  id: string
  title: string
  description: string
  status: string
  dueDate: string
  userId: string
  createdAt: string
}

export type TaskFormValues = {
  title: string
  description: string
  status: string
  dueDate: string
}

export const taskStatuses = ['Pending', 'InProgress', 'Completed'] as const

export const statusColorMap: Record<string, ThemeColor> = {
  Pending: 'warning',
  InProgress: 'info',
  Completed: 'success'
}
