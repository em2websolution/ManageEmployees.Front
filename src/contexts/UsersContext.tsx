'use client';

import { createContext, useEffect, useState } from "react";

import { toast } from "sonner";

import type { User } from "@/core/domain/gateways/user.gateway";
import type { UsersType } from "@/types/apps/userTypes";
import { userGateway } from "@/core/infra/gateways/user.gateway.impl.singleton";import { getApiErrorMessage } from '@/utils/getApiErrorMessage'

type UsersContextType = {
  users: UsersType[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  fetchUsers: (page?: number, pageSize?: number, search?: string, role?: string) => Promise<void>;
  deleteUser(userId: string): Promise<void>;
}

const adapter = (data: User): UsersType => ({
  id: data.userId,
  role: data.role,
  email: data.email,
  firstName: data.firstName,
  lastName: data.lastName,
  avatar: '',
  phoneNumber: data.phoneNumber,
  document: data.docNumber,
})

const UsersContext = createContext<UsersContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode
}

const UsersProvider = ({ children }: Props) => {
  const [users, setUsers] = useState<UsersType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  async function fetchUsers(p?: number, ps?: number, search?: string, role?: string) {
    setLoading(true)

    try {
      const currentPage = p ?? page
      const currentPageSize = ps ?? pageSize
      const res = await userGateway.getAllUsers(currentPage, currentPageSize, search, role)
      const mapped = res.items.map(adapter)

      setUsers(mapped)
      setPage(res.page)
      setPageSize(res.pageSize)
      setTotalCount(res.totalCount)
      setTotalPages(res.totalPages)
    } catch (error) {
      console.error(error);
      toast.error(getApiErrorMessage(error, 'Error fetching users'))
    } finally {
      setLoading(false)
    }
  }


  async function deleteUser(userId: string) {
    try {
      await userGateway.deleteUser(userId);
      await fetchUsers()

    } catch (error) {
      console.error(error);
      toast.error(getApiErrorMessage(error, 'Error deleting user'))
    }
  }

  useEffect(() => {
    const token = window.localStorage.getItem('accessToken')

    if (token) {
      (async () => {
        await fetchUsers()
      })()
    }
  }, [])

  return (
    <UsersContext.Provider value={{
      users,
      loading,
      page,
      pageSize,
      totalCount,
      totalPages,
      setPage,
      setPageSize,
      fetchUsers,
      deleteUser
    }}>
      {children}
    </UsersContext.Provider>
  )
}

export { UsersContext, UsersProvider }

