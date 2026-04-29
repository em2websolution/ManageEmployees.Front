'use client'

import { createContext, useEffect, useState } from 'react'

import { toast } from 'sonner'

import type { Task, CreateTaskRequest, UpdateTaskRequest } from '@/core/domain/gateways/task.gateway'
import type { TaskType } from '@/types/apps/taskTypes'
import { taskGateway } from '@/core/infra/gateways/task.gateway.impl.singleton'
import { getApiErrorMessage } from '@/utils/getApiErrorMessage'

type TasksContextType = {
  tasks: TaskType[]
  loading: boolean
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  fetchTasks: (page?: number, pageSize?: number, search?: string, status?: string, startDate?: string, endDate?: string) => Promise<void>
  createTask: (data: CreateTaskRequest) => Promise<void>
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

const adapter = (data: Task): TaskType => ({
  id: data.id,
  title: data.title,
  description: data.description,
  status: data.status,
  dueDate: data.dueDate,
  userId: data.userId,
  createdAt: data.createdAt
})

const TasksContext = createContext<TasksContextType | undefined>(undefined)

type Props = {
  children: React.ReactNode
}

const TasksProvider = ({ children }: Props) => {
  const [tasks, setTasks] = useState<TaskType[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  async function fetchTasks(p?: number, ps?: number, search?: string, status?: string, startDate?: string, endDate?: string) {
    setLoading(true)

    try {
      const currentPage = p ?? page
      const currentPageSize = ps ?? pageSize
      const res = await taskGateway.getAllTasks(currentPage, currentPageSize, search, status, startDate, endDate)
      const mapped = res.items.map(adapter)

      setTasks(mapped)
      setPage(res.page)
      setPageSize(res.pageSize)
      setTotalCount(res.totalCount)
      setTotalPages(res.totalPages)
    } catch (error) {
      console.error(error)
      toast.error(getApiErrorMessage(error, 'Error fetching tasks'))
    } finally {
      setLoading(false)
    }
  }

  async function createTask(data: CreateTaskRequest) {
    try {
      await taskGateway.createTask(data)
      await fetchTasks()
      toast.success('Task created successfully')
    } catch (error) {
      console.error(error)
      toast.error(getApiErrorMessage(error, 'Error creating task'))
    }
  }

  async function updateTask(id: string, data: UpdateTaskRequest) {
    try {
      await taskGateway.updateTask(id, data)
      await fetchTasks()
      toast.success('Task updated successfully')
    } catch (error) {
      console.error(error)
      toast.error(getApiErrorMessage(error, 'Error updating task'))
    }
  }

  async function deleteTask(id: string) {
    try {
      await taskGateway.deleteTask(id)
      await fetchTasks()
    } catch (error) {
      console.error(error)
      toast.error(getApiErrorMessage(error, `Error deleting task`))
    }
  }

  useEffect(() => {
    const token = window.localStorage.getItem('accessToken')

    if (token) {
      (async () => {
        await fetchTasks()
      })()
    }
  }, [])

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        page,
        pageSize,
        totalCount,
        totalPages,
        setPage,
        setPageSize,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export { TasksContext, TasksProvider }
