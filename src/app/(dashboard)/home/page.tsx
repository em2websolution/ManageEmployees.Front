'use client'

import { useEffect } from "react";

import { useRouter } from 'next/navigation';

import UserList from "@/views/list";

import { useUsers } from "@/hooks/useUsers";

export default function Page() {
  const { users, fetchUsers } = useUsers()

  const router = useRouter()

  useEffect(() => {
    const userDataJson = window.localStorage.getItem('userData')

    if (!userDataJson) {
      router.push('/login')
    } else {
      fetchUsers()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UserList userData={users} />
  )
}
