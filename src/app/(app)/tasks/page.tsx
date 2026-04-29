'use client'

import { useEffect } from "react"

import { useRouter } from 'next/navigation'

import TaskList from "@/views/tasks"

import { useTasks } from "@/hooks/useTasks"

export default function Page() {
  const { tasks, fetchTasks } = useTasks()
  const router = useRouter()

  useEffect(() => {
    const userDataJson = window.localStorage.getItem('userData')

    if (!userDataJson) {
      router.push('/login')
    } else {
      fetchTasks()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <TaskList taskData={tasks} />
}
