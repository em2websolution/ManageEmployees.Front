'use client'

import { createContext, useEffect, useState } from 'react'

import { toast } from 'sonner'

import type { Task, CreateTaskRequest, UpdateTaskRequest } from '@/core/domain/gateways/task.gateway'
import type { TaskType } from '@/types/apps/taskTypes'
import { taskGateway } from '@/core/infra/gateways/task.gateway.impl.singleton'
import { getApiErrorMessage } from '@/utils/getApiErrorMessage'

type TasksContextType = {
  tasks: TaskType[]
  fetchTasks: () => Promise<void>
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

  async function fetchTasks() {
    try {
      const res = await taskGateway.getAllTasks()
      const mapped = res.map(adapter)

      setTasks(mapped)
    } catch (error) {
      console.error(error)
      toast.error(getApiErrorMessage(error, 'Error fetching tasks'))
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
